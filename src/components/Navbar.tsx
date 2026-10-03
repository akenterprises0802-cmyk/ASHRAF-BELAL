import React, { useState } from 'react';
import { UserAccount } from '../types';
import { CompanyLogo } from './CompanyLogo';
import {
  FileText,
  DollarSign,
  CalendarCheck,
  Users,
  LogOut,
  Shield,
  KeyRound,
  X,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserAccount;
  activeTab: 'formA' | 'formC' | 'formD' | 'users';
  setActiveTab: (tab: 'formA' | 'formC' | 'formD' | 'users') => void;
  onLogout: () => void;
  onSetPassword?: (userId: string, newPass: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onLogout,
  onSetPassword,
}) => {
  const isStaff = currentUser.role === 'Staff';
  const isAdmin = currentUser.role === 'Admin';

  // Change Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!newPassword.trim()) {
      setPasswordError('Please enter a new password.');
      return;
    }

    if (newPassword.trim().length < 4) {
      setPasswordError('Password must be at least 4 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match. Please re-enter.');
      return;
    }

    if (onSetPassword) {
      onSetPassword(currentUser.id, newPassword.trim());
      setPasswordSuccess(true);
      setTimeout(() => {
        setPasswordSuccess(false);
        setShowPasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
      }, 1500);
    }
  };

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
                <span>Users &amp; Roles</span>
              </button>
            )}
          </nav>

          {/* User Badge, Save Password & Logout */}
          <div className="flex items-center gap-2.5">
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

            {/* Save / Change Password Button after login */}
            <button
              onClick={() => {
                setShowPasswordModal(true);
                setPasswordError('');
                setPasswordSuccess(false);
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition-colors cursor-pointer"
              title="Save or change your login password"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Change Password</span>
            </button>

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

      {/* Save / Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 text-slate-900">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Save New Password</h3>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="p-5 space-y-4 text-xs">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                Logged in as: <strong>{currentUser.fullName}</strong> (@{currentUser.username})
              </div>

              {passwordError && (
                <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 font-semibold">
                  {passwordError}
                </div>
              )}

              {passwordSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Password saved successfully!</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:ring-2 focus:ring-blue-600 font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
