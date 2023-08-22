"use client"

import { useCallback, useEffect, useState } from "react"
import NavbarMenuButton from "../MenuButton"
import NavbarMobileLogo from "../MobileLogo"
import SearchBar from "../../SearchBar"
import NavbarColorModeToggle from "../ColorModeToggle"

const MobileMenu = () => {
  const [isMobile, setIsMobile] = useState(false)

  const handleResize = useCallback(() => {
    if (window.innerWidth < 1025 && !isMobile) {
      setIsMobile(true)
    } else if (window.innerWidth >= 1025 && isMobile) {
      setIsMobile(false)
    }
  }, [isMobile])

  useEffect(() => {
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [handleResize])

  useEffect(() => {
    handleResize()
  }, [])

  return (
    <div className="flex w-full items-center justify-between lg:hidden">
      {isMobile && (
        <>
          <NavbarMenuButton
            buttonProps={{
              className:
                "!border-none !bg-transparent !bg-no-image !shadow-none",
            }}
          />
          <NavbarMobileLogo />
          <div className="flex">
            <SearchBar />
            <NavbarColorModeToggle
              buttonProps={{
                className:
                  "!border-none !bg-transparent !bg-no-image !shadow-none ml-1",
              }}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default MobileMenu
