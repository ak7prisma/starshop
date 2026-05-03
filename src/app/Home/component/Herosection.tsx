"use client";
import Link from "next/link";
import { RiArrowDownWideLine } from "react-icons/ri";
import { Anta } from "next/font/google";
import { useModal } from "@/hooks/useModals";
import ContactModal from "@/components/modals/ContactModal";
import { motion } from "framer-motion";
import { fadeIn, staggerContainer } from "@/components/animations/variants";

const anta = Anta({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-Anta',
});

interface HerosectionProps {
    newsCarouselSlot: React.ReactNode;
}

export default function Herosection({ newsCarouselSlot }: HerosectionProps) {

    const { isOpen: isModalOpen, open, close } = useModal();

    const topupId = "#top-up-section";
    const bestsellerId = "#promo-section";

    const hoverButton = `bg-indigo-600 hover:bg-indigo-700 cursor-pointer px-10 py-2 rounded-md font-medium transition shadow-lg`;

    return (
        <section className="w-full flex justify-center pt-25 md:pt-30 pb-15 px-4 md:px-0 min-h-screen text-white">

            <div className="max-w-7xl w-full flex flex-col-reverse md:flex-row items-center justify-between">

                <motion.div
                    variants={staggerContainer(0.2, 0.1)}
                    initial="hidden"
                    animate="show"
                    className="flex-1 max-w-lg space-y-7 text-center md:text-left"
                >

                    <motion.h1
                        variants={fadeIn('up', 0.2)}
                        className={`${anta.className} ${anta.variable} flex flex-col text-3xl md:text-5xl lg:text-6xl leading-tight `}
                    >
                        <span>TOP UP</span>
                        <span className=" text-indigo-700 md:whitespace-nowrap">MURAH x TERPERCAYA</span>
                        <span>STARSHOP SOLUSINYA</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeIn('up', 0.4)}
                        className="text-md md:text-lg text-gray-400"
                    >
                        Starshop menyediakan layanan topup game dan product digital lainnya dengan harga terjangkau dan pelayanan cepat!!
                    </motion.p>

                    <motion.div
                        variants={fadeIn('up', 0.6)}
                        className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6"
                    >
                        <Link href={topupId} className={hoverButton}>
                            Top Up Now
                        </Link>
                        <button
                            onClick={open}
                            className={hoverButton} >
                            Contact Me
                        </button>
                        <ContactModal
                            isOpen={isModalOpen}
                            onClose={close}
                        />
                    </motion.div>

                    <motion.div
                        variants={fadeIn('up', 0.8)}
                        className="pt-10 flex flex-col items-center md:items-start md:ml-40 text-gray-400 hover:text-gray-500 duration-300"
                    >
                        <Link href={bestsellerId} className="flex flex-col items-center">
                            <span className="text-sm">Scroll Down</span>
                            <RiArrowDownWideLine size={30} className="mt-1 animate-bounce" />
                        </Link>
                    </motion.div>
                </motion.div>

                <motion.div
                    variants={fadeIn('left', 0.5)}
                    initial="hidden"
                    animate="show"
                    className="flex-1 items-center w-full max-w-lg px-5 mt-5 md:mt-0"
                >
                    {newsCarouselSlot}
                </motion.div>

            </div>
        </section>
    );
}