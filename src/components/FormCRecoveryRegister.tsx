import React, { useState, useMemo } from 'react';
import { RecoveryRecord, EmployeeRecord, UserRole } from '../types';
import { StatutoryHeader } from './StatutoryHeader';
import { exportFormCToExcel } from '../utils/excelExport';
import { RecoveryIndividualSlip } from './RecoveryIndividualSlip';
import {
  PlusCircle,
  FileSpreadsheet,
  Trash2,
  Printer,
  Search,
  User,
  Building,
  CheckSquare,
  Square,
  X,
  Check,
  Edit2,
  FileBadge,
  DollarSign,
  Download,
} from 'lucide-react';

interface FormCProps {
  recoveries: RecoveryRecord[];
  employees: EmployeeRecord[];
  onAddRecovery: (record: RecoveryRecord) => void;
  onUpdateRecovery?: (record: RecoveryRecord) => void;
  onDeleteRecoveries: (ids: string[]) => void;
  userRole: UserRole;
}

export const FormCRecoveryRegister: React.FC<FormCProps> = ({
  recoveries,
  employees,
  onAddRecovery,
  onUpdateRecovery,
  onDeleteRecoveries,
  userRole,
}) => {
  const isStaff = userRole === 'Staff';

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByName, setFilterByName] = useState<string>('ALL'); // "In From C the Print Optation Should be BY The Name"
  const [filterPrincipalEmployer, setFilterPrincipalEmployer] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Individual Print Slip Modal
  const [individualSlipRecord, setIndividualSlipRecord] = useState<RecoveryRecord | null>(null);

  // Form Fields
  const [selectedEmpCode, setSelectedEmpCode] = useState(employees[0]?.empCode || '');
  const [recoveryType, setRecoveryType] = useState('Advance');
  const [particulars, setParticulars] = useState('');
  const [dateOfDamageOrLoss, setDateOfDamageOrLoss] = useState(new Date().toISOString().slice(0, 10));
  const [amount, setAmount] = useState<number>(1000);
  const [showCauseIssued, setShowCauseIssued] = useState<'Yes' | 'No'>('Yes');
  const [explanationHeard, setExplanationHeard] = useState('HR Manager');
  const [noOfInstalments, setNoOfInstalments] = useState<number>(3);
  const [firstMonthYear, setFirstMonthYear] = useState('2024-05');
  const [lastMonthYear, setLastMonthYear] = useState('2024-07');
  const [dateOfCompleteRecovery, setDateOfCompleteRecovery] = useState('');
  const [remarks, setRemarks] = useState('');

  // Extract distinct Employee Names for "Print by Name" filter
  const employeeNamesList = useMemo(() => {
    const set = new Set<string>();
    recoveries.forEach((r) => set.add(r.name));
    return Array.from(set).sort();
  }, [recoveries]);

  // Extract Principal Employers
  const principalEmployersList = useMemo(() => {
    const set = new Set<string>();
    recoveries.forEach((r) => {
      if (r.principalEmployer) set.add(r.principalEmployer);
    });
    return Array.from(set).sort();
  }, [recoveries]);

  // Filtered Recoveries
  const filteredRecoveries = useMemo(() => {
    return recoveries.filter((rec) => {
      const matchesSearch =
        rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.particulars.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rec.recoveryType.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesName =
        filterByName === 'ALL' || rec.name.toLowerCase() === filterByName.toLowerCase();

      const matchesPE =
        filterPrincipalEmployer === 'ALL' || rec.principalEmployer === filterPrincipalEmployer;

      return matchesSearch && matchesName && matchesPE;
    });
  }, [recoveries, searchTerm, filterByName, filterPrincipalEmployer]);

  // Total Recovery Amount Calculation
  const totalRecoveryAmount = useMemo(() => {
    return filteredRecoveries.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [filteredRecoveries]);

  // Select all toggle
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredRecoveries.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRecoveries.map((r) => r.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected recovery record(s)?`)) {
      onDeleteRecoveries(selectedIds);
      setSelectedIds([]);
    }
  };

  const handleDeleteOne = (id: string, name: string) => {
    if (window.confirm(`Delete recovery entry for ${name}?`)) {
      onDeleteRecoveries([id]);
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setSelectedEmpCode(employees[0]?.empCode || '');
    setRecoveryType('Advance');
    setParticulars('');
    setDateOfDamageOrLoss(new Date().toISOString().slice(0, 10));
    setAmount(1000);
    setShowCauseIssued('Yes');
    setExplanationHeard('HR Manager');
    setNoOfInstalments(3);
    setFirstMonthYear('2024-05');
    setLastMonthYear('2024-07');
    setDateOfCompleteRecovery('');
    setRemarks('');
    setIsModalOpen(true);
  };

  // Open Edit Modal for a specific recovery record
  const handleOpenEdit = (rec: RecoveryRecord) => {
    setEditingId(rec.id);
    setSelectedEmpCode(rec.empCode);
    setRecoveryType(rec.recoveryType);
    setParticulars(rec.particulars);
    setDateOfDamageOrLoss(rec.dateOfDamageOrLoss);
    setAmount(rec.amount);
    setShowCauseIssued(rec.showCauseIssued);
    setExplanationHeard(rec.explanationHeard);
    setNoOfInstalments(rec.noOfInstalments);
    setFirstMonthYear(rec.firstMonthYear);
    setLastMonthYear(rec.lastMonthYear);
    setDateOfCompleteRecovery(rec.dateOfCompleteRecovery || '');
    setRemarks(rec.remarks);
    setIsModalOpen(true);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedEmp = employees.find((e) => e.empCode === selectedEmpCode);

    if (editingId && onUpdateRecovery) {
      const existing = recoveries.find((r) => r.id === editingId);
      const updatedRecord: RecoveryRecord = {
        id: editingId,
        slNo: existing ? existing.slNo : recoveries.length + 1,
        empCode: selectedEmpCode,
        name: matchedEmp ? matchedEmp.name : existing?.name || 'Employee',
        principalEmployer: matchedEmp ? matchedEmp.principalEmployerName : existing?.principalEmployer || 'GLOZIYO SITE',
        recoveryType,
        particulars,
        dateOfDamageOrLoss,
        amount: Number(amount) || 0,
        showCauseIssued,
        explanationHeard,
        noOfInstalments: Number(noOfInstalments) || 1,
        firstMonthYear,
        lastMonthYear,
        dateOfCompleteRecovery,
        remarks,
      };
      onUpdateRecovery(updatedRecord);
    } else {
      const newRecord: RecoveryRecord = {
        id: `rec_${Date.now()}`,
        slNo: recoveries.length + 1,
        empCode: selectedEmpCode,
        name: matchedEmp ? matchedEmp.name : 'Unknown Employee',
        principalEmployer: matchedEmp ? matchedEmp.principalEmployerName : 'GLOZIYO DIRECT ESTABLISHMENT',
        recoveryType,
        particulars,
        dateOfDamageOrLoss,
        amount: Number(amount) || 0,
        showCauseIssued,
        explanationHeard,
        noOfInstalments: Number(noOfInstalments) || 1,
        firstMonthYear,
        lastMonthYear,
        dateOfCompleteRecovery,
        remarks,
      };
      onAddRecovery(newRecord);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Central Bold Statutory Header */}
      <StatutoryHeader
        formTitle="FORM C - RECOVERY REGISTER"
        subTitle="[See Rule 2(1) Central Rules • Register of Recoveries for Damages, Loss or Advances]"
        principalEmployer={filterPrincipalEmployer !== 'ALL' ? filterPrincipalEmployer : undefined}
        extraInfo={filterByName !== 'ALL' ? `PRINT SELECTION FOR EMPLOYEE: ${filterByName.toUpperCase()}` : undefined}
      />

      {/* Summary Preview Banner */}
      <div className="no-print grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-blue-900 block">Total Recovery Entries</span>
          <span className="text-xl font-black text-blue-950 font-mono">{filteredRecoveries.length}</span>
        </div>
        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-emerald-900 block">Total Amount Assessed</span>
          <span className="text-xl font-black text-emerald-950 font-mono">₹{totalRecoveryAmount.toLocaleString('en-IN')}</span>
        </div>
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-amber-900 block">Filtered Employee</span>
          <span className="text-xs font-bold text-amber-950 truncate block mt-1">{filterByName === 'ALL' ? 'All Employees' : filterByName}</span>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[10px] uppercase font-bold text-slate-700 block">Principal Employer Site</span>
          <span className="text-xs font-bold text-slate-900 truncate block mt-1">{filterPrincipalEmployer === 'ALL' ? 'All Sites' : filterPrincipalEmployer}</span>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {!isStaff && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Add Recovery
            </button>
          )}

          {!isStaff && (
            <button
              onClick={() => exportFormCToExcel(filteredRecoveries, filterByName !== 'ALL' ? filterByName : '')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export to Excel
            </button>
          )}

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

          {/* Print Register Button (Active) */}
          <button
            onClick={handlePrintPDF}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer"
            title="Print Form C Recovery Register as Legal Landscape PDF"
          >
            <Printer className="w-4 h-4" />
            Print Register (Legal PDF)
          </button>
        </div>

        {/* Right Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, particulars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs w-44 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PRINT BY NAME OPTION */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-300 rounded-lg px-2.5 py-1">
            <User className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-bold text-amber-900 text-[11px]">Print by Name:</span>
            <select
              value={filterByName}
              onChange={(e) => setFilterByName(e.target.value)}
              className="bg-transparent text-xs text-amber-950 font-bold focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">All Employees</option>
              {employeeNamesList.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Principal Employer Filter */}
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

      {/* Form C Register Table */}
      <div className="bg-white rounded-xl border border-slate-300 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px] leading-tight">
            <thead>
              <tr className="bg-slate-100 border-b-2 border-slate-300 text-slate-900 uppercase font-black tracking-wider text-[10px]">
                {!isStaff && (
                  <th className="no-print p-2 w-8 text-center border-r border-slate-300">
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="cursor-pointer text-slate-600 hover:text-blue-600"
                    >
                      {selectedIds.length === filteredRecoveries.length && filteredRecoveries.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                )}
                <th className="p-2 border-r border-slate-300 text-center w-12">Sl. No.</th>
                <th className="p-2 border-r border-slate-300 w-24">Employee Code</th>
                <th className="p-2 border-r border-slate-300 min-w-36">Name</th>
                <th className="p-2 border-r border-slate-300 min-w-40">Principal Employer</th>
                <th className="p-2 border-r border-slate-300 w-24">Recovery Type</th>
                <th className="p-2 border-r border-slate-300 min-w-48">Particulars</th>
                <th className="p-2 border-r border-slate-300 w-28">Date of Damage / Loss</th>
                <th className="p-2 border-r border-slate-300 w-24 text-right">Amount (₹)</th>
                <th className="p-2 border-r border-slate-300 w-24 text-center">Show Cause Issued</th>
                <th className="p-2 border-r border-slate-300 min-w-32">Explanation Heard</th>
                <th className="p-2 border-r border-slate-300 w-20 text-center">No. of Instalments</th>
                <th className="p-2 border-r border-slate-300 w-24">First Month/Year</th>
                <th className="p-2 border-r border-slate-300 w-24">Last Month/Year</th>
                <th className="p-2 border-r border-slate-300 w-28">Date Complete Recovery</th>
                <th className="p-2 border-r border-slate-300 min-w-32">Remarks</th>
                {!isStaff && <th className="no-print p-2 text-center w-28">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredRecoveries.length === 0 ? (
                <tr>
                  <td colSpan={17} className="p-8 text-center text-slate-500 font-medium">
                    No recovery records found.
                  </td>
                </tr>
              ) : (
                filteredRecoveries.map((rec, index) => {
                  const isSelected = selectedIds.includes(rec.id);
                  return (
                    <tr
                      key={rec.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        isSelected ? 'bg-blue-50' : index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      {!isStaff && (
                        <td className="no-print p-2 text-center border-r border-slate-200">
                          <button
                            type="button"
                            onClick={() => handleToggleSelectOne(rec.id)}
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
                        {rec.empCode}
                      </td>
                      <td className="p-2 font-bold text-slate-900 border-r border-slate-200">
                        {rec.name}
                      </td>
                      <td className="p-2 text-slate-800 border-r border-slate-200">
                        {rec.principalEmployer}
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <span className="px-1.5 py-0.5 rounded font-semibold text-[10px] bg-slate-100 text-slate-800">
                          {rec.recoveryType}
                        </span>
                      </td>
                      <td className="p-2 text-slate-800 border-r border-slate-200">{rec.particulars}</td>
                      <td className="p-2 font-mono text-slate-700 border-r border-slate-200">
                        {rec.dateOfDamageOrLoss}
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-slate-950 border-r border-slate-200">
                        ₹{rec.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2 text-center border-r border-slate-200">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            rec.showCauseIssued === 'Yes' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {rec.showCauseIssued}
                        </span>
                      </td>
                      <td className="p-2 text-slate-800 border-r border-slate-200">{rec.explanationHeard}</td>
                      <td className="p-2 text-center font-bold text-slate-800 border-r border-slate-200">
                        {rec.noOfInstalments}
                      </td>
                      <td className="p-2 font-mono text-slate-700 border-r border-slate-200">
                        {rec.firstMonthYear}
                      </td>
                      <td className="p-2 font-mono text-slate-700 border-r border-slate-200">
                        {rec.lastMonthYear}
                      </td>
                      <td className="p-2 font-mono text-slate-700 border-r border-slate-200">
                        {rec.dateOfCompleteRecovery || '-'}
                      </td>
                      <td className="p-2 text-slate-600 border-r border-slate-200">{rec.remarks || '-'}</td>

                      {/* Actions: Edit, Individual Slip Print, Delete */}
                      {!isStaff && (
                        <td className="no-print p-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {/* Option to Take out print Individually */}
                            <button
                              type="button"
                              onClick={() => setIndividualSlipRecord(rec)}
                              className="p-1 text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                              title="Take out print of Individual Recovery Slip"
                            >
                              <FileBadge className="w-4 h-4" />
                            </button>

                            {/* Option to Edit Recovery Record */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(rec)}
                              className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                              title="Edit Recovery Record"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeleteOne(rec.id, rec.name)}
                              className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-100 rounded transition-colors cursor-pointer"
                              title="Delete recovery record"
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

      {/* Add / Edit Recovery Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingId ? 'Edit Recovery Record (Form C)' : 'Add Recovery Record (Form C)'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
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
                  value={selectedEmpCode}
                  onChange={(e) => setSelectedEmpCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold"
                >
                  {employees.map((emp) => (
                    <option key={emp.empCode} value={emp.empCode}>
                      {emp.empCode} — {emp.name} ({emp.principalEmployerName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recovery Type *</label>
                  <select
                    value={recoveryType}
                    onChange={(e) => setRecoveryType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Advance">Salary Advance</option>
                    <option value="Damage">Damage to Tools/Equipments</option>
                    <option value="Loss">Loss of Goods / Store Asset</option>
                    <option value="Fine">Statutory Fine / Penalty</option>
                    <option value="Overpayment">Overpayment Recovery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Particulars *</label>
                <input
                  type="text"
                  required
                  value={particulars}
                  onChange={(e) => setParticulars(e.target.value)}
                  placeholder="e.g. Festival advance, tool replacement..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date of Damage/Loss *</label>
                  <input
                    type="date"
                    required
                    value={dateOfDamageOrLoss}
                    onChange={(e) => setDateOfDamageOrLoss(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Show Cause Issued *</label>
                  <select
                    value={showCauseIssued}
                    onChange={(e) => setShowCauseIssued(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Explanation Heard By</label>
                  <input
                    type="text"
                    value={explanationHeard}
                    onChange={(e) => setExplanationHeard(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. of Instalments</label>
                  <input
                    type="number"
                    min={1}
                    value={noOfInstalments}
                    onChange={(e) => setNoOfInstalments(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">First Month/Year</label>
                  <input
                    type="month"
                    value={firstMonthYear}
                    onChange={(e) => setFirstMonthYear(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Month/Year</label>
                  <input
                    type="month"
                    value={lastMonthYear}
                    onChange={(e) => setLastMonthYear(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date Complete</label>
                  <input
                    type="date"
                    value={dateOfCompleteRecovery}
                    onChange={(e) => setDateOfCompleteRecovery(e.target.value)}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Recovery progress remarks..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
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
                  {editingId ? 'Update Recovery' : 'Save Recovery'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Individual Slip Modal */}
      {individualSlipRecord && (
        <RecoveryIndividualSlip
          recovery={individualSlipRecord}
          onClose={() => setIndividualSlipRecord(null)}
        />
      )}
    </div>
  );
};
