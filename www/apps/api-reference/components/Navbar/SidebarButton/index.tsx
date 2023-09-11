"use client"

import IconSidebar from "@/components/Icons/Sidebar"
import Tooltip from "@/components/Tooltip"
import NavbarIconButton from "../IconButton"
import { useSidebar } from "../../../providers/sidebar"
import clsx from "clsx"
import { useEffect, useState } from "react"

const NavbarSidebarButton = () => {
  const { desktopSidebarOpen, setDesktopSidebarOpen } = useSidebar()
  const [isApple, setIsApple] = useState(false)

  const toggleSidebar = () => {
    setDesktopSidebarOpen((prevValue) => !prevValue)
  }

  useEffect(() => {
    setIsApple(navigator.userAgent.toLowerCase().indexOf("mac") !== 0)
    function isEditingContent(event: KeyboardEvent) {
      const element = event.target as HTMLElement
      const tagName = element.tagName
      return (
        element.isContentEditable ||
        tagName === "INPUT" ||
        tagName === "SELECT" ||
        tagName === "TEXTAREA"
      )
    }

    function sidebarShortcut(e: KeyboardEvent) {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "i" &&
        !isEditingContent(e)
      ) {
        e.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", sidebarShortcut)

    return () => {
      window.removeEventListener("keydown", sidebarShortcut)
    }
  }, [])

  const getPlatformKey = () =>
    `
    <kbd class="${clsx(
      "bg-medusa-tag-neutral-bg dark:bg-medusa-tag-neutral-bg-dark",
      "border border-solid rounded-sm border-medusa-tag-neutral-border dark:border-medusa-tag-neutral-border-dark",
      "text-medusa-tag-neutral-text dark:text-medusa-tag-neutral-text font-base text-compact-x-small-plus",
      "inline-flex !p-0 justify-center items-center shadow-none ml-0.5",
      isApple && "w-[22px] h-[22px]",
      !isApple && "w-1.5 h-1.5"
    )}">${isApple ? "⌘" : "Ctrl"}</kbd>
    `

  return (
    <Tooltip
      html={
        desktopSidebarOpen
          ? `<span class="text-compact-x-small-plus">Close sidebar ${getPlatformKey()}
        <kbd class="${clsx(
          "bg-medusa-tag-neutral-bg dark:bg-medusa-tag-neutral-bg-dark",
          "border border-solid rounded-sm border-medusa-tag-neutral-border dark:border-medusa-tag-neutral-border-dark",
          "text-medusa-tag-neutral-text dark:text-medusa-tag-neutral-text font-base text-compact-x-small-plus",
          "inline-flex w-[22px] h-[22px] !p-0 justify-center items-center shadow-none"
        )}">I</kbd></span>`
          : `<span class="text-compact-x-small-plus">Lock sidebar open ${getPlatformKey()}
      <kbd class="${clsx(
        "bg-medusa-tag-neutral-bg dark:bg-medusa-tag-neutral-bg-dark",
        "border border-solid rounded-sm border-medusa-tag-neutral-border dark:border-medusa-tag-neutral-border-dark",
        "text-medusa-tag-neutral-text dark:text-medusa-tag-neutral-text font-base text-compact-x-small-plus",
        "inline-flex w-[22px] h-[22px] !p-0 justify-center items-center shadow-none"
      )}">I</kbd></span>`
      }
    >
      <NavbarIconButton onClick={toggleSidebar}>
        <IconSidebar iconColorClassName="stroke-medusa-fg-muted dark:stroke-medusa-fg-muted-dark" />
      </NavbarIconButton>
    </Tooltip>
  )
}

export default NavbarSidebarButton
