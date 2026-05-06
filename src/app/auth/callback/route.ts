import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
            }
          },
        },
      }
    )
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
        console.error('Supabase Auth Error di Callback:', error.message)
        return NextResponse.redirect(`${origin}/auth/Login?error=exchange-failed&message=${encodeURIComponent(error.message)}`)
    } 

    const redirectUrl = new URL(next, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Jika tidak ada kode, arahkan ke Login dengan pesan error spesifik
  return NextResponse.redirect(`${origin}/auth/Login?error=no-code`)
}