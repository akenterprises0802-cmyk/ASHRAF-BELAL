import React, { useState } from 'react';
import { UserAccount, UserRole } from '../types';
import {
  Users,
  UserPlus,
  Trash2,
  Mail,
  Phone,
  Shield,
  Check,
  X,
  AlertCircle,
  KeyRound,
  Lock,
} from 'lucide-react';

interface UserManagementProps {
  users: UserAccount[];
  currentUser: UserAccount;
  onCreateUser: (user: UserAccount) => void;
  onDeleteUser: (userId: string) => void;
  onSetPassword?: (userId: string, newPass: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  currentUser,
  onCreateUser,
  onDeleteUser,
  onSetPassword,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [passwordModalUserId, setPasswordModalUserId] = useState<string | null>(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // New User Form State
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Staff');
  const [formError, setFormError] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!username.trim() || !fullName.trim() || !email.trim() || !mobile.trim() || !password.trim()) {
      setFormError('All fields including Password are strictly mandatory. All users must be password protected.');
      return;
    }

    if (password.trim().length < 4) {
      setFormError('Password must be at least 4 characters long.');
      return;
    }

    if (users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase())) {
      setFormError('Username already exists. Please choose a different username.');
      return;
    }

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      username: username.trim().toLowerCase(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      password: password.trim(),
      role,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onCreateUser(newUser);
    setStatusNotice(`User "${newUser.fullName}" (${newUser.role}) created and password protected.`);
    setIsCreateOpen(false);
    // Reset form
    setUsername('');
    setFullName('');
    setEmail('');
    setMobile('');
    setPassword('');
    setRole('Staff');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalUserId || !onSetPassword) return;

    if (!newPasswordVal.trim() || newPasswordVal.trim().length < 4) {
      alert('Password must be at least 4 characters long.');
      return;
    }

    onSetPassword(passwordModalUserId, newPasswordVal.trim());
    const targetUser = users.find((u) => u.id === passwordModalUserId);
    setStatusNotice(`Password saved successfully for "${targetUser?.fullName || 'User'}".`);
    setPasswordModalUserId(null);
    setNewPasswordVal('');
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (id === currentUser.id) {
      alert('You cannot delete your own logged-in Admin account.');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete user: "${name}"?`)) {
      onDeleteUser(id);
      setStatusNotice(`User "${name}" has been deleted.`);
    }
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-extrabold text-slate-900">
              Role-Based Access &amp; User Administration
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            All users are password-protected. Admin rights to create accounts, assign roles (Admin, HR, Staff), and manage passwords.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow cursor-pointer transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Create New User
        </button>
      </div>

      {statusNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{statusNotice}</span>
          <button
            onClick={() => setStatusNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <span className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
            Password-Protected System Accounts ({users.length})
          </span>
          <span className="text-[11px] text-slate-500">
            Current Session: <strong className="text-blue-900">{currentUser.fullName} ({currentUser.role})</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <th className="p-3">User &amp; Username</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Email ID</th>
                <th className="p-3">Mobile No</th>
                <th className="p-3">Security Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isCurrent = u.id === currentUser.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{u.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-500">@{u.username}</div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                          u.role === 'Admin'
                            ? 'bg-rose-100 text-rose-800'
                            : u.role === 'HR'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-700 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{u.mobile}</span>
                      </div>
                    </td>
                    <td className="p-3 text-[11px]">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[10px]">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        Password Protected
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Change Password Button */}
                        <button
                          onClick={() => {
                            setPasswordModalUserId(u.id);
                            setNewPasswordVal('');
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold transition-colors cursor-pointer"
                          title="Change password for this user"
                        >
                          <KeyRound className="w-3 h-3 text-blue-600" />
                          <span>Change Password</span>
                        </button>

                        {/* Admin Delete User button */}
                        {!isCurrent ? (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.fullName)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-rose-100 text-rose-600 hover:text-rose-800 text-[11px] font-bold transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-semibold italic">Current User</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Password Modal */}
      {passwordModalUserId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Save New Password</h3>
              </div>
              <button
                onClick={() => setPasswordModalUserId(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePassword} className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                Set and save new password for user:{' '}
                <strong className="text-slate-900">
                  {users.find((u) => u.id === passwordModalUserId)?.fullName}
                </strong>
                .
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Password *
                </label>
                <input
                  type="text"
                  required
                  value={newPasswordVal}
                  onChange={(e) => setNewPasswordVal(e.target.value)}
                  placeholder="Enter new password (min. 4 chars)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPasswordModalUserId(null)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow cursor-pointer"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Create New User Account</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Shabana Khan"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. shabana"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Staff">Staff (Form A Entry only)</option>
                    <option value="HR">HR Manager</option>
                    <option value="Admin">Admin (Full Control)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email ID *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@gloziyo.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile No *</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Set mandatory password (min. 4 chars)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
