import React, { useState } from 'react';
import {
  EmployeeRecord,
  UserRole,
  STATUTORY_EXIT_REASONS,
  DOCUMENT_TYPES,
  EmployeeDocument,
} from '../types';
import {
  X,
  Upload,
  Plus,
  Check,
  AlertCircle,
  FileCheck,
  FileX,
  Image as ImageIcon,
} from 'lucide-react';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: EmployeeRecord) => void;
  initialData?: EmployeeRecord | null;
  designations: string[];
  qualifications: string[];
  onAddDesignation: (newDesig: string) => void;
  onAddQualification: (newQual: string) => void;
  userRole: UserRole;
  nextSrNo: number;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  designations,
  qualifications,
  onAddDesignation,
  onAddQualification,
  userRole,
  nextSrNo,
}) => {
  const isEdit = !!initialData;
  const isStaff = userRole === 'Staff';

  // Form State
  const [empCode, setEmpCode] = useState(initialData?.empCode || `EMP00${nextSrNo}`);
  const [name, setName] = useState(initialData?.name || '');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Transgender' | 'Other'>(
    initialData?.gender || 'Male'
  );
  const [dob, setDob] = useState(initialData?.dob || '');
  const [designation, setDesignation] = useState(initialData?.designation || designations[0] || 'Helper');
  const [qualification, setQualification] = useState(
    initialData?.qualification || qualifications[0] || 'Graduate'
  );
  const [category, setCategory] = useState<'Unskilled' | 'Semi-Skilled' | 'Skilled' | 'Highly Skilled'>(
    initialData?.category || 'Skilled'
  );
  const [mobile, setMobile] = useState(initialData?.mobile || '');

  // Statutory fields
  const [uan, setUan] = useState(initialData?.uan || '');
  const [esic, setEsic] = useState(initialData?.esic || '');
  const [lwfNo, setLwfNo] = useState(initialData?.lwfNo || '');
  const [pan, setPan] = useState(initialData?.pan || '');

  // Bank Details
  const [bankName, setBankName] = useState(initialData?.bankName || '');
  const [bankAddress, setBankAddress] = useState(initialData?.bankAddress || '');
  const [accountNo, setAccountNo] = useState(initialData?.accountNo || '');
  const [ifscCode, setIfscCode] = useState(initialData?.ifscCode || '');

  // Address
  const [presentAddress, setPresentAddress] = useState(initialData?.presentAddress || '');
  const [permanentAddress, setPermanentAddress] = useState(initialData?.permanentAddress || '');
  const [isSameAddress, setIsSameAddress] = useState(initialData?.isSameAddress || false);

  // Principal Employer
  const [principalEmployerName, setPrincipalEmployerName] = useState(
    initialData?.principalEmployerName || 'GLOZIYO DIRECT ESTABLISHMENT'
  );
  const [principalEmployerAddress, setPrincipalEmployerAddress] = useState(
    initialData?.principalEmployerAddress || '01A, Tasmiya Tower, Millennium Hospital Compound, Kausa 400 612'
  );

  // Joining & Exit
  const [dateOfJoining, setDateOfJoining] = useState(initialData?.dateOfJoining || new Date().toISOString().slice(0, 10));
  const [dateOfExit, setDateOfExit] = useState(initialData?.dateOfExit || '');
  const [reasonOfExit, setReasonOfExit] = useState(initialData?.reasonOfExit || 'N/A (Active Employee)');
  const [status, setStatus] = useState<'Active' | 'Exit' | 'Terminated'>(initialData?.status || 'Active');
  const [remarks, setRemarks] = useState(initialData?.remarks || '');

  // Photo & Signature (Mandatory)
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl || '');
  const [signatureUrl, setSignatureUrl] = useState(initialData?.signatureUrl || '');

  // Documents
  const [documents, setDocuments] = useState<{ [key: string]: EmployeeDocument }>(
    initialData?.documents || {}
  );

  // Add custom designation/qualification UI modal states
  const [showNewDesigInput, setShowNewDesigInput] = useState(false);
  const [newDesigName, setNewDesigName] = useState('');
  const [showNewQualInput, setShowNewQualInput] = useState(false);
  const [newQualName, setNewQualName] = useState('');

  // Error message
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Handle Address Same Checkbox
  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsSameAddress(checked);
    if (checked) {
      setPermanentAddress(presentAddress);
    }
  };

  const handlePresentAddressChange = (val: string) => {
    setPresentAddress(val);
    if (isSameAddress) {
      setPermanentAddress(val);
    }
  };

  // Handle Image Upload with 100 KB limit validation
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'photo' | 'signature'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = file.size / 1024;
    if (sizeKb > 100) {
      alert(`File size is ${sizeKb.toFixed(1)} KB. Maximum allowed size is 100 KB per statutory rules.`);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        if (target === 'photo') setPhotoUrl(reader.result);
        if (target === 'signature') setSignatureUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Document Upload (Max 100 KB)
  const handleDocUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    docKey: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKb = file.size / 1024;
    if (sizeKb > 100) {
      alert(`Document "${file.name}" is ${sizeKb.toFixed(1)} KB. Max limit is 100 KB. Please upload a compressed document.`);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setDocuments((prev) => ({
          ...prev,
          [docKey]: {
            name: file.name,
            sizeKb: Math.round(sizeKb),
            dataUrl: reader.result as string,
            uploadedAt: new Date().toISOString().slice(0, 10),
          },
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddNewDesignation = () => {
    if (!newDesigName.trim()) return;
    onAddDesignation(newDesigName.trim());
    setDesignation(newDesigName.trim());
    setNewDesigName('');
    setShowNewDesigInput(false);
  };

  const handleAddNewQualification = () => {
    if (!newQualName.trim()) return;
    onAddQualification(newQualName.trim());
    setQualification(newQualName.trim());
    setNewQualName('');
    setShowNewQualInput(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!name.trim()) {
      setErrorMsg('Full Name of Employee is required.');
      return;
    }
    if (!uan.trim()) {
      setErrorMsg('UAN (Universal Account Number) is mandatory.');
      return;
    }
    if (!pan.trim()) {
      setErrorMsg('PAN Number is mandatory.');
      return;
    }
    if (!bankName.trim() || !accountNo.trim() || !ifscCode.trim()) {
      setErrorMsg('Bank Details (Bank Name, Account Number, IFSC) are mandatory.');
      return;
    }
    if (!photoUrl) {
      setErrorMsg('Employee Photograph is mandatory (Upload under 100 KB).');
      return;
    }
    if (!signatureUrl) {
      setErrorMsg('Employee Signature is mandatory (Upload under 100 KB).');
      return;
    }

    // Check mandatory documents
    const mandatoryDocs = DOCUMENT_TYPES.filter((d) => d.required);
    for (const mDoc of mandatoryDocs) {
      if (!documents[mDoc.key]) {
        // Warning or blocking - let's prompt or require
        const confirmSkip = confirm(
          `Statutory Document "${mDoc.label}" is marked mandatory. Do you want to proceed and upload it later?`
        );
        if (!confirmSkip) {
          setErrorMsg(`Please upload mandatory document: ${mDoc.label}`);
          return;
        }
        break;
      }
    }

    const updatedRecord: EmployeeRecord = {
      id: initialData?.id || `emp_${Date.now()}`,
      srNo: initialData?.srNo || nextSrNo,
      empCode: empCode.trim(),
      name: name.trim(),
      gender,
      dob,
      designation,
      qualification,
      category: isStaff ? 'Unskilled' : category, // Skill Category disabled for Staff
      mobile: mobile.trim(),
      uan: uan.trim().toUpperCase(),
      esic: esic.trim(),
      lwfNo: lwfNo.trim(), // Optional per instructions
      pan: pan.trim().toUpperCase(),
      bankName: bankName.trim(),
      bankAddress: bankAddress.trim(),
      accountNo: accountNo.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      presentAddress: presentAddress.trim(),
      permanentAddress: permanentAddress.trim(),
      isSameAddress,
      principalEmployerName: principalEmployerName.trim(),
      principalEmployerAddress: principalEmployerAddress.trim(),
      dateOfJoining,
      dateOfExit: status === 'Active' ? '' : dateOfExit,
      reasonOfExit: status === 'Active' ? 'N/A (Active Employee)' : reasonOfExit,
      status,
      remarks: remarks.trim(),
      photoUrl,
      signatureUrl,
      documents,
    };

    onSave(updatedRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950 border border-amber-400/40">
                Rule 2(1) Central Rules
              </span>
              <h3 className="font-extrabold text-lg text-white">
                {isEdit ? 'Edit Employee Record' : 'Add Employee to Statutory Register (Form A)'}
              </h3>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Establishment: GLOZIYO SERVICES PRIVATE LIMITED • LIN: 1-8125-1293-8
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Identifiers */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Section 1: Basic Employee Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Employee Code *
                </label>
                <input
                  type="text"
                  required
                  value={empCode}
                  onChange={(e) => setEmpCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="EMP001"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Name of Employee *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Full Legal Name as per Aadhar / PAN"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Birth (DOB) *</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="10-digit mobile"
                />
              </div>

              {/* Designation with + Add Option */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Designation *</label>
                  <button
                    type="button"
                    onClick={() => setShowNewDesigInput(!showNewDesigInput)}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add New
                  </button>
                </div>
                {showNewDesigInput ? (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="New designation..."
                      value={newDesigName}
                      onChange={(e) => setNewDesigName(e.target.value)}
                      className="w-full px-2 py-1.5 border border-blue-400 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewDesignation}
                      className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {designations.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Qualification with + Add Option */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Qualification *</label>
                  <button
                    type="button"
                    onClick={() => setShowNewQualInput(!showNewQualInput)}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-bold flex items-center gap-0.5 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add New
                  </button>
                </div>
                {showNewQualInput ? (
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="e.g. B.Tech, M.Com..."
                      value={newQualName}
                      onChange={(e) => setNewQualName(e.target.value)}
                      className="w-full px-2 py-1.5 border border-blue-400 rounded-lg text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddNewQualification}
                      className="px-2.5 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {qualifications.map((q) => (
                      <option key={q} value={q}>
                        {q}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Skill Category - Disabled for Staff */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-700">Skill Category</label>
                  {isStaff && (
                    <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                      Disabled for Staff
                    </span>
                  )}
                </div>
                <select
                  disabled={isStaff}
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                    isStaff
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed border-slate-300'
                      : 'bg-white text-slate-900 border-slate-300'
                  }`}
                >
                  <option value="Unskilled">Unskilled</option>
                  <option value="Semi-Skilled">Semi-Skilled</option>
                  <option value="Skilled">Skilled</option>
                  <option value="Highly Skilled">Highly Skilled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Statutory Identifiers */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Section 2: Statutory &amp; Social Security Identifiers
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  UAN (Universal Account No. EPFO) *
                </label>
                <input
                  type="text"
                  required
                  value={uan}
                  onChange={(e) => setUan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="12-digit UAN"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ESIC Number</label>
                <input
                  type="text"
                  value={esic}
                  onChange={(e) => setEsic(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="17-digit ESIC code"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  LWF NO (Labour Welfare Fund)
                  <span className="text-[10px] text-slate-500 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={lwfNo}
                  onChange={(e) => setLwfNo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="LWF Registration No."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">PAN Card Number *</label>
                <input
                  type="text"
                  required
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono uppercase font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="e.g. ABCDE1234F"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Bank Details */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Section 3: Bank Details (Disbursement) *
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Name *</label>
                <input
                  type="text"
                  required
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="e.g. HDFC Bank, SBI"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Address / Branch</label>
                <input
                  type="text"
                  value={bankAddress}
                  onChange={(e) => setBankAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Branch location"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Account Number *</label>
                <input
                  type="text"
                  required
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono font-bold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Bank account number"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">IFSC Code *</label>
                <input
                  type="text"
                  required
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="e.g. HDFC0001234"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Present & Permanent Address with Copy Option */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Section 4: Present &amp; Permanent Addresses
              </h4>
              <label className="flex items-center gap-2 text-xs font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSameAddress}
                  onChange={handleSameAddressChange}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span>Tick if Permanent Address is same as Present Address</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Present Address *</label>
                <textarea
                  rows={2}
                  required
                  value={presentAddress}
                  onChange={(e) => handlePresentAddressChange(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Current residing address in Mumbai / Thane..."
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Permanent Address *</label>
                <textarea
                  rows={2}
                  required
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  readOnly={isSameAddress}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                    isSameAddress ? 'bg-slate-100 text-slate-600' : 'bg-white text-slate-900 border-slate-300'
                  }`}
                  placeholder="Permanent native place address..."
                />
              </div>
            </div>
          </div>

          {/* Section 5: Principal Employer Deputation */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Section 5: Principal Employer Particulars
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Principal Employer Name *
                </label>
                <input
                  type="text"
                  required
                  value={principalEmployerName}
                  onChange={(e) => setPrincipalEmployerName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="e.g. Larsen & Toubro / Godrej / GLOZIYO HEAD OFFICE"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Principal Employer Site Address
                </label>
                <input
                  type="text"
                  value={principalEmployerAddress}
                  onChange={(e) => setPrincipalEmployerAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Site / Plant / Depot location"
                />
              </div>
            </div>
          </div>

          {/* Section 6: Service Tenure, Exit Particulars, Remarks / Status */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Section 6: Service Tenure, Status &amp; Reason of Exit
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Joining *</label>
                <input
                  type="date"
                  required
                  value={dateOfJoining}
                  onChange={(e) => setDateOfJoining(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Remarks / Status *
                </label>
                <select
                  value={status}
                  onChange={(e) => {
                    const st = e.target.value as any;
                    setStatus(st);
                    if (st === 'Active') {
                      setDateOfExit('');
                      setReasonOfExit('N/A (Active Employee)');
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="Active">Active</option>
                  <option value="Exit">Exit</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date of Exit</label>
                <input
                  type="date"
                  disabled={status === 'Active'}
                  value={dateOfExit}
                  onChange={(e) => setDateOfExit(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                    status === 'Active' ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-900 border-slate-300'
                  }`}
                />
              </div>

              {/* Reason of Exit Dropdown */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason of Exit
                </label>
                <select
                  disabled={status === 'Active'}
                  value={reasonOfExit}
                  onChange={(e) => setReasonOfExit(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden ${
                    status === 'Active' ? 'bg-slate-100 text-slate-400' : 'bg-white text-slate-900 border-slate-300'
                  }`}
                >
                  {STATUTORY_EXIT_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Remarks Field */}
              <div className="md:col-span-4">
                <label className="block font-semibold text-slate-700 mb-1">
                  Remarks
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  placeholder="Enter administrative or supervisory remarks..."
                />
              </div>
            </div>
          </div>

          {/* Section 7: Mandatory Photograph & Signature */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-4">
            <h4 className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Section 7: Photograph &amp; Signature (Mandatory &lt;= 100 KB) *
              </span>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Max 100 KB per file
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Photo Upload */}
              <div className="border border-slate-300 rounded-lg p-3 bg-white flex flex-col items-center">
                <span className="font-bold text-slate-800 mb-2">Photograph *</span>
                <div className="w-28 h-32 border-2 border-dashed border-slate-300 rounded flex items-center justify-center bg-slate-50 mb-3 overflow-hidden">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Employee Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400 p-2">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 text-slate-400" />
                      <span className="text-[10px]">No Photo</span>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo (&lt; 100 KB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'photo')}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Signature Upload */}
              <div className="border border-slate-300 rounded-lg p-3 bg-white flex flex-col items-center">
                <span className="font-bold text-slate-800 mb-2">Signature *</span>
                <div className="w-48 h-32 border-2 border-dashed border-slate-300 rounded flex items-center justify-center bg-slate-50 mb-3 overflow-hidden p-2">
                  {signatureUrl ? (
                    <img src={signatureUrl} alt="Signature Preview" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <div className="text-center text-slate-400 p-2">
                      <span className="text-[10px]">No Signature Uploaded</span>
                    </div>
                  )}
                </div>
                <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Signature (&lt; 100 KB)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'signature')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Section 8: Statutory Documents Checklist (Max 100 KB) */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Section 8: Onboarding Documents (Max 100 KB Limit)
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                Mandatory marked with (*)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {DOCUMENT_TYPES.map((dt) => {
                const doc = documents[dt.key];
                return (
                  <div
                    key={dt.key}
                    className={`border rounded-lg p-2.5 flex flex-col justify-between ${
                      doc
                        ? 'bg-emerald-50/70 border-emerald-300'
                        : dt.required
                        ? 'bg-white border-amber-300'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-[11px]">
                          {dt.label} {dt.required && <span className="text-rose-600">*</span>}
                        </span>
                        {doc ? (
                          <FileCheck className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <FileX className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      {doc ? (
                        <p className="text-[10px] text-emerald-800 font-medium truncate">
                          {doc.name} ({doc.sizeKb} KB)
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-400">
                          {dt.required ? 'Mandatory upload' : 'Optional document'}
                        </p>
                      )}
                    </div>

                    <label className="mt-2 block text-center cursor-pointer py-1 px-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[10px] border border-slate-300 transition-colors">
                      {doc ? 'Change File' : 'Upload (&lt; 100KB)'}
                      <input
                        type="file"
                        accept=".pdf,image/*"
                        onChange={(e) => handleDocUpload(e, dt.key)}
                        className="hidden"
                      />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-semibold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 font-bold shadow-md cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              {isEdit ? 'Update Employee Record' : 'Save & Register Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
