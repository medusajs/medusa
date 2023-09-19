"use client"

import React from "react"
import { SearchModalOpener } from "@/components"
import { useMobile, usePageLoading } from "@/providers"

export const NavbarSearchModalOpener = () => {
  const { isMobile } = useMobile()
  const { isLoading } = usePageLoading()

  return <SearchModalOpener isMobile={isMobile} isLoading={isLoading} />
}
