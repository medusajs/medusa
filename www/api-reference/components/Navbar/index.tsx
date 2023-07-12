import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import NavbarLink from "./Link"
import IconLightMode from "../Icons/LightMode"
import IconReport from "../Icons/Report"

const Navbar = () => {
  // TODO change logo based on color mode
  return (
    <nav
      className={clsx(
        "h-navbar sticky top-0 mx-auto flex w-full max-w-xl justify-between py-[12px] px-1.5",
        "shadow-navbar dark:shadow-navbar-dark bg-docs-bg dark:bg-docs-bg-dark z-[400]"
      )}
    >
      <div className="flex items-center">
        <Link href="/" className="h-fit">
          <Image
            src="/images/logo.png"
            alt="Medusa Logo"
            height={20}
            width={83}
            className="align-middle"
          />
        </Link>
        {/* Add search bar */}
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
        {/* TODO Replace with color mode functionality */}
        <button
          className={clsx(
            "bg-button-neutral dark:bg-button-neutral-dark hover:!bg-no-image active:!bg-no-image hover:bg-medusa-button-neutral-hover dark:hover:bg-medusa-button-neutral-hover-dark",
            "active:bg-medusa-button-neutral-pressed dark:active:bg-medusa-button-neutral-pressed-dark",
            "focus:shadow-neutral-button-focused dark:focus:shadow-neutral-button-focused-dark",
            "border-medusa-border-neutral-buttons dark:border-medusa-border-neutral-buttons-dark rounded border border-solid",
            "flex h-2 w-2 cursor-pointer items-center justify-center",
            "hover:!bg-medusa-button-neutral-hover dark:hover:!bg-medusa-button-neutral-hover-dark",
            "ml-1 mr-[12px]"
          )}
        >
          <IconLightMode />
        </button>
        <Link
          href="https://github.com/medusajs/medusa/issues/new?assignees=&labels=type%3A+docs&template=docs.yml"
          className={clsx(
            "bg-button-neutral dark:bg-button-neutral-dark hover:!bg-no-image active:!bg-no-image hover:bg-medusa-button-neutral-hover dark:hover:bg-medusa-button-neutral-hover-dark",
            "active:bg-medusa-button-neutral-pressed dark:active:bg-medusa-button-neutral-pressed-dark",
            "focus:shadow-neutral-button-focused dark:focus:shadow-neutral-button-focused-dark",
            "border-medusa-border-neutral-buttons dark:border-medusa-border-neutral-buttons-dark rounded border border-solid",
            "flex h-2 w-2 cursor-pointer items-center justify-center",
            "hover:!bg-medusa-button-neutral-hover dark:hover:!bg-medusa-button-neutral-hover-dark"
          )}
        >
          <IconReport />
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
