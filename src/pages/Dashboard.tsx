import { useState, useEffect } from "react";
import { Character, Game } from "@/types";
import Models from "./Models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingState, ErrorState } from "@/components/SystemState";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  ScatterChart, Scatter, Legend, Treemap
} from "recharts";

const ROLE_COLORS = { hero: "#bca476", villain: "#e84c22", support: "#7a6e5f" };

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-board border border-torch/30 p-3 shadow-xl text-[10px] font-['Courier_Prime'] text-bone">
      <p className="font-bold text-torch-hot mb-1 tracking-[1px] uppercase">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="opacity-90">
          {p.name}: <span className="font-bold text-bone">{p.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [gameTimeline, setGameTimeline] = useState<any[]>([]);
  const [charSceneCounts, setCharSceneCounts] = useState<any[]>([]);
  const [mlFeatures, setMlFeatures] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/api/characters').then(r => r.ok ? r.json() : Promise.reject(new Error("Characters fetch failed"))),
      fetch('http://localhost:3001/api/games').then(r => r.ok ? r.json() : Promise.reject(new Error("Games fetch failed"))),
      fetch('http://localhost:3001/api/analytics/summary').then(r => r.ok ? r.json() : Promise.reject(new Error("Analytics fetch failed"))),
      fetch('/game_timeline.json').then(r => r.json()),
      fetch('/char_scene_counts.json').then(r => r.json()),
      fetch('/ml_feature_importance.json').then(r => r.json())
    ]).then(([chars, gs, an, gt, csc, mlf]) => {
      setCharacters(chars);
      setGames(gs);
      setAnalytics(an);
      setGameTimeline(gt || []);
      setCharSceneCounts(csc || []);
      setMlFeatures(mlf || []);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="relative max-w-[1300px] mx-auto px-6 md:px-12 pt-[70px] pb-[60px] z-[5] min-h-[70vh] flex items-center justify-center">
        <LoadingState message="COMPILING GLOBAL ANALYTICS..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative max-w-[1300px] mx-auto px-6 md:px-12 pt-[70px] pb-[60px] z-[5] min-h-[70vh] flex items-center justify-center">
        <ErrorState error={error} message="DATA CORRUPTION DETECTED" />
      </div>
    );
  }

  const roleData = [
    { name: "Heroes", value: characters.filter(c => c.classification === "hero").length, color: ROLE_COLORS.hero },
    { name: "Villains", value: characters.filter(c => c.classification === "villain").length, color: ROLE_COLORS.villain },
    { name: "Support", value: characters.filter(c => c.classification === "support").length, color: ROLE_COLORS.support },
  ];

  let cumulative = 0;
  const cumulativeData = gameTimeline.map(g => {
    cumulative += (g.unique_scenes || 0);
    return { 
      name: (g.game_title || "").replace("Resident Evil", "RE").replace("RE ", "RE"), 
      cumulative, 
      year: g.year,
      scenes: g.unique_scenes,
      chars: g.unique_chars
    };
  });

  const kpis = [
    { label: "Total Games", value: games.length },
    { label: "Total Entities", value: characters.length },
    { label: "Total Scenes", value: gameTimeline.reduce((a, g) => a + (g.unique_scenes || 0), 0) },
    { label: "Total Contacts", value: analytics?.globalInteractions || 0 },
  ];

  const communityCounts = characters.reduce((acc, c) => {
    if (c.communityId !== undefined) {
      acc[c.communityId] = (acc[c.communityId] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);
  
  const treeMapData = Object.keys(communityCounts).map(id => ({
    name: `Cluster ${id}`,
    size: communityCounts[Number(id)]
  }));

  return (
    <div className="relative max-w-[1300px] mx-auto px-6 md:px-12 pt-[70px] pb-[60px] z-[5]">
      
      {/* Title Node */}
      <div className="md:absolute z-[6] md:top-0 md:left-[2%] md:w-[460px] mb-8 md:mb-0">
        <div className="bg-gradient-to-br from-[#1c140c66] to-[#050301b3] border border-torch/25 p-7 md:p-8 transform md:rotate-[0.5deg] relative shadow-xl">
          <div className="absolute -top-1.5 left-5 w-[22px] h-[22px] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--torch-hot),var(--torch)_70%)] shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
          <div className="font-['Courier_Prime'] text-[10px] tracking-[4px] text-torch uppercase mb-4 opacity-90">
            System Diagnostics
          </div>
          <h1 className="title-h1 font-['Cinzel'] font-bold text-4xl md:text-[50px] tracking-[5px] text-bone leading-none relative">
            DATA TERMINAL
            <span className="block text-[0.48em] tracking-[7px] text-torch-hot mt-2">GLOBAL ANALYTICS</span>
          </h1>
        </div>
      </div>

      <div className="mt-8 md:mt-[200px] relative z-10">
        <Tabs defaultValue="overview" className="w-full">
          <div className="mb-6 flex justify-end">
            <TabsList className="bg-[#1f1b17]/80 border border-torch/20">
              <TabsTrigger value="overview" className="font-['Courier_Prime'] data-[state=active]:bg-torch/20 data-[state=active]:text-torch-hot">Overview</TabsTrigger>
              <TabsTrigger value="advanced" className="font-['Courier_Prime'] data-[state=active]:bg-torch/20 data-[state=active]:text-torch-hot">Advanced Models</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="space-y-12">
            
            {/* KPI Cards (styled as medical vitals) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map((k, i) => {
            const rotation = i % 2 === 0 ? 'rotate-[1deg]' : '-rotate-[1deg]';
            return (
              <div key={k.label} className={`bg-black/60 border border-torch/30 p-4 transform ${rotation} shadow-[0_5px_15px_rgba(0,0,0,0.5)]`}>
                <div className="font-['Courier_Prime'] text-[10px] tracking-[2px] text-bone-dim uppercase">{k.label}</div>
                <div className="font-['Cinzel'] text-3xl md:text-4xl font-bold text-torch-hot mt-2 glitch-hover">{k.value.toLocaleString()}</div>
                
                {/* Heartbeat line graphic */}
                <div className="mt-3 w-full h-[20px] opacity-40">
                  <svg viewBox="0 0 100 20" className="w-full h-full stroke-torch fill-none stroke-[1.5px] vector-line">
                    <path d="M0 10 L20 10 L25 5 L30 18 L35 2 L40 10 L100 10" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stacked Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Treemap for Factions */}
          <div className="bg-[#1f1b17]/80 border border-torch/20 p-6 shadow-xl relative group hover:border-torch/50 transition-colors">
            {/* Tape corner */}
            <div className="absolute -top-3 -right-3 w-12 h-4 bg-[#d8cfba2e] rotate-45 opacity-60"></div>
            
            <h3 className="font-['Courier_Prime'] text-xs tracking-[3px] text-bone-dim uppercase mb-6 border-b border-torch/20 pb-2">Faction Clusters (ML Louvain)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <Treemap
                data={treeMapData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#1f1b17"
                fill="#e84c22"
              >
                <Tooltip content={<CustomTooltip />} />
              </Treemap>
            </ResponsiveContainer>
          </div>

          {/* Cumulative Growth */}
          <div className="bg-[#1f1b17]/80 border border-torch/20 p-6 shadow-xl relative group hover:border-torch/50 transition-colors">
            <h3 className="font-['Courier_Prime'] text-xs tracking-[3px] text-bone-dim uppercase mb-6 border-b border-torch/20 pb-2">Cumulative Scene Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={cumulativeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#bca476", fontFamily: 'Courier Prime' }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 9, fill: "#bca476", fontFamily: 'Courier Prime' }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="cumulative" stroke="#c22626" fill="rgba(232, 76, 34, 0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Top Character Scene Counts */}
          <div className="bg-[#1f1b17]/80 border border-torch/20 p-6 shadow-xl relative group hover:border-torch/50 transition-colors">
            <h3 className="font-['Courier_Prime'] text-xs tracking-[3px] text-bone-dim uppercase mb-6 border-b border-torch/20 pb-2">Top Entities by Scene Count</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charSceneCounts.slice(0, 10)} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: "#bca476", fontFamily: 'Courier Prime' }} />
                <YAxis dataKey="char_name" type="category" width={100} tick={{ fontSize: 9, fill: "#bca476", fontFamily: 'Courier Prime' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total_scenes" name="Total Scenes" fill="#e84c22" radius={[0, 4, 4, 0]}>
                  {charSceneCounts.slice(0, 10).map((entry, i) => (
                    <Cell key={i} fill={entry.char_role === 'hero' ? ROLE_COLORS.hero : entry.char_role === 'villain' ? ROLE_COLORS.villain : ROLE_COLORS.support} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ML Feature Importances */}
          <div className="bg-[#1f1b17]/80 border border-torch/20 p-6 shadow-xl relative group hover:border-torch/50 transition-colors">
            <h3 className="font-['Courier_Prime'] text-xs tracking-[3px] text-bone-dim uppercase mb-6 border-b border-torch/20 pb-2">ML Classification: Feature Importances</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mlFeatures} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 9, fill: "#bca476", fontFamily: 'Courier Prime' }} />
                <YAxis dataKey="feature" type="category" width={100} tick={{ fontSize: 9, fill: "#bca476", fontFamily: 'Courier Prime' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="importance" name="Importance Score" fill="#c22626" radius={[0, 4, 4, 0]}>
                  {mlFeatures.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? "#c22626" : "#e84c22"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

          </TabsContent>
          <TabsContent value="advanced">
            <Models />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="h-[100px]"></div>
    </div>
  );
}
