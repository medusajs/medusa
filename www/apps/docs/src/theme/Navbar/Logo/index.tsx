import React from "react"
import Logo from "@theme/Logo"
import MobileLogo from "../../../components/MobileLogo"

export default function NavbarLogo(): JSX.Element {
  return (
    <>
      <Logo
        className="navbar__brand hidden lg:block"
        imageClassName="navbar__logo"
        titleClassName="navbar__title text--truncate"
      />
      <MobileLogo
        className="navbar__brand lg:hidden mx-auto"
        imageClassName="navbar__logo"
        titleClassName="navbar__title text--truncate"
      />
    </>
  )
}
