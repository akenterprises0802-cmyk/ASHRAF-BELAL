import React, { useState } from 'react';
import { UserAccount, ESTABLISHMENT_DETAILS } from '../types';
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
  Eye,
  EyeOff,
} from 'lucide-react';

interface LoginPageProps {
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  onSetPassword?: (userId: string, newPass: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  users,
  onLoginSuccess,
  onSetPassword,
}) => {
  // Login Form States (clean, no demo data pre-filled)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    if (!trimmedUser) {
      setErrorMessage('Please enter your username or registered email.');
      return;
    }

    if (!password) {
      setErrorMessage('Password is required. All accounts are strictly password-protected.');
      return;
    }

    // Find user
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === trimmedUser ||
        u.email.toLowerCase() === trimmedUser
    );

    if (!user) {
      setErrorMessage('Account not found. Please verify your username or registered email.');
      return;
    }

    // Check Password strictly
    if (user.password !== password) {
      setErrorMessage('Incorrect password. Please try again or use "Forgot Password" to reset.');
      return;
    }

    onLoginSuccess(user);
  };

  // Forgot Password Initiated via Email
  const handleInitiateForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    const query = forgotInput.trim().toLowerCase();
    if (!query) {
      setForgotError('Please enter your username or registered email ID.');
      return;
    }

    const targetUser = users.find(
      (u) =>
        u.username.toLowerCase() === query ||
        u.email.toLowerCase() === query
    );

    if (!targetUser) {
      setForgotError('No registered account found with that username or email ID.');
      return;
    }

    // Generate random 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setMatchedForgotUser(targetUser);
    setSimulatedOtp(code);
    setForgotStep('otp');
  };

  // Verify OTP and Save New Password
  const handleVerifyOtpAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (enteredOtp.trim() !== simulatedOtp) {
      setForgotError('Invalid verification code. Please enter the 6-digit OTP shown in the dispatch notice.');
      return;
    }

    if (!newPassword.trim()) {
      setForgotError('Please enter a valid new password.');
      return;
    }

    if (matchedForgotUser && onSetPassword) {
      onSetPassword(matchedForgotUser.id, newPassword.trim());
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
        {/* Establishment Header Seal */}
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

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Employee Management Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Secure Password-Protected Access for Statutory Registers
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username or Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username or Registered Email *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter your username or email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Password with Forgot Password link */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Password *
                </label>
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer mt-4"
            >
              <Lock className="w-4 h-4" />
              <span>Login to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-slate-500 text-[11px]">
          Government Statutory Ease of Compliance System • Central Rules 2017
        </div>
      </div>

      {/* Forgot Password by Email Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Reset Password by Email</h3>
              </div>
              <button
                onClick={closeForgotModal}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
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

              {/* Step 1: Enter Username or Email */}
              {forgotStep === 'input' && (
                <form onSubmit={handleInitiateForgot} className="space-y-4 text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    Enter your username or registered email address. We will send a secure 6-digit verification code to your email to verify your identity.
                  </p>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Username or Registered Email ID *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. admin@gloziyo.com or admin"
                        value={forgotInput}
                        onChange={(e) => setForgotInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 text-sm"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Verification Code by Email</span>
                  </button>
                </form>
              )}

              {/* Step 2: OTP Verification & New Password Entry */}
              {forgotStep === 'otp' && matchedForgotUser && (
                <form onSubmit={handleVerifyOtpAndReset} className="space-y-4 text-xs">
                  {/* Simulated Email Dispatch Box */}
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-xs text-emerald-800">
                      <Mail className="w-4 h-4" />
                      Email Verification Dispatched:
                    </div>
                    <p className="text-[11px]">
                      A 6-digit verification code was sent to registered email: <strong>{matchedForgotUser.email}</strong>.
                    </p>
                    <div className="mt-1 font-mono text-base font-extrabold text-blue-900 bg-white p-2 rounded-lg border border-emerald-300 text-center tracking-widest shadow-xs">
                      {simulatedOtp}
                    </div>
                    <p className="text-[10px] text-emerald-700 text-center">
                      (Use the 6-digit code above to authenticate)
                    </p>
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
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono text-sm focus:ring-2 focus:ring-blue-600 font-bold"
                      placeholder="Enter new password"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm &amp; Save New Password</span>
                  </button>
                </form>
              )}

              {/* Step 3: Success Confirmation */}
              {forgotStep === 'success' && (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Password Successfully Saved!
                  </h4>
                  <p className="text-xs text-slate-600">
                    Your password has been updated. You can now log in immediately with your new credentials.
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
