import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
// Asumsi '@/lib/supabase' mengimpor Supabase Client standar
import { supabase } from '@/lib/supabase'; 

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
// CLIENT_KEY TIDAK DIGUNAKAN DI SISI SERVER (hanya di browser)

if (!SERVER_KEY) {
    // Log error hanya di development, tidak perlu di production
    console.error("MIDTRANS_SERVER_KEY is missing! Transaction creation will fail.");
}

// Inisialisasi Midtrans Snap
// isProduction harus berupa boolean dari environment variable
const snap = new midtransClient.Snap({
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
    serverKey: SERVER_KEY!, 
    // clientKey tidak digunakan untuk createTransaction, bisa diisi string kosong
    clientKey: "", 
});

export async function POST(req: Request) {
    // 1. Cek Kunci Rahasia
    if (!SERVER_KEY) {
         return NextResponse.json({ 
             error: 'Konfigurasi Payment Gateway bermasalah. Server Key hilang.' 
         }, { status: 500 });
    }
    
    try {
        const { idTopup, amount, adminFee, productName } = await req.json();

        // 2. Ambil Data User dari Supabase Auth
        // Catatan: Pastikan client Supabase Anda terkonfigurasi untuk membawa token auth dari cookies.
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
             return NextResponse.json({ 
                 error: 'Pengguna tidak terautentikasi. Silakan login kembali.' 
             }, { status: 401 });
        }

        // 3. Persiapkan Detail Customer
        const customer = {
            name: user.user_metadata?.fullName || "StarShop User",
            email: user.email!, // Email diasumsikan selalu ada jika user terautentikasi
        };

        const totalHarga = amount + adminFee;

        if (totalHarga <= 0) {
            return NextResponse.json({ error: 'Jumlah pembayaran tidak valid.' }, { status: 400 });
        }
        
        // 4. Parameter Transaksi Midtrans
        const parameter = {
            transaction_details: {
                // order_id harus unik
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
            },
            credit_card: { secure: true },
            expiry: { unit: 'days', duration: 1 }, // Masa berlaku transaksi
            // URL notifikasi wajib di set di parameter, atau di dashboard Midtrans
            // notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/midtransWebhook`, 
        };

        // 5. Buat Transaksi dan Dapatkan Snap Token
        const transaction = await snap.createTransaction(parameter);
        
        // 6. Kirim Snap Token kembali ke client
        return NextResponse.json({ token: transaction.token });
    } catch (error) {
        console.error('Error creating Midtrans transaction:', error);
        
        // Response error generik untuk klien
        return NextResponse.json({ 
            error: 'Gagal memproses transaksi di Payment Gateway. Cek log server.' 
        }, { status: 500 });
    }
}