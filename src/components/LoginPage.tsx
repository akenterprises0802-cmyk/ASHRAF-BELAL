import React, { useState } from 'react';
import { UserAccount, UserRole, ESTABLISHMENT_DETAILS } from '../types';
import { CompanyLogo } from './CompanyLogo';
import {
  Lock,
  User,
  Shield,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Mail,
  Send,
  X,
  Info,
} from 'lucide-react';

interface LoginPageProps {
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  onResetPasswordExternal: (userId: string, newPass: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  users,
  onLoginSuccess,
  onResetPasswordExternal,
}) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotInput, setForgotInput] = useState('');
  const [forgotStep, setForgotStep] = useState<'input' | 'otp' | 'success'>('input');
  const [matchedForgotUser, setMatchedForgotUser] = useState<UserAccount | null>(null);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedUser = username.trim().toLowerCase();
    const user = users.find(
      (u) =>
        (u.username.toLowerCase() === trimmedUser || u.email.toLowerCase() === trimmedUser) &&
        u.password === password
    );

    if (!user) {
      setErrorMessage('Invalid username or password. Please verify credentials.');
      return;
    }

    if (user.role !== selectedRole) {
      setErrorMessage(
        `Role mismatch: User "@${user.username}" is designated as [${user.role}], but you selected [${selectedRole}].`
      );
      return;
    }

    onLoginSuccess(user);
  };

  const handleQuickFill = (u: string, p: string, r: UserRole) => {
    setUsername(u);
    setPassword(p);
    setSelectedRole(r);
    setErrorMessage('');
  };

  // Forgot password initiated
  const handleInitiateForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    const query = forgotInput.trim().toLowerCase();
    const targetUser = users.find(
      (u) => u.username.toLowerCase() === query || u.email.toLowerCase() === query
    );

    if (!targetUser) {
      setForgotError('No registered user account found with that username or email ID.');
      return;
    }

    // STRICT REQUIREMENT: Remove the Password forget Option from Staff
    if (targetUser.role === 'Staff') {
      setForgotError(
        'Self-service Password Reset is strictly disabled for Staff accounts. Please contact your System Administrator to reset your password.'
      );
      return;
    }

    // Admin & HR allowed
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setMatchedForgotUser(targetUser);
    setSimulatedOtp(code);
    setForgotStep('otp');
  };

  const handleVerifyOtpAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (enteredOtp.trim() !== simulatedOtp) {
      setForgotError('Invalid verification code. Please check the simulated email dispatch below.');
      return;
    }

    if (!newPassword.trim()) {
      setForgotError('Please enter a valid new password.');
      return;
    }

    if (matchedForgotUser) {
      onResetPasswordExternal(matchedForgotUser.id, newPassword.trim());
      setForgotStep('success');
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotInput('');
    setForgotStep('input');
    setMatchedForgotUser(null);
    setSimulatedOtp('');
    setEnteredOtp('');
    setNewPassword('');
    setForgotError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-25"></div>
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Establishment Card Top Seal */}
        <div className="text-center mb-6">
          <div className="inline-flex justify-center mb-3">
            <CompanyLogo size="xl" showText={false} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wide">
            {ESTABLISHMENT_DETAILS.name}
          </h1>
          <p className="text-xs font-bold text-amber-400 mt-1 uppercase tracking-wider">
            {ESTABLISHMENT_DETAILS.ruleText}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 px-4 leading-relaxed font-medium">
            Address: {ESTABLISHMENT_DETAILS.address}
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Employee Management Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Role-Based Access for Statutory Registers (Form A, Form C, Form D)
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                {/* Forget Password link - only for Admin and HR */}
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Select Role *
              </label>
              <div className="relative">
                <Shield className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <select
                  required
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="Admin">Admin (Full Control, Reset Passwords, Print Dossier)</option>
                  <option value="HR">HR Manager (Form A, Form C, Form D Access)</option>
                  <option value="Staff">Staff (Form A Entry Only - Restricted)</option>
                </select>
              </div>
              {selectedRole === 'Staff' && (
                <p className="text-[10px] text-amber-700 bg-amber-50 rounded p-1.5 mt-1 border border-amber-200">
                  Staff Role: Restricted to adding Form A records only. Statutory exports, user management, and Form C/D access are disabled.
                </p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer mt-2"
            >
              <span>Login to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block text-center mb-2.5">
              Quick Role Switch (Demo Credentials)
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickFill('admin', 'admin123', 'Admin')}
                className={`py-1.5 px-2 rounded-lg font-bold border transition-colors cursor-pointer text-center ${
                  selectedRole === 'Admin'
                    ? 'bg-rose-50 border-rose-400 text-rose-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('hr', 'hr123', 'HR')}
                className={`py-1.5 px-2 rounded-lg font-bold border transition-colors cursor-pointer text-center ${
                  selectedRole === 'HR'
                    ? 'bg-amber-50 border-amber-400 text-amber-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                HR Manager
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('staff', 'staff123', 'Staff')}
                className={`py-1.5 px-2 rounded-lg font-bold border transition-colors cursor-pointer text-center ${
                  selectedRole === 'Staff'
                    ? 'bg-blue-50 border-blue-400 text-blue-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Staff
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-slate-500 text-[11px]">
          Government Statutory Ease of Compliance System • Central Rules 2017
        </div>
      </div>

      {/* Forgot Password Modal (Admin & HR only) */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Statutory Account Password Reset</h3>
              </div>
              <button onClick={closeForgotModal} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {forgotError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{forgotError}</span>
                </div>
              )}

              {/* Notice that Staff cannot reset password */}
              <div className="mb-4 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Security Policy:</strong> Password reset via email verification is available exclusively for <strong>Admin</strong> and <strong>HR</strong> roles. Staff must contact Admin.
                </div>
              </div>

              {forgotStep === 'input' && (
                <form onSubmit={handleInitiateForgot} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Enter Username or Registered Email ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. admin@gloziyo.com or hr"
                      value={forgotInput}
                      onChange={(e) => setForgotInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-600 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Verification Code to Email</span>
                  </button>
                </form>
              )}

              {forgotStep === 'otp' && matchedForgotUser && (
                <form onSubmit={handleVerifyOtpAndReset} className="space-y-4 text-xs">
                  {/* Simulated Dispatch Box */}
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-xs text-emerald-800">
                      <Mail className="w-4 h-4" />
                      Email &amp; SMS Dispatch Simulated:
                    </div>
                    <p className="text-[11px]">
                      A 6-digit OTP code was sent to registered email: <strong>{matchedForgotUser.email}</strong> and Mobile: <strong>{matchedForgotUser.mobile}</strong>.
                    </p>
                    <div className="mt-1 font-mono text-base font-extrabold text-blue-900 bg-white p-1.5 rounded border border-emerald-300 text-center tracking-widest">
                      {simulatedOtp}
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Enter 6-Digit Verification Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-base font-bold text-center tracking-widest text-slate-900 focus:ring-2 focus:ring-blue-600"
                      placeholder="123456"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Enter New Password *
                    </label>
                    <input
                      type="text"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:ring-2 focus:ring-blue-600"
                      placeholder="New password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm &amp; Reset Password</span>
                  </button>
                </form>
              )}

              {forgotStep === 'success' && (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Password Successfully Reset!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Your account password has been updated. You can now log in with your new credentials.
                  </p>
                  <button
                    type="button"
                    onClick={closeForgotModal}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow"
                  >
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
