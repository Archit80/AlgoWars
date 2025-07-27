'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const checkLogin = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        router.push('/dashboard')
      }
    }

    checkLogin()
  }, [router])

  return <p>Logging you in...</p>
}
