import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { gameFeatures } from "@/data/games";
import { characters } from "@/data/characters";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter, Legend,
} from "recharts";

const ROLE_COLORS = { hero: "#00b4d8", villain: "#e63946", support: "#2dc653" };

const roleData = [
  { name: "Heroes", value: characters.filter(c => c.role === "hero").length, color: ROLE_COLORS.hero },
  { name: "Villains", value: characters.filter(c => c.role === "villain").length, color: ROLE_COLORS.villain },
  { name: "Support", value: characters.filter(c => c.role === "support").length, color: ROLE_COLORS.support },
];

const gameChartData = gameFeatures
  .sort((a, b) => a.chronology_order - b.chronology_order)
  .map(g => ({
    name: g.game_title.replace("Resident Evil", "RE").replace("RE ", "RE"),
    scenes: g.total_scenes,
    characters: g.unique_characters,
    interactions: g.total_interactions,
    density: g.interactions_per_scene,
    year: g.year,
  }));

let cumulative = 0;
const cumulativeData = gameFeatures
  .sort((a, b) => a.chronology_order - b.chronology_order)
  .map(g => {
    cumulative += g.total_scenes;
    return { name: g.game_title.replace("Resident Evil", "RE"), cumulative, year: g.year };
  });

const scatterData = gameFeatures.map(g => ({
  name: g.game_title.replace("Resident Evil", "RE"),
  x: g.unique_characters,
  y: g.interactions_per_scene,
  z: g.total_scenes,
}));

const radarData = gameFeatures.slice(0, 6).map(g => ({
  game: g.game_title.replace("Resident Evil ", "RE"),
  scenes: Math.min(g.total_scenes / 5, 100),
  characters: g.unique_characters * 10,
  density: g.interactions_per_scene * 20,
}));

const kpis = [
  { label: "Total Games", value: gameFeatures.length },
  { label: "Total Characters", value: characters.length },
  { label: "Total Scenes", value: gameFeatures.reduce((a, g) => a + g.total_scenes, 0) },
  { label: "Total Interactions", value: gameFeatures.reduce((a, g) => a + g.total_interactions, 0) },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover p-3 shadow-xl text-sm">
      <p className="font-mono font-bold text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="text-xs">
          {p.name}: <span className="font-bold">{p.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const filteredCharacters = selectedRole === "all"
    ? characters
    : characters.filter(c => c.role === selectedRole);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black font-mono tracking-tighter">
          ANALYTICS <span className="text-re-red">DASHBOARD</span>
        </h1>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="hero">Heroes</SelectItem>
            <SelectItem value="villain">Villains</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.label} className="border-border/50 hover:border-re-red/30 transition-colors">
            <CardContent className="p-4">
              <div className="text-xs font-mono text-muted-foreground tracking-wider">{k.label}</div>
              <div className="text-3xl font-black text-foreground mt-1">{k.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Scenes per Game */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground">SCENES PER GAME</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gameChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="scenes" fill="hsl(var(--re-red))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Role Distribution Pie */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground">ROLE DISTRIBUTION</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={roleData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {roleData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Cumulative Scene Growth */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground">CUMULATIVE SCENE GROWTH</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={cumulativeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="cumulative" stroke="hsl(var(--re-red))" fill="hsl(var(--re-red) / 0.2)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Interaction Density */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground">INTERACTION DENSITY</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={gameChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="density" stroke="#e63946" strokeWidth={2} dot={{ fill: "#e63946", r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="characters" stroke="#00b4d8" strokeWidth={2} dot={{ fill: "#00b4d8", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="characters" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground">
                CHARACTER ROSTER ({filteredCharacters.length} {selectedRole !== "all" ? selectedRole + "s" : "total"})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredCharacters.map(c => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/30 hover:border-re-red/30 transition-colors bg-card">
                    <div className={`w-2 h-2 rounded-full ${c.role === 'hero' ? 'bg-re-blue' : c.role === 'villain' ? 'bg-re-red' : 'bg-re-green'}`} />
                    <div>
                      <div className="text-sm font-medium text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{c.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Scatter Plot */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground">CHARACTERS vs DENSITY</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="x" name="Characters" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Characters", position: "bottom", fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis dataKey="y" name="Density" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="rounded-lg border border-border bg-popover p-3 shadow-xl text-sm">
                          <p className="font-mono font-bold">{d.name}</p>
                          <p className="text-xs">Characters: {d.x}</p>
                          <p className="text-xs">Density: {d.y}</p>
                          <p className="text-xs">Scenes: {d.z}</p>
                        </div>
                      );
                    }} />
                    <Scatter data={scatterData} fill="#e63946">
                      {scatterData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? "#e63946" : "#00b4d8"} />)}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground">GAME METRICS RADAR</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="game" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <PolarRadiusAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                    <Radar name="Scenes" dataKey="scenes" stroke="#e63946" fill="#e63946" fillOpacity={0.2} />
                    <Radar name="Characters" dataKey="characters" stroke="#00b4d8" fill="#00b4d8" fillOpacity={0.2} />
                    <Radar name="Density" dataKey="density" stroke="#2dc653" fill="#2dc653" fillOpacity={0.2} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Interactions Bar */}
            <Card className="border-border/50 lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-mono tracking-wider text-muted-foreground">TOTAL INTERACTIONS PER GAME</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gameChartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="interactions" fill="#e63946" radius={[0, 4, 4, 0]}>
                      {gameChartData.map((_, i) => <Cell key={i} fill={i % 3 === 0 ? "#e63946" : i % 3 === 1 ? "#00b4d8" : "#2dc653"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
