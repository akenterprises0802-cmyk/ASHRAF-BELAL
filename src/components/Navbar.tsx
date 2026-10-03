import React from 'react';
import { UserAccount } from '../types';
import { CompanyLogo } from './CompanyLogo';
import {
  FileText,
  DollarSign,
  CalendarCheck,
  Users,
  LogOut,
  Shield,
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserAccount;
  activeTab: 'formA' | 'formC' | 'formD' | 'users';
  setActiveTab: (tab: 'formA' | 'formC' | 'formD' | 'users') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const isStaff = currentUser.role === 'Staff';
  const isAdmin = currentUser.role === 'Admin';

  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <CompanyLogo size="md" showText={true} />
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('formA')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'formA'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Form A (Employee Register)</span>
            </button>

            {/* Form C - Hidden for Staff */}
            {!isStaff && (
              <button
                onClick={() => setActiveTab('formC')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'formC'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Form C (Recovery Register)</span>
              </button>
            )}

            {/* Form D - Hidden for Staff */}
            {!isStaff && (
              <button
                onClick={() => setActiveTab('formD')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'formD'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CalendarCheck className="w-4 h-4 text-blue-400" />
                <span>Form D (Attendance Register)</span>
              </button>
            )}

            {/* User Management - Admin only */}
            {isAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4 text-rose-400" />
                <span>Users &amp; Passwords</span>
              </button>
            )}
          </nav>

          {/* User Badge & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs">
              <Shield
                className={`w-4 h-4 ${
                  currentUser.role === 'Admin'
                    ? 'text-rose-400'
                    : currentUser.role === 'HR'
                    ? 'text-amber-400'
                    : 'text-blue-400'
                }`}
              />
              <div className="hidden sm:block text-left">
                <span className="font-bold text-white block text-[11px] leading-tight">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] text-slate-400">
                  Role: <strong className="text-slate-200">{currentUser.role}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors cursor-pointer"
              title="Logout / Switch Account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 text-[11px]">
          <button
            onClick={() => setActiveTab('formA')}
            className={`px-2 py-1 rounded font-bold ${
              activeTab === 'formA' ? 'text-blue-400 font-extrabold' : 'text-slate-400'
            }`}
          >
            Form A
          </button>
          {!isStaff && (
            <button
              onClick={() => setActiveTab('formC')}
              className={`px-2 py-1 rounded font-bold ${
                activeTab === 'formC' ? 'text-blue-400 font-extrabold' : 'text-slate-400'
              }`}
            >
              Form C
            </button>
          )}
          {!isStaff && (
            <button
              onClick={() => setActiveTab('formD')}
              className={`px-2 py-1 rounded font-bold ${
                activeTab === 'formD' ? 'text-blue-400 font-extrabold' : 'text-slate-400'
              }`}
            >
              Form D
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-2 py-1 rounded font-bold ${
                activeTab === 'users' ? 'text-blue-400 font-extrabold' : 'text-slate-400'
              }`}
            >
              Users
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
