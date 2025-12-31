"use client"
import React, { useState, useEffect } from "react"
// Local Icon Definition
const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 12h14" />
        <path d="M12 5l7 7-7 7" />
    </svg>
);

interface Card {
    id: number
    contentType: 1 | 2 | 3
}

const cardData = {
    1: {
        title: "The Sovereign Interface",
        description: "AI-Native OS Design",
        // Clean high-res image
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    },
    2: {
        title: "The Foundry",
        description: "Rapid Prototyping Engine",
        image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop",
    },
    3: {
        title: "Lumos Intelligence",
        description: "Strategic Cognition Layer",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2680&auto=format&fit=crop",
    },
}

const initialCards: Card[] = [
    { id: 1, contentType: 1 },
    { id: 2, contentType: 2 },
    { id: 3, contentType: 3 },
]

function CardContent({ contentType }: { contentType: 1 | 2 | 3 }) {
    const data = cardData[contentType]

    return (
        <div className="flex h-full w-full flex-col gap-4">
            {/* Exact Image Styling from original snippet */}
            <div className="-outline-offset-1 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-xl outline outline-black/10 dark:outline-white/10">
                <img
                    src={data.image}
                    alt={data.title}
                    className="h-full w-full select-none object-cover"
                />
            </div>

            {/* Footer Content */}
            <div className="flex w-full items-center justify-between gap-2 px-3 pb-6">
                <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium text-slate-900 font-serif text-lg">{data.title}</span>
                    <span className="text-slate-500 text-sm">{data.description}</span>
                </div>
                <button className="flex h-10 shrink-0 cursor-pointer select-none items-center gap-0.5 rounded-full bg-slate-900 pl-4 pr-3 text-sm font-medium text-white transition-colors hover:bg-slate-800">
                    Read
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="square"
                    >
                        <path d="M9.5 18L15.5 12L9.5 6" />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default function AnimatedCardStack() {
    const [cards, setCards] = useState(initialCards)
    const [isAnimating, setIsAnimating] = useState(false)

    const handleAnimate = () => {
        if (isAnimating) return;
        setIsAnimating(true);

        setTimeout(() => {
            setCards((prev) => {
                const newCards = [...prev];
                const first = newCards.shift();
                if (first) newCards.push(first);
                return newCards;
            });
            setIsAnimating(false);
        }, 600);
    };

    return (
        <div className="flex w-full flex-col items-center justify-center py-12">
            {/* Container with original height */}
            <div className="relative h-[380px] w-full max-w-full flex justify-center items-center">
                {cards.map((card, index) => {
                    if (index > 2) return null;

                    // EXACT Original Dimensions: h-[280px] w-[324px] sm:w-[512px]
                    // EXACT Original Rounding: rounded-t-xl
                    // EXACT Original Padding: p-1
                    let className = "absolute transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] flex h-[280px] w-[324px] sm:w-[512px] items-center justify-center overflow-hidden rounded-t-xl border-x border-t border-slate-200 bg-white p-1 shadow-lg will-change-transform";
                    let style: React.CSSProperties = {};

                    if (index === 0) {
                        style = {
                            zIndex: 30,
                            transform: isAnimating
                                ? 'translateY(100%) scale(1)'
                                : 'translateY(12px) scale(1)',
                            opacity: isAnimating ? 0 : 1,
                            bottom: 0,
                        };
                    } else if (index === 1) {
                        style = {
                            zIndex: 20,
                            transform: isAnimating
                                ? 'translateY(12px) scale(1)'
                                : 'translateY(-16px) scale(0.95)',
                            opacity: 1,
                            bottom: 0,
                        };
                    } else if (index === 2) {
                        style = {
                            zIndex: 10,
                            transform: isAnimating
                                ? 'translateY(-16px) scale(0.95)'
                                : 'translateY(-44px) scale(0.9)',
                            opacity: 1,
                            bottom: 0,
                        }
                    }

                    return (
                        <div
                            key={card.id}
                            className={className}
                            style={style}
                        >
                            <CardContent contentType={card.contentType} />
                        </div>
                    )
                })}
            </div>

            <div className="relative z-10 -mt-px flex w-full items-center justify-center border-t border-slate-200 py-4">
                <button
                    onClick={handleAnimate}
                    className="flex h-9 cursor-pointer select-none items-center justify-center gap-1 overflow-hidden rounded-lg border border-slate-200 bg-white px-3 font-medium text-slate-600 transition-all hover:bg-slate-50 active:scale-[0.98]"
                >
                    Animate
                </button>
            </div>
        </div>
    )
}
