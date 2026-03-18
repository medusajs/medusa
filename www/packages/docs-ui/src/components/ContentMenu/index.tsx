"use client"

import clsx from "clsx"
import React from "react"
import { ContentMenuToc } from "./Toc"
import { ContentMenuActions } from "./Actions"
import { ContentMenuProducts } from "./Products"
import { useLayout } from "../../providers/Layout"
import { ShadedBlock } from "../ShadedBlock"
import { ContentMenuWhatsNew } from "./WhatsNew"

export const ContentMenu = () => {
  const { showCollapsedNavbar } = useLayout()

  return (
    <div
      className={clsx(
        "hidden lg:flex w-full max-w-sidebar-lg",
        "flex-col gap-docs_2 pb-docs_1.5",
        "fixed top-[57px] right-docs_0.25 z-10",
        "border-l border-medusa-border-base h-full",
        showCollapsedNavbar && "max-h-[calc(100%-112px)]",
        !showCollapsedNavbar && "max-h-[calc(100%-56px)]"
      )}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        <ContentMenuToc />
        <ContentMenuActions />
        <ContentMenuProducts />
        <ContentMenuWhatsNew />
        <div className="p-docs_1">
          <ShadedBlock className="!h-docs_2" />
        </div>
      </div>
    </div>
  )
}
