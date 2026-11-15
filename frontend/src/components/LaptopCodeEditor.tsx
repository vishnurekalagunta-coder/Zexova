import React, { useState, useEffect } from 'react';

interface CodeSnippet {
  filename: string;
  tabLabel: string;
  language: string;
  code: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    filename: 'ZexovaEngine.ts',
    tabLabel: 'ZexovaEngine.ts',
    language: 'TypeScript',
    code: `import { LuxuryPlatform, NeuralCore } from '@zexova/core';

export const Zexova = async () => {
  const core = await NeuralCore.init({
    mode: 'autonomous',
    quantumVault: true,
  });

  return core.launchFlagship({
    brand: 'ZEXOVA Luxury Circular',
    tier: 'Supreme',
    verified: true,
    status: 'ONLINE',
  });
};`
  },
  {
    filename: 'VaultSecurity.ts',
    tabLabel: 'VaultSecurity.ts',
    language: 'TypeScript',
    code: `import { Vault, BiometricZKP } from '@zexova/security';

interface Transaction {
  item: 'MacBook Pro 16" M3';
  auth: BiometricZKP;
  verified: boolean;
}

export async function executeTrade(tx: Transaction) {
  return await Vault.transfer({
    destination: '0x71C...8a9F',
    instantDelivery: true,
    encrypted: true,
  });
}`
  }
];

