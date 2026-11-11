import React, { useEffect, useState } from 'react';
import { TabType } from '../types';
import { probabilityApi } from '../services/api';
import { soundEngine, useSoundMute } from '../utils/sound';
import {
  Coins,
  Dice5,
  Layers,
  BarChart3,
  Home,
  CheckCircle2,
  XCircle,
  Sparkles,
  Menu,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [muted, toggleMute] = useSoundMute();

  const handleSelectTab = (tab: TabType) => {
    if (tab !== activeTab) {
      soundEngine.playTabSwitch();
    } else {
      soundEngine.playClick();
    }
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    probabilityApi
      .checkHealth()
      .then(() => setBackendOnline(true))
      .catch(() => setBackendOnline(false));
  }, []);

  const navItems: { id: TabType; label: string; shortLabel: string; icon: any }[] = [
    { id: 'home', label: 'Home', shortLabel: 'Home', icon: Home },
    { id: 'coin', label: 'Coin Lab', shortLabel: 'Coin', icon: Coins },
    { id: 'dice', label: 'Dice Lab', shortLabel: 'Dice', icon: Dice5 },
    { id: 'cards', label: 'Card Lab', shortLabel: 'Cards', icon: Layers },
    { id: 'statistics', label: 'LLN Stats', shortLabel: 'Stats', icon: BarChart3 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-midnight-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div
          onClick={() => handleSelectTab('home')}
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 p-0.5 shadow-glow-violet transition-transform group-hover:scale-105 shrink-0">
            <div className="w-full h-full bg-midnight-950 rounded-[10px] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            </div>
          </div>
          <div className="shrink-0">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent whitespace-nowrap">
                PROBABILITY<span className="text-cyan-400">LAB</span>
              </span>
              <span className="hidden xl:inline-block whitespace-nowrap px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30 rounded-full">
                Group 7
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide hidden sm:block whitespace-nowrap">
              Python Stochastic Engine & Studio
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 bg-midnight-900/60 p-1 rounded-xl border border-white/5 shrink-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_-3px_rgba(147,51,234,0.5)] border border-purple-400/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Status Pill, Sound Toggle & Mobile Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-2.5 shrink-0">
          {/* Compact API status indicator on mobile/tablet */}
          <div
            className="flex lg:hidden items-center space-x-1.5 px-2 py-1 rounded-full bg-midnight-900/90 border border-white/10 text-[10px] font-mono whitespace-nowrap"
            title={backendOnline ? 'Python Engine Active' : 'Checking API'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                backendOnline === true
                  ? 'bg-emerald-400 animate-pulse'
                  : backendOnline === false
                  ? 'bg-rose-400'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span
              className={
                backendOnline === true
                  ? 'text-emerald-400'
                  : backendOnline === false
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }
            >
              API
            </span>
          </div>

          <div className="hidden lg:flex items-center space-x-2 px-3 py-1 rounded-full bg-midnight-900 border border-white/10 text-xs font-mono whitespace-nowrap shrink-0">
            {backendOnline === true ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-400">Python 3.12: Active</span>
              </>
            ) : backendOnline === false ? (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span className="text-rose-400">Python: Offline</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                <span className="text-amber-400">Checking API...</span>
              </>
            )}
          </div>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute sound effects' : 'Mute sound effects'}
            title={muted ? 'Sound Off (Tap to enable)' : 'Sound Effects On'}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all active:scale-95 ${
              muted
                ? 'bg-midnight-900/70 border-white/10 text-slate-400 hover:text-slate-200'
                : 'bg-purple-500/15 border-purple-400/35 text-purple-200 hover:bg-purple-500/25 shadow-[0_0_12px_-4px_rgba(168,85,247,0.45)]'
            }`}
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-purple-300" />
            )}
            <span className="hidden sm:inline font-mono text-[11px]">
              {muted ? 'Muted' : 'SFX'}
            </span>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 border border-white/10 active:scale-95"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 1-Tap Mobile Quick Navigation Rail */}
      <div className="md:hidden border-t border-white/5 bg-midnight-950/75 px-3 py-1.5 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-[0_0_14px_-3px_rgba(147,51,234,0.6)] border border-purple-400/50'
                  : 'bg-midnight-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-midnight-950/95 backdrop-blur-2xl px-4 py-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_-3px_rgba(147,51,234,0.5)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 mt-1 border-t border-white/10 flex items-center justify-between px-2 text-xs font-mono">
            <span className="text-slate-400">Engine Connection</span>
            {backendOnline ? (
              <span className="flex items-center text-emerald-400 space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active</span>
              </span>
            ) : (
              <span className="flex items-center text-rose-400 space-x-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>Offline</span>
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

