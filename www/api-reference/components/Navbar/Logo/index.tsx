"use client"

import { useColorMode } from "@/providers/color-mode"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavbarLogo = () => {
  const { colorMode } = useColorMode()
  const pathname = usePathname()

  return (
    <Link href={pathname} className="h-fit">
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
