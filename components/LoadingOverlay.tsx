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
    <div className="fixed inset-0 z-50 bg-[#F7F7F5]/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-slate-200 rounded-full animate-spin-slow absolute top-0 left-0"></div>
        <div className="w-16 h-16 border-t-2 border-slate-900 rounded-full animate-spin"></div>
      </div>
      <h3 className="mt-8 text-2xl font-serif text-slate-900 tracking-wide text-center">
        {message}{dots}
      </h3>
      <p className="mt-2 text-slate-500 text-sm text-center max-w-md">
        Deep thinking requires time. Our systems are analyzing complex patterns in your psyche.
      </p>
    </div>
  );
};