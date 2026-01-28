import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'warning' | 'info' | 'error' | 'default' | 'purple';
}

export const Badge = ({ className = '', variant = 'default', children, ...props }: BadgeProps) => {
    const variants = {
        success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        error: "bg-red-500/10 text-red-500 border-red-500/20",
        purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        default: "bg-gray-500/10 text-gray-400 border-gray-500/20"
    };

    return (
        <span
            className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};

export const getBadgeVariant = (status: string): BadgeProps['variant'] => {
    switch (status?.toLowerCase()) {
        case 'success': return 'success';
        case 'pending': return 'warning';
        case 'processing': return 'info';
        case 'failed': return 'error';
        default: return 'default';
    }
};
