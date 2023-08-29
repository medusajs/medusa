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
          colorMode === "light"
            ? "/images/logo-icon.png"
            : "/images/logo-icon-dark.png"
        }
        alt="Medusa Logo"
        height={20}
        width={20}
        className="align-middle"
      />
    </Link>
  )
}

export default NavbarLogo
