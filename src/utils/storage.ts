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
    password: 'admin123',
    fullName: 'Mohammad Tariq (Admin)',
    email: 'admin@gloziyo.com',
    mobile: '9820112233',
    role: 'Admin',
    createdAt: '2024-01-01',
  },
  {
    id: 'usr_hr',
    username: 'hr',
    password: 'hr123',
    fullName: 'Shabana Khan (HR Manager)',
    email: 'hr@gloziyo.com',
    mobile: '9892334455',
    role: 'HR',
    createdAt: '2024-01-15',
  },
  {
    id: 'usr_staff',
    username: 'staff',
    password: 'staff123',
    fullName: 'Rahul Verma (Data Operator)',
    email: 'staff@gloziyo.com',
    mobile: '9870556677',
    role: 'Staff',
    createdAt: '2024-02-01',
  },
];

export const INITIAL_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'emp_1',
    srNo: 1,
    empCode: 'EMP001',
    name: 'Aamir Farooqui',
    gender: 'Male',
    dob: '1990-05-12',
    designation: 'Site Supervisor',
    qualification: 'Diploma',
    category: 'Skilled',
    mobile: '9876543210',
    uan: '100987654321',
    esic: '31000987654321001',
    lwfNo: 'MH-LWF-45210',
    pan: 'ABCDE1234F',
    bankName: 'HDFC Bank',
    bankAddress: 'Kausa Branch, Thane, MH',
    accountNo: '50100234567891',
    ifscCode: 'HDFC0001234',
    presentAddress: 'Tasmiya Tower, Kausa, Thane 400612',
    permanentAddress: 'Tasmiya Tower, Kausa, Thane 400612',
    isSameAddress: true,
    principalEmployerName: 'Larsen & Toubro Ltd (Metro Project)',
    principalEmployerAddress: 'Plot No. 4, MIDC Industrial Area, Thane Belapur Road, Navi Mumbai',
    dateOfJoining: '2020-01-15',
    dateOfExit: '',
    reasonOfExit: 'N/A (Active Employee)',
    status: 'Active',
    remarks: 'Field site lead supervisor with clean record',
    photoUrl: DUMMY_PHOTO,
    signatureUrl: DUMMY_SIGNATURE,
    documents: {
      aadhar: { name: 'Aadhar_Aamir.pdf', sizeKb: 65, dataUrl: '#', uploadedAt: '2020-01-15' },
      pan: { name: 'PAN_Aamir.pdf', sizeKb: 45, dataUrl: '#', uploadedAt: '2020-01-15' },
      resume: { name: 'Resume_Aamir.pdf', sizeKb: 80, dataUrl: '#', uploadedAt: '2020-01-15' },
      residence: { name: 'ElectricityBill.pdf', sizeKb: 55, dataUrl: '#', uploadedAt: '2020-01-15' },
      cheque: { name: 'CancelCheque.pdf', sizeKb: 40, dataUrl: '#', uploadedAt: '2020-01-15' },
    },
  },
  {
    id: 'emp_2',
    srNo: 2,
    empCode: 'EMP002',
    name: 'Bhavna Kulkarni',
    gender: 'Female',
    dob: '1994-08-22',
    designation: 'HR Executive',
    qualification: 'Graduate',
    category: 'Skilled',
    mobile: '9819012345',
    uan: '100876543210',
    esic: '31000876543210002',
    lwfNo: 'MH-LWF-45211',
    pan: 'BKULP9876Z',
    bankName: 'State Bank of India',
    bankAddress: 'Mumbra Branch, Thane',
    accountNo: '30495867123',
    ifscCode: 'SBIN0000456',
    presentAddress: 'Flat 402, Green Valley, Mumbra, Thane',
    permanentAddress: 'Flat 402, Green Valley, Mumbra, Thane',
    isSameAddress: true,
    principalEmployerName: 'GLOZIYO HEAD OFFICE',
    principalEmployerAddress: '01A, Tasmiya Tower, Millennium Hospital Compound, Kausa 400612',
    dateOfJoining: '2021-03-01',
    dateOfExit: '',
    reasonOfExit: 'N/A (Active Employee)',
    status: 'Active',
    remarks: 'Handling onboarding and statutory compliances',
    photoUrl: DUMMY_PHOTO,
    signatureUrl: DUMMY_SIGNATURE,
    documents: {
      aadhar: { name: 'Aadhar_Bhavna.pdf', sizeKb: 72, dataUrl: '#', uploadedAt: '2021-03-01' },
      pan: { name: 'PAN_Bhavna.pdf', sizeKb: 42, dataUrl: '#', uploadedAt: '2021-03-01' },
      resume: { name: 'Resume_Bhavna.pdf', sizeKb: 88, dataUrl: '#', uploadedAt: '2021-03-01' },
      residence: { name: 'RentAgreement.pdf', sizeKb: 90, dataUrl: '#', uploadedAt: '2021-03-01' },
      cheque: { name: 'Cheque_SBI.pdf', sizeKb: 48, dataUrl: '#', uploadedAt: '2021-03-01' },
    },
  },
  {
    id: 'emp_3',
    srNo: 3,
    empCode: 'EMP003',
    name: 'Chandan Kumar Yadav',
    gender: 'Male',
    dob: '1988-11-05',
    designation: 'Welder',
    qualification: 'ITI',
    category: 'Skilled',
    mobile: '9765432109',
    uan: '100765432109',
    esic: '31000765432109003',
    lwfNo: '',
    pan: 'CKYPR6543M',
    bankName: 'Bank of Baroda',
    bankAddress: 'Kausa Bypass, Thane',
    accountNo: '24050100012398',
    ifscCode: 'BARB0KAUSAA',
    presentAddress: 'Room 12, Chawl No 3, Old Mumbai Pune Highway, Kausa',
    permanentAddress: 'Vill. Rampur, Dist. Jaunpur, Uttar Pradesh',
    isSameAddress: false,
    principalEmployerName: 'Godrej & Boyce Mfg Co Ltd',
    principalEmployerAddress: 'Pirojshanagar, Vikhroli, Mumbai',
    dateOfJoining: '2022-07-10',
    dateOfExit: '2024-01-31',
    reasonOfExit: 'Resignation by the employee',
    status: 'Exit',
    remarks: 'Full and final settlement completed',
    photoUrl: DUMMY_PHOTO,
    signatureUrl: DUMMY_SIGNATURE,
    documents: {
      aadhar: { name: 'Aadhar_Chandan.pdf', sizeKb: 68, dataUrl: '#', uploadedAt: '2022-07-10' },
      pan: { name: 'PAN_Chandan.pdf', sizeKb: 45, dataUrl: '#', uploadedAt: '2022-07-10' },
      resume: { name: 'BioData_Chandan.pdf', sizeKb: 60, dataUrl: '#', uploadedAt: '2022-07-10' },
      residence: { name: 'RationCard.pdf', sizeKb: 75, dataUrl: '#', uploadedAt: '2022-07-10' },
      cheque: { name: 'BankPassbook.pdf', sizeKb: 52, dataUrl: '#', uploadedAt: '2022-07-10' },
    },
  },
  {
    id: 'emp_4',
    srNo: 4,
    empCode: 'EMP004',
    name: 'Dinesh Sawant',
    gender: 'Male',
    dob: '1995-02-14',
    designation: 'Fitter',
    qualification: 'ITI',
    category: 'Skilled',
    mobile: '9821456780',
    uan: '100654321098',
    esic: '31000654321098004',
    lwfNo: 'MH-LWF-45214',
    pan: 'DSAWP3456L',
    bankName: 'Kotak Mahindra Bank',
    bankAddress: 'Thane West',
    accountNo: '43120987654',
    ifscCode: 'KKBK0000678',
    presentAddress: 'Near Millennium Hospital, Kausa 400612',
    permanentAddress: 'Near Millennium Hospital, Kausa 400612',
    isSameAddress: true,
    principalEmployerName: 'Larsen & Toubro Ltd (Metro Project)',
    principalEmployerAddress: 'Plot No. 4, MIDC Industrial Area, Thane Belapur Road, Navi Mumbai',
    dateOfJoining: '2022-09-01',
    dateOfExit: '',
    reasonOfExit: 'N/A (Active Employee)',
    status: 'Active',
    remarks: 'Mechanical assembly operations',
    photoUrl: DUMMY_PHOTO,
    signatureUrl: DUMMY_SIGNATURE,
    documents: {},
  },
];

