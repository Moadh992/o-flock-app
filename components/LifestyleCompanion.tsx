import React from 'react';
import { Button } from './Button';

interface LifestyleCompanionProps {
    onClose: () => void;
}

export const LifestyleCompanion: React.FC<LifestyleCompanionProps> = ({ onClose }) => {
    return (
        <div className="max-w-xl mx-auto py-20 animate-fade-in text-center space-y-12">
            <div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-2">Weekly Check-In</span>
                <h2 className="text-3xl font-serif text-slate-900 dark:text-white">Discipline. Honesty. Motion.</h2>
            </div>

            <div className="grid gap-4 max-w-sm mx-auto">
                <Button
                    variant="outline"
                    onClick={() => { alert("Keep going. Consistency compounds."); onClose(); }}
                    className="justify-start px-6 h-14"
                >
                    🚀 I made progress
                </Button>
                <Button
                    variant="outline"
                    onClick={() => { alert("Stalling is part of the process. Break it down."); onClose(); }}
                    className="justify-start px-6 h-14"
                >
                    ⏸ I stalled
                </Button>
                <Button
                    variant="outline"
                    onClick={() => { alert("Being lost means you're navigating new territory."); onClose(); }}
                    className="justify-start px-6 h-14"
                >
                    🗺 I’m lost
                </Button>
                <Button
                    variant="outline"
                    onClick={() => { alert("Reconsideration is healthy. Don't be rash."); onClose(); }}
                    className="justify-start px-6 h-14 text-red-500"
                >
                    ⚠️ I’m reconsidering everything
                </Button>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-white/5 max-w-xs mx-auto">
                <p className="text-xs text-slate-400 leading-relaxed">
                    O’Flock stays with you.<br />
                    Not to hype you… but to keep you grounded, capable, and honest.
                </p>
                <button onClick={onClose} className="mt-8 text-xs font-bold text-slate-300 hover:text-slate-500">
                    SKIP FOR NOW
                </button>
            </div>
        </div>
    );
};
