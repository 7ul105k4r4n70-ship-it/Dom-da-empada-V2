import React from 'react';
import { Search, UserCircle } from 'lucide-react';
import { type Region } from '@/types';
import { cn } from '@/lib/utils';
import { NotificationCenter } from './NotificationCenter';

interface TopBarProps {
  region: Region;
  setRegion: (region: Region) => void;
  title: string;
}

export function TopBar({ region, setRegion, title }: TopBarProps) {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-slate-100 flex justify-between items-center px-8 z-40 shadow-sm">
      <div className="flex items-center gap-8">
        <span className="text-lg font-black text-primary uppercase tracking-wider font-headline">
          {title}
        </span>
        
        <div className="flex bg-slate-100 p-1 rounded-full border border-slate-200">
          <button 
            onClick={() => setRegion('Recife')}
            className={cn(
              "px-6 py-1.5 rounded-full text-xs font-bold transition-all duration-300",
              region === 'Recife' 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-slate-500 hover:text-primary"
            )}
          >
            Recife
          </button>
          <button 
            onClick={() => setRegion('Salvador')}
            className={cn(
              "px-6 py-1.5 rounded-full text-xs font-bold transition-all duration-300",
              region === 'Salvador' 
                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                : "text-slate-500 hover:text-primary"
            )}
          >
            Salvador
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 w-64"
          />
        </div>
        <NotificationCenter />
        <button className="p-2 text-on-surface-variant hover:bg-slate-100 rounded-full">
          <UserCircle className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
