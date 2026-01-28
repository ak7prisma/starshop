import Link from "next/link";

interface ButtonProps {
    href: string;
    label: string;
    extraclass?: string;
    rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export default function ButtonLinkPrimary({ href, label, rounded, extraclass} : Readonly<ButtonProps>) {
    return(
        <Link 
            href={href} 
            className={`inline-flex items-center justify-center ${extraclass} border border-transparent text-base font-medium rounded-${rounded} text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30`}
        >
            {label}
        </Link>
    );
}