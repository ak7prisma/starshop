"use client";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from 'react';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: Readonly<ContactModalProps>) {

  const contactItemStyle = "flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-900/80 transition duration-300 cursor-pointer group";
  
  return (
    <Modal 
      show={isOpen} 
      onClose={onClose} 
      position="center" 
      popup 
      theme={{
        content: {
          base: "relative w-full p-4 h-auto flex justify-center items-center",
          inner: "relative rounded-lg shadow-xl flex flex-col w-full md:w-[35rem] animate-scale-in" 
        }
      }}
    >

      <ModalHeader className="border-0 pb-2 pt-6 px-6">
          <span className="text-xl font-bold text-indigo-400 tracking-wide">Contact Me</span>
      </ModalHeader>
      
      <ModalBody className="px-6 pb-6 pt-2">
        <div className="space-y-4 text-slate-200">

          <div className="flex flex-col space-y-2">
            
            <a href="https://wa.me/628989209565" target="_blank" rel="noopener noreferrer" className={contactItemStyle}>
              <div className="p-3 bg-slate-900 rounded-full shrink-0">
                  <FaWhatsapp size={22} className="text-green-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg">WhatsApp</span>
                <span className="text-sm text-slate-400 tracking-wide">+62 898-9209-565</span>
              </div>
            </a>
            
            <a href="mailto:ahmadkurniaprisma@gmail.com" className={contactItemStyle}>
              <div className="p-3 bg-slate-900 rounded-full shrink-0">
                  <FaEnvelope size={22} className="text-red-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg">Email</span>
                <span className="text-sm text-slate-400 tracking-wide">starshop@gmail.com</span>
              </div>
            </a>
            
            <div className={contactItemStyle}>
              <div className="p-3 bg-slate-900 rounded-full shrink-0">
                  <FaMapMarkerAlt size={22} className="text-indigo-500" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-lg">Address</span>
                <span className="text-sm text-slate-400 tracking-wide">Benka, Jl. Radio, Indralaya Utara</span>
              </div>
            </div>

          </div>
        </div>
      </ModalBody>
      
    </Modal>
  );
}