export const INITIAL_RECOVERIES: RecoveryRecord[] = [
  {
    id: 'rec_1',
    slNo: 1,
    empCode: 'EMP001',
    name: 'Aamir Farooqui',
    principalEmployer: 'Larsen & Toubro Ltd (Metro Project)',
    recoveryType: 'Advance',
    particulars: 'Festival Salary Advance against Festival Allowance',
    dateOfDamageOrLoss: '2024-04-01',
    amount: 5000,
    showCauseIssued: 'Yes',
    explanationHeard: 'Shabana Khan (HR Manager)',
    noOfInstalments: 5,
    firstMonthYear: '2024-04',
    lastMonthYear: '2024-08',
    dateOfCompleteRecovery: '2024-08-31',
    remarks: 'Recovered fully in 5 equal instalments',
  },
  {
    id: 'rec_2',
    slNo: 2,
    empCode: 'EMP003',
    name: 'Chandan Kumar Yadav',
    principalEmployer: 'Godrej & Boyce Mfg Co Ltd',
    recoveryType: 'Damage',
    particulars: 'Tooling damage during machine fabrication',
    dateOfDamageOrLoss: '2023-10-15',
    amount: 2500,
    showCauseIssued: 'Yes',
    explanationHeard: 'Mohammad Tariq (Admin)',
    noOfInstalments: 2,
    firstMonthYear: '2023-11',
    lastMonthYear: '2023-12',
    dateOfCompleteRecovery: '2023-12-31',
    remarks: 'Deducted as per inquiry report with acknowledgment',
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_1',
    srNo: 1,
    empCode: 'EMP001',
    name: 'Aamir Farooqui',
    placeOfWork: 'Larsen & Toubro Ltd (Metro Project)',
    dateOfJoining: '2020-01-15',
    monthText: 'OCTOBER',
    monthNumber: 10,
    year: 2024,
    dailyAttendance: {
      1: 'P', 2: 'H', 3: 'P', 4: 'P', 5: 'P', 6: 'S', 7: 'P', 8: 'P', 9: 'P', 10: 'P',
      11: 'P', 12: 'HD', 13: 'S', 14: 'P', 15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'S',
      21: 'P', 22: 'P', 23: 'P', 24: 'A', 25: 'P', 26: 'P', 27: 'S', 28: 'P', 29: 'P', 30: 'P', 31: 'P'
    },
    summaryDays: 25.5,
    remarksHours: '204 hrs',
    signatureKeeper: 'Shabana Khan (HR Manager)',
  },
  {
    id: 'att_2',
    srNo: 2,
    empCode: 'EMP002',
    name: 'Bhavna Kulkarni',
    placeOfWork: 'GLOZIYO HEAD OFFICE',
    dateOfJoining: '2021-03-01',
    monthText: 'OCTOBER',
    monthNumber: 10,
    year: 2024,
    dailyAttendance: {
      1: 'P', 2: 'H', 3: 'P', 4: 'P', 5: 'P', 6: 'S', 7: 'P', 8: 'P', 9: 'P', 10: 'P',
      11: 'P', 12: 'P', 13: 'S', 14: 'P', 15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'S',
      21: 'P', 22: 'P', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'S', 28: 'P', 29: 'P', 30: 'P', 31: 'P'
    },
    summaryDays: 26,
    remarksHours: '208 hrs',
    signatureKeeper: 'Mohammad Tariq (Admin)',
  },
  {
    id: 'att_3',
    srNo: 3,
    empCode: 'EMP004',
    name: 'Dinesh Sawant',
    placeOfWork: 'Larsen & Toubro Ltd (Metro Project)',
    dateOfJoining: '2022-09-01',
    monthText: 'OCTOBER',
    monthNumber: 10,
    year: 2024,
    dailyAttendance: {
      1: 'P', 2: 'H', 3: 'P', 4: 'P', 5: 'P', 6: 'S', 7: 'P', 8: 'P', 9: 'P', 10: 'P',
      11: 'P', 12: 'P', 13: 'S', 14: 'P', 15: 'P', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'S',
      21: 'P', 22: 'P', 23: 'P', 24: 'HD', 25: 'P', 26: 'P', 27: 'S', 28: 'P', 29: 'P', 30: 'P', 31: 'P'
    },
    summaryDays: 25.5,
    remarksHours: '204 hrs',
    signatureKeeper: 'Shabana Khan (HR Manager)',
  }
];

// Local Storage Keys
const USERS_KEY = 'gloziyo_users_v2';
const EMPLOYEES_KEY = 'gloziyo_employees_v2';
const RECOVERIES_KEY = 'gloziyo_recoveries_v2';
const ATTENDANCE_KEY = 'gloziyo_attendance_v3';
const DESIGNATIONS_KEY = 'gloziyo_designations_v2';
const QUALIFICATIONS_KEY = 'gloziyo_qualifications_v2';
const CURRENT_USER_KEY = 'gloziyo_current_user_v2';

export function getStoredUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
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
