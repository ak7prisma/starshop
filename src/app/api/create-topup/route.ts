import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      idProduct, 
      idGame, 
      amount, 
      price, 
      paymentMethod, 
      paymentProofUrl 
    } = body;

    if (!idProduct || !idGame || !amount || !price || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields: idProduct, idGame, amount, price, paymentMethod' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Server configuration error. Missing SUPABASE_SERVICE_ROLE_KEY' },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('topup')
      .insert({
        idProduct,
        idGame,
        amount,
        price,
        status: 'Pending',
        paymentMethod,
        paymentProofUrl: paymentProofUrl || null,
      })
      .select('idTopup')
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { 
          error: 'Failed to create topup record',
          details: insertError.message 
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      idTopup: insertData.idTopup,
    });
  } catch (error) {
    console.error('Error creating topup:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create topup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

