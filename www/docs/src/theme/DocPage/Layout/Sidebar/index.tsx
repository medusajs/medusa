import React, { type ReactNode, useState, useCallback, useRef } from "react"
import clsx from "clsx"
import { ThemeClassNames } from "@docusaurus/theme-common"
import { useDocsSidebar } from "@docusaurus/theme-common/internal"
import { useLocation } from "@docusaurus/router"
import DocSidebar from "@theme/DocSidebar"
import ExpandButton from "@theme/DocPage/Layout/Sidebar/ExpandButton"
import type { Props } from "@theme/DocPage/Layout/Sidebar"
import { SwitchTransition, CSSTransition } from "react-transition-group"

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
  setHiddenSidebarContainer,
}: Props): JSX.Element {
  const { pathname } = useLocation()

  const [hiddenSidebar, setHiddenSidebar] = useState(false)
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false)
    }
    setHiddenSidebarContainer((value) => !value)
  }, [setHiddenSidebarContainer, hiddenSidebar])

  const { name } = useDocsSidebar()
  const sidebarRef = useRef(null)

  return (
    <aside
      className={clsx(
        ThemeClassNames.docs.docSidebarContainer,
        "lg:tw-block lg:tw-w-sidebar lg:tw-will-change-[width] lg:tw-transition-[width] lg:tw-ease-ease tw-clip tw-hidden tw-duration-200",
        hiddenSidebarContainer && "lg:tw-w-sidebar-hidden lg:tw-cursor-pointer"
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
          setHiddenSidebar(true)
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
                  onCollapse={toggleSidebar}
                  isHidden={hiddenSidebar}
                />
                {hiddenSidebar && (
                  <ExpandButton toggleSidebar={toggleSidebar} />
                )}
              </div>
            </ResetOnSidebarChange>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </aside>
  )
}
