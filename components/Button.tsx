import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F7F7F5] disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";

  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 shadow-lg shadow-slate-900/10 focus:ring-slate-900 font-semibold",
    secondary: "bg-white text-slate-900 hover:bg-slate-50 dark:bg-zinc-900 dark:text-white dark:border-white/10 dark:hover:bg-zinc-800 focus:ring-slate-200 border border-slate-200 shadow-sm",
    outline: "border border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-900 dark:border-white/20 dark:text-slate-400 dark:hover:text-white dark:hover:border-white focus:ring-slate-900",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};