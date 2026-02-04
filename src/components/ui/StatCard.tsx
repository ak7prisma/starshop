import { ComponentType } from 'react';
import { Card } from './Card';

interface StatCardProps {
    title: string;
    value: string | number;
    trend: string;
    isPositive: boolean;
    icon: ComponentType<{ size?: number | string; className?: string }>;
    color: 'blue' | 'yellow' | 'green' | 'purple';
    isRestricted?: boolean;
    isLive?: boolean;
}

export const StatCard = ({
    title,
    value,
    trend,
    isPositive,
    icon: Icon,
    color,
    isRestricted = false,
    isLive = true,
}: StatCardProps) => {

    const colorStyles = {
        blue: 'bg-blue-500/10 text-blue-500',
        yellow: 'bg-amber-500/10 text-amber-500',
        green: 'bg-emerald-500/10 text-emerald-500',
        purple: 'bg-purple-500/10 text-purple-500',
    };

    return (
        <Card className="hover:border-gray-700 transition-all duration-300 group relative overflow-hidden h-full">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
                    <Icon size={24} />
                </div>

                {isLive && !isRestricted && (
                    <div className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-gray-800 text-gray-400">
                        <span>Live</span>
                    </div>
                )}
            </div>

            <h3 className={`text-2xl font-bold mb-1 tracking-tight ${isRestricted ? "text-gray-600 blur-[2px] select-none" : "text-white"
                }`}>
                {value}
            </h3>

            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-xs mt-3 border-t border-gray-800 pt-3 text-gray-500">
                {trend}
            </p>
        </Card>
    );
};
