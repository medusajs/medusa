import React, { type ReactNode, useRef } from "react"
import clsx from "clsx"
import { ThemeClassNames } from "@docusaurus/theme-common"
import { useDocsSidebar } from "@docusaurus/theme-common/internal"
import { useLocation } from "@docusaurus/router"
import DocSidebar from "@theme/DocSidebar"
import type { Props } from "@theme/DocRoot/Layout/Sidebar"
import { useSidebar } from "../../../../providers/Sidebar"
import { CSSTransition, SwitchTransition } from "react-transition-group"

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

export default function DocRootLayoutSidebar({
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
        "min-[997px]:block min-[997px]:w-sidebar min-[997px]:transition-[left] min-[997px]:ease-ease min-[997px]:duration-200 min-[997px]:left-0 hidden",
        !hiddenSidebarContainer && "clip",
        hiddenSidebarContainer &&
          "min-[997px]:fixed min-[997px]:left-[-100%] min-[997px]:rounded min-[997px]:border-0 min-[997px]:border-medusa-border-strong",
        hiddenSidebarContainer &&
          sidebarContext?.floatingSidebar &&
          "min-[997px]:!left-0.5 min-[997px]:top-[65px] min-[997px]:z-20 min-[997px]:bg-docs-bg min-[997px]:shadow-flyout min-[997px]:dark:shadow-flyout-dark"
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
            enter: "animate-fadeInLeft animate-fast",
            exit: "animate-fadeOutLeft animate-fast",
          }}
          timeout={200}
        >
          <div
            className={clsx(
              "min-[997px]:top-[57px] min-[997px]:sticky min-[997px]:max-h-screen min-[997px]:[&>div]:max-h-screen"
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
