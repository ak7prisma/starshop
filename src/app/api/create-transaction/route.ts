import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';
// Asumsi '@/lib/supabase' mengimpor Supabase Client standar
import { supabase } from '@/lib/supabase'; 

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true'; // Simpan status mode

if (!SERVER_KEY) {
    console.error("MIDTRANS_SERVER_KEY is missing! Transaction creation will fail.");
}

// Inisialisasi Midtrans Snap
const snap = new midtransClient.Snap({
    isProduction: IS_PRODUCTION, // Gunakan IS_PRODUCTION
    serverKey: SERVER_KEY!, 
    clientKey: "", 
});

export async function POST(req: Request) {
    // 1. Cek Kunci Rahasia
    if (!SERVER_KEY) {
         return NextResponse.json({ 
             error: 'Konfigurasi Payment Gateway bermasalah. Server Key hilang.' 
         }, { status: 500 });
    }

    console.log(`[Midtrans] Processing transaction in ${IS_PRODUCTION ? 'PRODUCTION' : 'SANDBOX'} mode.`);
    
    try {
        const { idTopup, amount, adminFee, productName } = await req.json();

        // 2. PENINGKATAN: Validasi dan Parsing Data Masukan
        const parsedAmount = Number(amount);
        const parsedAdminFee = Number(adminFee);

        if (isNaN(parsedAmount) || isNaN(parsedAdminFee) || !idTopup || !productName) {
            return NextResponse.json({ 
                error: 'Data transaksi tidak lengkap atau tidak valid.' 
            }, { status: 400 });
        }

        // 3. Ambil Data User dari Supabase Auth
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
             return NextResponse.json({ 
                 error: 'Pengguna tidak terautentikasi. Silakan login kembali.' 
             }, { status: 401 });
        }

        // 4. Persiapkan Detail Customer
        const customer = {
            name: user.user_metadata?.fullName || "StarShop User",
            email: user.email!, 
        };

        const totalHarga = parsedAmount + parsedAdminFee;

        if (totalHarga <= 0) {
            return NextResponse.json({ error: 'Jumlah pembayaran tidak valid.' }, { status: 400 });
        }
        
        // 5. Parameter Transaksi Midtrans
        const parameter = {
            transaction_details: {
                order_id: idTopup, 
                gross_amount: totalHarga,
            },
            item_details: [
                { id: 'topup-item', price: parsedAmount, quantity: 1, name: productName },
                { id: 'admin-fee', price: parsedAdminFee, quantity: 1, name: 'Biaya Admin' },
            ],
            customer_details: {
                first_name: customer.name.split(' ')[0] || "User",
                last_name: customer.name.split(' ').slice(1).join(' ') || "",
                email: customer.email,
            },
            credit_card: { secure: true },
            expiry: { unit: 'days', duration: 1 }, 
            // URL notifikasi harus di set di dashboard Midtrans atau di sini
            // notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/midtransWebhook`, 
        };

        // 6. Buat Transaksi dan Dapatkan Snap Token
        const transaction = await snap.createTransaction(parameter);
        
        // 7. Kirim Snap Token kembali ke client
        return NextResponse.json({ token: transaction.token });
    } catch (error) {
        // PENINGKATAN: Log error yang lebih detail
        if (error instanceof Error) {
             console.error('Error creating Midtrans transaction:', error.message);
        } else {
             console.error('Error creating Midtrans transaction:', error);
        }
        
        return NextResponse.json({ 
            error: 'Terjadi kesalahan saat membuat transaksi. Cek log server untuk detail.' 
        }, { status: 500 });
    }
}