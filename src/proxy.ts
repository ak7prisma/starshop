import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/app/utils/supabase/proxy'

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (
    path.startsWith('/_next/static') ||
    path.startsWith('/_next/image') ||
    path === '/favicon.ico' ||
    new RegExp(/\.(svg|png|jpg|jpeg|gif|webp)$/).exec(path)
  ) {
    return NextResponse.next()
  }

  return await updateSession(request)
}