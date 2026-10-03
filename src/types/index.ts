export type UserRole = 'Admin' | 'HR' | 'Staff';

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  mobile: string;
  role: UserRole;
  createdAt: string;
}

export type ExitReason =
  | 'Sessation (Short Service )- The Employee ill Health'
  | 'Retirement'
  | 'Death In Service'
  | 'Superannuation'
  | 'Permanent Disablement'
  | 'Sessation (Short Service )- Any other reason'
  | 'Sessation (Short Service )- Closure of Contract Or Closure of Employer’s Business'
  | 'Sessation (Short Service )- Other Cause Beyond the Control of Employee'
  | 'Retirement from Service attaining the age of 55 years'
  | 'Retirement on account of Permanent and total incapacity'
  | 'Termination of Service in the case of mass or individual retrenchment'
  | 'Termination of Service under a voluntary scheme of retirement'
  | 'Marriage'
  | 'Resignation by the employee'
  | 'N/A (Active Employee)';

export interface EmployeeDocument {
  name: string;
  sizeKb: number;
  dataUrl: string;
  uploadedAt: string;
}

export interface EmployeeRecord {
  id: string;
  srNo: number;
  empCode: string;
  name: string;
  gender: 'Male' | 'Female' | 'Transgender' | 'Other';
  dob: string;
  designation: string;
  qualification: string;
  category: 'Unskilled' | 'Semi-Skilled' | 'Skilled' | 'Highly Skilled';
  mobile: string;
  uan: string; // Universal Account No. EPFO *
  esic: string; // ESIC Number
  lwfNo: string; // LWF NO (Labour Welfare Fund - optional)
  pan: string; // PAN
  bankName: string;
  bankAddress: string;
  accountNo: string;
  ifscCode: string;
  presentAddress: string;
  permanentAddress: string;
  isSameAddress?: boolean;
  principalEmployerName: string;
  principalEmployerAddress: string;
  dateOfJoining: string;
  dateOfExit: string;
  reasonOfExit: ExitReason | string;
  status: 'Active' | 'Exit' | 'Terminated';
  remarks: string;
  photoUrl: string; // Mandatory
  signatureUrl: string; // Mandatory
  documents: {
    [key: string]: EmployeeDocument;
  };
}

export interface RecoveryRecord {
  id: string;
  slNo: number;
  empCode: string;
  name: string;
  principalEmployer: string;
  recoveryType: 'Advance' | 'Damage' | 'Loss' | 'Fine' | 'Overpayment' | string;
  particulars: string;
  dateOfDamageOrLoss: string;
  amount: number;
  showCauseIssued: 'Yes' | 'No';
  explanationHeard: string;
  noOfInstalments: number;
  firstMonthYear: string; // YYYY-MM
  lastMonthYear: string; // YYYY-MM
  dateOfCompleteRecovery: string;
  remarks: string;
}

export type AttendanceStatus = 'P' | 'A' | 'HD' | 'H' | 'S';

export interface AttendanceRecord {
  id: string;
  srNo: number;
  empCode: string;
  name: string;
  placeOfWork: string; // Principal Employer / Site
  dateOfJoining: string;
  monthText: string; // e.g. "OCTOBER"
  monthNumber: number; // 1-12
  year: number; // e.g. 2024
  dailyAttendance: { [day: number]: AttendanceStatus };
  summaryDays: number; // Total Present Days (P + 0.5*HD)
  remarksHours: string; // e.g. "208 hrs"
  signatureKeeper: string; // e.g. "HR Manager"
}

export const ATTENDANCE_OPTIONS: {
  code: AttendanceStatus;
  label: string;
  badge: string;
  desc: string;
}[] = [
  { code: 'P', label: 'Present', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', desc: 'Full Day Present' },
  { code: 'A', label: 'Absent', badge: 'bg-rose-100 text-rose-800 border-rose-300', desc: 'Absent' },
  { code: 'HD', label: 'Half Day', badge: 'bg-amber-100 text-amber-800 border-amber-300', desc: 'Half Day Working (0.5)' },
  { code: 'H', label: 'Holiday', badge: 'bg-purple-100 text-purple-800 border-purple-300', desc: 'Public / Paid Holiday' },
  { code: 'S', label: 'Sunday', badge: 'bg-blue-100 text-blue-800 border-blue-300', desc: 'Sunday (Weekly Off)' },
];

export const ESTABLISHMENT_DETAILS = {
  name: 'GLOZIYO SERVICES PRIVATE LIMITED',
  address: '01A, Tasmiya Tower, Millennium Hospital Compound, Old Mumbai Pune Highway, Near Mumbai Chat Kausa 400 612.',
  lin: '1-8125-1293-8',
  ruleText: 'Statutory Register under Central Rules Rule 2(1) • LIN: 1-8125-1293-8',
};

export const DEFAULT_DESIGNATIONS = [
  'Manager',
  'HR Manager',
  'HR Executive',
  'Office Boy',
  'House Keeping Staff',
  'Welder',
  'Fitter',
  'Helper',
  'Project Manager',
  'Site Supervisor',
  'Admin Manager',
  'Admin Staff',
  'Marketing Executive',
  'Marketing Manager',
  'Data Entry Operator',
];

export const DEFAULT_QUALIFICATIONS = [
  'Graduate',
  '12th',
  '10th',
  'ITI',
  'Diploma',
  'Degree',
  'Post Graduate',
];

export const STATUTORY_EXIT_REASONS: ExitReason[] = [
  'N/A (Active Employee)',
  'Sessation (Short Service )- The Employee ill Health',
  'Retirement',
  'Death In Service',
  'Superannuation',
  'Permanent Disablement',
  'Sessation (Short Service )- Any other reason',
  'Sessation (Short Service )- Closure of Contract Or Closure of Employer’s Business',
  'Sessation (Short Service )- Other Cause Beyond the Control of Employee',
  'Retirement from Service attaining the age of 55 years',
  'Retirement on account of Permanent and total incapacity',
  'Termination of Service in the case of mass or individual retrenchment',
  'Termination of Service under a voluntary scheme of retirement',
  'Marriage',
  'Resignation by the employee',
];

export const DOCUMENT_TYPES = [
  { key: 'aadhar', label: '01. Aadhar Card', required: true },
  { key: 'pan', label: '02. PAN Card', required: true },
  { key: 'resume', label: '03. Resume', required: true },
  { key: 'qualification', label: '04. Qualification Certificate', required: false },
  { key: 'residence', label: '05. Residence Proof', required: true },
  { key: 'cheque', label: '06. Cancel Cheque', required: true },
  { key: 'resignation', label: '07. Resignation Letter', required: false },
  { key: 'other', label: '08. Other Document', required: false },
];
