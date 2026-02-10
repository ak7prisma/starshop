import Link from "next/link";
import React from "react";

interface FormFooterProps{
  label1: string;
  label2: string;
  linkroute: string;
  children?: React.ReactNode
}

export default function FormFooter({label1, label2, linkroute, children}: Readonly<FormFooterProps>){
    return(
      <div className="flex flex-col items-center mt-5 gap-5">
        {children}
        <p className="text-center text-sm/6 text-gray-400">
            {label1}{' '}
            <Link href={linkroute} className="font-semibold text-indigo-400 hover:text-indigo-300">
              {label2}
            </Link>
        </p>
      </div>
        
    );
}