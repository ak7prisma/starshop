interface HeaderProps{
    no: string;
    label: string;
}

export default function TopupHeaderForm({no, label}: Readonly<HeaderProps>){
    return(
    <h3 className="text-xl font-bold mb-4 text-indigo-300 flex items-center">
        <span className="w-8 h-8 flex items-center justify-center bg-indigo-700 rounded-full text-white font-mono mr-3">{no}</span>
        <p>{label}</p>
    </h3>
    );
}