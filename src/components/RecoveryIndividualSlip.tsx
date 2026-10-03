import React from 'react';
import { RecoveryRecord, ESTABLISHMENT_DETAILS } from '../types';
import { StatutoryHeader } from './StatutoryHeader';
import { Printer, Download, X, FileText, CheckCircle } from 'lucide-react';

interface RecoveryIndividualSlipProps {
  recovery: RecoveryRecord;
  onClose: () => void;
}

export const RecoveryIndividualSlip: React.FC<RecoveryIndividualSlipProps> = ({
  recovery,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Recovery Memo - ${recovery.empCode} - ${recovery.name}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: Arial, sans-serif; color: #0f172a; background: #fff; margin: 0; padding: 25px; font-size: 12px; }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 20px; text-transform: uppercase; color: #0f172a; }
    .header h2 { margin: 4px 0; font-size: 13px; color: #475569; }
    .header p { margin: 2px 0; font-size: 11px; color: #64748b; }
    .memo-badge { display: inline-block; padding: 4px 12px; background: #f1f5f9; border: 1px solid #cbd5e1; font-weight: bold; margin-top: 8px; font-size: 13px; text-transform: uppercase; }
    .box { border: 1px solid #94a3b8; border-radius: 6px; padding: 15px; margin-bottom: 15px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .field label { display: block; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 2px; }
    .field span { font-size: 13px; font-weight: 600; color: #0f172a; }
    .amount-box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; margin-top: 10px; text-align: center; }
    .amount-val { font-size: 20px; font-weight: bold; color: #0369a1; font-family: monospace; }
    .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-top: 50px; text-align: center; }
    .sig-line { border-bottom: 1px solid #000; height: 50px; margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${ESTABLISHMENT_DETAILS.name}</h1>
    <h2>${ESTABLISHMENT_DETAILS.ruleText}</h2>
    <p><strong>Address:</strong> ${ESTABLISHMENT_DETAILS.address}</p>
    <div class="memo-badge">FORM C - STATUTORY RECOVERY MEMO / SLIP</div>
  </div>

  <div class="box">
    <div class="grid">
      <div class="field"><label>Slip Reference / Sl No.</label><span>SLIP-REC-${recovery.slNo.toString().padStart(4, '0')}</span></div>
      <div class="field"><label>Date of Damage / Loss</label><span>${recovery.dateOfDamageOrLoss}</span></div>
      <div class="field"><label>Employee Code</label><span>${recovery.empCode}</span></div>
      <div class="field"><label>Employee Name</label><span>${recovery.name}</span></div>
      <div class="field" style="grid-column: span 2;"><label>Principal Employer / Work Place</label><span>${recovery.principalEmployer}</span></div>
      <div class="field"><label>Recovery Type</label><span>${recovery.recoveryType}</span></div>
      <div class="field"><label>Show Cause Issued</label><span>${recovery.showCauseIssued}</span></div>
      <div class="field" style="grid-column: span 2;"><label>Explanation Heard By Officer</label><span>${recovery.explanationHeard || 'HR Manager'}</span></div>
      <div class="field" style="grid-column: span 2;"><label>Particulars of Damage / Loss / Advance</label><span>${recovery.particulars}</span></div>
    </div>

    <div class="amount-box">
      <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #64748b;">Total Amount to be Recovered</div>
      <div class="amount-val">₹${recovery.amount.toLocaleString('en-IN')}</div>
    </div>

    <div class="grid" style="margin-top: 15px;">
      <div class="field"><label>Number of Instalments</label><span>${recovery.noOfInstalments} equal instalments</span></div>
      <div class="field"><label>First Month / Year</label><span>${recovery.firstMonthYear}</span></div>
      <div class="field"><label>Last Month / Year</label><span>${recovery.lastMonthYear}</span></div>
      <div class="field"><label>Date of Complete Recovery</label><span>${recovery.dateOfCompleteRecovery || 'In Progress'}</span></div>
      <div class="field" style="grid-column: span 2;"><label>Remarks / Assessment Notes</label><span>${recovery.remarks || 'Deduction initiated per statutory register rules'}</span></div>
    </div>
  </div>

  <div class="signatures">
    <div>
      <div class="sig-line"></div>
      <p style="margin: 0; font-weight: bold;">Signature / Thumb Impression of Employee</p>
      <span style="font-size: 11px; color: #64748b;">(${recovery.name})</span>
    </div>
    <div>
      <div class="sig-line"></div>
      <p style="margin: 0; font-weight: bold; text-transform: uppercase;">GLOZIYO SERVICES PVT LTD</p>
      <span style="font-size: 11px; color: #64748b;">Authorized Signatory / Register Keeper</span>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Recovery_Slip_${recovery.empCode}_${recovery.name.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-300 my-auto">
        {/* Top Control Bar */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">
              Individual Recovery Memo &amp; Slip — {recovery.empCode}: {recovery.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Slip
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Slip
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Slip Paper */}
        <div className="p-6 sm:p-8 bg-white print:p-2 text-slate-900 text-xs">
          <StatutoryHeader
            formTitle="FORM C - STATUTORY RECOVERY MEMO / SLIP"
            subTitle="[See Rule 2(1) Central Rules • Register of Recoveries for Damages, Loss or Advances]"
            principalEmployer={recovery.principalEmployer}
          />

          <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/50 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Slip No.</span>
                <span className="font-mono font-bold text-slate-900">
                  SLIP-REC-{recovery.slNo.toString().padStart(4, '0')}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Employee Code</span>
                <span className="font-mono font-bold text-slate-900">{recovery.empCode}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Employee Name</span>
                <span className="font-bold text-slate-900 text-sm">{recovery.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Recovery Type</span>
                <span className="inline-block px-2 py-0.5 rounded font-bold text-[11px] bg-blue-100 text-blue-900">
                  {recovery.recoveryType}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Date of Damage / Loss</span>
                <span className="font-mono font-semibold text-slate-800">{recovery.dateOfDamageOrLoss}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Show Cause Issued</span>
                <span className="font-semibold text-slate-800">{recovery.showCauseIssued}</span>
              </div>
              <div className="sm:col-span-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Particulars</span>
                <span className="font-medium text-slate-900">{recovery.particulars}</span>
              </div>
            </div>

            {/* Recovery Amount Card */}
            <div className="bg-white border-2 border-blue-200 rounded-xl p-3 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                Total Recovery Amount
              </span>
              <span className="font-mono font-black text-2xl text-blue-950">
                ₹{recovery.amount.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Instalment Schedule */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Instalments</span>
                <span className="font-bold text-slate-900">{recovery.noOfInstalments} equal</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">First Month</span>
                <span className="font-mono font-bold text-slate-800">{recovery.firstMonthYear}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Last Month</span>
                <span className="font-mono font-bold text-slate-800">{recovery.lastMonthYear}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Date Complete</span>
                <span className="font-mono font-semibold text-slate-800">
                  {recovery.dateOfCompleteRecovery || 'In Recovery'}
                </span>
              </div>
              <div className="sm:col-span-4 border-t border-slate-100 pt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Remarks</span>
                <span className="italic text-slate-700">{recovery.remarks || 'None'}</span>
              </div>
            </div>
          </div>

          {/* Attestation Signatures */}
          <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t-2 border-slate-300 text-center">
            <div>
              <div className="h-12 border-b border-slate-600 mb-1"></div>
              <p className="font-bold text-slate-900">Signature of Employee</p>
              <span className="text-[10px] text-slate-500">({recovery.name})</span>
            </div>
            <div>
              <div className="h-12 border-b border-slate-600 mb-1"></div>
              <p className="font-bold text-slate-900 uppercase">GLOZIYO SERVICES PVT LTD</p>
              <span className="text-[10px] text-slate-500">Authorized Officer / HR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
