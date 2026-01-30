import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Shield, ChevronRight, Play, Star, Check, X } from 'lucide-react';
import { LumosWidget } from './LumosWidget';

interface LandingProps {
    onStart: () => void;
    onLogin: () => void;
}

const Button: React.FC<{ children: React.ReactNode; onClick?: () => void; className?: string; variant?: 'primary' | 'secondary' }> = ({ children, onClick, className = '', variant = 'primary' }) => {
    return (
        <button
            onClick={onClick}
            className={`relative px-8 py-4 rounded-full font-bold text-lg overflow-hidden group ${variant === 'primary' ? 'bg-white text-black' : 'bg-white/10 text-white backdrop-blur-md border border-white/20'
                } ${className}`}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
        </button>
    );
};

const FeatureCard: React.FC<{ title?: string; description?: string; icon?: React.ReactNode; delay: number; className?: string; children?: React.ReactNode }> = ({ title, description, icon, delay, className = "", children }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleMouseMove}
            className={`group relative rounded-[2rem] bg-zinc-900/50 border border-white/10 p-8 overflow-hidden hover:border-white/20 transition-colors ${className}`}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.1),
              transparent 80%
            )
          `,
                }}
            />
            {children ? children : (
                <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500">
                        {icon}
                    </div>
                    <h3 className="text-2xl font-serif text-white mb-3">{title}</h3>
                    <p className="text-zinc-400 leading-relaxed font-light">{description}</p>
                </div>
            )}
        </motion.div>
    );
};

const VideoModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm"
                    />
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 pointer-events-auto"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 group">
                                <div className="text-center">
                                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Play className="w-8 h-8 text-white fill-current" />
                                    </div>
                                    <p className="text-zinc-500 font-medium">Demo Video Placeholder</p>
                                </div>
                                {/* <iframe
                                    src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
                                    title="Product Demo"
                                    className="w-full h-full absolute inset-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                /> */}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

const CursorIcon = () => (
    <svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 466.73 532.09" className="w-5 h-5 fill-zinc-500 group-hover:fill-zinc-300 transition-colors">
        <path d="M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06-1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z" />
    </svg>
);

const WindsurfIcon = () => (
    <svg viewBox="0 0 1024 1024" className="w-5 h-5 fill-zinc-500 group-hover:fill-zinc-300 transition-colors" xmlns="http://www.w3.org/2000/svg">
        <path d="M897.246 286.869H889.819C850.735 286.808 819.017 318.46 819.017 357.539V515.589C819.017 547.15 792.93 572.716 761.882 572.716C743.436 572.716 725.02 563.433 714.093 547.85L552.673 317.304C539.28 298.16 517.486 286.747 493.895 286.747C457.094 286.747 423.976 318.034 423.976 356.657V515.619C423.976 547.181 398.103 572.746 366.842 572.746C348.335 572.746 329.949 563.463 319.021 547.881L138.395 289.882C134.316 284.038 125.154 286.93 125.154 294.052V431.892C125.154 438.862 127.285 445.619 131.272 451.34L309.037 705.2C319.539 720.204 335.033 731.344 352.9 735.392C397.616 745.557 438.77 711.135 438.77 667.278V508.406C438.77 476.845 464.339 451.279 495.904 451.279H495.995C515.02 451.279 532.857 460.562 543.785 476.145L705.235 706.661C718.659 725.835 739.327 737.218 763.983 737.218C801.606 737.218 833.841 705.9 833.841 667.308V508.376C833.841 476.815 859.41 451.249 890.975 451.249H890.975C890.975 451.249 890.975 451.249 890.975 451.249H897.276C901.233 451.249 904.43 448.053 904.43 444.097V294.021C904.43 290.065 901.233 286.869 897.276 286.869H897.246Z" />
    </svg>
);

const ClaudeIcon = () => (
    <img
        src="https://img.logo.dev/anthropic.com?token=pk_YBlqx6vUR_mo5wCxEWUzXw"
        alt="Claude"
        className="w-5 h-5 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
    />
);

const ZedIcon = () => (
    <img
        src="https://img.logo.dev/zed.dev?token=pk_YBlqx6vUR_mo5wCxEWUzXw"
        alt="Zed"
        className="w-5 h-5 object-contain opacity-60 group-hover:opacity-100 transition-opacity"
    />
);

const EngineeringStack: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-3"
        >
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Engineering Integration</span>
            <div className="flex items-center gap-6">
                <div className="group flex items-center gap-2" title="Claude">
                    <ClaudeIcon />
                    <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors">Claude</span>
                </div>
                <div className="group flex items-center gap-2" title="Zed IDE">
                    <ZedIcon />
                    <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors">Zed IDE</span>
                </div>
                <div className="group flex items-center gap-2" title="Cursor">
                    <CursorIcon />
                    <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors">Cursor</span>
                </div>
                <div className="group flex items-center gap-2" title="Windsurf">
                    <WindsurfIcon />
                    <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-400 transition-colors">Windsurf</span>
                </div>
            </div>
        </motion.div>
    );
};

const ideas = [
    {
        title: "The Community Architect",
        description: "Monetize your high empathy. Build a private, paid community for burnt-out executives seeking connection.",
        tags: ["B2C", "Community", "High Ticket"],
        gradient: "from-orange-500 to-red-500"
    },
    {
        title: "The Niche Solo-SaaS",
        description: "Leverage your analytical depth. Build a specialized data tool for compliance officers. Zero churn, high LTV.",
        tags: ["B2B", "SaaS", "Low Touch"],
        gradient: "from-blue-500 to-indigo-500"
    },
    {
        title: "The Content Engine",
        description: "Utilize your flow state for writing. A productized newsletter service for technical founders who hate marketing.",
        tags: ["Service", "Content", "Scalable"],
        gradient: "from-purple-500 to-pink-500"
    }
];

const IdeaSpinner: React.FC = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % ideas.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full max-w-md mx-auto h-[400px] perspective-1000">
            <AnimatePresence mode="popLayout">
                {ideas.map((idea, i) => {
                    if (i === index) {
                        return (
                            <motion.div
                                layoutId="card"
                                key={idea.title}
                                initial={{ opacity: 0, scale: 0.8, z: -100, y: -50 }}
                                animate={{ opacity: 1, scale: 1, z: 0, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, z: -100, y: 50, rotateX: -20 }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute inset-0 bg-zinc-900 border border-white/10 rounded-[2rem] p-8 flex flex-col justify-between shadow-2xl origin-bottom"
                                style={{ zIndex: 10 }}
                            >
                                <div>
                                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 bg-gradient-to-r ${idea.gradient} text-white`}>
                                        Generated Blueprint
                                    </div>
                                    <h3 className="text-3xl font-serif text-white mb-4">{idea.title}</h3>
                                    <p className="text-zinc-400 text-lg leading-relaxed">{idea.description}</p>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {idea.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10 overflow-hidden rounded-b-[2rem]">
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 4, ease: "linear" }}
                                        className={`h-full bg-gradient-to-r ${idea.gradient}`}
                                    />
                                </div>
                            </motion.div>
                        );
                    }
                    return null;
                })}
            </AnimatePresence>
            {/* Background "Stack" Effect */}
            <div className="absolute inset-0 bg-zinc-800/50 rounded-[2rem] transform scale-95 translate-y-4 -z-10 border border-white/5"></div>
            <div className="absolute inset-0 bg-zinc-800/30 rounded-[2rem] transform scale-90 translate-y-8 -z-20 border border-white/5"></div>
        </div>
    );
};

