import clsx from "clsx"
import Link from "next/link"
import NavbarLink from "./Link"
import NavbarColorModeToggle from "./ColorModeToggle"
import NavbarLogo from "./Logo"
import SearchBar from "../SearchBar"
import NavbarMenuButton from "./MenuButton"
import getLinkWithBasePath from "../../utils/get-link-with-base-path"
import FeedbackModal from "./FeedbackModal"

const Navbar = () => {
  return (
    <nav
      className={clsx(
        "h-navbar sticky top-0 w-full justify-between",
        "bg-docs-bg dark:bg-docs-bg-dark border-medusa-border-base dark:border-medusa-border-base-dark z-[400] border-b"
      )}
    >
      <div
        className={clsx(
          "h-navbar max-w-xxl sticky top-0 mx-auto flex w-full justify-between py-[12px] px-1 lg:px-3"
        )}
      >
        <div className="flex w-full items-center gap-0.5 lg:w-auto lg:gap-1.5">
          <NavbarLogo />
          <div className="hidden items-center gap-1.5 lg:flex">
            <NavbarLink href="https://docs.medusajs.com/" label="Docs" />
            <NavbarLink
              href="https://docs.medusajs.com/user-guide"
              label="User Guide"
            />
            <NavbarLink
              href={getLinkWithBasePath("/store")}
              label="Store API"
              activeValue="store"
            />
            <NavbarLink
              href={getLinkWithBasePath("/admin")}
              label="Admin API"
              activeValue="admin"
            />
          </div>
          <div className="lg:hidden [&>*]:flex-1">
            <SearchBar />
          </div>
          <NavbarMenuButton />
        </div>
        <div className="hidden min-w-0 flex-1 items-center justify-end gap-0.5 lg:flex">
          <div className="w-[240px] [&>*]:flex-1">
            <SearchBar />
          </div>
          <NavbarColorModeToggle />
          <FeedbackModal />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
