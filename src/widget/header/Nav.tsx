'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from 'react'
import { LinkType } from ".";


const Nav = ({ links }: { links: LinkType[] }) => {
  const pathname = usePathname();
  return (
    <nav className="flex gap-8">
      {links.map(link =>
        <Link href={link.path} key={link.name}
          className={`${link.path === pathname && 'text-accent border-b-2 border-accent'} 
          capitalize font-medium hover:text-accent transition-all hover:border-primary`}
        >
          {link.name}
        </Link>
      )}
    </nav>
  )
}

export default Nav