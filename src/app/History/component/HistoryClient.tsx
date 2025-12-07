"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase'; 
import type { TopupData } from '@/datatypes/TopupData'; 
import HistoryCard from './HistoryCard';
import ButtonLinkPrimary from '@/app/components/ui/ButtonLinkPrimary';
import { FaHistory } from 'react-icons/fa';

export default function HistoryClient() {
    const [historyData, setHistoryData] = useState<TopupData[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);

                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                
                if (sessionError || !session) {
                    console.log("Session tidak ditemukan, redirecting ke login...");
                    router.replace('/auth/Login');
                    return; 
                }

                console.log("User terdeteksi:", session.user.id); 

                const { data, error } = await supabase
                    .from('topup')
                    .select('*, Products (nameProduct, itemName)')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error("Error fetching data:", error.message);
                    throw error;
                }
                
                if (data) setHistoryData(data as TopupData[]);

            } catch (error) {
                console.error('Error in fetchHistory:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                router.replace('/auth/Login');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center min-h-[200px] bg-[#181B2B] rounded-2xl border border-[#2D3142]">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                </div>
            );
        }

        if (historyData.length > 0) {
            return historyData.map((item) => (
                <HistoryCard key={item.idTopup} item={item} />
            ));
        }

        return (
            <div className="bg-[#181B2B] rounded-2xl p-12 border border-[#2D3142] text-center shadow-xl">
                <div className="w-16 h-16 bg-[#2D3142] rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHistory className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Belum ada riwayat</h3>
                <p className="text-gray-400 mb-6">Anda belum melakukan transaksi apapun.</p>
                <ButtonLinkPrimary href="/Home" label="Top Up Now" rounded='lg' extraclass='px-5 py-3'/>
            </div>
        );
    };

    return (
        <div className="max-w-full mx-auto text-gray-200 min-h-screen px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-white mb-2">Riwayat Top Up</h1>
                    <p className="text-gray-400">Daftar transaksi yang pernah Anda lakukan.</p>
                </div>

                <div className="space-y-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}