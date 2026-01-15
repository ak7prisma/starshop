import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

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

  const { data: { user } } = await supabase.auth.getUser()

  const url = request.nextUrl
  const isDashboardRoute = url.pathname.startsWith('/dashboard')
  const isAuthRoute = url.pathname.startsWith('/login')

  // Logic Keamanan Role login

  if (isDashboardRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isDashboardRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('idProfil', user.id)
      .single()

    const userRole = profile?.role

    if (userRole !== 'admin' && userRole !== 'boss') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
}