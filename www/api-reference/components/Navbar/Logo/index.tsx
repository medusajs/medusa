"use client"

import { useColorMode } from "@/providers/color-mode"
import Image from "next/image"

const NavbarLogo = () => {
  const { colorMode } = useColorMode()

  return (
    <Image
      src={colorMode === "light" ? "/images/logo.png" : "/images/logo-dark.png"}
      alt="Medusa Logo"
      height={20}
      width={83}
      className="align-middle"
    />
  )
}

export default NavbarLogo
