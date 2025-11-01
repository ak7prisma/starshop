// app/api/create-transaction/route.ts

import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

// Pastikan Environment Variables sudah dimuat dengan benar dan periksa keberadaannya
const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

if (!SERVER_KEY || !CLIENT_KEY) {
    // Penting: Throw Error jika kunci rahasia tidak ditemukan
    console.error("MIDTRANS_SERVER_KEY or NEXT_PUBLIC_MIDTRANS_CLIENT_KEY is missing!");
    // Kita akan kembalikan error 500 jika API dipanggil tanpa kunci
    // Ini lebih baik ditangani di luar POST jika ingin fail-fast
}

// Inisialisasi Midtrans Snap API dengan Server Key rahasia
const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    // Gunakan non-null assertion operator (!) setelah kita memastikan keberadaannya.
    // Ini memberitahu TypeScript bahwa nilai tersebut pasti string non-null.
    serverKey: SERVER_KEY!, 
    clientKey: CLIENT_KEY!,
});

export async function POST(req: Request) {
    // Cek kunci di dalam POST agar bisa merespons error ke client
    if (!SERVER_KEY || !CLIENT_KEY) {
         return NextResponse.json({ 
             error: 'Konfigurasi Payment Gateway bermasalah. Server Key hilang.' 
         }, { status: 500 });
    }
    
    try {
        // Data yang dikirim dari Client-Side
        const { idTopup, amount, adminFee, productName } = await req.json();

        // **PENTING**: Ambil data user yang login dari Supabase Auth di sini
        // Misalnya: const { data: { user } } = await supabase.auth.getUser();
        
        // Dummy Data Customer
        const customer = {
            name: "StarShop User", 
            email: "user@starshop.com", 
            phone: "081234567890", 
        };

        const totalHarga = amount + adminFee;

        if (totalHarga <= 0) {
            return NextResponse.json({ error: 'Jumlah pembayaran tidak valid.' }, { status: 400 });
        }
        
        // Parameter transaksi Midtrans
        const parameter = {
            transaction_details: {
                order_id: idTopup, 
                gross_amount: totalHarga,
            },
            item_details: [
                { id: 'topup-item', price: amount, quantity: 1, name: productName },
                { id: 'admin-fee', price: adminFee, quantity: 1, name: 'Biaya Admin' },
            ],
            customer_details: {
                first_name: customer.name.split(' ')[0] || "User",
                last_name: customer.name.split(' ').slice(1).join(' ') || "",
                email: customer.email,
                phone: customer.phone, 
            },
            credit_card: { secure: true },
            expiry: { unit: 'days', duration: 1 }, 
        };

        const transaction = await snap.createTransaction(parameter);
        
        return NextResponse.json({ token: transaction.token });
    } catch (error) {
        console.error('Error creating Midtrans transaction:', error);
        // Tangkap error spesifik Midtrans jika memungkinkan
        return NextResponse.json({ 
            error: 'Gagal memproses transaksi di Payment Gateway. Cek log server.' 
        }, { status: 500 });
    }
}