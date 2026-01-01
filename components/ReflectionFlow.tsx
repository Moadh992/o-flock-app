import React, { useState } from 'react';
import { Button } from './Button';
import { QuestionInput } from './Input';
import { Question } from '../types';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

export interface ReflectionState {
    step: 'QUESTIONS' | 'SUMMARY' | 'DECISION';
    answers: { [key: string]: string };
    comments: { [key: string]: string };
}

interface ReflectionFlowProps {
    onComplete: (decision: 'STAY' | 'REFINE' | 'PIVOT') => void;
    onCancel: () => void;
}

const QUESTIONS: Question[] = [
    {
        id: 'q1_resonance',
        type: 'select',
        text: "Did this idea truly resonate with you?",
        options: [
            { label: "Yes, deeply", value: "deeply" },
            { label: "It did… but the feeling faded", value: "faded" },
            { label: "I’m unsure", value: "unsure" },
            { label: "Honestly, not really", value: "no" }
        ]
    },
    {
        id: 'q2_action',
        type: 'select',
        text: "What did you actually do with it?",
        options: [
            { label: "I started building", value: "started" },
            { label: "I explored it mentally", value: "explored" },
            { label: "I froze", value: "froze" },
            { label: "I avoided it", value: "avoided" },
            { label: "I did nothing", value: "nothing" }
        ]
    },
    {
        id: 'q3_blocker',
        type: 'select',
        text: "Why?",
        options: [
            { label: "Fear / self-doubt", value: "fear" },
            { label: "Overwhelm / complexity", value: "overwhelm" },
            { label: "I didn’t fully believe in it", value: "disbelief" },
            { label: "Life got in the way", value: "life" },
            { label: "I don’t know", value: "unknown" }
        ]
    },
    {
        id: 'q4_feeling',
        type: 'select',
        text: "How do you feel about this direction now?",
        options: [
            { label: "Strongly motivated", value: "motivated" },
            { label: "Calmly committed", value: "committed" },
            { label: "Conflicted", value: "conflicted" },
            { label: "Emotionally distant", value: "distant" },
            { label: "Done with it", value: "done" }
        ]
    }
];

