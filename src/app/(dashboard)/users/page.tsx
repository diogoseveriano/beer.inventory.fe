'use client'

import {useSession} from "next-auth/react";
import { useRouter } from 'next/navigation'
import {useEffect, useState} from "react";

const Page = () => {

  const [loading, setLoading] = useState(true)

  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session) { router.push('/inventory') }

    if (session && session.user && session.user.role != 'ADMIN') {
      router.push('/inventory')
    }
    else {
      setLoading(false)
    }
  }, [session, router])

  if (loading)
    return (<div>Loading...</div>)
  else {
    return (
      <div>
        <h1>Users</h1>
        <br/>
      </div>
    );
  }
};

export default Page;
