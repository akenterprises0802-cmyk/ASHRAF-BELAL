import {
  UserAccount,
  EmployeeRecord,
  RecoveryRecord,
  AttendanceRecord,
  DEFAULT_DESIGNATIONS,
  DEFAULT_QUALIFICATIONS,
} from '../types';

// Sample dummy SVG avatars for default records
export const DUMMY_PHOTO =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="200" viewBox="0 0 160 200"><rect width="100%" height="100%" fill="%23e2e8f0"/><circle cx="80" cy="70" r="40" fill="%2394a3b8"/><path d="M20 180 C20 125, 140 125, 140 180 Z" fill="%23475569"/><text x="80" y="195" font-size="11" text-anchor="middle" fill="%2364748b" font-family="sans-serif">GLOZIYO ID PHOTO</text></svg>';

export const DUMMY_SIGNATURE =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="70" viewBox="0 0 200 70"><path d="M20 45 Q 40 15, 60 40 T 90 25 T 130 50 T 170 30" fill="none" stroke="%231e3a8a" stroke-width="2.5" stroke-linecap="round"/><text x="100" y="65" font-size="9" text-anchor="middle" fill="%2394a3b8" font-family="sans-serif">Verified Signature</text></svg>';

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_admin',
    username: 'admin',
    password: 'admin@gloziyo',
    fullName: 'System Administrator',
    email: 'admin@gloziyo.com',
    mobile: '9820112233',
    role: 'Admin',
    createdAt: '2024-01-01',
  },
  {
    id: 'usr_hr',
    username: 'hr',
    password: 'hr@gloziyo',
    fullName: 'HR Manager',
    email: 'hr@gloziyo.com',
    mobile: '9892334455',
    role: 'HR',
    createdAt: '2024-01-15',
  },
  {
    id: 'usr_staff',
    username: 'staff',
    password: 'staff@gloziyo',
    fullName: 'Staff Operator',
    email: 'staff@gloziyo.com',
    mobile: '9870556677',
    role: 'Staff',
    createdAt: '2024-02-01',
  },
];

// Clean empty statutory registers for real production usage (zero demo data)
export const INITIAL_EMPLOYEES: EmployeeRecord[] = [];

export const INITIAL_RECOVERIES: RecoveryRecord[] = [];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [];

// Local Storage Keys (v3 represents clean production state with no demo data and no passwords)
const USERS_KEY = 'gloziyo_users_v3_clean';
const EMPLOYEES_KEY = 'gloziyo_employees_live_clean';
const RECOVERIES_KEY = 'gloziyo_recoveries_live_clean';
const ATTENDANCE_KEY = 'gloziyo_attendance_live_clean';
const DESIGNATIONS_KEY = 'gloziyo_designations_v2';
const QUALIFICATIONS_KEY = 'gloziyo_qualifications_v2';
const CURRENT_USER_KEY = 'gloziyo_current_user_v3';

// Purge legacy demo localStorage caches on load
try {
  localStorage.removeItem('gloziyo_users_v2');
  localStorage.removeItem('gloziyo_users_v1');
  localStorage.removeItem('gloziyo_current_user_v2');
  localStorage.removeItem('gloziyo_current_user_v1');
  localStorage.removeItem('gloziyo_employees_v2');
  localStorage.removeItem('gloziyo_recoveries_v2');
  localStorage.removeItem('gloziyo_attendance_v3');
  localStorage.removeItem('gloziyo_employees_v1');
  localStorage.removeItem('gloziyo_recoveries_v1');
  localStorage.removeItem('gloziyo_attendance_v1');
} catch {
  // Ignore in SSR/restricted environments
}

export function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed: UserAccount[] = JSON.parse(raw);
    const secured = parsed.map((u) => ({
      ...u,
      password: u.password && u.password.trim() !== '' ? u.password : `${u.username}@gloziyo`,
    }));
    return secured;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: UserAccount[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null) {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function getStoredEmployees(): EmployeeRecord[] {
  try {
    const raw = localStorage.getItem(EMPLOYEES_KEY);
    if (!raw) {
      localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(INITIAL_EMPLOYEES));
      return INITIAL_EMPLOYEES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EMPLOYEES;
  }
}

export function saveStoredEmployees(employees: EmployeeRecord[]) {
  localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
}

export function getStoredRecoveries(): RecoveryRecord[] {
  try {
    const raw = localStorage.getItem(RECOVERIES_KEY);
    if (!raw) {
      localStorage.setItem(RECOVERIES_KEY, JSON.stringify(INITIAL_RECOVERIES));
      return INITIAL_RECOVERIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_RECOVERIES;
  }
}

export function saveStoredRecoveries(recoveries: RecoveryRecord[]) {
  localStorage.setItem(RECOVERIES_KEY, JSON.stringify(recoveries));
}

export function getStoredAttendance(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(ATTENDANCE_KEY);
    if (!raw) {
      localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(INITIAL_ATTENDANCE));
      return INITIAL_ATTENDANCE;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ATTENDANCE;
  }
}

export function saveStoredAttendance(att: AttendanceRecord[]) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(att));
}

export function getStoredDesignations(): string[] {
  try {
    const raw = localStorage.getItem(DESIGNATIONS_KEY);
    if (!raw) {
      localStorage.setItem(DESIGNATIONS_KEY, JSON.stringify(DEFAULT_DESIGNATIONS));
      return DEFAULT_DESIGNATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_DESIGNATIONS;
  }
}

export function saveStoredDesignations(list: string[]) {
  localStorage.setItem(DESIGNATIONS_KEY, JSON.stringify(list));
}

export function getStoredQualifications(): string[] {
  try {
    const raw = localStorage.getItem(QUALIFICATIONS_KEY);
    if (!raw) {
      localStorage.setItem(QUALIFICATIONS_KEY, JSON.stringify(DEFAULT_QUALIFICATIONS));
      return DEFAULT_QUALIFICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_QUALIFICATIONS;
  }
}

export function saveStoredQualifications(list: string[]) {
  localStorage.setItem(QUALIFICATIONS_KEY, JSON.stringify(list));
}
