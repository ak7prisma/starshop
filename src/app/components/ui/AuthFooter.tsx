import Link from "next/link";

export default function FormFooter({label1,label2,linkroute}:any){
    return(
        <p className="mt-10 text-center text-sm/6 text-gray-400">
            {label1}{' '}
            <Link href={linkroute} className="font-semibold text-indigo-400 hover:text-indigo-300">
              {label2}
            </Link>
          </p>
    );
}