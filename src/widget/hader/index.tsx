import React from 'react'
import Link from "next/link";
import Nav from './Nav';
import MobileNav from './MobileNav';
import Logo from './Logo';

export type LinkType = {
  name: string;
  path: string;
}
const links: LinkType[] = [
  {
    name: "home",
    path: '/'
  },

]

const Header = () => {
  return (
    <div className='sticky w-full h-full top-0 z-50 bg-primary'>
      <header className='py-2 xl:py-4 text-white'>
        <div className='container mx-auto w-full flex justify-between items-center'>
          <Link href={'/'}>
            <h1 className='text-4xl font-semibold'>
              <Logo />
            </h1>
          </Link>
          <div className="hidden lg:block">
            <Nav links={links} />
          </div>

          <div className="lg:hidden ">
            <MobileNav links={links} />
          </div>
        </div>

      </header>
    </div>
  )
}

export default Header