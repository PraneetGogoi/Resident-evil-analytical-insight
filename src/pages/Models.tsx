import { useState, useEffect } from "react";
import { LoadingState, ErrorState } from "@/components/SystemState";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend
} from "recharts";

const ROLE_COLORS = { hero: "#bca476", villain: "#e84c22", support: "#7a6e5f" };
const CLUSTER_COLORS = ["#00b4d8", "#e63946", "#2dc653"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-board border border-torch/30 p-3 shadow-xl text-[10px] font-['Courier_Prime'] text-bone">
      {data.name && <p className="font-bold text-torch-hot mb-1 tracking-[1px] uppercase">{data.name}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || '#fff' }} className="opacity-90">
          {p.name}: <span className="font-bold text-bone">{typeof p.value === 'number' ? p.value.toFixed(3) : p.value}</span>
        </p>
      ))}
      {data.role && <p className="text-bone-dim mt-1">Role: <span style={{ color: ROLE_COLORS[data.role as keyof typeof ROLE_COLORS] }}>{data.role}</span></p>}
    </div>
  );
};

export default function Models() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/advanced_analytics.json')
      .then(r => r.ok ? r.json() : Promise.reject(new Error("Failed to fetch advanced analytics data")))
      .then(data => {
        setAnalytics(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <LoadingState message="TRAINING ADVANCED MODELS..." />;
  }

  if (error) {
    return <ErrorState error={error} message="MODEL COMPILATION FAILED" />;
  }

  const { scatter_data, model_accuracies, centroids } = analytics;

  return (
    <div className="space-y-12 relative z-10">
      
      {/* Machine Learning Models */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Model Accuracy Comparison */}
          <div className="bg-[#1f1b17]/80 border border-torch/20 p-6 shadow-xl relative group hover:border-torch/50 transition-colors">
            <h3 className="font-['Courier_Prime'] text-xs tracking-[3px] text-bone-dim uppercase mb-6 border-b border-torch/20 pb-2">Classifier Performance</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={model_accuracies} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#bca476", fontFamily: 'Courier Prime' }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: "#bca476", fontFamily: 'Courier Prime' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'Courier Prime', color: '#bca476' }} />
                <Bar dataKey="cv_mean" name="CV Mean Accuracy" fill="#00b4d8" radius={[2, 2, 0, 0]} barSize={30} />
                <Bar dataKey="test_acc" name="Test Accuracy" fill="#f4a261" radius={[2, 2, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* KMeans PCA Projection */}
          <div className="bg-[#1f1b17]/80 border border-torch/20 p-6 shadow-xl relative group hover:border-torch/50 transition-colors">
            <h3 className="font-['Courier_Prime'] text-xs tracking-[3px] text-bone-dim uppercase mb-6 border-b border-torch/20 pb-2">PCA Projection & KMeans (K=3)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" dataKey="pc1" name="PC1" tick={{ fontSize: 9, fill: "#bca476" }} />
                <YAxis type="number" dataKey="pc2" name="PC2" tick={{ fontSize: 9, fill: "#bca476" }} />
                <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Entities" data={scatter_data}>
                  {scatter_data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[entry.cluster % CLUSTER_COLORS.length]} />
                  ))}
                </Scatter>
                <Scatter name="Centroids" data={centroids} fill="yellow" shape="star" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Network Topology Section */}
        <div className="bg-[#1c140c66] border border-torch/20 p-6 shadow-xl relative">
          <h2 className="font-['Cinzel'] text-2xl tracking-[3px] text-torch-hot mb-2">Network Topology</h2>
          <p className="font-['Courier_Prime'] text-xs text-bone-dim mb-8">Graph theoretical centrality distributions across the entire RE universe.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Degree vs PageRank */}
            <div className="bg-[#1f1b17]/80 border border-torch/10 p-4 relative group hover:border-torch/40 transition-colors">
              <h3 className="font-['Courier_Prime'] text-[10px] tracking-[2px] text-bone/60 uppercase mb-4 text-center">Degree vs PageRank</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" dataKey="degree" name="Degree" tick={{ fontSize: 9, fill: "#bca476" }} />
                  <YAxis type="number" dataKey="pagerank" name="PageRank" tick={{ fontSize: 9, fill: "#bca476" }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Characters" data={scatter_data}>
                    {scatter_data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={ROLE_COLORS[entry.role as keyof typeof ROLE_COLORS] || ROLE_COLORS.support} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Degree vs Betweenness */}
            <div className="bg-[#1f1b17]/80 border border-torch/10 p-4 relative group hover:border-torch/40 transition-colors">
              <h3 className="font-['Courier_Prime'] text-[10px] tracking-[2px] text-bone/60 uppercase mb-4 text-center">Degree vs Betweenness</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" dataKey="degree" name="Degree" tick={{ fontSize: 9, fill: "#bca476" }} />
                  <YAxis type="number" dataKey="betweenness" name="Betweenness" tick={{ fontSize: 9, fill: "#bca476" }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Characters" data={scatter_data}>
                    {scatter_data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={ROLE_COLORS[entry.role as keyof typeof ROLE_COLORS] || ROLE_COLORS.support} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Betweenness vs Eigenvector */}
            <div className="bg-[#1f1b17]/80 border border-torch/10 p-4 relative group hover:border-torch/40 transition-colors">
              <h3 className="font-['Courier_Prime'] text-[10px] tracking-[2px] text-bone/60 uppercase mb-4 text-center">Betweenness vs Eigenvector</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" dataKey="betweenness" name="Betweenness" tick={{ fontSize: 9, fill: "#bca476" }} />
                  <YAxis type="number" dataKey="eigenvector" name="Eigenvector" tick={{ fontSize: 9, fill: "#bca476" }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Characters" data={scatter_data}>
                    {scatter_data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={ROLE_COLORS[entry.role as keyof typeof ROLE_COLORS] || ROLE_COLORS.support} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Legend for Roles */}
            <div className="bg-[#1f1b17]/80 border border-torch/10 p-4 flex flex-col items-center justify-center space-y-4">
              <h3 className="font-['Courier_Prime'] text-[10px] tracking-[2px] text-bone/60 uppercase text-center">Role Classification Legend</h3>
              <div className="flex flex-col gap-3 font-['Courier_Prime'] text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ROLE_COLORS.hero }}></div>
                  <span className="text-bone">Hero / Protagonist</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ROLE_COLORS.villain }}></div>
                  <span className="text-bone">Villain / Antagonist</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ROLE_COLORS.support }}></div>
                  <span className="text-bone">Support / Neutral</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
