import React from 'react';
import { Search, UserCircle, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type Region } from '@/types';
import { cn } from '@/lib/utils';
import { NotificationCenter } from './NotificationCenter';
import { AISearch } from './AISearch';

interface TopBarProps {
  region: Region;
  setRegion: (region: Region) => void;
  title: string;
  onMenuToggle?: () => void;
}

export function TopBar({ region, setRegion, title, onMenuToggle }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-14 lg:h-16 bg-white border-b border-slate-100 flex justify-between items-center px-4 lg:px-8 z-40 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="text-xs lg:text-sm font-black text-primary uppercase tracking-wider font-headline">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <AISearch />
        <NotificationCenter />
        <button 
          onClick={() => navigate('/profile')}
          className="p-2 text-on-surface-variant hover:bg-slate-100 rounded-full transition-colors"
          title="Ver meu perfil"
        >
          <UserCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
