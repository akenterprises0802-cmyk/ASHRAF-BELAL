import * as XLSX from 'xlsx';
import { EmployeeRecord, RecoveryRecord, AttendanceRecord, ESTABLISHMENT_DETAILS } from '../types';

export function exportFormAToExcel(employees: EmployeeRecord[]) {
  const headers = [
    'S. No.',
    'Employee Code',
    'Name',
    'Gender',
    'DOB',
    'Qualification',
    'Designation',
    'Skill Category',
    'Mobile',
    'UAN (EPFO)',
    'ESIC Number',
    'LWF No',
    'PAN',
    'Bank Name',
    'Bank Address',
    'Account Number',
    'IFSC Code',
    'Present Address',
    'Permanent Address',
    'Principal Employer Name',
    'Principal Employer Address',
    'Date of Joining',
    'Date of Exit',
    'Reason for Exit',
    'Status',
    'Remarks',
  ];

  const dataRows = employees.map((emp, idx) => [
    idx + 1,
    emp.empCode,
    emp.name,
    emp.gender,
    emp.dob,
    emp.qualification || '-',
    emp.designation,
    emp.category,
    emp.mobile,
    emp.uan,
    emp.esic,
    emp.lwfNo || '-',
    emp.pan,
    emp.bankName,
    emp.bankAddress,
    emp.accountNo,
    emp.ifscCode,
    emp.presentAddress,
    emp.permanentAddress,
    emp.principalEmployerName,
    emp.principalEmployerAddress,
    emp.dateOfJoining,
    emp.dateOfExit || '-',
    emp.reasonOfExit || '-',
    emp.status,
    emp.remarks || '-',
  ]);

  const sheetData = [
    [ESTABLISHMENT_DETAILS.name],
    [ESTABLISHMENT_DETAILS.ruleText],
    [`Address: ${ESTABLISHMENT_DETAILS.address}`],
    ['FORM A - EMPLOYEE REGISTER (Rule 2(1) Central Rules)'],
    [],
    headers,
    ...dataRows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Form A - Employee Register');
  XLSX.writeFile(wb, `Form_A_Employee_Register_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportFormCToExcel(recoveries: RecoveryRecord[], filterName = '') {
  const headers = [
    'Sl. No.',
    'Employee Code',
    'Name',
    'Principal Employer',
    'Recovery Type',
    'Particulars',
    'Date of Damage/Loss',
    'Amount (₹)',
    'Show Cause Issued',
    'Explanation Heard',
    'No. of Instalments',
    'First Month/Year',
    'Last Month/Year',
    'Date of Complete Recovery',
    'Remarks',
  ];

  const dataRows = recoveries.map((rec, idx) => [
    idx + 1,
    rec.empCode,
    rec.name,
    rec.principalEmployer,
    rec.recoveryType,
    rec.particulars,
    rec.dateOfDamageOrLoss,
    rec.amount,
    rec.showCauseIssued,
    rec.explanationHeard,
    rec.noOfInstalments,
    rec.firstMonthYear,
    rec.lastMonthYear,
    rec.dateOfCompleteRecovery || '-',
    rec.remarks || '-',
  ]);

  const sheetData = [
    [ESTABLISHMENT_DETAILS.name],
    [ESTABLISHMENT_DETAILS.ruleText],
    [`Address: ${ESTABLISHMENT_DETAILS.address}`],
    [`FORM C - RECOVERY REGISTER (Rule 2(1) Central Rules)${filterName ? ` - Filtered: ${filterName}` : ''}`],
    [],
    headers,
    ...dataRows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Form C - Recovery Register');
  XLSX.writeFile(wb, `Form_C_Recovery_Register_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export function exportFormDToExcel(attendanceList: AttendanceRecord[], monthText: string, year: number) {
  const daysHeader = Array.from({ length: 31 }, (_, i) => String(i + 1));
  const headers = [
    'S. No.',
    'Employee Code',
    'Name of Employee',
    'Place of Work / Principal Employer',
    'Date of Joining',
    ...daysHeader,
    'Summary (Days Present)',
    'Remarks (Hours)',
    'Signature of Register Keeper',
  ];

  const dataRows = attendanceList.map((att, idx) => {
    const dailyMarks = Array.from({ length: 31 }, (_, i) => att.dailyAttendance[i + 1] || '-');
    return [
      idx + 1,
      att.empCode,
      att.name,
      att.placeOfWork,
      att.dateOfJoining,
      ...dailyMarks,
      att.summaryDays,
      att.remarksHours,
      att.signatureKeeper,
    ];
  });

  const sheetData = [
    [ESTABLISHMENT_DETAILS.name],
    [ESTABLISHMENT_DETAILS.ruleText],
    [`Address: ${ESTABLISHMENT_DETAILS.address}`],
    [`FORM D - ATTENDANCE REGISTER | WAGES PERIOD: MONTH: ${monthText.toUpperCase()}, YEAR: ${year}`],
    [],
    headers,
    ...dataRows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Form D - Attendance');
  XLSX.writeFile(wb, `Form_D_Attendance_Register_${monthText}_${year}.xlsx`);
}
