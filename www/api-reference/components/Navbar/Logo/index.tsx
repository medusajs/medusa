"use client"

import { useColorMode } from "@/providers/color-mode"
import getLinkWithBasePath from "@/utils/get-link-with-base-path"
import Image from "next/image"
import Link from "next/link"

const NavbarLogo = () => {
  const { colorMode } = useColorMode()

  return (
    <Link href={`/`} className="flex-1">
      <Image
        src={
          colorMode === "light"
            ? getLinkWithBasePath("/images/logo.png")
            : getLinkWithBasePath("/images/logo-dark.png")
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
