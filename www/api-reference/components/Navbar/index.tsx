import clsx from "clsx"
import Link from "next/link"
import NavbarLink from "./Link"
import IconReport from "../Icons/Report"
import NavbarIconButton from "./IconButton"
import NavbarColorModeToggle from "./ColorModeToggle"
import NavbarLogo from "./Logo"
import SearchBar from "../SearchBar"

const Navbar = () => {
  return (
    <nav
      className={clsx(
        "h-navbar sticky top-0 mx-auto flex w-full max-w-xl justify-between py-[12px] px-1.5",
        "shadow-navbar dark:shadow-navbar-dark bg-docs-bg dark:bg-docs-bg-dark z-[400]"
      )}
    >
      <div className="flex items-center">
        <NavbarLogo />
        <div className="w-[280px] [&>*]:flex-1">
          <SearchBar />
        </div>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end">
        <NavbarLink href="https://docs.medusajs.com/" label="Docs" />
        <NavbarLink
          href="https://docs.medusajs.com/user-guide"
          label="User Guide"
        />
        <NavbarLink href="/store" label="Store API" />
        <NavbarLink href="/admin" label="Admin API" />
        <span className="bg-medusa-border-strong dark:bg-medusa-border-strong-dark mx-1 h-[20px] w-[1px] align-middle"></span>
        <NavbarColorModeToggle />
        <NavbarIconButton>
          <Link href="https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml">
            <IconReport />
          </Link>
        </NavbarIconButton>
      </div>
    </nav>
  )
}

export default Navbar
