"use client"

import React, { useRef, useState } from "react"
import { Button } from "../../Button"
import { ArrowUturnLeft, BarsThree, XMark } from "@medusajs/icons"
import clsx from "clsx"
import { MenuItem } from "types"
import { CSSTransition, SwitchTransition } from "react-transition-group"
import { MainNavMobileMainMenu } from "./Main"
import { MainNavMobileSubMenu } from "./SubMenu"

export type SelectedMenu = {
  title: string
  menu: MenuItem[]
}

export const MainNavMobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu>()
  const ref = useRef(null)

  return (
    <div className="flex lg:hidden justify-center items-center">
      <Button
        variant="transparent"
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-medusa-fg-subtle !p-[6.5px]"
      >
        {!isOpen && <BarsThree />}
        {isOpen && <XMark />}
      </Button>
      <div
        className={clsx(
          "flex items-center justify-center fixed w-full h-[calc(100vh-52px)]",
          "top-[52px] transition-[left] bg-medusa-bg-subtle z-50",
          !isOpen && "-left-full",
          isOpen && "left-0"
        )}
      >
        <SwitchTransition>
          <CSSTransition
            key={!selectedMenu ? "main" : "sub"}
            classNames={{
              enter: "animate-fadeInLeft animate-fast",
              exit: "animate-fadeOutRight animate-fast",
            }}
            nodeRef={ref}
            timeout={250}
          >
            <div ref={ref} className="w-full px-docs_1.5">
              {!selectedMenu && (
                <MainNavMobileMainMenu setSelectedMenu={setSelectedMenu} />
              )}
              {selectedMenu && (
                <>
                  <div
                    className={clsx(
                      "flex items-center gap-docs_0.5",
                      "text-medusa-fg-base my-[14px]",
                      "cursor-pointer"
                    )}
                    tabIndex={-1}
                    onClick={() => setSelectedMenu(undefined)}
                  >
                    <ArrowUturnLeft />
                    <span className="text-h1">Back</span>
                  </div>
                  <MainNavMobileSubMenu {...selectedMenu} />
                </>
              )}
            </div>
          </CSSTransition>
        </SwitchTransition>
      </div>
    </div>
  )
}
