import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as d3 from "d3-force";
import { NetworkData, Character, CharacterConnection } from "../types";

const Index = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/network')
      .then(res => res.json())
      .then((data: NetworkData) => {
        const topChars = data.nodes.sort((a, b) => (b.pageRank || 0) - (a.pageRank || 0)).slice(0, 20);
        const topCharIds = new Set(topChars.map(c => String(c.id)));
        const filteredEdges = data.edges.filter(e => topCharIds.has(String(e.sourceId)) && topCharIds.has(String(e.targetId)));

        const forceNodes = topChars.map(n => ({ ...n } as Character & d3.SimulationNodeDatum));
        const forceEdges = filteredEdges.map(e => ({ source: String(e.sourceId), target: String(e.targetId), weight: e.weight }));

        d3.forceSimulation(forceNodes)
          .force('link', d3.forceLink(forceEdges).id((d: any) => String(d.id)).distance(150))
          .force('charge', d3.forceManyBody().strength(-200))
          .force('center', d3.forceCenter(650, 475))
          .force("collide", d3.forceCollide((d: any) => 90).strength(0.9))
          .force("titleAvoid", () => {
            forceNodes.forEach((d: any) => {
              if (d.x < 620 && d.y < 420) {
                d.x += (620 - d.x) * 0.1;
              }
            });
          })
          .force("bounds", () => {
            forceNodes.forEach((d: any) => {
              d.x = Math.max(90, Math.min(1300 - 90, d.x));
              d.y = Math.max(90, Math.min(950 - 90, d.y));
            });
          })
          .on('tick', () => {
            setNodes([...forceNodes]);
            setEdges([...forceEdges]);
          });
      });
  }, []);

  return (
    <>
      <div className="relative max-w-[1300px] mx-auto px-6 md:px-12 pt-[70px] pb-[60px] z-[5] min-h-[1000px]">
        
        {/* String Layer */}
        <svg className="absolute inset-0 z-[1] pointer-events-none w-full h-full drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]" viewBox="0 0 1300 950" preserveAspectRatio="xMidYMid meet">
          {edges.map((edge, i) => {
            const isHovered = hoveredNode === edge.source.id || hoveredNode === edge.target.id;
            const isAnyHovered = hoveredNode !== null;
            const opacity = isAnyHovered ? (isHovered ? 0.8 : 0.05) : Math.max(0.1, Math.min(0.4, edge.weight / 20));
            const strokeColor = isHovered ? "var(--torch-hot)" : "var(--string)";
            
            return (
              <line
                key={i}
                x1={edge.source.x}
                y1={edge.source.y}
                x2={edge.target.x}
                y2={edge.target.y}
                stroke={strokeColor}
                strokeWidth={Math.max(0.5, (edge.weight / 15))}
                opacity={opacity}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>

        {/* Title Node */}
        <div className="md:absolute z-[6] md:top-0 md:left-[2%] md:w-[460px] mb-8 md:mb-0">
          <div className="bg-gradient-to-br from-[#1c140c66] to-[#050301b3] border border-torch/25 p-7 md:p-8 transform md:-rotate-2 relative shadow-xl">
            <div className="absolute -top-1.5 left-5 w-[22px] h-[22px] rounded-full bg-[radial-gradient(circle_at_35%_30%,var(--torch-hot),var(--torch)_70%)] shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
            <div className="font-['Courier_Prime'] text-[10px] tracking-[4px] text-torch uppercase mb-4 opacity-90">
              Village Outskirts — Tape 03
            </div>
            <h1 className="title-h1 font-['Cinzel'] font-bold text-4xl md:text-[50px] lg:text-[60px] tracking-[5px] text-bone leading-none relative">
              RESIDENT EVIL
              <span className="block text-[0.58em] tracking-[9px] text-blood-glow mt-1.5">ANALYTICS</span>
            </h1>
            <p className="font-['Special_Elite'] text-[12.5px] leading-[1.9] text-bone-dim mt-4">
              Case board reconstructed from recovered field tapes, evidence photos, and personnel files. Some threads are still missing.
            </p>
          </div>
        </div>

        {/* Data-Driven Nodes */}
        {nodes.map((node, i) => {
          // Add some jitter to rotation
          const rot = (node.x % 6) - 3; 
          
          // Determine size based on PageRank
          const scale = Math.max(0.7, Math.min(1.4, (node.pageRank || 0) * 12 + 0.65));
          const isHovered = hoveredNode === node.id;
          const isRelated = hoveredNode ? edges.some(e => (e.source.id === hoveredNode && e.target.id === node.id) || (e.target.id === hoveredNode && e.source.id === node.id)) : false;
          
          // dim non-related nodes if something is hovered
          const opacity = hoveredNode ? (isHovered || isRelated ? 1 : 0.3) : 1;
          const zIndex = isHovered ? 30 : (isRelated ? 25 : 6);

          return (
            <div 
              key={node.id} 
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className="absolute transform transition-all duration-300 hover:!z-[40]"
              style={{ 
                left: `${node.x - 70}px`, 
                top: `${node.y - 70}px`,
                width: '140px',
                rotate: `${rot}deg`,
                scale: isHovered ? scale * 1.15 : scale,
                opacity: opacity,
                zIndex: zIndex
              }}
            >
              <Link to="/characters" className={`block bg-paper p-2 pb-5 shadow-[0_10px_24px_rgba(0,0,0,0.5)] border ${isHovered ? 'border-torch shadow-[0_10px_30px_rgba(180,30,30,0.4)]' : 'border-[#cabb96]/30'}`}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 -rotate-2 w-8 h-3 bg-[#d8cfba2e] opacity-70 shadow-sm"></div>
                <div className="w-full aspect-[4/3] relative overflow-hidden bg-[#0a0a0a] border border-ash/20">
                   <div className="absolute inset-0 flex items-center justify-center font-['Courier_Prime'] text-[9px] tracking-[1px] text-[#d8cfba99] uppercase text-center p-1">
                      {node.name}
                   </div>
                </div>
                <div className="font-['Caveat'] text-[14px] text-[#2a2015] text-center mt-1.5 leading-tight">
                  PR: {(node.pageRank || 0).toFixed(3)}
                </div>
              </Link>
            </div>
          );
        })}

        <div className="hidden md:block h-[1000px]"></div>
      </div>

      <footer className="max-w-[1300px] mx-auto px-6 md:px-[60px] pb-[60px] pt-[26px] flex flex-col md:flex-row justify-between font-['Courier_Prime'] text-[9.5px] text-ash tracking-[1px] border-t border-torch/15 relative z-[5] gap-4 md:gap-0 mt-8 md:mt-0">
        <span>R.E. ANALYTICS — INVESTIGATION BOARD PREVIEW</span>
        <span>THREADS INCOMPLETE</span>
      </footer>
    </>
  );
};

export default Index;
