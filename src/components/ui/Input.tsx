import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', leftIcon, rightIcon, error, disabled, ...props }, ref) => {
        return (
            <div className="w-full">
                <div className="relative group/input">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-colors group-focus-within/input:text-blue-500">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        disabled={disabled}
                        className={`
              w-full bg-gray-950 border text-white rounded-lg text-sm focus:outline-none focus:ring-1 transition-all placeholder:text-gray-600
              ${leftIcon ? 'pl-10' : 'pl-4'}
              ${rightIcon ? 'pr-10' : 'pr-4'}
              ${error
                                ? 'border-red-900/50 text-red-400 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-800 focus:border-blue-500 focus:ring-blue-500'
                            }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${className}
            `}
                        {...props}
                    />

                    {rightIcon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1 text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
