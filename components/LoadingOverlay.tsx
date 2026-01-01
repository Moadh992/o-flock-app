import React, { useEffect, useState } from 'react';

interface LoadingOverlayProps {
  message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-slate-100 dark:border-white/5 rounded-full animate-spin-slow absolute top-0 left-0"></div>
        <div className="w-16 h-16 border-t-2 border-slate-900 dark:border-white rounded-full animate-spin"></div>
      </div>
      <h3 className="mt-8 text-2xl font-serif text-slate-900 dark:text-white tracking-wide text-center">
        {message}{dots}
      </h3>
      <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm text-center max-w-sm">
        Synthesizing high-leverage outcomes. Our engines are mapping your drive to market opportunity.
      </p>
    </div>
  );
};