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

interface HerosectionProps {
    newsCarouselSlot: React.ReactNode;
}

export default function Herosection({ newsCarouselSlot }: HerosectionProps) {
    
    const { isOpen, open: openContactModal, close: closeContactModal } = useModal(false); 

    const topupId = "#top-up-section"; 
    const bestsellerId = "#promo-section"; 

    const hoverButton = `bg-indigo-600 hover:bg-indigo-700 cursor-pointer px-10 py-2 rounded-md font-medium transition shadow-lg`;

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
                <div className="flex-1 items-center w-full max-w-lg px-5 mt-5 md:mt-0">
                   {newsCarouselSlot}
                </div>

            </div>
        </section>
    );
}