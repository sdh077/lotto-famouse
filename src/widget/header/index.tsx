import React from 'react'
import Link from "next/link";
import Logo from './Logo';

export type LinkType = {
  name: string;
  path: string;
}
// const links: LinkType[] = [
//   {
//     name: "home",
//     path: '/'
//   },

// ]

const Header = () => {
  return (
    <div className='sticky w-full h-full top-0 z-50 bg-white border-b-2 border-b-primary'>
      <header className='py-2 xl:py-4 text-primary'>
        <div className='container mx-auto w-full flex justify-start items-center'>
          <Link href={'/'}>
            <Logo />
          </Link>
          {/* <div className="hidden lg:block">
            <Nav links={links} />
          </div>

          <div className="lg:hidden ">
            <MobileNav links={links} />
          </div> */}
        </div>

      </header>
    </div>
  )
}

export default Header