export const ReflectionFlow: React.FC<ReflectionFlowProps> = ({ onComplete, onCancel }) => {
    const [reflectionState, setReflectionState] = useState<ReflectionState>({
        step: 'QUESTIONS',
        answers: {},
        comments: {}
    });
    const [currentQIndex, setCurrentQIndex] = useState(0);

    const handleAnswer = (value: string) => {
        const questionId = QUESTIONS[currentQIndex].id;
        const newAnswers = { ...reflectionState.answers, [questionId]: value };

        setReflectionState(prev => ({ ...prev, answers: newAnswers }));

        // Auto-advance if not comment focused (handled manually usually, but here we can just wait)
        if (currentQIndex < QUESTIONS.length - 1) {
            setTimeout(() => setCurrentQIndex(prev => prev + 1), 250);
        } else {
            setTimeout(() => setReflectionState(prev => ({ ...prev, step: 'SUMMARY', answers: newAnswers })), 250);
        }
    };

    const handleComment = (value: string) => {
        const questionId = QUESTIONS[currentQIndex].id;
        setReflectionState(prev => ({
            ...prev,
            comments: { ...prev.comments, [questionId]: value }
        }));
    };

    const handleNext = () => {
        if (currentQIndex < QUESTIONS.length - 1) {
            setCurrentQIndex(prev => prev + 1);
        } else {
            setReflectionState(prev => ({ ...prev, step: 'SUMMARY' }));
        }
    };

    const handleBack = () => {
        if (currentQIndex > 0) {
            setCurrentQIndex(prev => prev - 1);
        } else {
            onCancel();
        }
    };

    const getAnalysis = () => {
        const ans = reflectionState.answers;
        // Simple heuristic analysis for MVP
        let emotional = "You approached this with good intent, but something stopped the momentum.";
        let reality = "There is a gap between your desire and your execution.";
        let meaning = "You might need to simplify before you amplify.";

        if (ans.q1_resonance === 'deeply' && ans.q4_feeling === 'motivated') {
            emotional = "You are deeply connected to this mission.";
            reality = "The friction likely comes from tactical overwhelm, not lack of vision.";
            meaning = "You are ready to build, you just need a clearer first step.";
        } else if (ans.q1_resonance === 'no' || ans.q4_feeling === 'done') {
            emotional = "Your intuition is rejecting this path.";
            reality = "Forcing this would be a waste of your life energy.";
            meaning = "Letting go is the most productive thing you can do right now.";
        } else if (ans.q3_blocker === 'fear' || ans.q3_blocker === 'overwhelm') {
            emotional = "The vision is right, but the mountain looks too high.";
            reality = "You are paralyzed by the size of the task.";
            meaning = "You need to reduce scope until fear disappears.";
        }

        return { emotional, reality, meaning };
    };

    const analysis = getAnalysis();

    if (reflectionState.step === 'QUESTIONS') {
        const q = QUESTIONS[currentQIndex];
        const progress = ((currentQIndex) / QUESTIONS.length) * 100;

        return (
            <div className="w-full flex flex-col min-h-[calc(100vh-80px)] justify-center">
                {/* Progress Fixed at Top */}
                <div className="fixed top-20 left-0 w-full z-30 bg-[#F7F7F5]/80 dark:bg-black/90 backdrop-blur-sm pt-4 pb-2 px-4 md:px-6 border-b border-transparent dark:border-white/5">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Reflection</span>
                            <span className="text-xs font-mono text-slate-400">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-900 dark:bg-white transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="animate-fade-in-up w-full max-w-4xl mx-auto px-0 md:px-4 py-8">
                    <div className="mb-8 text-center">
                        <span className="text-slate-500 dark:text-slate-400 font-bold tracking-widest text-[10px] uppercase border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-full bg-white dark:bg-black">
                            Review
                        </span>
                    </div>

                    <QuestionInput
                        question={q}
                        value={reflectionState.answers[q.id] || ''}
                        comment={reflectionState.comments[q.id] || ''}
                        onChange={handleAnswer}
                        onCommentChange={handleComment}
                        onEnter={handleNext}
                    />

                    <div className="pt-12 flex flex-col-reverse md:flex-row justify-center gap-4">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="px-6 border-transparent hover:border-slate-200 hover:bg-white w-full md:w-auto"
                        >
                            <ArrowLeftIcon /> Back
                        </Button>
                        {/* 
                          Note: We don't show a "Continue" button necessarily because Selection auto-advances, 
                          but keeping one is good for accessibility/backup or if they just type a comment.
                        */}
                        <Button
                            onClick={handleNext}
                            className="px-10 shadow-xl shadow-slate-900/10 group w-full md:w-auto"
                            disabled={!reflectionState.answers[q.id]}
                        >
                            Continue <ArrowRightIcon />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (reflectionState.step === 'SUMMARY') {
        return (
            <div className="max-w-xl mx-auto py-12 animate-fade-in space-y-8">
                <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">Analysis</span>
                    <h2 className="text-3xl font-serif text-slate-900 dark:text-white mb-2">Your Truth</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">We’ve held up the mirror. Here is what we see.</p>
                </div>

                <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl divide-y divide-slate-100 dark:divide-white/5 shadow-xl shadow-slate-200/20 dark:shadow-black/40 overflow-hidden">
                    <div className="p-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Emotional State</span>
                        <p className="text-slate-800 dark:text-slate-200 text-lg font-serif leading-relaxed">{analysis.emotional}</p>
                    </div>
                    <div className="p-6">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">Reality Check</span>
                        <p className="text-slate-800 dark:text-slate-200 text-lg font-serif leading-relaxed">{analysis.reality}</p>
                    </div>
                    <div className="p-6 bg-slate-50/50 dark:bg-white/5">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">The Prescription</span>
                        <p className="text-slate-900 dark:text-white text-lg font-serif font-medium leading-relaxed">{analysis.meaning}</p>
                    </div>
                </div>

                <Button fullWidth variant="primary" onClick={() => setReflectionState({ ...reflectionState, step: 'DECISION' })}>
                    Proceed to Decision
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-12 animate-fade-in">
            <div className="text-center mb-16">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-3">Alignment</span>
                <h2 className="text-3xl md:text-5xl font-serif text-slate-900 dark:text-white mb-4">Clarity Before Motion</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                    Do not move forward out of habit. Move forward out of conviction. Choose your path.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 px-4">
                {/* Stay */}
                <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-8 rounded-2xl hover:border-slate-300 dark:hover:border-white/30 transition-colors duration-300 flex flex-col group cursor-default">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-6 text-xl">🔥</div>
                    <h3 className="text-xl font-serif text-slate-900 dark:text-white mb-3">Stay the Course</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 flex-1 leading-relaxed">
                        This direction still aligns with your core. The friction is just "the work". We simplify. We focus. We execute.
                    </p>
                    <Button variant="primary" onClick={() => onComplete('STAY')}>Strengthen Mission</Button>
                </div>

                {/* Refine */}
                <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-8 rounded-2xl hover:border-slate-300 dark:hover:border-white/30 transition-colors duration-300 flex flex-col group cursor-default">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-6 text-xl">📐</div>
                    <h3 className="text-xl font-serif text-slate-900 dark:text-white mb-3">Refine The Mission</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 flex-1 leading-relaxed">
                        The core is right, but the shape is wrong. You’re blocked by complexity or scope. We need to adjust parameters.
                    </p>
                    <Button variant="outline" onClick={() => onComplete('REFINE')}>Refine Strategy</Button>
                </div>

                {/* Pivot */}
                <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-8 rounded-2xl hover:border-slate-300 dark:hover:border-white/30 transition-colors duration-300 flex flex-col group cursor-default">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-white/10 rounded-full flex items-center justify-center mb-6 text-xl">🧭</div>
                    <h3 className="text-xl font-serif text-slate-900 dark:text-white mb-3">Pivot With Integrity</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 flex-1 leading-relaxed">
                        This isn't your path anymore. Admitting this is strength, not weakness. We keep your profile, but reset the mission.
                    </p>
                    <Button variant="outline" onClick={() => onComplete('PIVOT')} className="bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10">New Direction</Button>
                </div>
            </div>
        </div>
    );
};
