import React, { type ReactNode, useRef, useContext } from "react"
import clsx from "clsx"
import { ThemeClassNames } from "@docusaurus/theme-common"
import { useDocsSidebar } from "@docusaurus/theme-common/internal"
import { useLocation } from "@docusaurus/router"
import DocSidebar from "@theme/DocSidebar"
import type { Props } from "@theme/DocPage/Layout/Sidebar"
import { SwitchTransition, CSSTransition } from "react-transition-group"
import { SidebarContext } from "@site/src/context/sidebar"

// Reset sidebar state when sidebar changes
// Use React key to unmount/remount the children
// See https://github.com/facebook/docusaurus/issues/3414
function ResetOnSidebarChange({ children }: { children: ReactNode }) {
  const sidebar = useDocsSidebar()
  return (
    <React.Fragment key={sidebar?.name ?? "noSidebar"}>
      {children}
    </React.Fragment>
  )
}

export default function DocPageLayoutSidebar({
  sidebar,
  hiddenSidebarContainer,
}: Props): JSX.Element {
  const { pathname } = useLocation()
  const sidebarContext = useContext(SidebarContext)
  const { name } = useDocsSidebar()
  const sidebarRef = useRef(null)

  return (
    <aside
      className={clsx(
        ThemeClassNames.docs.docSidebarContainer,
        "lg:tw-block lg:tw-w-sidebar lg:tw-transition-[left] lg:tw-ease-ease lg:tw-duration-200 lg:tw-left-0 tw-hidden",
        !hiddenSidebarContainer && "clip",
        hiddenSidebarContainer &&
          "lg:tw-fixed lg:tw-left-[-100%] lg:tw-rounded lg:tw-border-0 lg:tw-border-medusa-border-strong lg:dark:tw-border-medusa-border-strong-dark",
        hiddenSidebarContainer &&
          sidebarContext?.floatingSidebar &&
          "lg:!tw-left-0.5 lg:tw-top-[65px] lg:tw-z-20 lg:tw-bg-docs-bg lg:dark:tw-bg-docs-bg-dark lg:tw-shadow-flyout lg:dark:tw-shadow-flyout-dark"
      )}
      onTransitionEnd={(e) => {
        if (
          !e.currentTarget.classList.contains(
            ThemeClassNames.docs.docSidebarContainer
          )
        ) {
          return
        }

        if (hiddenSidebarContainer) {
          sidebarContext?.setHiddenSidebar(true)
        }
      }}
      onMouseLeave={() => {
        setTimeout(() => {
          if (!document.querySelector(".sidebar-toggler:hover")) {
            sidebarContext?.setFloatingSidebar(false)
          }
        }, 100)
      }}
      onMouseUp={(e) => {
        const target = e.target as Element
        console.log("here", target.classList)
        if (
          target.classList.contains("menu__list-item") ||
          target.parentElement.classList.contains("menu__list-item")
        ) {
          sidebarContext?.setFloatingSidebar(false)
        }
      }}
    >
      <SwitchTransition>
        <CSSTransition
          key={name}
          nodeRef={sidebarRef}
          classNames={{
            enter: "animate__animated animate__fadeInLeft animate__fastest",
            exit: "animate__animated animate__fadeOutLeft animate__fastest",
          }}
          timeout={200}
        >
          <div
            className={clsx(
              "lg:tw-top-[57px] lg:tw-sticky lg:tw-max-h-screen lg:[&>div]:tw-max-h-screen"
            )}
            ref={sidebarRef}
          >
            <ResetOnSidebarChange>
              <div>
                <DocSidebar
                  sidebar={sidebar}
                  path={pathname}
                  onCollapse={sidebarContext?.onCollapse}
                  isHidden={sidebarContext?.hiddenSidebar}
                />
              </div>
            </ResetOnSidebarChange>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </aside>
  )
}
