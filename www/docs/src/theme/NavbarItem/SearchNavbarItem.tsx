import React from "react"
import NavbarSearch from "@theme/Navbar/Search"
import type { Props } from "@theme/NavbarItem/SearchNavbarItem"
import SearchModalOpener from "../../components/Search/ModalOpener"

export default function SearchNavbarItem({
  mobile,
}: Props): JSX.Element | null {
  if (mobile) {
    return null
  }

  return (
    <NavbarSearch>
      <SearchModalOpener />
    </NavbarSearch>
  )
}