export const LaptopCodeEditor: React.FC = () => {
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [displayedChars, setDisplayedChars] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentSnippet = SNIPPETS[snippetIndex];
  const fullText = currentSnippet.code;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPaused) {
      // Pause after full typing (4 seconds) before clearing
      timer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (!isDeleting) {
      // Typing forward
      if (displayedChars < fullText.length) {
        const nextChar = fullText[displayedChars];
        // Natural typing delay: punctuation / newlines take longer
        let delay = 35;
        if (nextChar === '\n') delay = 160;
        else if (nextChar === ';' || nextChar === '{' || nextChar === '}') delay = 100;
        else if (nextChar === ' ') delay = 25;
        else delay = 30 + Math.random() * 20;

        timer = setTimeout(() => {
          setDisplayedChars((prev) => prev + 1);
        }, delay);
      } else {
        // Finished typing snippet
        setIsPaused(true);
      }
    } else {
      // Backspacing fast
      if (displayedChars > 0) {
        timer = setTimeout(() => {
          setDisplayedChars((prev) => Math.max(0, prev - 4));
        }, 15);
      } else {
        // Move to next snippet
        setIsDeleting(false);
        setSnippetIndex((prev) => (prev + 1) % SNIPPETS.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedChars, isDeleting, isPaused, fullText]);

  const currentText = fullText.slice(0, displayedChars);
  const lines = currentText.split('\n');

  // Syntax highlighting renderer for typed lines
  const renderHighlightedLine = (line: string, isLastLine: boolean) => {
    // Basic syntax highlighting token regex
    const tokens = line.split(/('(?:[^'\\]|\\.)*'|\b(?:import|export|from|const|await|async|return|function|interface|boolean|true|false)\b|\b(?:LuxuryPlatform|NeuralCore|Vault|BiometricZKP|Transaction|Zexova)\b|\b(?:init|launchFlagship|executeTrade|transfer)\b|[{}();:,=>]|(?:\/\/.*$))/g);

    return (
      <span>
        {tokens.map((token, i) => {
          if (!token) return null;

          // Comments
          if (token.startsWith('//')) {
            return <span key={i} className="text-[#5c6370] italic">{token}</span>;
          }
          // Strings
          if (token.startsWith("'") && token.endsWith("'")) {
            return <span key={i} className="text-[#98c379] font-medium">{token}</span>;
          }
          // Keywords
          if (/^(?:import|export|from|const|await|async|return|function|interface)$/.test(token)) {
            return <span key={i} className="text-[#c678dd] font-semibold">{token}</span>;
          }
          // Booleans
          if (/^(?:true|false|boolean)$/.test(token)) {
            return <span key={i} className="text-[#d19a66] font-semibold">{token}</span>;
          }
          // Types / Classes
          if (/^(?:LuxuryPlatform|NeuralCore|Vault|BiometricZKP|Transaction|Zexova)$/.test(token)) {
            return <span key={i} className="text-[#e5c07b] font-semibold">{token}</span>;
          }
          // Functions / Methods
          if (/^(?:init|launchFlagship|executeTrade|transfer)$/.test(token)) {
            return <span key={i} className="text-[#61afef] font-semibold">{token}</span>;
          }
          // Punctuation
          if (/^[{}();:,=>]$/.test(token)) {
            return <span key={i} className="text-[#abb2bf] font-light">{token}</span>;
          }
          // Property keys or general variables
          if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(token)) {
            return <span key={i} className="text-[#e06c75]">{token}</span>;
          }

          return <span key={i} className="text-[#abb2bf]">{token}</span>;
        })}
        {isLastLine && (
          <span className="inline-block w-1.5 h-3 sm:h-3.5 bg-cyan-400 ml-0.5 align-middle animate-pulse" />
        )}
      </span>
    );
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#0f1117] text-[#abb2bf] font-mono select-none overflow-hidden text-[6px] sm:text-[7.5px] md:text-[8px] lg:text-[9.5px] xl:text-[10.5px] leading-relaxed">
      
      {/* 1. macOS Top Window Bar */}
      <div className="h-4 sm:h-5 w-full bg-[#161821] border-b border-black/40 flex items-center justify-between px-2 sm:px-2.5 flex-shrink-0 z-20">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
        </div>

        <div className="text-[5.5px] sm:text-[7px] font-mono text-zinc-400 tracking-wider truncate px-2 font-medium">
          zexova-core — {currentSnippet.filename}
        </div>

        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[5px] sm:text-[6.5px] text-zinc-500 uppercase font-bold tracking-widest hidden sm:inline">
            Live
          </span>
        </div>
      </div>

      {/* 2. Editor Tab Strip */}
      <div className="h-3.5 sm:h-4.5 bg-[#12141c] border-b border-black/30 flex items-center px-1.5 gap-1 flex-shrink-0">
        {SNIPPETS.map((snip, idx) => {
          const isActive = idx === snippetIndex;
          return (
            <div
              key={snip.filename}
              className={`px-1.5 py-0.5 rounded-t flex items-center gap-1 text-[5px] sm:text-[6.5px] transition-colors ${
                isActive
                  ? 'bg-[#0f1117] text-white border-t border-cyan-400 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className="text-[#3178c6] font-bold text-[5px] sm:text-[6.5px]">TS</span>
              <span>{snip.tabLabel}</span>
            </div>
          );
        })}
      </div>

      {/* 3. Main Code Canvas with Line Numbers */}
      <div className="flex-1 w-full overflow-hidden p-1 sm:p-1.5 flex bg-[#0f1117]">
        {/* Line Numbers Gutter */}
        <div className="pr-1.5 sm:pr-2 text-right text-zinc-600 select-none border-r border-zinc-800/80 mr-1.5 sm:mr-2 flex flex-col font-mono text-[5.5px] sm:text-[7px] md:text-[8px] lg:text-[9px]">
          {Array.from({ length: Math.max(lines.length, 12) }).map((_, i) => (
            <div key={i} className="leading-relaxed opacity-60">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Typed Code Canvas */}
        <div className="flex-1 overflow-hidden font-mono whitespace-pre flex flex-col">
          {lines.map((line, idx) => (
            <div key={idx} className="leading-relaxed min-h-[9px] sm:min-h-[11px] lg:min-h-[14px]">
              {renderHighlightedLine(line, idx === lines.length - 1)}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom Status Bar */}
      <div className="h-3 sm:h-4 bg-[#161821] border-t border-black/40 flex items-center justify-between px-2 text-[5px] sm:text-[6.5px] text-zinc-500 flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold flex items-center gap-0.5">
            ⚡ main*
          </span>
          <span className="hidden sm:inline text-zinc-400">0 errors</span>
          <span className="text-emerald-400 font-medium">✓ Ready</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Ln {lines.length}, Col {lines[lines.length - 1]?.length || 0}</span>
          <span className="hidden sm:inline">UTF-8</span>
          <span className="text-zinc-400 font-semibold">{currentSnippet.language}</span>
        </div>
      </div>

    </div>
  );
};

export default LaptopCodeEditor;

