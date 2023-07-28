"use client"

import { useColorMode } from "@/providers/color-mode"
import Image from "next/image"
import Link from "next/link"

const NavbarLogo = () => {
  const { colorMode } = useColorMode()

  return (
    <Link href={`/`} className="flex-1">
      <Image
        src={
          colorMode === "light" ? "/images/logo.png" : "/images/logo-dark.png"
        }
        alt="Medusa Logo"
        height={20}
        width={83}
        className="align-middle"
      />
    </Link>
  )
}

export default NavbarLogo
