import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Matcher
  if (
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path === '/favicon.ico' ||
    new RegExp(/\.(svg|png|jpg|jpeg|gif|webp)$/).exec(path)
  ) {
    return NextResponse.next()
  }

  // Setup Response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Supabase Logic
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

  // Admin Check
  const { data: { user } } = await supabase.auth.getUser()

  // Proteksi Dashboard
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('idProfil', user.id)
      .single()

    if (profile?.role !== 'admin' && profile?.role !== 'boss') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // B. Proteksi Login
  if (path.startsWith('/login') && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}