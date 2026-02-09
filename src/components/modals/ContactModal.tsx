"use client";
import { contactModalData } from "@/constant/socialdata";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { X } from "lucide-react";
import Link from "next/link";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: Readonly<ContactModalProps>) {

  const contactItemStyle = "flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-900/80 transition duration-300 cursor-pointer group";
  
  return (
    <Modal 
      show={isOpen} 
      position="center" 
      popup 
      theme={{
        content: {
          base: "relative w-full h-auto flex justify-center items-center",
          inner: "relative rounded-lg shadow-xl flex flex-col w-full md:w-[35rem] animate-scale-in" 
        }
      }}
    >

      <ModalHeader className="rounded-t-lg bg-slate-800 pb-2 pt-6 px-6">
        <span className="text-xl font-bold text-indigo-400">Contact Me</span>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors">
          <X size={24} />
        </button>    
      </ModalHeader>
      
      <ModalBody className="rounded-b-lg bg-slate-800 px-6 pb-6 pt-2">
        <div className="space-y-4 text-slate-200">

          <div className="flex flex-col space-y-2">
            
            {contactModalData.map((Data) => (
              <Link 
                key={Data.label}
                href={Data.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={contactItemStyle}>
                <div className="p-3 bg-slate-900 rounded-full shrink-0">
                    {<Data.Icon size={22} className={`text-${Data.color}-500`} />}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-lg">{Data.label}</span>
                  <span className="text-sm text-slate-400 tracking-wide">{Data.value}</span>
                </div>
              </Link>
            ))}

          </div>
        </div>
      </ModalBody>
      
    </Modal>
  );
}