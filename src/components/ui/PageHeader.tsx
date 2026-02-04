import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    extra?: ReactNode;
    userRole?: string;
    greeting?: string;
}

export const PageHeader = ({ title, subtitle, extra, userRole, greeting }: PageHeaderProps) => {
    return (
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
            <div>
                {greeting && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1 font-medium">
                        <span>{new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                )}
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    {greeting ? `${greeting}, ` : ''}{title}
                </h1>
                {subtitle && <p className="text-gray-400 mt-1 text-sm">{subtitle}</p>}
            </div>
            {extra && (
                <div>
                    {extra}
                </div>
            )}
        </div>
    );
};
