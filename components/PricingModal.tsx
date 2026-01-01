import React, { useEffect } from 'react';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubscribe: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSubscribe }) => {



    if (!isOpen) return null;

    const CheckItem = ({ text }: { text: string }) => (
        <li className="flex items-start gap-3">
            <div className="mt-1 w-4 h-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <span className="text-slate-600 dark:text-slate-400 text-sm leading-tight">{text}</span>
        </li>
    );

    // Button styles from Button.tsx
    const buttonBaseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F7F7F5] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";
    const buttonPrimaryStyles = "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 shadow-lg shadow-slate-900/10 focus:ring-slate-900 font-semibold";

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#F7F7F5] dark:bg-black rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up border border-slate-200 dark:border-white/10 overflow-hidden max-h-[85vh] overflow-y-auto md:overflow-hidden md:max-h-none">

                {/* Header */}
                <div className="p-6 md:p-8 pb-6 text-center border-b border-slate-200 dark:border-white/10 bg-white dark:bg-black">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Foundry Access</span>
                    <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-2">Lifetime Access</h2>
                    <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-slate-900 dark:text-white">$29</span>
                        <span className="text-slate-400 text-sm font-medium">/ one-time</span>
                    </div>
                    <p className="text-slate-500 text-xs mt-3 max-w-[260px] mx-auto">
                        Secure your lifetime pass to O'flock. Build infinite missions. No recurring fees.
                    </p>
                </div>

                {/* Benefits */}
                <div className="p-6 md:p-8 bg-[#F7F7F5] dark:bg-black">
                    <ul className="space-y-4 mb-8">
                        <CheckItem text="Unlimited Mission & Strategy Generations" />
                        <CheckItem text="Deep Dive Blueprint (30-Day Execution Plan)" />
                        <CheckItem text="Access to AI Build Prompts (Replit, Lovable)" />
                        <CheckItem text="Export Plans to Notion & PDF" />
                        <CheckItem text="Priority Strategy Refinement" />
                    </ul>

                    <a
                        href="https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_ffVjJ9pmP1vUPN45bNW20eRHBT6uUja5iShSz1YqVy9/redirect"
                        data-polar-checkout
                        data-polar-checkout-theme="dark"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${buttonBaseStyles} ${buttonPrimaryStyles} w-full shadow-xl shadow-slate-900/10 mb-3`}
                    >
                        Get Lifetime Access
                    </a>

                    <button
                        onClick={onClose}
                        className="w-full text-center text-xs text-slate-400 hover:text-slate-600 font-medium py-2"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
};
