"use client"

import React from "react"
import { useColorMode } from "@/providers"
import Link from "next/link"
import clsx from "clsx"
import Image from "next/image"

export type NavbarLogoProps = {
  light: string
  dark?: string
  className?: string
  imageClassName?: string
}

export const NavbarLogo = ({
  light,
  dark,
  className,
  imageClassName,
}: NavbarLogoProps) => {
  const { colorMode } = useColorMode()

  return (
    <Link href={`/`} className={clsx("flex-1", className)}>
      <Image
        src={colorMode === "light" ? light : dark || light}
        alt="Medusa Logo"
        height={20}
        width={20}
        className={clsx("align-middle", imageClassName)}
      />
    </Link>
  )
}
