"use client";

import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import Link from "next/link";
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface TopupSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  idTopup?: number | null;
}

export default function TopupSuccessModal({ 
  isOpen, 
  onClose, 
  idTopup 
}: Readonly<TopupSuccessModalProps>) {
  
  return (
    <Modal 
      show={isOpen} 
      onClose={onClose} 
      popup 
      position="center" 
      theme={{ 
        content: { 
          base: "relative w-full h-auto flex justify-center items-center pointer-events-none", // pointer-events-none di base agar klik di luar area modal tembus (opsional, tergantung UX)
          inner: "relative pointer-events-auto rounded-lg shadow-xl flex flex-col w-90 md:w-125 h-auto bg-[#181B2B] border border-[#2D3142] animate-scale-in" 
        },
        header: { 
          base: "border-b border-[#2D3142] bg-[#181B2B] rounded-t-lg p-4" 
        }
      }}
    >
      <ModalHeader className="border-none">
        <div className="flex items-center justify-center space-x-3 p-2">
          <FaCheckCircle className="text-green-500 text-2xl" />
          <span className="text-xl font-bold text-white">Topup Berhasil!</span>
        </div>
      </ModalHeader>
      
      <ModalBody className="p-5 bg-[#181B2B] rounded-b-lg">
        <div className="space-y-5 text-gray-200">
          <div className="text-center">
            <p className="text-base mb-3">
              Topup Anda telah berhasil disimpan!
            </p>
            {idTopup && (
              <p className="text-sm text-gray-400 mb-3">
                ID Topup: <span className="font-mono bg-[#2D3142] px-2 py-1 rounded select-all">{idTopup}</span>
              </p>
            )}
            <p className="text-xs text-gray-400">
              Silakan tunggu konfirmasi dari admin. Status pembayaran akan diperbarui setelah verifikasi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onClose}
              type="button"
              className="flex-1 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-indigo-500/30 text-sm"
            >
              Topup Lagi
            </button>
            <Link
              href="/Home"
              className="flex-1 cursor-pointer bg-[#2D3142] hover:bg-[#3C4258] text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 border border-[#2D3142] text-sm text-center flex items-center justify-center"
            >
              Home
            </Link>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}