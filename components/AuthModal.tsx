import React, { useState } from 'react';
import { Button } from './Button';
import { supabase } from '../services/supabaseClient';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'default' | 'email' | 'success'>('default');
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });
            if (error) throw error;
            // Redirect happens automatically
        } catch (err: any) {
            console.error("Google Login Error:", err);
            // Check for the specific Supabase error regarding missing providers
            if (err.message && (err.message.includes('provider is not enabled') || err.code === 'validation_failed')) {
                setError("Google Login is not enabled in your Supabase project. Please enable it in the Authentication > Providers dashboard.");
            } else {
                console.error("Supabase Auth Error:", err);
                setError(err.message || "Failed to login with Google");
            }
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: window.location.origin,
                },
            });
            if (error) throw error;
            setView('success');
        } catch (err: any) {
            setError(err.message || "Failed to send magic link");
            setLoading(false);
        }
    };



    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xl transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-black rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 animate-fade-in-up border border-zinc-100 dark:border-white/10 overflow-hidden max-h-[85vh] overflow-y-auto md:overflow-hidden md:max-h-none">

                {/* Decorative Top Gradient */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-900 to-transparent dark:via-white/50"></div>

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-900 dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                    </div>
                    <h2 className="text-2xl font-serif text-zinc-900 dark:text-white mb-2">Save your Mission</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                        Secure your blueprint in your personal Founder Space. <br />Return to it anytime.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 text-red-600 text-xs p-3 rounded-lg text-center border border-red-100 leading-relaxed">
                        {error}
                    </div>
                )}

                {view === 'success' ? (
                    <div className="text-center animate-fade-in space-y-4">
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100">
                            <p className="font-bold mb-1">Check your email</p>
                            <p className="text-sm">We sent a magic link to <span className="font-semibold">{email}</span></p>
                        </div>
                        <p className="text-xs text-zinc-400">Click the link in your email to sign in.</p>
                        <button
                            onClick={onClose}
                            className="w-full text-center text-xs text-zinc-500 hover:text-zinc-900 font-medium py-2"
                        >
                            Close
                        </button>
                    </div>
                ) : view === 'default' ? (
                    <div className="space-y-3">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-white font-medium py-3 rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-slate-200 dark:border-white/20 border-t-slate-900 dark:border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z" fill="#EA4335" /></svg>
                                    <span>Continue with Google</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => setView('email')}
                            className="w-full flex items-center justify-center gap-3 bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-medium py-3 rounded-xl transition-all shadow-lg shadow-zinc-900/20 active:scale-[0.98]"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            <span>Continue with Email</span>
                        </button>


                    </div>
                ) : (
                    <form onSubmit={handleEmailLogin} className="space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-xs font-bold uppercase text-zinc-400 mb-1.5 ml-1">Work Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-xl p-3 text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white focus:bg-white dark:focus:bg-black transition-all"
                                placeholder="founder@venture.com"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-3">
                            <Button
                                fullWidth
                                disabled={loading}
                                className="shadow-lg shadow-zinc-900/10"
                            >
                                {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
                            </Button>
                            <button
                                type="button"
                                onClick={() => setView('default')}
                                className="w-full text-center text-xs text-zinc-500 hover:text-zinc-900 font-medium py-2"
                            >
                                Go back
                            </button>
                        </div>
                    </form>
                )}

                <div className="mt-8 pt-6 border-t border-zinc-100 text-center">
                    <p className="text-[10px] text-zinc-400 leading-relaxed">
                        By continuing, you acknowledge that O'flock uses Supabase for secure authentication.
                        Your intellectual property remains yours.
                    </p>
                </div>
            </div>
        </div>
    );
};