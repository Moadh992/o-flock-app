import React, { useState } from 'react';
import { ReflectionAnswers } from '../types';
import { Button } from './Button';

// Local Icons to avoid circular dependencies
const ArrowRightIcon = ({ className = "" }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
);

const CheckCircleIcon = ({ className = "" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);

interface ReflectionModeProps {
    onComplete: (answers: ReflectionAnswers) => void;
}

const QUESTIONS = [
    {
        id: 'resonance',
        title: 'Resonance',
        question: 'Does this mission still resonate with you deeply?',
        type: 'select',
        options: [
            { label: 'Yes, Deeply', value: 'deeply', description: 'It feels like my life\'s work.' },
            { label: 'Somewhat', value: 'somewhat', description: 'The direction is right, but details are fuzzy.' },
            { label: 'No / Not Anymore', value: 'no', description: 'I feel disconnected from this goal.' }
        ]
    },
    {
        id: 'action',
        title: 'Momentum',
        question: 'What concrete action have you taken in the last 7 days?',
        type: 'select',
        options: [
            { label: 'Started Building', value: 'started', description: 'Code written, content made, or outreach sent.' },
            { label: 'Planned / Researched', value: 'planned', description: 'Gathering info but no output yet.' },
            { label: 'Nothing Yet', value: 'nothing', description: 'Life got in the way.' }
        ]
    },
    {
        id: 'why',
        title: 'The Truth',
        question: 'What is the primary blocker?',
        type: 'select',
        options: [
            { label: 'None / Full Speed', value: 'none', description: 'I am moving fast.' },
            { label: 'Disbelief / Imposter Syndrome', value: 'disbelief', description: 'I simply don\'t believe I can do it.' },
            { label: 'Complexity / Overwhelm', value: 'complexity', description: 'I don\'t know where to start.' },
            { label: 'Distraction / Life', value: 'distraction', description: 'Other things are taking priority.' },
            { label: 'Skill Gap', value: 'skills', description: 'I don\'t know how to build this part.' }
        ]
    },
    {
        id: 'feeling',
        title: 'Emotional State',
        question: 'In one sentence, how does this mission make you feel right now?',
        type: 'text',
        placeholder: 'e.g. Excited but anxious about the technical side...'
    }
];

export const ReflectionModeView: React.FC<ReflectionModeProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Partial<ReflectionAnswers>>({});

    const currentQ = QUESTIONS[step];
    const isLast = step === QUESTIONS.length - 1;

    const handleSelect = (value: string) => {
        setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }));
    };

    const handleNext = () => {
        if (isLast) {
            if (isValid()) {
                onComplete(answers as ReflectionAnswers);
            }
        } else {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(prev => prev - 1);
        }
    };

    const isValid = () => {
        const val = answers[currentQ.id as keyof ReflectionAnswers];
        return val && val.trim().length > 0;
    };

    return (
        <div className="max-w-3xl mx-auto min-h-[60vh] flex flex-col justify-center py-12 animate-fade-in">
            {/* Progress */}
            <div className="fixed top-24 left-0 w-full z-30 pointer-events-none">
                <div className="max-w-6xl mx-auto px-4 md:px-6">
                    <div className="flex gap-2">
                        {QUESTIONS.map((q, idx) => (
                            <div
                                key={q.id}
                                className={`h-1 flex-1 rounded-full transition-all duration-500 ${idx <= step ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200 dark:bg-white/10'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-center mb-10">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">{currentQ.title}</span>
                <h2 className="text-2xl md:text-4xl font-serif text-slate-900 dark:text-white leading-tight">
                    {currentQ.question}
                </h2>
            </div>

            <div className="max-w-xl mx-auto w-full mb-12">
                {currentQ.type === 'select' ? (
                    <div className="grid gap-4">
                        {currentQ.options?.map((opt) => (
                            <div
                                key={opt.value}
                                onClick={() => handleSelect(opt.value)}
                                className={`group p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between ${answers[currentQ.id as keyof ReflectionAnswers] === opt.value
                                    ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white text-white dark:text-slate-900 shadow-lg'
                                    : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex flex-col">
                                    <span className={`font-bold text-lg ${answers[currentQ.id as keyof ReflectionAnswers] === opt.value ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'}`}>
                                        {opt.label}
                                    </span>
                                    <span className={`text-sm ${answers[currentQ.id as keyof ReflectionAnswers] === opt.value ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'}`}>
                                        {opt.description}
                                    </span>
                                </div>
                                {answers[currentQ.id as keyof ReflectionAnswers] === opt.value && (
                                    <CheckCircleIcon className="w-6 h-6 text-white dark:text-slate-900" />
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-900/50 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:ring-2 focus-within:ring-slate-900 dark:focus-within:ring-white transition-all shadow-sm">
                        <textarea
                            value={answers.feeling || ''}
                            onChange={handleTextChange}
                            placeholder={currentQ.placeholder}
                            className="w-full h-40 bg-transparent p-4 text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none resize-none"
                            autoFocus
                        />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-center gap-4">
                {step > 0 && (
                    <Button variant="outline" onClick={handleBack} className="w-auto px-6 border-slate-200 dark:border-slate-700">
                        <ArrowLeftIcon /> Back
                    </Button>
                )}
                <Button
                    onClick={handleNext}
                    disabled={!isValid()}
                    className="w-auto px-10 shadow-xl shadow-slate-900/10"
                >
                    {isLast ? 'Complete Reflection' : 'Continue'}
                    {!isLast && <ArrowRightIcon />}
                </Button>
            </div>
        </div>
    );
};
