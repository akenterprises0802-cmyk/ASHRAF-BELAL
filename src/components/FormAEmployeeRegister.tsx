import React, { useState, useMemo } from 'react';
import { EmployeeRecord, UserRole, ESTABLISHMENT_DETAILS } from '../types';
import { StatutoryHeader } from './StatutoryHeader';
import { exportFormAToExcel } from '../utils/excelExport';
import {
  UserPlus,
  FileSpreadsheet,
  Trash2,
  Printer,
  FileBadge,
  Search,
  Filter,
  ArrowUpDown,
  Building,
  CheckSquare,
  Square,
  AlertTriangle,
  Edit2,
  Users,
  UserCheck,
  UserX,
  Download,
} from 'lucide-react';

interface FormAProps {
  employees: EmployeeRecord[];
  onAddEmployee: () => void;
  onEditEmployee: (emp: EmployeeRecord) => void;
  onDeleteEmployees: (ids: string[]) => void;
  onPrintIndividual: (emp: EmployeeRecord) => void;
  userRole: UserRole;
}

export const FormAEmployeeRegister: React.FC<FormAProps> = ({
  employees,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployees,
  onPrintIndividual,
  userRole,
}) => {
  const isStaff = userRole === 'Staff';

  // Selection state for active bulk deletion
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrincipalEmployer, setFilterPrincipalEmployer] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState<'alphaAsc' | 'joiningDate' | 'exitDate' | 'srNo'>('alphaAsc');

  // Extract distinct Principal Employers for dropdown filter
  const principalEmployersList = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      if (e.principalEmployerName) set.add(e.principalEmployerName);
    });
    return Array.from(set);
  }, [employees]);

  // Filter & Sort
  const processedEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const matchesSearch =
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.mobile.includes(searchTerm) ||
          emp.uan.includes(searchTerm) ||
          emp.pan.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPE =
          filterPrincipalEmployer === 'ALL' ||
          emp.principalEmployerName === filterPrincipalEmployer;

        const matchesStatus =
          filterStatus === 'ALL' || emp.status === filterStatus;

        return matchesSearch && matchesPE && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'alphaAsc') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'joiningDate') {
          return new Date(a.dateOfJoining).getTime() - new Date(b.dateOfJoining).getTime();
        }
        if (sortBy === 'exitDate') {
          if (!a.dateOfExit && !b.dateOfExit) return 0;
          if (!a.dateOfExit) return 1;
          if (!b.dateOfExit) return -1;
          return new Date(a.dateOfExit).getTime() - new Date(b.dateOfExit).getTime();
        }
        return a.srNo - b.srNo;
      });
  }, [employees, searchTerm, filterPrincipalEmployer, filterStatus, sortBy]);

  // Employee Metric Counts for Preview
  const totalEmployeesCount = employees.length;
  const activeEmployeesCount = employees.filter((e) => e.status === 'Active').length;
  const exitEmployeesCount = employees.filter((e) => e.status === 'Exit' || e.status === 'Terminated').length;
  const filteredCount = processedEmployees.length;

  // Bulk selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === processedEmployees.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(processedEmployees.map((e) => e.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Active Delete Selected handler
  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete the ${selectedIds.length} selected employee record(s)? This statutory action cannot be reversed.`
    );
    if (confirmDelete) {
      onDeleteEmployees(selectedIds);
      setSelectedIds([]);
    }
  };

  // Single delete
  const handleDeleteOne = (id: string, name: string) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete employee record: "${name}"?`
    );
    if (confirmDelete) {
      onDeleteEmployees([id]);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  // PDF Print Trigger
  const handlePrintPDF = () => {
    window.print();
  };

  // Download Standalone Form A Document
  const handleDownloadStandaloneDoc = () => {
    const rows = processedEmployees
      .map(
        (emp, i) => `<tr>
        <td style="text-align:center;">${i + 1}</td>
        <td style="font-family:monospace;font-weight:bold;">${emp.empCode}</td>
        <td style="font-weight:bold;">${emp.name}</td>
        <td>${emp.gender}</td>
        <td>${emp.dob}</td>
        <td>${emp.qualification || '-'}</td>
        <td>${emp.designation}</td>
        <td>${emp.category}</td>
        <td>${emp.mobile}</td>
        <td>${emp.uan}</td>
        <td>${emp.esic || '-'}</td>
        <td>${emp.pan}</td>
        <td>${emp.bankName} (A/C: ${emp.accountNo})</td>
        <td>${emp.presentAddress}</td>
        <td>${emp.principalEmployerName}</td>
        <td>${emp.dateOfJoining}</td>
        <td>${emp.dateOfExit || '-'}</td>
        <td>${emp.status}</td>
      </tr>`
      )
      .join('');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Form A Employee Register</title>
  <style>
    @page { size: legal landscape; margin: 8mm; }
    body { font-family: Arial, sans-serif; color: #000; background: #fff; margin: 0; padding: 10px; font-size: 8pt; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 10px; }
    .header h1 { margin: 0; font-size: 16pt; text-transform: uppercase; }
    .header h2 { margin: 2pt 0; font-size: 10pt; }
    .header p { margin: 2pt 0; font-size: 8pt; color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 7pt; }
    th, td { border: 1px solid #333; padding: 3px 2px; }
    th { background: #f1f5f9; text-transform: uppercase; font-weight: bold; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${ESTABLISHMENT_DETAILS.name}</h1>
    <h2>${ESTABLISHMENT_DETAILS.ruleText}</h2>
    <p><strong>Address:</strong> ${ESTABLISHMENT_DETAILS.address}</p>
    <div style="font-weight:bold;margin-top:4px;font-size:10pt;">FORM A - EMPLOYEE REGISTER (Rule 2(1) Central Rules)</div>
    <div style="font-size:8pt;margin-top:2px;">Total Records: ${processedEmployees.length}</div>
  </div>
  <table>
    <thead>
      <tr>
        <th>S.No</th>
        <th>Code</th>
        <th>Name</th>
        <th>Gender</th>
        <th>DOB</th>
        <th>Qual</th>
        <th>Designation</th>
        <th>Category</th>
        <th>Mobile</th>
        <th>UAN</th>
        <th>ESIC</th>
        <th>PAN</th>
        <th>Bank Details</th>
        <th>Address</th>
        <th>Principal Employer</th>
        <th>DOJ</th>
        <th>Exit Date</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Form_A_Employee_Register_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // STAFF ACCESS LOCKDOWN: "Role Staff Can Not Show the Data Only Access of Add the record"
  if (isStaff) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-6">
        <StatutoryHeader
          formTitle="FORM A - EMPLOYEE ONBOARDING PORTAL"
          subTitle="Staff Registration Portal • Restricted Entry Access"
        />

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <UserPlus className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              Staff Employee Registration Desk
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              You are logged in with the <strong>Staff</strong> role. In accordance with establishment privacy compliance, you are authorized <strong>only to add and submit new employee records</strong> into Form A.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 text-left space-y-1.5 max-w-lg mx-auto">
            <div className="font-bold flex items-center gap-1.5 text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Staff Access Privileges:
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
              <li>Access is restricted solely to adding new employee records.</li>
              <li>Existing employee personal records, wages, and statutory databases are protected from staff view.</li>
              <li>Form C, Form D, and User Administration are inaccessible.</li>
            </ul>
          </div>

          <div className="pt-2">
            <button
              onClick={onAddEmployee}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-lg hover:shadow-xl transition-all text-sm cursor-pointer"
            >
              <UserPlus className="w-5 h-5" />
              <span>+ Add / Register New Employee</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            Establishment: GLOZIYO SERVICES PRIVATE LIMITED • LIN: 1-8125-1293-8
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Central bold statutory header */}
      <StatutoryHeader
        formTitle="FORM A - EMPLOYEE REGISTER"
        subTitle="[See Rule 2(1) of the Ease of Compliance to Maintain Registers under various Labour Laws Central Rules, 2017]"
        principalEmployer={filterPrincipalEmployer !== 'ALL' ? filterPrincipalEmployer : undefined}
      />

      {/* PREVIEW OF TOTAL EMPLOYEES DASHBOARD CARDS */}
      <div className="no-print grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-blue-900 block">Total Employees</span>
            <span className="text-2xl font-black text-blue-950 font-mono">{totalEmployeesCount}</span>
            <span className="text-[10px] text-blue-700 block mt-0.5">Showing {filteredCount} matched</span>
          </div>
          <Users className="w-6 h-6 text-blue-600 opacity-80" />
        </div>

        <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-emerald-900 block">Active Employees</span>
            <span className="text-2xl font-black text-emerald-950 font-mono">{activeEmployeesCount}</span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">On Active Roll</span>
          </div>
          <UserCheck className="w-6 h-6 text-emerald-600 opacity-80" />
        </div>

        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-amber-900 block">Exited / Relieved</span>
            <span className="text-2xl font-black text-amber-950 font-mono">{exitEmployeesCount}</span>
            <span className="text-[10px] text-amber-700 block mt-0.5">Resigned / Retired</span>
          </div>
          <UserX className="w-6 h-6 text-amber-600 opacity-80" />
        </div>

        <div className="p-3 bg-purple-50/80 border border-purple-200 rounded-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase text-purple-900 block">Principal Employers</span>
            <span className="text-2xl font-black text-purple-950 font-mono">{principalEmployersList.length}</span>
            <span className="text-[10px] text-purple-700 block mt-0.5">Registered Sites</span>
          </div>
          <Building className="w-6 h-6 text-purple-600 opacity-80" />
        </div>
      </div>

      {/* Control Bar: Add, Export, Delete, Print, Download, Search, Filter */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Left Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Employee - Allowed for all including Staff */}
          <button
            onClick={onAddEmployee}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add Employee
          </button>

          {/* Print PDF Button - Disabled for Staff */}
          {!isStaff && (
            <button
              onClick={handlePrintPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              title="Print / Save Form A Register as Legal Landscape PDF"
            >
              <Printer className="w-4 h-4" />
              Print Register (Legal PDF)
            </button>
          )}

          {/* Download Excel - Disabled for Staff */}
          {!isStaff && (
            <button
              onClick={() => exportFormAToExcel(processedEmployees)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              title="Download formatted Excel sheet for Form A"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download Excel
            </button>
          )}

          {/* Download Document - Disabled for Staff */}
          {!isStaff && (
            <button
              onClick={handleDownloadStandaloneDoc}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              title="Download Standalone Printable Document"
            >
              <Download className="w-4 h-4" />
              Download Document
            </button>
          )}

          {/* Delete Selected - Active and working, disabled for Staff */}
          {!isStaff && (
            <button
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold text-xs shadow-xs transition-all ${
                selectedIds.length > 0
                  ? 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer ring-2 ring-rose-300'
                  : 'bg-rose-100 text-rose-300 cursor-not-allowed opacity-60'
              }`}
              title={
                selectedIds.length > 0
                  ? `Delete ${selectedIds.length} selected employee(s)`
                  : 'Select rows below to activate delete'
              }
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected {selectedIds.length > 0 && `(${selectedIds.length})`}
            </button>
          )}
        </div>

        {/* Right Search, Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, name, UAN, PAN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs w-48 sm:w-56 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter by Principal Employer */}
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

          {/* Sort By */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-hidden cursor-pointer"
            >
              <option value="alphaAsc">Sort: Name (A to Z Ascending)</option>
              <option value="joiningDate">Sort: Date of Joining</option>
              <option value="exitDate">Sort: Date of Exit</option>
              <option value="srNo">Sort: S. No.</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="Active">Active</option>
              <option value="Exit">Exit</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Statutory Table (Legal Landscape Fitted) */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px] leading-tight">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300 text-slate-900 uppercase font-black tracking-wider text-[10px]">
                {/* Select All Checkbox - No print & Hidden for Staff */}
                {!isStaff && (
                  <th className="no-print p-2 w-8 text-center border-r border-slate-300">
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="cursor-pointer text-slate-600 hover:text-blue-600"
                    >
                      {selectedIds.length === processedEmployees.length && processedEmployees.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                )}
                <th className="p-2 border-r border-slate-300 text-center w-12">S. No.</th>
                <th className="p-2 border-r border-slate-300 w-24">Employee Code</th>
                <th className="p-2 border-r border-slate-300 min-w-36">Name</th>
                <th className="p-2 border-r border-slate-300 w-16">Gender</th>
                <th className="p-2 border-r border-slate-300 w-20">DOB</th>
                <th className="p-2 border-r border-slate-300 min-w-28">Qualification</th>
                <th className="p-2 border-r border-slate-300 min-w-32">Designation</th>
                <th className="p-2 border-r border-slate-300 w-24">Category</th>
                <th className="p-2 border-r border-slate-300 w-24">Mobile</th>
                <th className="p-2 border-r border-slate-300 w-28">UAN (EPFO)</th>
                <th className="p-2 border-r border-slate-300 w-28">ESIC Number</th>
                <th className="p-2 border-r border-slate-300 w-24">LWF No</th>
                <th className="p-2 border-r border-slate-300 w-24">PAN</th>
                <th className="p-2 border-r border-slate-300 min-w-44">Bank Details</th>
                <th className="p-2 border-r border-slate-300 min-w-40">Present Address</th>
                <th className="p-2 border-r border-slate-300 min-w-40">Permanent Address</th>
                <th className="p-2 border-r border-slate-300 min-w-44">Principal Employer</th>
                <th className="p-2 border-r border-slate-300 w-24">Date of Joining</th>
                <th className="p-2 border-r border-slate-300 w-20">Date of Exit</th>
                <th className="p-2 border-r border-slate-300 min-w-36">Reason for Exit</th>
                <th className="p-2 border-r border-slate-300 w-20 text-center">Status</th>
                <th className="p-2 border-r border-slate-300 min-w-32">Remarks</th>
                {/* Actions column - No print & Hidden for Staff */}
                {!isStaff && <th className="no-print p-2 text-center w-28">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {processedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={24} className="p-8 text-center text-slate-500 font-medium">
                    No employees matching the criteria. Click &quot;Add Employee&quot; to register records.
                  </td>
                </tr>
              ) : (
                processedEmployees.map((emp, index) => {
                  const isSelected = selectedIds.includes(emp.id);
                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      {/* Checkbox column - hidden for Staff */}
                      {!isStaff && (
                        <td className="no-print p-2 text-center border-r border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectOne(emp.id)}
                            className="cursor-pointer text-slate-500 hover:text-blue-600"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      )}

                      <td className="p-2 text-center font-bold text-slate-700 border-r border-slate-200">
                        {index + 1}
                      </td>
                      <td className="p-2 font-mono font-bold text-slate-900 border-r border-slate-200">
                        {emp.empCode}
                      </td>
                      <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                        <div className="flex items-center gap-2">
                          {emp.photoUrl && (
                            <img
                              src={emp.photoUrl}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-300"
                            />
                          )}
                          <span>{emp.name}</span>
                        </div>
                      </td>
                      <td className="p-2 text-slate-700 border-r border-slate-200">{emp.gender}</td>
                      <td className="p-2 font-mono text-slate-700 border-r border-slate-200">{emp.dob}</td>
                      <td className="p-2 font-medium text-slate-800 border-r border-slate-200">
                        {emp.qualification || '-'}
                      </td>
                      <td className="p-2 font-bold text-blue-900 border-r border-slate-200">
                        {emp.designation}
                      </td>
                      <td className="p-2 text-slate-700 border-r border-slate-200">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-[10px]">
                          {emp.category}
                        </span>
                      </td>
                      <td className="p-2 font-mono text-slate-800 border-r border-slate-200">{emp.mobile}</td>
                      <td className="p-2 font-mono font-semibold text-slate-900 border-r border-slate-200">
                        {emp.uan}
                      </td>
                      <td className="p-2 font-mono text-slate-700 border-r border-slate-200">
                        {emp.esic || '-'}
                      </td>
                      <td className="p-2 font-mono text-slate-700 border-r border-slate-200">
                        {emp.lwfNo || '-'}
                      </td>
                      <td className="p-2 font-mono font-bold text-slate-800 border-r border-slate-200">
                        {emp.pan}
                      </td>
                      <td className="p-2 text-slate-800 border-r border-slate-200">
                        <div className="font-semibold text-slate-900">{emp.bankName}</div>
                        <div className="font-mono text-[10px] text-slate-600">A/C: {emp.accountNo}</div>
                        <div className="font-mono text-[10px] text-blue-800">IFSC: {emp.ifscCode}</div>
                      </td>
                      <td className="p-2 text-slate-700 text-[10px] max-w-44 truncate border-r border-slate-200" title={emp.presentAddress}>
                        {emp.presentAddress}
                      </td>
                      <td className="p-2 text-slate-700 text-[10px] max-w-44 truncate border-r border-slate-200" title={emp.permanentAddress}>
                        {emp.permanentAddress}
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{emp.principalEmployerName}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-44" title={emp.principalEmployerAddress}>
                          {emp.principalEmployerAddress}
                        </div>
                      </td>
                      <td className="p-2 font-mono font-semibold text-slate-800 border-r border-slate-200">
                        {emp.dateOfJoining}
                      </td>
                      <td className="p-2 font-mono text-slate-700 border-r border-slate-200">
                        {emp.dateOfExit || '-'}
                      </td>
                      <td className="p-2 text-slate-700 text-[10px] border-r border-slate-200" title={emp.reasonOfExit}>
                        {emp.reasonOfExit || '-'}
                      </td>
                      <td className="p-2 text-center border-r border-slate-200">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            emp.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : emp.status === 'Exit'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-2 text-slate-600 text-[10px] border-r border-slate-200">
                        {emp.remarks || '-'}
                      </td>

                      {/* Row Action Buttons - COMPLETELY HIDDEN FOR STAFF */}
                      {!isStaff && (
                        <td className="no-print p-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* Individual Print Dossier for Admin & HR */}
                            <button
                              type="button"
                              onClick={() => onPrintIndividual(emp)}
                              className="p-1 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                              title="Print Individual Statutory Dossier (with Photo & Signature)"
                            >
                              <FileBadge className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => onEditEmployee(emp)}
                              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                              title="Edit Record"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Single Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteOne(emp.id, emp.name)}
                              className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
