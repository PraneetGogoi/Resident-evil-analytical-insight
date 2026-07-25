import { useState, useEffect } from "react";

interface RedactedTextProps {
  text: string;
  className?: string;
  revealColor?: string;
}

export function RedactedText({ text, className = "", revealColor = "text-blood-hot" }: RedactedTextProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (isRevealed) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(String(text).slice(0, i + 1));
        i++;
        if (i >= String(text).length) clearInterval(interval);
      }, 50); // Typewriter speed
      return () => clearInterval(interval);
    } else {
      setDisplayedText("");
    }
  }, [isRevealed, text]);

  return (
    <div 
      className={`relative inline-block cursor-pointer group ${className}`}
      onClick={(e) => { e.stopPropagation(); setIsRevealed(true); }}
    >
      {/* The actual text (typewriter revealed) */}
      <span className={`font-['Courier_Prime'] font-bold ${revealColor}`}>
        {isRevealed ? displayedText : "\u00A0".repeat(String(text).length)}
        {isRevealed && displayedText.length < String(text).length && <span className="animate-pulse">_</span>}
      </span>
      
      {/* The black redaction bar */}
      <div 
        className={`absolute inset-0 bg-black transition-all duration-700 ease-out origin-left ${isRevealed ? 'scale-x-0 opacity-0' : 'scale-x-100 opacity-100 group-hover:bg-black/80'}`}
      />
    </div>
  );
}
