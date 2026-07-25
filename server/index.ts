import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Auth Middleware ---
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};

// --- Auth Route ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  // Simple hardcoded admin check for prototyping
  if (username === 'admin' && password === 'umbrella') {
    const accessToken = jwt.sign({ username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    res.json({ accessToken });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// --- Search Endpoints ---
app.get('/api/search', async (req, res) => {
  const q = req.query.q as string;
  if (!q) return res.json([]);
  
  const characters = await prisma.character.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { bio: { contains: q } },
      ]
    },
    take: 5
  });

  const games = await prisma.game.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { location: { contains: q } },
      ]
    },
    take: 5
  });

  res.json({ characters, games });
});

// --- Character Endpoints ---
app.get('/api/network', async (req, res) => {
  const nodes = await prisma.character.findMany();
  const edges = await prisma.characterConnection.findMany();
  res.json({ nodes, edges });
});

app.get('/api/characters', async (req, res) => {
  const characters = await prisma.character.findMany();
  res.json(characters);
});

app.get('/api/characters/:id', async (req, res) => {
  const character = await prisma.character.findUnique({
    where: { id: (req.params.id as string) },
    include: {
      incidents: {
        include: { game: true }
      }
    }
  });
  if (character) res.json(character);
  else res.status(404).send('Not found');
});

// Join table relation endpoint (Requested by user)
app.get('/api/characters/:id/incidents', async (req, res) => {
  const appearances = await prisma.appearance.findMany({
    where: { characterId: (req.params.id as string) },
    include: { game: true }
  });
  res.json(appearances.map(a => a.game));
});

app.post('/api/characters', authenticateToken, async (req, res) => {
  const character = await prisma.character.create({ data: req.body });
  res.json(character);
});

app.put('/api/characters/:id', authenticateToken, async (req, res) => {
  const character = await prisma.character.update({
    where: { id: (req.params.id as string) },
    data: req.body
  });
  res.json(character);
});

app.delete('/api/characters/:id', authenticateToken, async (req, res) => {
  await prisma.appearance.deleteMany({ where: { characterId: (req.params.id as string) }});
  await prisma.character.delete({ where: { id: (req.params.id as string) } });
  res.sendStatus(204);
});

// --- Game Endpoints ---
app.get('/api/games', async (req, res) => {
  const games = await prisma.game.findMany({
    orderBy: { chronologyOrder: 'asc' }
  });
  res.json(games);
});

app.get('/api/games/:id', async (req, res) => {
  const game = await prisma.game.findUnique({
    where: { id: (req.params.id as string) },
    include: {
      characters: {
        include: { character: true }
      },
      analytics: true
    }
  });
  if (game) res.json(game);
  else res.status(404).send('Not found');
});

app.post('/api/games', authenticateToken, async (req, res) => {
  const game = await prisma.game.create({ data: req.body });
  res.json(game);
});

app.put('/api/games/:id', authenticateToken, async (req, res) => {
  const game = await prisma.game.update({
    where: { id: (req.params.id as string) },
    data: req.body
  });
  res.json(game);
});

app.delete('/api/games/:id', authenticateToken, async (req, res) => {
  await prisma.appearance.deleteMany({ where: { gameId: (req.params.id as string) }});
  await prisma.analytics.deleteMany({ where: { gameId: (req.params.id as string) }});
  await prisma.interaction.deleteMany({ where: { gameId: (req.params.id as string) }});
  await prisma.game.delete({ where: { id: (req.params.id as string) } });
  res.sendStatus(204);
});

// --- Analytics Endpoints ---
app.post('/api/interactions', async (req, res) => {
  const { gameId } = req.body;
  
  if (gameId) {
    await prisma.interaction.create({
      data: { gameId }
    });
    
    // Also increment the total in the analytics table for easy reading
    const analytics = await prisma.analytics.findUnique({ where: { gameId } });
    if (analytics) {
      await prisma.analytics.update({
        where: { gameId },
        data: { totalInteractions: { increment: 1 } }
      });
    }
  }
  res.sendStatus(201);
});

app.get('/api/analytics/summary', async (req, res) => {
  const allAnalytics = await prisma.analytics.findMany({
    include: { game: true }
  });
  
  // Aggregate
  const totalInteractions = await prisma.interaction.count();
  const summary = {
    totalEntitiesTracked: await prisma.character.count(),
    totalScenesAnalyzed: allAnalytics.reduce((acc, curr) => acc + curr.totalScenes, 0),
    globalInteractions: totalInteractions,
    gameBreakdown: allAnalytics.map(a => ({
      gameId: a.gameId,
      title: a.game.title,
      interactions: a.totalInteractions
    }))
  };
  
  res.json(summary);
});

app.listen(PORT, () => {
  console.log(`RE:AI Backend server running on port ${PORT}`);
});
