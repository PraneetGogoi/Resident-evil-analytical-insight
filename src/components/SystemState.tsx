import { AlertCircle, Loader2 } from "lucide-react";

export function LoadingState({ message = "ACCESSING DATA TERMINAL..." }: { message?: string }) {
  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center border border-torch/20 bg-[#1f1b17]/40 relative overflow-hidden group">
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>
      <div className="flex flex-col items-center space-y-4 relative z-10">
        <Loader2 className="w-12 h-12 text-torch animate-spin" />
        <div className="font-['Courier_Prime'] text-torch tracking-widest animate-pulse text-sm">
          {message}
        </div>
      </div>
      {/* Glitch decoration */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-torch/50"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-torch/50"></div>
    </div>
  );
}

export function ErrorState({ error, message = "SIGNAL LOST — RECONNECTING..." }: { error?: Error | null, message?: string }) {
  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center border border-torch bg-black/60 relative overflow-hidden">
      <div className="absolute inset-0 scanline opacity-40 pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiMxMTEiLz48cmVjdCB3aWR0aD0iMiIgaGVpZ2h0PSIyIiBmaWxsPSIjMzMzIi8+PC9zdmc+')]"></div>
      <div className="flex flex-col items-center space-y-4 relative z-10 p-6 bg-black/80 border border-torch/50 shadow-[0_0_20px_rgba(232,76,34,0.3)]">
        <AlertCircle className="w-16 h-16 text-torch-hot animate-[glitch_2s_infinite]" />
        <div className="font-['Courier_Prime'] text-torch-hot tracking-widest text-xl font-bold uppercase text-center glitch-hover">
          {message}
        </div>
        {error && (
          <div className="font-['Courier_Prime'] text-bone-dim text-xs mt-4 max-w-md text-center bg-black p-3 border border-torch/20">
            ERR_CODE: {error.message || "UNKNOWN_EXCEPTION"}
          </div>
        )}
      </div>
    </div>
  );
}
