"use client";

import { InputHTMLAttributes, forwardRef, useState, ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  extraLabel?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      type = "text",
      label,
      leftIcon,
      rightIcon,
      error,
      extraLabel,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPasswordType = type === "password";
    
    let passwordType = "password";
    if (showPassword) {
      passwordType = "text";
    }
    const currentType = isPasswordType 
      ? passwordType
      : type;

    return (
      <div className="w-full space-y-2">
        {(label || extraLabel) && (
          <div className="flex items-center justify-between">
            {label && (
              <label 
                htmlFor={id} 
                className="block text-sm font-medium leading-6 text-gray-100"
              >
                {label}
              </label>
            )}
            {extraLabel}
          </div>
        )}

        <div className="relative group/input">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-colors group-focus-within/input:text-blue-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={currentType}
            disabled={disabled}
            className={`
              block w-full rounded-lg border bg-gray-950 py-2.5 text-white shadow-sm transition-all
              text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 
              ${leftIcon ? "pl-10" : "pl-4"}
              ${rightIcon || isPasswordType ? "pr-10" : "pr-4"}
              ${
                error
                  ? "border-red-900/50 text-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-800 focus:border-blue-500 focus:ring-blue-500"
              }
              ${disabled ? "opacity-50 cursor-not-allowed bg-gray-900" : ""}
              ${className}
            `}
            {...props}
          />

          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {isPasswordType ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none hover:text-gray-300 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            ) : (
              rightIcon
            )}
          </div>
        </div>

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";