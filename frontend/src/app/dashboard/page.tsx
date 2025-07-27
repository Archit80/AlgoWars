'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      console.log('User data:', user);
    })
  }, [])

  return (
    <div>
      {user ? (
        <h1 className='text-white'>Welcome, {user.email}</h1>
      ) : (
        <p className='text-white'>Not logged in</p>
      )}
    </div>
  )
}
