import React, { useState } from 'react';
import { 
  Bell, 
  Menu, 
  User, 
  LogOut, 
  RotateCcw, 
  ChevronDown, 
  CheckCircle, 
  ShieldCheck, 
  MapPin, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  pageTitle: string;
  activeRole: UserRole;
  userName: string;
  onRoleChange: (role: UserRole) => void;
  onLogout: () => void;
  onResetData: () => void;
  onToggleSidebar: () => void;
  onNavigateLanding: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  pageTitle,
  activeRole,
  userName,
  onRoleChange,
  onLogout,
  onResetData,
  onToggleSidebar,
  onNavigateLanding
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Indian Date Format
  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date());

  const roles: UserRole[] = [
    'Kitchen Staff',
    'NGO Partner',
    'Delivery Partner',
    'Administrator'
  ];

  const roleColors: Record<UserRole, string> = {
    'Kitchen Staff': 'bg-emerald-100 text-emerald-800 border-emerald-300',
    'NGO Partner': 'bg-teal-100 text-teal-800 border-teal-300',
    'Delivery Partner': 'bg-blue-100 text-blue-800 border-blue-300',
    'Administrator': 'bg-purple-100 text-purple-800 border-purple-300'
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left side: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus:outline-hidden"
          title="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
            {pageTitle}
          </h1>
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <MapPin className="w-3 h-3 text-emerald-600" />
            Vijayawada Canteen Hub
          </span>
        </div>
      </div>

      {/* Right side: Date, Role Switcher, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Display */}
        <div className="hidden lg:flex flex-col text-right pr-2 border-r border-slate-200">
          <span className="text-xs font-semibold text-slate-700">{formattedDate}</span>
          <span className="text-[11px] text-slate-400">SIH26234 Live Prototype</span>
        </div>

        {/* Role Selector Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleDropdown(!showRoleDropdown);
              setShowUserDropdown(false);
              setShowNotifications(false);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold border transition-all ${roleColors[activeRole]} hover:shadow-xs`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Role:</span>
            <span>{activeRole}</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Switch Active Role
              </div>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    onRoleChange(r);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                    activeRole === r
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{r}</span>
                  {activeRole === r && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleDropdown(false);
              setShowUserDropdown(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative transition-colors"
            title="System Alerts"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Live System Alerts
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto">
                <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-slate-700">
                  <div className="font-semibold text-emerald-900 flex justify-between">
                    <span>Batch Delivered</span>
                    <span className="text-[10px] text-emerald-600 font-normal">14 mins ago</span>
                  </div>
                  <p className="mt-1 text-slate-600">
                    Hope Food Bank (Benz Circle) received 14 kg Vegetable Rice. 56 meals saved!
                  </p>
                </div>
                <div className="p-2.5 bg-teal-50/70 border border-teal-100 rounded-xl text-xs text-slate-700">
                  <div className="font-semibold text-teal-900 flex justify-between">
                    <span>Surplus Detected</span>
                    <span className="text-[10px] text-teal-600 font-normal">1 hr ago</span>
                  </div>
                  <p className="mt-1 text-slate-600">
                    BATCH-02 (Dal Tadka) has 8.5 kg surplus. Safe for human redistribution review.
                  </p>
                </div>
                <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-slate-700">
                  <div className="font-semibold text-blue-900 flex justify-between">
                    <span>Virtual IoT Sensor Calibrated</span>
                    <span className="text-[10px] text-blue-600 font-normal">2 hrs ago</span>
                  </div>
                  <p className="mt-1 text-slate-600">
                    Cold chain unit 1 maintained steady 5.2°C temperature in College Canteen pantry.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowRoleDropdown(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 leading-tight">{userName}</span>
              <span className="text-[10px] text-slate-500 leading-tight">{activeRole}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in">
              <div className="p-3 bg-slate-50 rounded-xl mb-2">
                <p className="text-xs font-bold text-slate-800">{userName}</p>
                <p className="text-[11px] text-slate-500">Smart College Canteen, Vijayawada</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded-md text-[10px] font-semibold text-slate-700">
                  <User className="w-3 h-3 text-emerald-600" />
                  Role: {activeRole}
                </div>
              </div>

              <button
                onClick={onResetData}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-amber-700 hover:bg-amber-50 flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                Reset Demo Data (Canonical)
              </button>

              <button
                onClick={onNavigateLanding}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                View Public Landing Page
              </button>

              <hr className="my-1 border-slate-100" />

              <button
                onClick={onLogout}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                Logout / Switch Account
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
