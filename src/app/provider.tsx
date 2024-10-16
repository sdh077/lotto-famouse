
"use client";

import React, { useEffect, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
const queryClient = new QueryClient()
export default function Provider({ children, ...props }: { children: React.ReactNode }) {
  const [isMount, setMount] = useState(false)

  useEffect(() => {
    setMount(true)
  }, [])

  if (!isMount) {
    return null
  }
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </>
  )
}