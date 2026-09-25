import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Boxes, 
  Cpu, 
  ClipboardCheck, 
  HeartHandshake, 
  Navigation, 
  Leaf, 
  FileText, 
  Settings, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { NavigationTab, UserRole } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  activeRole: UserRole;
  surplusCount?: number;
  locationCity?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  activeRole,
  surplusCount = 2,
  locationCity
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 shrink-0" /> },
    { id: 'demand-forecast', label: 'Demand Forecast', icon: <TrendingUp className="w-5 h-5 shrink-0" /> },
    { id: 'food-batches', label: 'Food Batches', icon: <Boxes className="w-5 h-5 shrink-0" />, badge: surplusCount > 0 ? `${surplusCount} Surplus` : undefined },
    { id: 'iot-simulator', label: 'Virtual IoT Simulator', icon: <Cpu className="w-5 h-5 shrink-0" />, badge: 'Sim' },
    { id: 'quality-check', label: 'Quality Check', icon: <ClipboardCheck className="w-5 h-5 shrink-0" /> },
    { id: 'ngo-matching', label: 'NGO Matching', icon: <HeartHandshake className="w-5 h-5 shrink-0" /> },
    { id: 'route-planning', label: 'Route Planning', icon: <Navigation className="w-5 h-5 shrink-0" /> },
    { id: 'sustainability', label: 'Sustainability Analytics', icon: <Leaf className="w-5 h-5 shrink-0" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5 shrink-0" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5 shrink-0" /> },
  ];

  const handleTabClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 flex flex-col justify-between transition-all duration-300 shadow-sm ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
            {!isCollapsed ? (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 via-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="leading-tight">
                  <div className="font-display font-extrabold text-slate-900 text-base flex items-center gap-1.5">
                    SmartFood <span className="text-emerald-600">Rescue</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase truncate max-w-[140px]">
                    AI Ecosystem • {locationCity || 'AP Vijayawada'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-10 h-10 mx-auto rounded-xl bg-linear-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-sm shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
            )}

            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-14rem)]">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group relative ${
                    isActive
                      ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  } ${isCollapsed ? 'justify-center' : 'justify-between'}`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3">
                    <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-emerald-600 transition-colors'}`}>
                      {item.icon}
                    </span>
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badge.toString().includes('Surplus')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2.5 py-1 bg-slate-900 text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Banner & Tagline */}
        <div className="p-3 border-t border-slate-100">
          {!isCollapsed ? (
            <div className="p-3 rounded-xl bg-linear-to-br from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-100 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] uppercase tracking-wider mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                Active Mode: {activeRole}
              </div>
              <p className="text-[11px] text-slate-500 italic">
                “Predict. Rescue. Redistribute. Measure.”
              </p>
            </div>
          ) : (
            <div className="flex justify-center p-2 text-emerald-600">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
