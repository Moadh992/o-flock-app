import React from 'react';
import { User, SavedBlueprint } from '../types';
import { Button } from './Button';

interface UserHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    history: SavedBlueprint[];
    usageCount: number;
    onSelect: (item: SavedBlueprint) => void;
    onLogout: () => void;
    onReset: () => void;
    onUpgrade: () => void;
    onNewMission: () => void;
}

export const UserHistoryModal: React.FC<UserHistoryModalProps> = ({
    isOpen,
    onClose,
    user,
    history,
    usageCount,
    onSelect,
    onLogout,
    onReset,
    onUpgrade,
    onNewMission
}) => {
    if (!isOpen) return null;

    const FREE_LIMIT = 5;
    const isPro = user.plan === 'pro';
    const remaining = Math.max(0, FREE_LIMIT - usageCount);
    const percentageUsed = Math.min(100, (usageCount / FREE_LIMIT) * 100);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#F7F7F5] dark:bg-black rounded-2xl shadow-2xl w-full max-w-2xl animate-fade-in-up border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-black flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold text-lg">
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-serif text-slate-900 dark:text-white leading-none">{user.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Founder Space</span>
                                {isPro && <span className="bg-slate-900 dark:bg-white text-white dark:text-black text-[9px] font-bold px-1.5 py-0.5 rounded">LIFETIME</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={onNewMission} className="py-2 px-4 shadow-none border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/30 hidden md:flex text-xs h-9">
                            + New Mission
                        </Button>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                        </button>
                    </div>
                </div>

                {/* Usage Stats (Only for free users) */}
                {!isPro && (
                    <div className="p-6 bg-slate-50 dark:bg-black border-b border-slate-200 dark:border-white/10">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Free Plan Usage</span>
                            <span className="text-xs font-mono text-slate-900 dark:text-white font-bold">{usageCount} / {FREE_LIMIT} Blueprints</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden mb-4">
                            <div
                                className={`h-full transition-all duration-500 ease-out ${percentageUsed >= 100 ? 'bg-red-500' : 'bg-slate-900 dark:bg-white'}`}
                                style={{ width: `${percentageUsed}%` }}
                            ></div>
                        </div>
                        {usageCount >= FREE_LIMIT ? (
                            <div className="flex items-center justify-between bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-3 rounded-lg">
                                <span className="text-sm text-slate-600 dark:text-slate-400">You have reached your limit.</span>
                                <Button variant="primary" onClick={onUpgrade} className="py-1.5 px-4 text-xs h-auto">Get Lifetime Access</Button>
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400">
                                You have {remaining} free blueprints remaining.
                            </p>
                        )}
                    </div>
                )}

                {/* History List */}
                <div className="flex-1 overflow-y-auto p-6">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Generated Missions</h3>
                    {history.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl">
                            <p className="text-slate-400 text-sm">No missions generated yet.</p>
                            <Button onClick={onNewMission} className="mt-4">Start First Mission</Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        onSelect(item);
                                        onClose();
                                    }}
                                    className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-4 rounded-xl hover:border-slate-400 dark:hover:border-white/30 cursor-pointer transition-all group flex items-center justify-between"
                                >
                                    <div>
                                        <h4 className="font-serif text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                            {item.mission.title}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-sm">
                                            {item.mission.coreConcept}
                                        </p>
                                        <span className="text-[10px] text-slate-400 mt-2 block">
                                            {new Date(item.timestamp).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-black flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onLogout}
                            className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors px-2"
                        >
                            Sign Out
                        </button>
                    </div>
                    {!isPro && (
                        <button
                            onClick={onUpgrade}
                            className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            Get Lifetime Access
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
