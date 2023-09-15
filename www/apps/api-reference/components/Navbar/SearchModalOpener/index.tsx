"use client"

import { SearchModalOpener, useMobile, usePageLoading } from "docs-ui"

const NavbarSearchModalOpener = () => {
  const { isMobile } = useMobile()
  const { isLoading } = usePageLoading()

  return <SearchModalOpener isMobile={isMobile} isLoading={isLoading} />
}

export default NavbarSearchModalOpener
