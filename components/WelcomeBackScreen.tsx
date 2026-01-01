import React from 'react';
import { Button } from './Button';
import { User } from '../types';

interface WelcomeBackScreenProps {
    user: User;
    onContinue: () => void;
    onReflect: () => void;
    onViewHistory: () => void;
}

export const WelcomeBackScreen: React.FC<WelcomeBackScreenProps> = ({
    user,
    onContinue,
    onReflect,
    onViewHistory
}) => {
    return (
        <div className="max-w-xl mx-auto space-y-12 animate-fade-in py-20 min-h-[70vh] flex flex-col justify-center">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-serif font-medium text-slate-900 dark:text-white tracking-tight">
                    Welcome Back, {user.name ? user.name.split(' ')[0] : 'Founder'}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
                    Let’s be honest about where you truly are.
                </p>
            </div>

            <div className="space-y-4">
                <Button
                    fullWidth
                    variant="primary"
                    onClick={onContinue}
                    className="h-14 text-base"
                >
                    Continue Your Mission
                </Button>

                <div className="space-y-2">
                    <Button
                        fullWidth
                        variant="outline"
                        onClick={onReflect}
                        className="h-14 text-base border-slate-300 dark:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5"
                    >
                        Reflect
                    </Button>
                    <p className="text-center text-xs text-slate-400 dark:text-slate-500 px-4">
                        Not here to chase new ideas.<br />
                        We’re here to understand what really happened.
                    </p>
                </div>
            </div>

            <div className="pt-8 flex justify-center">
                <button
                    onClick={onViewHistory}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><path d="M12 7v5l4 2" /></svg>
                    View History
                </button>
            </div>
        </div>
    );
};
