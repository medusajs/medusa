"use client"

import React from "react"
import { NavbarMobileMenuButton, NavbarMobileMenuButtonProps } from "./Button"
import { NavbarColorModeToggle } from "../ColorModeToggle"
import { NavbarSearchModalOpener } from "../SearchModalOpener"
import { useMobile } from "@/providers"
import clsx from "clsx"
import { NavbarLogo, NavbarLogoProps } from "../Logo"

export type NavbarMobileMenuProps = {
  menuButton: NavbarMobileMenuButtonProps
  logo: NavbarLogoProps
}

export const NavbarMobileMenu = ({
  menuButton,
  logo,
}: NavbarMobileMenuProps) => {
  const { isMobile } = useMobile()

  return (
    <div className="flex w-full items-center justify-between lg:hidden">
      {isMobile && (
        <>
          <NavbarMobileMenuButton
            {...menuButton}
            buttonProps={{
              ...(menuButton.buttonProps || {}),
              className: clsx(
                menuButton.buttonProps?.className,
                "!border-none !bg-transparent !bg-no-image !shadow-none"
              ),
            }}
          />
          <NavbarLogo
            {...logo}
            className="lg:hidden"
            imageClassName="mx-auto"
          />
          <div className="flex">
            <NavbarSearchModalOpener />
            <NavbarColorModeToggle
              buttonProps={{
                className:
                  "!border-none !bg-transparent !bg-no-image !shadow-none ml-docs_1",
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}
