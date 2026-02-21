import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}) => {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/10 dark:shadow-blue-900/20',
        secondary: 'bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100',
        ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
        danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/50',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs font-medium',
        md: 'px-4 py-2 text-sm font-medium',
        lg: 'px-6 py-3 text-base font-medium',
        icon: 'p-1.5 text-sm',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-md transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
};
