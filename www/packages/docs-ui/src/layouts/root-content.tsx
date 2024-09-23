"use client"

import React from "react"
import { MobileNavigation } from "../components/MobileNavigation"
import { RootLayoutProps, Sidebar, useLayout } from ".."
import clsx from "clsx"
import { MainContentLayout } from "./main-content"
import { Toc } from "../components/Toc"

type RootLayoutContentProps = Omit<
  RootLayoutProps,
  "ProvidersComponent" | "htmlClassName" | "bodyClassName"
>

export const RootLayoutContent = ({
  sidebarProps,
  showToc,
  ...mainProps
}: RootLayoutContentProps) => {
  const { showSidebar } = useLayout()

  return (
    <div
      className={clsx(
        "h-screen overflow-hidden",
        "grid grid-cols-1 lg:mx-auto",
        showSidebar && "lg:grid-cols-[221px_1fr]"
      )}
      id="mainContent"
    >
      <MobileNavigation />
      {showSidebar && <Sidebar {...sidebarProps} />}
      <div className={clsx("relative", "h-screen", "flex")}>
        <MainContentLayout {...mainProps} />
        {showToc && <Toc />}
      </div>
    </div>
  )
}
