'use server'

import { headers } from "next/headers"
import { createClient } from "../utils/server"

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = await createClient()

  // Login
  const { data: { user }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { error: error.message }
  if (!user) return { error: 'User tidak ditemukan.' }

  // Cek Role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role
  
  if (role === 'admin' || role === 'boss') {
    return { success: true, redirectUrl: '/dashboard' }
  } else {
    return { success: true, redirectUrl: '/' }
  }
}

export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string 

  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username, 
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error("Supabase Auth Error:", error.message)
    return { error: error.message }
  }

  return { success: true }
}