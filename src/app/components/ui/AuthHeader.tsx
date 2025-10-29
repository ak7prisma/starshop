export default function FormHeader({label1,label2}:any){

    return(
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
                alt="starshop"
                src="/favicon.ico"
                className="mx-auto w-15 h-15 md:h-18 md:w-18"/>
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
                {label1}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
                {label2}
            </p>
        </div>
    );
}