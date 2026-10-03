import React, { useState, useMemo } from 'react';
import {
  AttendanceRecord,
  EmployeeRecord,
  UserRole,
  ESTABLISHMENT_DETAILS,
  AttendanceStatus,
  ATTENDANCE_OPTIONS,
} from '../types';
import { exportFormDToExcel } from '../utils/excelExport';
import {
  PlusCircle,
  FileSpreadsheet,
  Trash2,
  Printer,
  Calendar,
  Building,
  CheckSquare,
  Square,
  Sparkles,
  X,
  Check,
  Download,
  Users,
  CheckCircle2,
  Clock,
  HelpCircle,
} from 'lucide-react';

interface FormDProps {
  attendanceList: AttendanceRecord[];
  employees: EmployeeRecord[];
  onAddAttendance: (record: AttendanceRecord) => void;
  onUpdateAttendance: (records: AttendanceRecord[]) => void;
  onDeleteAttendance: (ids: string[]) => void;
  userRole: UserRole;
}

const MONTHS_TEXT = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
];

export const FormDAttendanceRegister: React.FC<FormDProps> = ({
  attendanceList,
  employees,
  onAddAttendance,
  onUpdateAttendance,
  onDeleteAttendance,
  userRole,
}) => {
  const isStaff = userRole === 'Staff';

  const [selectedMonthText, setSelectedMonthText] = useState('OCTOBER');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [filterPrincipalEmployer, setFilterPrincipalEmployer] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEmpCode, setModalEmpCode] = useState(employees[0]?.empCode || '');
  const [modalRemarksHours, setModalRemarksHours] = useState('208 hrs');
  const [modalSignatureKeeper, setModalSignatureKeeper] = useState('HR Manager');

  // Days in month calculation
  const monthIndex = MONTHS_TEXT.indexOf(selectedMonthText);
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, monthIndex + 1, 0).getDate();
  }, [selectedYear, monthIndex]);

  // Extract Principal Employers
  const principalEmployersList = useMemo(() => {
    const set = new Set<string>();
    attendanceList.forEach((a) => {
      if (a.placeOfWork) set.add(a.placeOfWork);
    });
    return Array.from(set).sort();
  }, [attendanceList]);

  // Filtered List
  const filteredList = useMemo(() => {
    return attendanceList.filter((att) => {
      const matchMonth = att.monthText === selectedMonthText && att.year === selectedYear;
      const matchPE =
        filterPrincipalEmployer === 'ALL' || att.placeOfWork === filterPrincipalEmployer;
      return matchMonth && matchPE;
    });
  }, [attendanceList, selectedMonthText, selectedYear, filterPrincipalEmployer]);

  // Total Employee & Aggregate Metrics Preview
  const totalEmployeesCount = filteredList.length;
  const totalActiveInSystem = employees.filter((e) => e.status === 'Active').length;

  const aggregatePresentDays = useMemo(() => {
    return filteredList.reduce((acc, row) => acc + (row.summaryDays || 0), 0);
  }, [filteredList]);

  // Cycle through AttendanceStatus on cell click: P -> A -> HD -> H -> S -> P
  const handleCellClick = (recordId: string, day: number) => {
    if (isStaff) return;
    if (day > daysInMonth) return;

    const cycleMap: Record<AttendanceStatus, AttendanceStatus> = {
      P: 'A',
      A: 'HD',
      HD: 'H',
      H: 'S',
      S: 'P',
    };

    const updated = attendanceList.map((rec) => {
      if (rec.id !== recordId) return rec;

      const currentStatus: AttendanceStatus = rec.dailyAttendance[day] || 'P';
      const nextStatus = cycleMap[currentStatus] || 'P';
      const newDaily = { ...rec.dailyAttendance, [day]: nextStatus };

      // Recalculate summary days: P = 1, HD = 0.5
      let totalDays = 0;
      for (let d = 1; d <= daysInMonth; d++) {
        const st = newDaily[d];
        if (st === 'P') totalDays += 1;
        else if (st === 'HD') totalDays += 0.5;
      }

      return {
        ...rec,
        dailyAttendance: newDaily,
        summaryDays: totalDays,
        remarksHours: `${Math.round(totalDays * 8)} hrs`,
      };
    });

    onUpdateAttendance(updated);
  };

  // Select all toggle
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredList.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredList.map((a) => a.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} attendance row(s)?`)) {
      onDeleteAttendance(selectedIds);
      setSelectedIds([]);
    }
  };

  // Quick populate attendance sheet for all active employees for this month with Sunday (S) & Present (P)
  const handleSyncFromEmployees = () => {
    const activeEmployees = employees.filter((e) => e.status === 'Active');
    if (activeEmployees.length === 0) {
      alert('No active employees found in Form A.');
      return;
    }

    const newRows: AttendanceRecord[] = [];
    activeEmployees.forEach((emp, idx) => {
      const exists = attendanceList.some(
        (a) => a.empCode === emp.empCode && a.monthText === selectedMonthText && a.year === selectedYear
      );
      if (!exists) {
        const defaultDaily: { [day: number]: AttendanceStatus } = {};
        let presentDays = 0;
        for (let d = 1; d <= 31; d++) {
          if (d > daysInMonth) continue;
          const dayOfWeek = new Date(selectedYear, monthIndex, d).getDay();
          if (dayOfWeek === 0) {
            defaultDaily[d] = 'S'; // Sunday
          } else {
            defaultDaily[d] = 'P'; // Present
            presentDays++;
          }
        }
        newRows.push({
          id: `att_${Date.now()}_${idx}`,
          srNo: attendanceList.length + idx + 1,
          empCode: emp.empCode,
          name: emp.name,
          placeOfWork: emp.principalEmployerName || 'GLOZIYO SITE',
          dateOfJoining: emp.dateOfJoining,
          monthText: selectedMonthText,
          monthNumber: monthIndex + 1,
          year: selectedYear,
          dailyAttendance: defaultDaily,
          summaryDays: presentDays,
          remarksHours: `${presentDays * 8} hrs`,
          signatureKeeper: 'Shabana Khan (HR Manager)',
        });
      }
    });

    if (newRows.length > 0) {
      onUpdateAttendance([...attendanceList, ...newRows]);
      alert(`Auto-generated attendance sheets for ${newRows.length} active employees for ${selectedMonthText} ${selectedYear}!`);
    } else {
      alert('Attendance records for all active employees already exist for this month.');
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  // Standalone Document Download for Form D
  const handleDownloadStandaloneDoc = () => {
    const tableHeaders = Array.from({ length: 31 }, (_, i) => `<th>${i + 1}</th>`).join('');
    const tableRows = filteredList
      .map((att, idx) => {
        const dailyCells = Array.from({ length: 31 }, (_, i) => {
          const mark = att.dailyAttendance[i + 1] || '-';
          return `<td style="font-weight:bold;text-align:center;">${mark}</td>`;
        }).join('');

        return `<tr>
          <td style="text-align:center;font-weight:bold;">${idx + 1}</td>
          <td style="font-family:monospace;font-weight:bold;">${att.empCode}</td>
          <td style="font-weight:bold;">${att.name}</td>
          <td>${att.placeOfWork}</td>
          <td style="text-align:center;">${att.dateOfJoining}</td>
          ${dailyCells}
          <td style="text-align:center;font-weight:bold;background:#eff6ff;">${att.summaryDays}</td>
          <td style="text-align:center;">${att.remarksHours}</td>
          <td>${att.signatureKeeper}</td>
        </tr>`;
      })
      .join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Form D Attendance Register - ${selectedMonthText} ${selectedYear}</title>
  <style>
    @page { size: legal landscape; margin: 8mm; }
    body { font-family: Arial, sans-serif; color: #000; background: #fff; margin: 0; padding: 10px; font-size: 8.5pt; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px; }
    .header h1 { margin: 0; font-size: 16pt; text-transform: uppercase; }
    .header h2 { margin: 2pt 0; font-size: 10.5pt; }
    .header p { margin: 2pt 0; font-size: 8.5pt; color: #333; }
    .wages-badge { display: inline-block; padding: 4px 14px; background: #1e3a8a; color: #fff; font-weight: bold; margin-top: 6px; font-size: 9.5pt; }
    .legend { display: flex; gap: 15px; justify-content: center; font-size: 8pt; margin: 8px 0; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 7.5pt; }
    th, td { border: 1px solid #333; padding: 3px 2px; }
    th { background: #f1f5f9; text-transform: uppercase; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${ESTABLISHMENT_DETAILS.name}</h1>
    <h2>${ESTABLISHMENT_DETAILS.ruleText}</h2>
    <p><strong>Address:</strong> ${ESTABLISHMENT_DETAILS.address}</p>
    <div style="font-weight:bold;margin-top:4px;">FORM D - ATTENDANCE REGISTER [Rule 2(1) Central Rules]</div>
    <div class="wages-badge">WAGES PERIOD: MONTH: ${selectedMonthText}, YEAR: ${selectedYear}</div>
  </div>
  <div class="legend">
    <span><strong>P:</strong> Present</span>
    <span><strong>A:</strong> Absent</span>
    <span><strong>HD:</strong> Half Day</span>
    <span><strong>H:</strong> Holiday</span>
    <span><strong>S:</strong> Sunday</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:25px;">S.No</th>
        <th style="width:55px;">Code</th>
        <th>Name of Employee</th>
        <th>Place of Work</th>
        <th style="width:65px;">DOJ</th>
        ${tableHeaders}
        <th style="width:50px;">Days</th>
        <th style="width:55px;">Hours</th>
        <th>Signature of Keeper</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Form_D_Attendance_${selectedMonthText}_${selectedYear}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedEmp = employees.find((e) => e.empCode === modalEmpCode);
    const defaultDaily: { [day: number]: AttendanceStatus } = {};
    let presentCount = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = new Date(selectedYear, monthIndex, d).getDay();
      if (dayOfWeek === 0) {
        defaultDaily[d] = 'S'; // Sunday
      } else {
        defaultDaily[d] = 'P'; // Present
        presentCount++;
      }
    }

    const newRecord: AttendanceRecord = {
      id: `att_${Date.now()}`,
      srNo: attendanceList.length + 1,
      empCode: modalEmpCode,
      name: matchedEmp ? matchedEmp.name : 'Employee',
      placeOfWork: matchedEmp ? matchedEmp.principalEmployerName : 'GLOZIYO SITE',
      dateOfJoining: matchedEmp ? matchedEmp.dateOfJoining : '2022-01-01',
      monthText: selectedMonthText,
      monthNumber: monthIndex + 1,
      year: selectedYear,
      dailyAttendance: defaultDaily,
      summaryDays: presentCount,
      remarksHours: modalRemarksHours,
      signatureKeeper: modalSignatureKeeper,
    };

    onAddAttendance(newRecord);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Central Bold Statutory Header */}
      <div className="statutory-header text-center border-b border-slate-300 pb-3 mb-4">
        <h1 className="text-xl sm:text-2xl font-black uppercase text-slate-900 tracking-wide">
          {ESTABLISHMENT_DETAILS.name}
        </h1>
        <p className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide">
          {ESTABLISHMENT_DETAILS.ruleText}
        </p>
        <p className="text-[11px] sm:text-xs text-slate-600 max-w-3xl mx-auto mt-0.5 font-medium">
          <span className="font-semibold text-slate-700">Address of Establishment:</span> {ESTABLISHMENT_DETAILS.address}
        </p>

        <div className="mt-2 inline-block px-4 py-1 rounded bg-slate-100 border border-slate-300">
          <h2 className="text-sm sm:text-base font-extrabold uppercase text-slate-950">
            FORM D - ATTENDANCE REGISTER
          </h2>
          <p className="text-[11px] font-semibold text-slate-700">
            [See Rule 2(1) Central Rules • Register of Attendance and Muster Roll]
          </p>
        </div>

        {/* WAGES PERIOD IN CENTER AND MONTH SHOULD BE IN THE TEXT AND YEAR */}
        <div className="mt-2.5 inline-block bg-blue-900 text-white font-extrabold px-6 py-1.5 rounded-md text-xs sm:text-sm tracking-wider shadow-xs uppercase">
          WAGES PERIOD: 01ST {selectedMonthText} {selectedYear} TO {daysInMonth}TH {selectedMonthText} {selectedYear} • MONTH: {selectedMonthText}, YEAR: {selectedYear}
        </div>

        {filterPrincipalEmployer !== 'ALL' && (
          <div className="mt-1.5 text-xs text-slate-700">
            <span className="font-bold">Principal Employer / Site:</span>{' '}
            <span className="font-semibold text-blue-900">{filterPrincipalEmployer}</span>
          </div>
        )}
      </div>

      {/* PREVIEW OF TOTAL EMPLOYEES & MUSTER SUMMARY CARDS */}
      <div className="no-print grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-blue-900 block">Total Employees in Form D</span>
            <span className="text-2xl font-black text-blue-950 font-mono">{totalEmployeesCount}</span>
          </div>
          <Users className="w-6 h-6 text-blue-600 opacity-80" />
        </div>

        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-900 block">Total Days Present Sum</span>
            <span className="text-2xl font-black text-emerald-950 font-mono">{aggregatePresentDays}</span>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-600 opacity-80" />
        </div>

        <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-purple-900 block">Active Form A Staff</span>
            <span className="text-2xl font-black text-purple-950 font-mono">{totalActiveInSystem}</span>
          </div>
          <Sparkles className="w-6 h-6 text-purple-600 opacity-80" />
        </div>

        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-900 block">Month Calendar Days</span>
            <span className="text-2xl font-black text-amber-950 font-mono">{daysInMonth} Days</span>
          </div>
          <Calendar className="w-6 h-6 text-amber-600 opacity-80" />
        </div>
      </div>

      {/* ATTENDANCE OPTIONS LEGEND: Absent, Present, Half Day, Holiday, Sunday */}
      <div className="no-print bg-slate-50 border border-slate-300 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Attendance Codes (Click cell to toggle):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ATTENDANCE_OPTIONS.map((opt) => (
            <span
              key={opt.code}
              className={`px-2.5 py-1 rounded-md border font-bold text-[11px] flex items-center gap-1.5 ${opt.badge}`}
              title={opt.desc}
            >
              <span className="font-mono text-xs">{opt.code}</span>
              <span>=</span>
              <span>{opt.label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Control Bar: Print, Download, Excel, Sync, Delete */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {!isStaff && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add Attendance Row
            </button>
          )}

          {!isStaff && (
            <button
              onClick={handleSyncFromEmployees}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              title="Populate attendance sheet for all active Form A employees"
            >
              <Sparkles className="w-4 h-4" />
              Auto-Populate Active Staff
            </button>
          )}

          {/* Option to Print and Download */}
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
            title="Print Form D Muster Roll as Legal Landscape PDF"
          >
            <Printer className="w-4 h-4" />
            Print Register (Legal PDF)
          </button>

          {!isStaff && (
            <button
              onClick={() => exportFormDToExcel(filteredList, selectedMonthText, selectedYear)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              title="Download formatted Excel sheet for Form D"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download Excel
            </button>
          )}

          <button
            onClick={handleDownloadStandaloneDoc}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            title="Download Standalone Printable Document"
          >
            <Download className="w-4 h-4" />
            Download Document
          </button>

          {!isStaff && (
            <button
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-all ${
                selectedIds.length > 0
                  ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer ring-2 ring-rose-300'
                  : 'bg-rose-100 text-rose-300 cursor-not-allowed opacity-60'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected {selectedIds.length > 0 && `(${selectedIds.length})`}
            </button>
          )}
        </div>

        {/* Month in TEXT and Year Selectors */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-bold text-amber-900 text-[11px]">Wages Month:</span>
            <select
              value={selectedMonthText}
              onChange={(e) => setSelectedMonthText(e.target.value)}
              className="bg-transparent text-xs text-amber-950 font-bold focus:outline-hidden cursor-pointer"
            >
              {MONTHS_TEXT.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1">
            <span className="font-bold text-slate-700 text-[11px]">Year:</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-transparent text-xs text-slate-900 font-bold focus:outline-hidden cursor-pointer"
            >
              {[2022, 2023, 2024, 2025, 2026].map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1">
            <Building className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterPrincipalEmployer}
              onChange={(e) => setFilterPrincipalEmployer(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Principal Employers</option>
              {principalEmployersList.map((pe) => (
                <option key={pe} value={pe}>
                  {pe}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Form D Grid Table (31 Days) */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse text-[10px] leading-tight select-none">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300 text-slate-900 uppercase font-black tracking-wider text-[9px]">
                {!isStaff && (
                  <th className="no-print p-1.5 w-6 text-center border-r border-slate-300">
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="cursor-pointer text-slate-600 hover:text-blue-600"
                    >
                      {selectedIds.length === filteredList.length && filteredList.length > 0 ? (
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                      ) : (
                        <Square className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </th>
                )}
                <th className="p-1.5 border-r border-slate-300 w-8">S.No.</th>
                <th className="p-1.5 border-r border-slate-300 w-16 text-left">Code</th>
                <th className="p-1.5 border-r border-slate-300 min-w-32 text-left">Name of Employee</th>
                <th className="p-1.5 border-r border-slate-300 min-w-28 text-left">Place of Work</th>
                <th className="p-1.5 border-r border-slate-300 w-16">DOJ</th>

                {/* 1 to 31 Days Columns */}
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                  const dayOfWeek = d <= daysInMonth ? new Date(selectedYear, monthIndex, d).getDay() : -1;
                  const isSunday = dayOfWeek === 0;
                  return (
                    <th
                      key={d}
                      className={`p-1 border-r border-slate-300 w-5 font-bold ${
                        d > daysInMonth
                          ? 'bg-slate-200 text-slate-400'
                          : isSunday
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                      title={d <= daysInMonth ? `Day ${d} (${isSunday ? 'Sunday' : 'Weekday'})` : undefined}
                    >
                      {d}
                    </th>
                  );
                })}

                <th className="p-1.5 border-r border-slate-300 w-14 font-extrabold bg-blue-50 text-blue-950">
                  Summary (Days)
                </th>
                <th className="p-1.5 border-r border-slate-300 w-14">Remarks (Hours)</th>
                <th className="p-1.5 border-r border-slate-300 min-w-28 text-left">
                  Signature of Keeper
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={41} className="p-8 text-center text-slate-500 font-medium">
                    No attendance records for {selectedMonthText} {selectedYear}. Click &quot;Auto-Populate Active Staff&quot; or &quot;Add Attendance Row&quot;.
                  </td>
                </tr>
              ) : (
                filteredList.map((att, index) => {
                  const isSelected = selectedIds.includes(att.id);
                  return (
                    <tr
                      key={att.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      {!isStaff && (
                        <td className="no-print p-1 text-center border-r border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectOne(att.id)}
                            className="cursor-pointer text-slate-500 hover:text-blue-600"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                            ) : (
                              <Square className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      )}
                      <td className="p-1 border-r border-slate-200 font-bold text-slate-700">
                        {index + 1}
                      </td>
                      <td className="p-1 border-r border-slate-200 font-mono font-bold text-slate-900 text-left">
                        {att.empCode}
                      </td>
                      <td className="p-1 border-r border-slate-200 font-bold text-slate-900 text-left whitespace-nowrap">
                        {att.name}
                      </td>
                      <td className="p-1 border-r border-slate-200 text-slate-700 text-left truncate max-w-28" title={att.placeOfWork}>
                        {att.placeOfWork}
                      </td>
                      <td className="p-1 border-r border-slate-200 font-mono text-slate-700">
                        {att.dateOfJoining}
                      </td>

                      {/* Daily marks (P, A, HD, H, S) - Clickable to cycle */}
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                        const mark = att.dailyAttendance[d];
                        const isInactiveDay = d > daysInMonth;

                        // Styling per status: Present, Absent, Half Day, Holiday, Sunday
                        let cellClass = 'text-slate-600';
                        if (isInactiveDay) {
                          cellClass = 'bg-slate-100 text-slate-300 cursor-not-allowed';
                        } else if (mark === 'P') {
                          cellClass = 'text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100';
                        } else if (mark === 'A') {
                          cellClass = 'text-rose-800 bg-rose-50 hover:bg-rose-100';
                        } else if (mark === 'HD') {
                          cellClass = 'text-amber-800 bg-amber-50 hover:bg-amber-100 font-extrabold';
                        } else if (mark === 'H') {
                          cellClass = 'text-purple-800 bg-purple-50 hover:bg-purple-100 font-extrabold';
                        } else if (mark === 'S') {
                          cellClass = 'text-blue-800 bg-blue-50/80 hover:bg-blue-100 font-extrabold';
                        }

                        return (
                          <td
                            key={d}
                            onClick={() => handleCellClick(att.id, d)}
                            className={`p-1 border-r border-slate-200 font-mono font-bold text-[9px] transition-colors ${cellClass} ${
                              !isStaff && !isInactiveDay ? 'cursor-pointer' : ''
                            }`}
                            title={
                              isInactiveDay
                                ? undefined
                                : `Day ${d}: ${mark || 'P'} (Click to change: P/A/HD/H/S)`
                            }
                          >
                            {isInactiveDay ? '-' : mark || 'P'}
                          </td>
                        );
                      })}

                      <td className="p-1 border-r border-slate-200 font-mono font-bold text-blue-900 bg-blue-50/50">
                        {att.summaryDays}
                      </td>
                      <td className="p-1 border-r border-slate-200 font-mono text-slate-800">
                        {att.remarksHours}
                      </td>
                      <td className="p-1 border-r border-slate-200 text-left text-slate-800 font-medium whitespace-nowrap">
                        {att.signatureKeeper}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Attendance Row Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">Add Attendance Row (Form D)</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveModal} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Employee *
                </label>
                <select
                  value={modalEmpCode}
                  onChange={(e) => setModalEmpCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                >
                  {employees.map((emp) => (
                    <option key={emp.empCode} value={emp.empCode}>
                      {emp.empCode} — {emp.name} ({emp.principalEmployerName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Wages Period (Active)
                </label>
                <div className="p-2.5 bg-slate-100 rounded-lg font-bold text-slate-800">
                  Month: {selectedMonthText}, Year: {selectedYear} ({daysInMonth} Days)
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Remarks (Total Working Hours)
                </label>
                <input
                  type="text"
                  value={modalRemarksHours}
                  onChange={(e) => setModalRemarksHours(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  placeholder="e.g. 208 hrs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Signature of Register Keeper
                </label>
                <input
                  type="text"
                  value={modalSignatureKeeper}
                  onChange={(e) => setModalSignatureKeeper(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="e.g. Shabana Khan (HR Manager)"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Save Row
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
