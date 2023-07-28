import clsx from "clsx"
import Link from "next/link"
import NavbarLink from "./Link"
import IconReport from "../Icons/Report"
import NavbarIconButton from "./IconButton"
import NavbarColorModeToggle from "./ColorModeToggle"
import NavbarLogo from "./Logo"
import SearchBar from "../SearchBar"
import NavbarMenuButton from "./MenuButton"
import getLinkWithBasePath from "../../utils/get-link-with-base-path"

const Navbar = () => {
  return (
    <nav
      className={clsx(
        "h-navbar sticky top-0 mx-auto flex w-full max-w-xl justify-between py-[12px] px-1.5",
        "shadow-navbar dark:shadow-navbar-dark bg-docs-bg dark:bg-docs-bg-dark z-[400]"
      )}
    >
      <div className="flex w-full items-center lg:w-auto">
        <NavbarMenuButton />
        <NavbarLogo />
        <div className="lg:w-[280px] [&>*]:flex-1">
          <SearchBar />
        </div>
      </div>
      <div className="hidden min-w-0 flex-1 items-center justify-end lg:flex">
        <NavbarLink href="https://docs.medusajs.com/" label="Docs" />
        <NavbarLink
          href="https://docs.medusajs.com/user-guide"
          label="User Guide"
        />
        <NavbarLink href={getLinkWithBasePath("/store")} label="Store API" />
        <NavbarLink href={getLinkWithBasePath("/admin")} label="Admin API" />
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
