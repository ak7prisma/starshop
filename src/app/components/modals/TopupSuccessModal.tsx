"use client";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface TopupSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTopupAgain: () => void;
    idTopup?: number | null;
}

export default function TopupSuccessModal({ 
    isOpen, 
    onClose, 
    onTopupAgain,
    idTopup 
}: Readonly<TopupSuccessModalProps>) {
  
  return (
    <Modal 
        show={isOpen} 
        onClose={onClose} 
        theme={{ 
            content: { 
              base: "w-90 md:w-125 h-80 bg-[#181B2B] rounded-lg border border-[#2D3142]" 
            },
            header: { 
              base: "border-b border-[#2D3142] bg-[#181B2B] rounded-t-lg" 
            }
        }}
    >
      <ModalHeader className="border-[#2D3142]">
        <div className="flex items-center justify-center space-x-3">
          <FaCheckCircle className="text-green-500 text-2xl" />
          <span className="text-xl font-bold text-white">Topup Berhasil!</span>
        </div>
      </ModalHeader>
      
      <ModalBody className="p-5 bg-[#181B2B]">
        <div className="space-y-5 text-gray-200">
          <div className="text-center">
            <p className="text-base mb-3">
              Topup Anda telah berhasil disimpan!
            </p>
            {idTopup && (
              <p className="text-sm text-gray-400 mb-3">
                ID Topup: <span className="font-mono bg-[#2D3142] px-2 py-1 rounded">{idTopup}</span>
              </p>
            )}
            <p className="text-xs text-gray-400">
              Silakan tunggu konfirmasi dari admin. Status pembayaran akan diperbarui setelah verifikasi.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onTopupAgain}
              className="flex-1 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 shadow-lg hover:shadow-indigo-500/30 text-sm"
            >
              Topup Lagi
            </button>
            <button
              onClick={onClose}
              className="flex-1 cursor-pointer bg-[#2D3142] hover:bg-[#3C4258] text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 border border-[#2D3142] text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

