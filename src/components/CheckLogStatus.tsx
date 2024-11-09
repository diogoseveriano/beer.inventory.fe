'use client'

import {redirect} from "next/navigation";
import {useSession} from "next-auth/react";

const CheckLogStatus = () => {
  const { data: session } = useSession();

  if (!session) {
    redirect("/login?not-authenticated");
  }
}
export default CheckLogStatus;
