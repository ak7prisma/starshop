"use client";

import { forwardRef, ReactNode } from "react";
import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';
interface TextareaProps extends TextareaAutosizeProps {
  label?: string;
  error?: string;
  extraLabel?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className = "",
      label,
      error,
      extraLabel,
      disabled,
      id,
      minRows = 3, 
      ...props
    },
    ref
  ) => {
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
          <TextareaAutosize
            ref={ref}
            id={id}
            disabled={disabled}
            minRows={minRows}
            className={`
              block w-full rounded-lg border bg-slate-950 px-4 py-2.5 text-white shadow-sm transition-all
              text-sm placeholder:text-gray-600 focus:outline-none focus:ring-1 resize-none
              ${
                error
                  ? "border-red-900/50 text-red-400 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-800 focus:border-indigo-500 focus:ring-indigo-500"
              }
              ${disabled ? "opacity-50 cursor-not-allowed bg-gray-900" : ""}
              ${className}
            `}
            {...props}
          />
        </div>

        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";