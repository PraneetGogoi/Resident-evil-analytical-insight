import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, Gamepad2, Skull, Shield, ChevronRight } from "lucide-react";
import { characters } from "@/data/characters";
import { games, gameFeatures } from "@/data/games";

const stats = [
  { label: "Games Analyzed", value: games.length, icon: Gamepad2 },
  { label: "Characters", value: characters.length, icon: Users },
  { label: "Total Scenes", value: gameFeatures.reduce((a, g) => a + g.total_scenes, 0).toLocaleString(), icon: BarChart3 },
  { label: "Interactions", value: gameFeatures.reduce((a, g) => a + g.total_interactions, 0).toLocaleString(), icon: Shield },
];

const Index = () => {
  return (
    <div className="min-h-[calc(100vh-3rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-re-red/5 via-background to-re-darkred/10" />
        <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, hsl(var(--re-red)) 1px, transparent 1px)', backgroundSize: '50px 50px'}} />
        
        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-re-red/30 bg-re-red/5 text-re-red text-sm font-mono tracking-wider">
              <Skull className="h-4 w-4" />
              ANALYTICAL INSIGHTS
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none">
              <span className="text-foreground">RESIDENT</span>
              <br />
              <span className="text-re-red drop-shadow-[0_0_30px_hsl(var(--re-red)/0.5)]">EVIL</span>
              <br />
              <span className="text-muted-foreground text-3xl md:text-5xl font-light tracking-widest">UNIVERSE</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore the complete analytical breakdown of the Resident Evil franchise — 
              characters, games, interactions, and deep data-driven insights across 
              <span className="text-re-red font-semibold"> 30 years</span> of survival horror.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-re-red hover:bg-re-darkred text-white font-mono tracking-wider group">
                <Link to="/dashboard">
                  EXPLORE DASHBOARD
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-re-red/30 hover:bg-re-red/10 font-mono tracking-wider">
                <Link to="/characters">
                  VIEW CHARACTERS
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative group p-6 rounded-xl border border-border/50 bg-card hover:border-re-red/40 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--re-red)/0.1)]"
            >
              <stat.icon className="h-5 w-5 text-re-red mb-3" />
              <div className="text-3xl md:text-4xl font-black text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-mono tracking-wider mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Preview */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8 font-mono tracking-wider">
          FRANCHISE <span className="text-re-red">TIMELINE</span>
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-re-red/50 via-re-red/20 to-transparent" />
          <div className="space-y-6 pl-12">
            {games.filter(g => g.type === 'mainline').sort((a,b) => a.year - b.year).slice(0, 8).map((game) => (
              <div key={game.id} className="relative group">
                <div className="absolute -left-[2.15rem] top-1.5 w-3 h-3 rounded-full bg-re-red/70 border-2 border-background group-hover:bg-re-red transition-colors" />
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-re-red text-sm font-bold">{game.year}</span>
                  <span className="text-foreground font-medium">{game.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="ghost" className="text-re-red hover:text-re-red/80 font-mono">
            <Link to="/games">See all games →</Link>
          </Button>
        </div>
      </section>

      {/* Role Distribution Preview */}
      <section className="container mx-auto px-6 py-16 pb-24">
        <h2 className="text-2xl font-bold mb-8 font-mono tracking-wider">
          CHARACTER <span className="text-re-red">ROLES</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['hero', 'villain', 'support'] as const).map((role) => {
            const count = characters.filter(c => c.role === role).length;
            const color = role === 'hero' ? 'text-re-blue' : role === 'villain' ? 'text-re-red' : 'text-re-green';
            const bgColor = role === 'hero' ? 'bg-re-blue/10 border-re-blue/30' : role === 'villain' ? 'bg-re-red/10 border-re-red/30' : 'bg-re-green/10 border-re-green/30';
            return (
              <div key={role} className={`p-6 rounded-xl border ${bgColor} transition-all duration-300 hover:scale-105`}>
                <div className={`text-4xl font-black ${color}`}>{count}</div>
                <div className="text-sm font-mono tracking-widest uppercase mt-2 text-muted-foreground">{role}s</div>
                <div className="mt-3 text-xs text-muted-foreground">
                  {characters.filter(c => c.role === role).slice(0, 3).map(c => c.name).join(", ")}...
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Index;
