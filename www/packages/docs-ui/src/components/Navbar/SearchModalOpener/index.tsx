"use client"

import React from "react"
import { SearchModalOpener } from "@/components"
import { useMobile } from "@/providers"

export type NavbarSearchModalOpenerProps = {
  isLoading?: boolean
}

export const NavbarSearchModalOpener = ({
  isLoading,
}: NavbarSearchModalOpenerProps) => {
  const { isMobile } = useMobile()

  return <SearchModalOpener isMobile={isMobile} isLoading={isLoading} />
}
