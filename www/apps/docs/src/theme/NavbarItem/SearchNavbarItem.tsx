import React from "react"
import NavbarSearch from "@theme/Navbar/Search"
import type { Props } from "@theme/NavbarItem/SearchNavbarItem"
import { SearchModalOpener } from "docs-ui"
import { useWindowSize } from "@docusaurus/theme-common"

export default function SearchNavbarItem({
  mobile,
}: Props): JSX.Element | null {
  const windowSize = useWindowSize()

  return (
    <NavbarSearch>
      <SearchModalOpener isMobile={mobile || windowSize !== "desktop"} />
    </NavbarSearch>
  )
}
