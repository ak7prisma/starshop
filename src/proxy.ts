import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  // 1. Init Response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 2. Setup Supabase Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 3. Logic Keamanan (Admin Check & IdProfil)
  const { data: { user } } = await supabase.auth.getUser()
  const url = request.nextUrl

  // Proteksi Dashboard
  if (url.pathname.startsWith('/dashboard')) {
    // A. Belum Login -> Login
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // B. Cek Role (Admin/Boss)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('idProfil', user.id)
      .single()

    if (profile?.role !== 'admin' && profile?.role !== 'boss') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Proteksi Halaman Login
  if (url.pathname.startsWith('/login') && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
}