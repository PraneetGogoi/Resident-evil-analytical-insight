import { games, gameFeatures } from "@/data/games";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Games() {
  const sortedGames = [...games].sort((a, b) => a.year - b.year);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-black font-mono tracking-tighter">
        GAME <span className="text-re-red">LIBRARY</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedGames.map((game) => {
          const features = gameFeatures.find(f => f.game_id === game.id);
          return (
            <Card key={game.id} className="border-border/50 hover:border-re-red/40 transition-all duration-300 group hover:shadow-[0_0_20px_hsl(var(--re-red)/0.1)]">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-bold group-hover:text-re-red transition-colors leading-tight">
                    {game.title}
                  </CardTitle>
                  <Badge variant="outline" className={game.type === 'mainline' ? 'border-re-red/40 text-re-red' : 'border-re-blue/40 text-re-blue'}>
                    {game.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="font-mono text-sm text-re-red font-bold">{game.year}</span>
                  <span className="text-xs text-muted-foreground">Chronology #{game.chronology_order}</span>
                </div>
              </CardHeader>
              {features && (
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-2xl font-black text-foreground">{features.total_scenes}</div>
                      <div className="text-xs text-muted-foreground font-mono">Scenes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-foreground">{features.unique_characters}</div>
                      <div className="text-xs text-muted-foreground font-mono">Characters</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-foreground">{features.total_interactions}</div>
                      <div className="text-xs text-muted-foreground font-mono">Interactions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-foreground">{features.interactions_per_scene}</div>
                      <div className="text-xs text-muted-foreground font-mono">Density</div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