export const ProductHuntLanding: React.FC<LandingProps> = ({ onStart, onLogin }) => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-500 selection:text-black overflow-x-hidden">

            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] left-[30%] w-[60%] h-[60%] rounded-full bg-orange-900/5 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* Navbar */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="fixed top-0 w-full z-50 px-6 py-6"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="font-serif font-bold text-2xl tracking-tighter">O'flock</span>
                        <span className="hidden md:flex flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
                            Alpha
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* The "Get Started" button is kept as there is no "SignIn" button in the original code. */}
                        <button onClick={onStart} className="px-5 py-2 rounded-full bg-white text-black font-bold text-sm">Get Started</button>
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <main className="relative z-10 pt-24 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center">



                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="text-6xl md:text-8xl lg:text-9xl font-serif font-medium tracking-tight leading-[0.9] mb-8"
                    >
                        Founders are <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">born, not made.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12 font-light [text-wrap:balance]"
                    >
                        Stop following generic advice. O'flock decodes your
                        <span className="text-white font-medium"> psychological architecture </span>
                        to build the startup only you can run.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    >
                        <Button onClick={onStart}>
                            Analyze My Profile <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" onClick={() => setIsVideoOpen(true)}>
                            <Play className="w-4 h-4 fill-current" /> See How It Works
                        </Button>
                    </motion.div>

                    <EngineeringStack />



                </div>
            </main>

            {/* Bento Grid */}
            <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">

                    <FeatureCard
                        title="Cognitive Analysis"
                        description="We map your Big 5 Traits, risk tolerance, and flow states against 10,000+ successful founder profiles."
                        icon={<Zap className="w-6 h-6" />}
                        delay={0.2}
                        className="md:col-span-2 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center !p-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-8 flex flex-col justify-end">
                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6 text-white">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-3xl font-serif text-white mb-3">Cognitive Architecture</h3>
                                <p className="text-zinc-300 text-lg">Deep-dive psychometrics that reveal your unfair advantages.</p>
                            </div>
                        </div>
                    </FeatureCard>

                    <FeatureCard
                        title="Execution Sync"
                        description="Your roadmap lives here. Check off tasks, track progress, and sync across all your devices in real-time."
                        icon={<Shield className="w-6 h-6" />}
                        delay={0.4}
                        className="bg-zinc-900"
                    />

                    <FeatureCard
                        title="Idea Validation"
                        description="Test your assumptions before writing code. We generate validation experiments tailored to your market."
                        icon={<Check className="w-6 h-6" />}
                        delay={0.6}
                        className="bg-zinc-900"
                    />
                </div>
            </section>

            {/* Philosophy / The Problem */}
            <section className="relative z-10 px-6 py-32 max-w-5xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-24"
                >
                    <h2 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-6">The Truth</h2>
                    <h3 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-[1.1]">
                        Most startups die because the founder is fighting their own nature.
                    </h3>
                    <p className="text-xl md:text-2xl text-zinc-400 font-light leading-relaxed max-w-3xl mx-auto">
                        You're trying to be Steve Jobs when you're built like Wozniak.
                        You're forcing sales when your genius is product.
                        <span className="text-white block mt-6 font-medium">O'flock aligns your business model with your biological wiring.</span>
                    </p>
                </motion.div>

                {/* Live Stats Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8 border-y border-white/5 py-16">
                    {[
                        { label: "Founders Analyzed", value: "12,403" },
                        { label: "Completion Rate", value: "94%" },
                        { label: "Matches Found", value: "8,921" },
                        { label: "Venture Backed", value: "32%" }
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className="text-4xl md:text-5xl font-serif text-white mb-2">{stat.value}</div>
                            <div className="text-xs font-bold uppercase tracking-widest text-zinc-500">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Generated Ideas Spinner */}
            <section className="relative z-10 px-6 py-32 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h2 className="text-sm font-bold uppercase tracking-widest text-purple-500 mb-6">The Output</h2>
                    <h3 className="text-4xl md:text-6xl font-serif text-white mb-8 leading-[1.1]">
                        Ideas that fit you like a glove.
                    </h3>
                    <p className="text-xl text-zinc-400 font-light leading-relaxed mb-8">
                        We don't just tell you "who you are." We generate concrete, execution-ready business models matched to your unique psychological signature.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 text-zinc-300">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span>Low Burn</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-300">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>High Leverage</span>
                        </div>
                    </div>
                </motion.div>
                <div className="relative">
                    <IdeaSpinner />
                </div>
            </section>

            {/* How It Works */}
            <section className="relative z-10 px-6 py-32 bg-zinc-900/20 border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20 md:text-center">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-500 mb-3">The Process</h2>
                        <h3 className="text-4xl md:text-5xl font-serif text-white">Three steps to clarity.</h3>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16">
                        {[
                            {
                                step: "01",
                                title: "Analyze",
                                desc: "Take our deep-dive psychometric assessment. It takes 7 minutes but saves 7 years of wrong turns."
                            },
                            {
                                step: "02",
                                title: "Align",
                                desc: "We generate a custom Founder Blueprint. Your strengths, your blindspots, and the exact business models that fit you."
                            },
                            {
                                step: "03",
                                title: "Execute",
                                desc: "Get a daily roadmap tailored to your flow state. No more burnout. Just high-leverage action."
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                                className="relative group"
                            >
                                <div className="text-7xl font-serif text-white/5 font-bold mb-6 group-hover:text-white/10 transition-colors">{item.step}</div>
                                <h4 className="text-2xl font-bold text-white mb-4">{item.title}</h4>
                                <p className="text-lg text-zinc-400 leading-relaxed font-light">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative z-10 px-6 py-32 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto relative rounded-[3rem] bg-zinc-900 border border-white/10 p-12 md:p-24 overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 blur-[100px] rounded-full mix-blend-screen"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full mix-blend-screen"></div>

                    <div className="relative z-10">
                        <h3 className="text-4xl md:text-6xl font-serif text-white mb-8">Ready to find your flock?</h3>
                        <p className="text-zinc-400 text-xl mb-12 max-w-2xl mx-auto">
                            Join thousands of founders building businesses that feel like play.
                            Start your free analysis today.
                        </p>
                        <button onClick={onStart} className="px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:shadow-2xl hover:shadow-white/20 transition-all transform hover:-translate-y-1">
                            Start Your Journey
                        </button>
                    </div>

                    {/* Decorative Circles */}
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border border-white/20 text-white/5 flex items-center justify-center animate-[spin_10s_linear_infinite]">
                        <div className="w-60 h-60 rounded-full border border-current text-white/5 flex items-center justify-center">
                            <div className="w-40 h-40 rounded-full border border-current"></div>
                        </div>
                    </div>
                </motion.div>
            </section>

            <LumosWidget />
            <footer className="relative z-10 py-12 border-t border-white/5 bg-black">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-zinc-600 text-sm">© {new Date().getFullYear()} O'flock. Backed by Lumos Systems.</p>
                </div>
            </footer>

            <style>{`
        .faded-edges {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
            <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
        </div>
    );
};
