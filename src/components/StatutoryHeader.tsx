import React from 'react';
import { ESTABLISHMENT_DETAILS } from '../types';
import { CompanyLogo } from './CompanyLogo';

interface StatutoryHeaderProps {
  formTitle: string;
  subTitle?: string;
  principalEmployer?: string;
  principalEmployerAddress?: string;
  extraInfo?: string;
  isPrintOnly?: boolean;
  className?: string;
}

export const StatutoryHeader: React.FC<StatutoryHeaderProps> = ({
  formTitle,
  subTitle,
  principalEmployer,
  principalEmployerAddress,
  extraInfo,
  className = '',
}) => {
  return (
    <div className={`statutory-header text-center border-b border-slate-300 pb-3 mb-4 ${className}`}>
      {/* Brand & Central Bold Heading */}
      <div className="flex flex-col items-center justify-center">
        <div className="mb-1 flex items-center justify-center gap-2">
          <CompanyLogo size="sm" showText={false} />
          <h1 className="text-xl sm:text-2xl font-black tracking-wide text-slate-900 uppercase">
            {ESTABLISHMENT_DETAILS.name}
          </h1>
        </div>
        
        <p className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide uppercase">
          {ESTABLISHMENT_DETAILS.ruleText}
        </p>

        <p className="text-[11px] sm:text-xs text-slate-600 max-w-3xl mt-0.5 font-medium leading-relaxed">
          <span className="font-semibold text-slate-700">Address of Establishment:</span> {ESTABLISHMENT_DETAILS.address}
        </p>
      </div>

      {/* Form Title */}
      <div className="mt-2.5 inline-block px-4 py-1 rounded bg-slate-100 border border-slate-300">
        <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-slate-950">
          {formTitle}
        </h2>
        {subTitle && (
          <p className="text-[11px] font-semibold text-slate-700">{subTitle}</p>
        )}
      </div>

      {/* Principal Employer Details if available or filtered */}
      {(principalEmployer || principalEmployerAddress) && (
        <div className="mt-2 text-xs text-slate-700 bg-amber-50/80 border border-amber-200 rounded px-3 py-1 inline-block text-left max-w-2xl mx-auto">
          <span className="font-bold text-slate-900">Principal Employer:</span>{' '}
          <span className="font-semibold text-blue-900">{principalEmployer || 'All Registered Employers'}</span>
          {principalEmployerAddress && (
            <span className="text-slate-600 block text-[11px]">
              <span className="font-medium">Employer Address:</span> {principalEmployerAddress}
            </span>
          )}
        </div>
      )}

      {extraInfo && (
        <div className="mt-1 text-xs font-semibold text-slate-700">
          {extraInfo}
        </div>
      )}
    </div>
  );
};
