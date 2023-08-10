import React, { type ReactNode, useRef } from "react"
import clsx from "clsx"
import { ThemeClassNames } from "@docusaurus/theme-common"
import { useDocsSidebar } from "@docusaurus/theme-common/internal"
import { useLocation } from "@docusaurus/router"
import DocSidebar from "@theme/DocSidebar"
import type { Props } from "@theme/DocPage/Layout/Sidebar"
import { SwitchTransition, CSSTransition } from "react-transition-group"
import { useSidebar } from "@site/src/providers/Sidebar"

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
  const sidebarContext = useSidebar()
  const { name } = useDocsSidebar()
  const sidebarRef = useRef(null)

  return (
    <aside
      className={clsx(
        ThemeClassNames.docs.docSidebarContainer,
        "lg:block lg:w-sidebar lg:transition-[left] lg:ease-ease lg:duration-200 lg:left-0 hidden",
        !hiddenSidebarContainer && "clip",
        hiddenSidebarContainer &&
          "lg:fixed lg:left-[-100%] lg:rounded lg:border-0 lg:border-medusa-border-strong lg:dark:border-medusa-border-strong-dark",
        hiddenSidebarContainer &&
          sidebarContext?.floatingSidebar &&
          "lg:!left-0.5 lg:top-[65px] lg:z-20 lg:bg-docs-bg lg:dark:bg-docs-bg-dark lg:shadow-flyout lg:dark:shadow-flyout-dark"
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
              "lg:top-[57px] lg:sticky lg:max-h-screen lg:[&>div]:max-h-screen"
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
