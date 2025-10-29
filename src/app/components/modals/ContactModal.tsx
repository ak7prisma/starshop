"use client";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from 'react';
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: Readonly<ContactModalProps>) {
  
  const contactItemStyle = "flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-700 transition duration-300 cursor-pointer";
  
  return (
    <Modal show={isOpen} onClose={onClose} theme={{ content: { base: "h-100 w-90 md:w-125 bg-slate-800 rounded-lg" } }}>
      
      <ModalHeader className="border-slate-500">
          <span className="text-xl font-bold text-indigo-400">Contact Me</span>
      </ModalHeader>
      
      <ModalBody className="p-5">
        <div className="space-y-6 text-slate-200">

          <div className="flex flex-col space-y-4">
            
            <a href="https://wa.me/628989209565" target="_blank" rel="noopener noreferrer" className={contactItemStyle}>
              <FaWhatsapp size={24} className="text-green-500" />
              <div className="flex flex-col">
                <span className="font-semibold">WhatsApp</span>
                <span className="text-sm text-slate-400">+62 898-9209-565</span>
              </div>
            </a>
            
            <a href="mailto:ahmadkurniaprisma@gmail.com" className={contactItemStyle}>
              <FaEnvelope size={24} className="text-red-500" />
              <div className="flex flex-col">
                <span className="font-semibold">Email</span>
                <span className="text-sm text-slate-400">starshop@gmail.com</span>
              </div>
            </a>
            
            <div className={contactItemStyle}>
              <FaMapMarkerAlt size={24} className="text-indigo-500" />
              <div className="flex flex-col">
                <span className="font-semibold">Address</span>
                <span className="text-sm text-slate-400">Benka, Jl. Radio, Indralaya Utara</span>
              </div>
            </div>

          </div>
        </div>
      </ModalBody>
      
    </Modal>
  );
}