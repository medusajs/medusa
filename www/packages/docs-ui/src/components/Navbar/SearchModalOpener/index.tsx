"use client"

import React from "react"
import { SearchModalOpener } from "@/components"

export type NavbarSearchModalOpenerProps = {
  isLoading?: boolean
}

export const NavbarSearchModalOpener = ({
  isLoading,
}: NavbarSearchModalOpenerProps) => {
  return <SearchModalOpener isLoading={isLoading} />
}
