import React from 'react';
import { HoverLinkPreview } from './HoverLinkPreview';

export const LumosWidget = () => (
    <HoverLinkPreview
        href="https://www.lumosmagency.com/"
        previewImage="https://i.ibb.co/3y7KpQXq/image.png"
        imageAlt="Lumos Systems Agency"
        className="fixed bottom-6 right-6 z-50 animate-fade-in hidden md:block no-underline"
    >
        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-white/5 rounded-full p-1.5 pr-5 flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
                <img
                    src="https://cm4-production-assets.s3.amazonaws.com/1767082639160-studio__1_-removebg-preview.png"
                    alt="Lumos Logo"
                    className="w-6 h-6 object-contain"
                />
            </div>
            <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold leading-none">Backed By</span>
                <span className="text-sm font-serif font-bold text-slate-900 dark:text-white leading-none mt-1 group-hover:text-black dark:group-hover:text-white transition-colors">Lumos Systems</span>
            </div>
        </div>
    </HoverLinkPreview>
);
