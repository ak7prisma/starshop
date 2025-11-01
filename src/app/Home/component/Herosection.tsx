"use client";
import Link from "next/link";
import { RiArrowDownWideLine, RiArrowLeftWideLine, RiArrowRightWideLine } from "react-icons/ri";
import { Anta } from "next/font/google";
import { useModal } from "@/hooks/useModals";
import ContactModal from "../../components/modals/ContactModal"; 

const anta = Anta({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-Anta', 
});

export default function Herosection() {
    
    const { isOpen, open: openContactModal, close: closeContactModal } = useModal(false); 

    const topupId = "#top-up-section"; 
    const bestsellerId = "#promo-section"; 

    const hoverButton = `bg-indigo-600 hover:bg-indigo-700 px-10 py-2 rounded-md font-medium transition shadow-lg`;
    const newsMenu = `h-3 w-3 focus:w-9 focus:bg-indigo-600 duration-300 bg-gray-500 rounded-full`;    

    return (
        <section className="w-full flex justify-center pt-20 md:pt-30 pb-15  min-h-screen text-white">
            
            <div className="max-w-7xl w-full flex flex-col-reverse md:flex-row items-center justify-between">
                
                {/*left-section*/}
                <div className="flex-1 max-w-lg space-y-7 text-center md:text-left">
                    
                    <h1 className={`${anta.className} ${anta.variable} md:w-5xl flex flex-col text-4xl md:text-5xl lg:text-6xl leading-tight`}>
                        <span>TOP UP</span>
                        <span className=" text-indigo-700">MURAH x TERPERCAYA</span>
                        <span>STARSHOP SOLUSINYA</span>
                    </h1>
                    
                    <p className="text-md md:text-lg text-gray-400">
                        Starshop menyediakan layanan topup game dan product digital lainnya dengan harga terjangkau dan pelayanan cepat!!
                    </p>
                    
                    <div className="flex justify-center md:justify-start space-x-15">
                        <Link href={topupId} className={hoverButton}>
                            Top Up Now
                        </Link>
                        <button 
                            onClick={openContactModal} 
                            className={hoverButton} >
                            Contact Me
                        </button>
                       <ContactModal 
                            isOpen={isOpen} 
                            onClose={closeContactModal}/>
                    </div>
                    
                    <div className="pt-10 flex flex-col items-center md:items-start md:ml-40 text-gray-400 hover:text-gray-500 duration-300">
                        <Link href={bestsellerId} className="flex flex-col items-center">
                            <span className="text-sm">Scroll Down</span>
                            <RiArrowDownWideLine size={30} className="mt-1 animate-bounce" />
                        </Link>
                    </div>
                </div>

                {/*right-section*/}
                <div className="flex-1 items-center w-full max-w-lg mt-10 md:mt-0">
                    
                    <img 
                        src="https://static0.gamerantimages.com/wordpress/wp-content/uploads/wm/2025/10/battlefield-6-cover-artwork-explosion-with-semi-transparent-steam-logo-composite-edit.jpg?w=1200&h=628&fit=crop" 
                        alt="news" 
                        className="h-55 md:h-100 w-full mb-10 mx-auto bg-indigo-700 bg-fixed rounded-none md:rounded-lg shadow-2xl text-white"/>

                    <div className="flex justify-center items-center space-x-3 mb-6">
                        <button className="text-slate-500 hover:text-slate-600 duration-300">
                            <RiArrowLeftWideLine size={35} />
                        </button>
                        
                        <div className="flex space-x-2">
                            <button className={newsMenu}></button>
                            <button className={newsMenu}></button>
                            <button className={newsMenu}></button>
                            <button className={newsMenu}></button>
                        </div>

                        <button className="text-slate-500 hover:text-slate-600 duration-300">
                            <RiArrowRightWideLine size={35} />
                        </button>
                    </div>

                </div>

            </div>
        </section>
    );
}