import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', variant = 'default', children, ...props }, ref) => {
        const variants = {
            default: "bg-gray-900 border border-gray-800",
            glass: "bg-gray-900/50 backdrop-blur-sm border border-gray-800"
        };

        return (
            <div
                ref={ref}
                className={`${variants[variant]} rounded-2xl p-6 shadow-xl ${className}`}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";
