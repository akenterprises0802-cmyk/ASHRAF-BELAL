import React from 'react';
import { EmployeeRecord, DOCUMENT_TYPES, ESTABLISHMENT_DETAILS } from '../types';
import { StatutoryHeader } from './StatutoryHeader';
import { Printer, Download, X, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

interface EmployeeIndividualDossierProps {
  employee: EmployeeRecord;
  onClose: () => void;
}

export const EmployeeIndividualDossier: React.FC<EmployeeIndividualDossierProps> = ({
  employee,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPrintable = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Statutory Dossier - ${employee.empCode} - ${employee.name}</title>
  <style>
    @page { size: legal landscape; margin: 10mm; }
    body { font-family: Arial, sans-serif; color: #1e293b; background: #fff; margin: 0; padding: 20px; font-size: 11px; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; }
    .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; color: #0f172a; }
    .header h2 { margin: 4px 0; font-size: 13px; color: #475569; }
    .header p { margin: 2px 0; font-size: 11px; color: #64748b; }
    .grid { display: grid; grid-template-columns: 3fr 1fr; gap: 15px; border: 1px solid #cbd5e1; padding: 12px; border-radius: 6px; margin-bottom: 12px; background: #f8fafc; }
    .subgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .field label { display: block; font-size: 9px; font-weight: bold; text-transform: uppercase; color: #64748b; }
    .field span { font-size: 12px; font-weight: 600; color: #0f172a; }
    .photo-box { text-align: center; border-left: 1px solid #cbd5e1; padding-left: 10px; }
    .photo-box img { width: 100px; height: 120px; object-fit: cover; border: 1px solid #94a3b8; border-radius: 4px; }
    .section-title { font-size: 11px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 8px; color: #1e3a8a; }
    .box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px; margin-bottom: 10px; background: #fff; }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .four-col { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 25px; padding-top: 15px; border-top: 1px solid #94a3b8; text-align: center; }
    .sig-img { max-height: 50px; max-width: 150px; object-fit: contain; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${ESTABLISHMENT_DETAILS.name}</h1>
    <h2>${ESTABLISHMENT_DETAILS.ruleText}</h2>
    <p><strong>Address:</strong> ${ESTABLISHMENT_DETAILS.address}</p>
    <h3 style="margin: 8px 0 0 0; color: #0369a1; text-transform: uppercase;">FORM A - INDIVIDUAL EMPLOYEE STATUTORY DOSSIER & SERVICE CARD</h3>
    ${employee.principalEmployerName ? `<p><strong>Principal Employer:</strong> ${employee.principalEmployerName} (${employee.principalEmployerAddress || ''})</p>` : ''}
  </div>

  <div class="grid">
    <div class="subgrid">
      <div class="field"><label>Employee Code</label><span>${employee.empCode}</span></div>
      <div class="field"><label>Full Name</label><span>${employee.name}</span></div>
      <div class="field"><label>Gender</label><span>${employee.gender}</span></div>
      <div class="field"><label>Date of Birth</label><span>${employee.dob || '-'}</span></div>
      <div class="field"><label>Designation</label><span>${employee.designation}</span></div>
      <div class="field"><label>Qualification</label><span>${employee.qualification || '-'}</span></div>
      <div class="field"><label>Skill Category</label><span>${employee.category}</span></div>
      <div class="field"><label>Mobile</label><span>${employee.mobile}</span></div>
      <div class="field"><label>Status</label><span>${employee.status}</span></div>
    </div>
    <div class="photo-box">
      ${employee.photoUrl ? `<img src="${employee.photoUrl}" alt="Photo" />` : '<div style="width:100px;height:120px;border:1px dashed #ccc;line-height:120px;color:#999;">Photo</div>'}
      <div style="font-size: 9px; font-weight: bold; margin-top: 4px;">OFFICIAL ID PHOTO</div>
    </div>
  </div>

  <div class="two-col">
    <div class="box">
      <div class="section-title">1. Statutory & Social Security Identifiers</div>
      <div class="subgrid">
        <div class="field"><label>UAN (EPFO) *</label><span>${employee.uan}</span></div>
        <div class="field"><label>ESIC Number</label><span>${employee.esic || '-'}</span></div>
        <div class="field"><label>PAN Card *</label><span>${employee.pan}</span></div>
        <div class="field"><label>LWF No</label><span>${employee.lwfNo || 'N/A'}</span></div>
      </div>
    </div>
    <div class="box">
      <div class="section-title">2. Bank Disbursement Particulars</div>
      <div class="subgrid">
        <div class="field"><label>Bank Name</label><span>${employee.bankName}</span></div>
        <div class="field"><label>IFSC Code</label><span>${employee.ifscCode}</span></div>
        <div class="field"><label>Account No</label><span>${employee.accountNo}</span></div>
        <div class="field" style="grid-column: span 3;"><label>Branch Address</label><span>${employee.bankAddress || '-'}</span></div>
      </div>
    </div>
  </div>

  <div class="two-col">
    <div class="box">
      <div class="section-title">3. Residence Addresses</div>
      <div class="field" style="margin-bottom: 6px;"><label>Present Address</label><span>${employee.presentAddress}</span></div>
      <div class="field"><label>Permanent Address</label><span>${employee.permanentAddress}</span></div>
    </div>
    <div class="box">
      <div class="section-title">4. Tenure & Exit Particulars</div>
      <div class="subgrid">
        <div class="field"><label>Date of Joining</label><span>${employee.dateOfJoining}</span></div>
        <div class="field"><label>Date of Exit</label><span>${employee.dateOfExit || 'Active'}</span></div>
        <div class="field"><label>Reason for Exit</label><span>${employee.reasonOfExit || '-'}</span></div>
        <div class="field" style="grid-column: span 3; margin-top: 4px;"><label>Remarks</label><span>${employee.remarks || 'None recorded'}</span></div>
      </div>
    </div>
  </div>

  <div class="signatures">
    <div>
      <div style="height: 50px;">
        ${employee.signatureUrl ? `<img src="${employee.signatureUrl}" class="sig-img" alt="Sig" />` : ''}
      </div>
      <p style="margin: 4px 0 0 0; font-weight: bold;">Signature of Employee</p>
      <span style="font-size: 10px; color: #64748b;">${employee.name}</span>
    </div>
    <div>
      <div style="height: 50px; border-bottom: 1px solid #000; width: 180px; margin: 0 auto;"></div>
      <p style="margin: 4px 0 0 0; font-weight: bold; text-transform: uppercase;">GLOZIYO SERVICES PVT LTD</p>
      <span style="font-size: 10px; color: #64748b;">Authorized Signatory / HR Manager</span>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Statutory_Dossier_${employee.empCode}_${employee.name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-300 my-auto">
        {/* Modal Top Bar - Hidden during print */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">
              Individual Employee Statutory Dossier &amp; Service Card — {employee.empCode}: {employee.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPrintable}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
              title="Download standalone printable HTML docket"
            >
              <Download className="w-4 h-4" />
              Download Printable Dossier
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF (Legal)
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Canvas */}
        <div className="p-6 sm:p-8 bg-white print:p-2 text-slate-900">
          <StatutoryHeader
            formTitle="FORM A - INDIVIDUAL EMPLOYEE STATUTORY DOSSIER"
            subTitle="Central Rules Rule 2(1) • Employee Service Card & Compliance Record"
            principalEmployer={employee.principalEmployerName}
            principalEmployerAddress={employee.principalEmployerAddress}
          />

          {/* Top section: Basic Details + Employee Photo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-slate-300 rounded-lg p-4 bg-slate-50/50 mb-4 print:mb-2">
            {/* 3 Columns of details */}
            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block font-semibold text-[10px] uppercase">Employee Code</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{employee.empCode}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold text-[10px] uppercase">Full Legal Name</span>
                <span className="font-bold text-slate-900 text-sm">{employee.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold text-[10px] uppercase">Gender</span>
                <span className="font-medium text-slate-900">{employee.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold text-[10px] uppercase">Date of Birth (DOB)</span>
                <span className="font-semibold text-slate-900">{employee.dob || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold text-[10px] uppercase">Designation</span>
                <span className="font-bold text-blue-900">{employee.designation}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold text-[10px] uppercase">Qualification</span>
                <span className="font-semibold text-slate-800">{employee.qualification || '-'}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold text-[10px] uppercase">Skill Category</span>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                  {employee.category}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold text-[10px] uppercase">Mobile Number</span>
                <span className="font-mono font-semibold text-slate-900">{employee.mobile}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-semibold text-[10px] uppercase">Employment Status</span>
                <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                  employee.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                  employee.status === 'Exit' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {employee.status}
                </span>
              </div>
            </div>

            {/* Photo Column */}
            <div className="flex flex-col items-center justify-center border-l md:border-slate-300 md:pl-4">
              <div className="w-28 h-32 border-2 border-slate-400 rounded-md overflow-hidden bg-white shadow-sm flex items-center justify-center p-0.5">
                {employee.photoUrl ? (
                  <img
                    src={employee.photoUrl}
                    alt={employee.name}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="text-center text-[10px] text-slate-400 p-2">
                    <ShieldAlert className="w-6 h-6 mx-auto mb-1 text-slate-400" />
                    Mandatory Photo
                  </div>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-500 mt-1 tracking-wider">
                Official Photo ID
              </span>
            </div>
          </div>

          {/* Section 2: Statutory Identifiers & Principal Employer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 print:mb-2 text-xs">
            {/* Statutory Numbers */}
            <div className="border border-slate-300 rounded-lg p-3 bg-white">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 mb-2">
                1. Statutory &amp; Social Security Identifiers
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">UAN (EPFO) *</span>
                  <span className="font-mono font-bold text-slate-900">{employee.uan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">ESIC Number</span>
                  <span className="font-mono font-semibold text-slate-900">{employee.esic || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">PAN Card</span>
                  <span className="font-mono font-bold text-slate-900">{employee.pan}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">LWF No. (Optional)</span>
                  <span className="font-mono text-slate-800">{employee.lwfNo || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Principal Employer */}
            <div className="border border-slate-300 rounded-lg p-3 bg-white">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 mb-2">
                2. Principal Employer Deputation
              </h4>
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Principal Employer Name</span>
                  <span className="font-bold text-slate-900">{employee.principalEmployerName || 'GLOZIYO DIRECT ESTABLISHMENT'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Deputation Address / Site</span>
                  <span className="text-slate-700">{employee.principalEmployerAddress || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Bank Details & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 print:mb-2 text-xs">
            {/* Bank Details */}
            <div className="border border-slate-300 rounded-lg p-3 bg-white">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 mb-2">
                3. Bank Account &amp; Disbursement Particulars
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Bank Name</span>
                  <span className="font-bold text-slate-900">{employee.bankName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">IFSC Code</span>
                  <span className="font-mono font-bold text-blue-900">{employee.ifscCode}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Account Number</span>
                  <span className="font-mono font-bold text-slate-900 text-sm tracking-wider">{employee.accountNo}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Bank Branch Address</span>
                  <span className="text-slate-700">{employee.bankAddress}</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="border border-slate-300 rounded-lg p-3 bg-white">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 mb-2">
                4. Residence Addresses
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Present Address</span>
                  <span className="text-slate-900 font-medium">{employee.presentAddress}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Permanent Address</span>
                  <span className="text-slate-900 font-medium">{employee.permanentAddress}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Tenure, Exit Reason & Remarks */}
          <div className="border border-slate-300 rounded-lg p-3 bg-white mb-4 print:mb-2 text-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 mb-2">
              5. Service Period, Exit Particulars &amp; Remarks
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Date of Joining</span>
                <span className="font-bold text-slate-900">{employee.dateOfJoining}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Date of Exit</span>
                <span className="font-bold text-slate-900">{employee.dateOfExit || 'Currently Active'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Reason of Exit (Statutory Dropdown)</span>
                <span className="font-semibold text-slate-900">{employee.reasonOfExit || '-'}</span>
              </div>
              <div className="col-span-4">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">Internal Remarks</span>
                <span className="text-slate-800 italic">{employee.remarks || 'None recorded'}</span>
              </div>
            </div>
          </div>

          {/* Section 5: Statutory Documents Verification Checklist */}
          <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 mb-4 print:mb-2 text-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1.5 mb-2">
              6. Onboarding Documents Checklist (Max 100 KB Verified)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DOCUMENT_TYPES.map((dt) => {
                const uploaded = !!employee.documents?.[dt.key];
                return (
                  <div
                    key={dt.key}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] ${
                      uploaded
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : dt.required
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-3.5 h-3.5 shrink-0 ${
                        uploaded ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span className="truncate">{dt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 6: Attestation & Signature Footer */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t-2 border-slate-400 mt-6 print:mt-4 text-xs">
            <div className="text-center flex flex-col items-center">
              <span className="text-slate-500 font-semibold text-[10px] uppercase mb-1">
                Employee Signature (Mandatory)
              </span>
              <div className="w-48 h-16 border border-dashed border-slate-400 rounded bg-white flex items-center justify-center p-1">
                {employee.signatureUrl ? (
                  <img
                    src={employee.signatureUrl}
                    alt="Signature"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <span className="text-rose-500 font-semibold text-[10px]">Pending Signature</span>
                )}
              </div>
              <span className="mt-1 font-bold text-slate-800 text-[11px]">
                {employee.name}
              </span>
            </div>

            <div className="text-center flex flex-col items-center justify-end">
              <div className="w-48 border-b-2 border-slate-800 pb-1 mb-1">
                <span className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  GLOZIYO SERVICES PVT LTD
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-600 uppercase">
                Authorized Signatory / HR Manager
              </span>
              <span className="text-[9px] text-slate-400">
                Registered Under Central Rules Rule 2(1)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
