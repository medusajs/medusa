"use client"

import { useColorMode } from "@/providers/color-mode"
import Image from "next/image"
import Link from "next/link"

const NavbarMobileLogo = () => {
  const { colorMode } = useColorMode()

  return (
    <Link href={`/`} className="flex-1 lg:hidden">
      <Image
        src={
          colorMode === "light"
            ? "/images/logo-mobile.png"
            : "/images/logo-mobile-dark.png"
        }
        alt="Medusa Logo"
        height={20}
        width={82}
        className="mx-auto align-middle"
      />
    </Link>
  )
}

export default NavbarMobileLogo
