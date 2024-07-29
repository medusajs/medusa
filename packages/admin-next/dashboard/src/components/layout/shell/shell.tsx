import * as Dialog from "@radix-ui/react-dialog"

import { SidebarLeft, TriangleRightMini, XMark } from "@medusajs/icons"
import { IconButton, clx } from "@medusajs/ui"
import { PropsWithChildren } from "react"
import { Link, Outlet, UIMatch, useMatches } from "react-router-dom"

import { useTranslation } from "react-i18next"
import { KeybindProvider } from "../../../providers/keybind-provider"
import { useGlobalShortcuts } from "../../../providers/keybind-provider/hooks"
import { useSidebar } from "../../../providers/sidebar-provider"
import { Notifications } from "../notifications"

export const Shell = ({ children }: PropsWithChildren) => {
  const globalShortcuts = useGlobalShortcuts()

  return (
    <KeybindProvider shortcuts={globalShortcuts}>
      <div className="flex h-screen flex-col items-start overflow-hidden lg:flex-row">
        <div>
          <MobileSidebarContainer>{children}</MobileSidebarContainer>
          <DesktopSidebarContainer>{children}</DesktopSidebarContainer>
        </div>
        <div className="flex h-screen w-full flex-col overflow-auto">
          <Topbar />
          <main className="flex h-full w-full flex-col items-center overflow-y-auto">
            <Gutter>
              <Outlet />
            </Gutter>
          </main>
        </div>
      </div>
    </KeybindProvider>
  )
}

const Gutter = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex w-full max-w-[1600px] flex-col gap-y-2 p-3">
      {children}
    </div>
  )
}

const Breadcrumbs = () => {
  const matches = useMatches() as unknown as UIMatch<
    unknown,
    { crumb?: (data?: unknown) => string }
  >[]

  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => {
      const handle = match.handle

      return {
        label: handle.crumb!(match.data),
        path: match.pathname,
      }
    })

  return (
    <ol
      className={clx(
        "text-ui-fg-muted txt-compact-small-plus flex select-none items-center"
      )}
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1
        const isSingle = crumbs.length === 1

        return (
          <li key={index} className={clx("flex items-center")}>
            {!isLast ? (
              <Link
                className="transition-fg hover:text-ui-fg-subtle"
                to={crumb.path}
              >
                {crumb.label}
              </Link>
            ) : (
              <div>
                {!isSingle && <span className="block lg:hidden">...</span>}
                <span
                  key={index}
                  className={clx({
                    "hidden lg:block": !isSingle,
                  })}
                >
                  {crumb.label}
                </span>
              </div>
            )}
            {!isLast && (
              <span className="mx-2">
                <TriangleRightMini />
              </span>
            )}
          </li>
        )
      })}
    </ol>
  )
}

const ToggleSidebar = () => {
  const { toggle } = useSidebar()

  return (
    <div>
      <IconButton
        className="hidden lg:flex"
        variant="transparent"
        onClick={() => toggle("desktop")}
        size="small"
      >
        <SidebarLeft className="text-ui-fg-muted" />
      </IconButton>
      <IconButton
        className="hidden max-lg:flex"
        variant="transparent"
        onClick={() => toggle("mobile")}
        size="small"
      >
        <SidebarLeft className="text-ui-fg-muted" />
      </IconButton>
    </div>
  )
}

const Topbar = () => {
  return (
    <div className="grid w-full grid-cols-2 border-b p-3">
      <div className="flex items-center gap-x-1.5">
        <ToggleSidebar />
        <Breadcrumbs />
      </div>
      <div className="flex items-center justify-end gap-x-3">
        <Notifications />
      </div>
    </div>
  )
}

const DesktopSidebarContainer = ({ children }: PropsWithChildren) => {
  const { desktop } = useSidebar()

  return (
    <div
      className={clx("hidden h-screen w-[220px] border-r", {
        "lg:flex": desktop,
      })}
    >
      {children}
    </div>
  )
}

const MobileSidebarContainer = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation()
  const { mobile, toggle } = useSidebar()

  return (
    <Dialog.Root open={mobile} onOpenChange={() => toggle("mobile")}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={clx(
            "bg-ui-bg-overlay fixed inset-0",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <Dialog.Content
          className={clx(
            "bg-ui-bg-subtle shadow-elevation-modal fixed inset-y-2 left-2 flex w-full max-w-[304px] flex-col overflow-hidden rounded-lg border-r",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 duration-200"
          )}
        >
          <div className="p-3">
            <Dialog.Close asChild>
              <IconButton
                size="small"
                variant="transparent"
                className="text-ui-fg-subtle"
              >
                <XMark />
              </IconButton>
            </Dialog.Close>
            <Dialog.Title className="sr-only">
              {t("app.nav.accessibility.title")}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              {t("app.nav.accessibility.description")}
            </Dialog.Description>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
