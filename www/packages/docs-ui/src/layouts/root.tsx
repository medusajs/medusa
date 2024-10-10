import React from "react"
import clsx from "clsx"
import { Sidebar, SidebarProps } from "@/components"
import { Toc } from "../components/Toc"
import { MainContentLayout, MainContentLayoutProps } from "./main-content"

export type RootLayoutProps = {
  showToc?: boolean
  sidebarProps?: SidebarProps
  showPagination?: boolean
  feedbackComponent?: React.ReactNode
  editComponent?: React.ReactNode
  showBreadcrumbs?: boolean
} & MainContentLayoutProps

export const RootLayout = ({
  sidebarProps,
  showToc = true,
  ...mainProps
}: RootLayoutProps) => {
  return (
    <>
      <Sidebar {...sidebarProps} />
      <div className={clsx("relative", "h-screen", "flex")}>
        <MainContentLayout {...mainProps} />
        {showToc && <Toc />}
      </div>
    </>
  )
}
