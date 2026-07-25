import { PrismaClient } from '@prisma/client'
import { characters } from '../src/data/characters'
import { games, gameFeatures, GameAppearance } from '../src/data/games'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

// I'll manually define the appearances based on standard RE lore since the original GameAppearance type was empty/not populated in games.ts.
const appearances = [
  { characterId: '1', gameId: 're2', role: 'Protagonist' },
  { characterId: '1', gameId: 're4', role: 'Protagonist' },
  { characterId: '1', gameId: 're6', role: 'Protagonist' },
  { characterId: '16', gameId: 're', role: 'Protagonist' },
  { characterId: '16', gameId: 're3', role: 'Protagonist' },
  { characterId: '16', gameId: 're5', role: 'Supporting' },
  { characterId: '16', gameId: 're_re', role: 'Protagonist' },
  { characterId: '15', gameId: 're', role: 'Protagonist' },
  { characterId: '15', gameId: 're_ve', role: 'Protagonist' },
  { characterId: '15', gameId: 're5', role: 'Protagonist' },
  { characterId: '15', gameId: 're6', role: 'Protagonist' },
  { characterId: '15', gameId: 're7', role: 'Cameo' },
  { characterId: '15', gameId: 're8', role: 'Supporting' },
  { characterId: '25', gameId: 're2', role: 'Protagonist' },
  { characterId: '25', gameId: 're_ve', role: 'Protagonist' },
  { characterId: '25', gameId: 're_re2', role: 'Protagonist' },
  { characterId: '3', gameId: 're2', role: 'Supporting' },
  { characterId: '3', gameId: 're4', role: 'Supporting' },
  { characterId: '3', gameId: 're6', role: 'Protagonist' },
  { characterId: '6', gameId: 're', role: 'Antagonist' },
  { characterId: '6', gameId: 're_ve', role: 'Antagonist' },
  { characterId: '6', gameId: 're4', role: 'Cameo' },
  { characterId: '6', gameId: 're5', role: 'Antagonist' },
  { characterId: '34', gameId: 're3', role: 'Antagonist' },
  { characterId: '27', gameId: 're2', role: 'Antagonist' },
]

async function main() {
  console.log('Seeding database...')

  // Clear existing
  await prisma.characterConnection.deleteMany()
  await prisma.appearance.deleteMany()
  await prisma.interaction.deleteMany()
  await prisma.analytics.deleteMany()
  await prisma.game.deleteMany()
  await prisma.character.deleteMany()

  // 0. Load analytical data
  const nodesPath = path.join(process.cwd(), 'nodes.json')
  const edgesPath = path.join(process.cwd(), 'edges.json')
  let nodes: any[] = []
  let edges: any[] = []
  try {
    nodes = JSON.parse(fs.readFileSync(nodesPath, 'utf8'))
    edges = JSON.parse(fs.readFileSync(edgesPath, 'utf8'))
  } catch (e) {
    console.log("Could not read analytics json files. Make sure to run data_pipeline.py first.")
  }

  // 1. Insert Characters
  for (const c of characters as any[]) {
    const nodeData = nodes.find(n => String(n.id) === String(c.id))
    await prisma.character.create({
      data: {
        id: String(c.id),
        name: c.name,
        faction: c.faction || 'UNKNOWN',
        classification: c.classification || c.role || 'UNKNOWN',
        status: c.status || 'UNKNOWN',
        killCount: typeof c.confirmedKills === 'string' ? 0 : (c.confirmedKills || 0),
        firstIncident: String(c.firstIncident || 'UNKNOWN'),
        redactionState: c.redactionState || 'NONE',
        portraitFilename: c.portraitFilename || 'placeholder.jpg',
        bio: c.bio || '',
        pageRank: nodeData?.pageRank,
        degree: nodeData?.degree,
        communityId: nodeData?.communityId,
        kmeansCluster: nodeData?.kmeansCluster,
        predictedRole: nodeData?.predictedRole,
        predictedConfidence: nodeData?.predictedConfidence,
        predictionFeatures: nodeData?.predictionFeatures,
      }
    })
  }
  console.log(`Created ${characters.length} characters.`)

  // 2. Insert Games
  for (const g of games) {
    await prisma.game.create({
      data: {
        id: g.id,
        title: g.title,
        year: g.year,
        type: g.type,
        chronologyOrder: g.chronology_order,
        location: g.location,
        protagonists: g.protagonists,
        blurb: g.blurb,
        outbreakClass: g.outbreakClass,
        casualties: String(g.casualties),
        containmentStatus: g.containmentStatus,
        severity: g.severity,
      }
    })
  }
  console.log(`Created ${games.length} games.`)

  // 3. Insert Analytics
  for (const f of gameFeatures) {
    // Only insert if the game exists (in case gameFeatures has extras)
    const gameExists = games.find(g => g.id === f.game_id)
    if (gameExists) {
      await prisma.analytics.create({
        data: {
          gameId: f.game_id,
          totalScenes: f.total_scenes,
          uniqueCharacters: f.unique_characters,
          totalInteractions: f.total_interactions,
          interactionsPerScene: f.interactions_per_scene,
        }
      })
    }
  }
  console.log(`Created ${gameFeatures.length} analytics records.`)

  // 4. Insert Appearances (Join Table)
  let appearanceCount = 0;
  for (const a of appearances) {
    const charExists = characters.find((c: any) => String(c.id) === a.characterId)
    const gameExists = games.find(g => g.id === a.gameId)
    if (charExists && gameExists) {
      await prisma.appearance.create({
        data: {
          characterId: a.characterId,
          gameId: a.gameId,
          role: a.role,
        }
      })
      appearanceCount++;
    }
  }
  console.log(`Created ${appearanceCount} appearances.`)

  // 5. Insert Character Connections
  let edgeCount = 0;
  for (const e of edges) {
    const sourceExists = characters.find((c: any) => String(c.id) === String(e.sourceId))
    const targetExists = characters.find((c: any) => String(c.id) === String(e.targetId))
    if (sourceExists && targetExists) {
      try {
        await prisma.characterConnection.create({
          data: {
            sourceId: String(e.sourceId),
            targetId: String(e.targetId),
            weight: e.weight
          }
        })
        edgeCount++;
      } catch (err) {
        // Ignore duplicate connections or self loops if any
      }
    }
  }
  console.log(`Created ${edgeCount} character connections.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
