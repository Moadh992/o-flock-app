import React, { useState } from 'react';
import { Button } from './Button';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubscribe: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSubscribe }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubscribeClick = () => {
        setLoading(true);
        // Simulate API call to Stripe
        setTimeout(() => {
            setLoading(false);
            onSubscribe();
        }, 1500);
    };

    const CheckItem = ({ text }: { text: string }) => (
        <li className="flex items-start gap-3">
            <div className="mt-1 w-4 h-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <span className="text-slate-600 dark:text-slate-400 text-sm leading-tight">{text}</span>
        </li>
    );

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#F7F7F5] dark:bg-slate-950 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in-up border border-slate-200 dark:border-white/10 overflow-hidden">

                {/* Header */}
                <div className="p-8 pb-6 text-center border-b border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900">
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
                <div className="p-8 bg-[#F7F7F5] dark:bg-slate-950">
                    <ul className="space-y-4 mb-8">
                        <CheckItem text="Unlimited Mission & Strategy Generations" />
                        <CheckItem text="Deep Dive Blueprint (30-Day Execution Plan)" />
                        <CheckItem text="Access to AI Build Prompts (Replit, Lovable)" />
                        <CheckItem text="Export Plans to Notion & PDF" />
                        <CheckItem text="Priority Strategy Refinement" />
                    </ul>

                    <Button
                        fullWidth
                        onClick={handleSubscribeClick}
                        disabled={loading}
                        className="shadow-xl shadow-slate-900/10 mb-3"
                    >
                        {loading ? 'Processing...' : 'Get Lifetime Access'}
                    </Button>

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
