import React from 'react'
import Header from '@/widget/hader';

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className=''>

      <Header />

      {children}
    </div>
  )
}
