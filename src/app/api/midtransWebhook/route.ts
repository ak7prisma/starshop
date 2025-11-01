import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import midtransClient from 'midtrans-client';

// --- Inisialisasi Midtrans (Wajib Ada) ---
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY; 

if (!SERVER_KEY || !CLIENT_KEY) {
    throw new Error("MIDTRANS_SERVER_KEY or NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is not defined for Webhook.");
}

// Gunakan CoreApi untuk menangani notifikasi Webhook
const core = new midtransClient.CoreApi({ 
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: SERVER_KEY!, 
    clientKey: CLIENT_KEY!, 
});
// ------------------------------------------

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // 1. Verifikasi Signature Key (Keamanan)
        // Solusi TypeScript: Menggunakan 'as any' pada 'core'
        const notification = await (core as any).transaction.notification(body);
        
        const { 
            order_id, 
            transaction_status, 
            fraud_status, 
        } = notification;

        let newStatus = 'Pending';
        
        if (transaction_status === 'settlement' || (transaction_status === 'capture' && fraud_status === 'accept')) {
            newStatus = 'Success';
            // PENTING: LAKUKAN PROSES PENGIRIMAN PRODUK/TOP-UP DI SINI
            console.log(`[Webhook Success] Segera kirim produk untuk Order ID: ${order_id}`);
        } else if (transaction_status === 'deny' || transaction_status === 'cancel' || transaction_status === 'expire' || fraud_status === 'deny') {
            newStatus = 'Failed';
        } else if (transaction_status === 'pending' || fraud_status === 'challenge') {
            newStatus = 'Pending';
        }

        // 2. Update Status di Supabase
        const { error } = await supabase
            .from('Topup')
            .update({ 
                status: newStatus,
                transactionIdMidtrans: notification.transaction_id,
            })
            .eq('idTopup', order_id);

        if (error) {
            console.error('Supabase update error:', error);
            return new NextResponse('Error updating Supabase', { status: 500 });
        }

        return new NextResponse('OK', { status: 200 }); // Wajib kembalikan 200 ke Midtrans
    } catch (error) {
        console.error('Webhook processing error:', error);
        return new NextResponse('Error processing webhook', { status: 500 }); 
    }
}