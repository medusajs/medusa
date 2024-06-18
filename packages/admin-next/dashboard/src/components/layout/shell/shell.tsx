import * as Dialog from "@radix-ui/react-dialog"

import {
  ArrowRightOnRectangle,
  BellAlert,
  BookOpen,
  Calendar,
  CircleHalfSolid,
  CogSixTooth,
  MagnifyingGlass,
  SidebarLeft,
  TriangleRightMini,
  User as UserIcon,
} from "@medusajs/icons"
import { Avatar, DropdownMenu, IconButton, Kbd, Text, clx } from "@medusajs/ui"
import { PropsWithChildren } from "react"
import {
  Link,
  Outlet,
  UIMatch,
  useLocation,
  useMatches,
  useNavigate,
} from "react-router-dom"

import { Skeleton } from "../../common/skeleton"

import { useLogout } from "../../../hooks/api/auth"
import { useMe } from "../../../hooks/api/users"
import { queryClient } from "../../../lib/query-client"
import { useSearch } from "../../../providers/search-provider"
import { useSidebar } from "../../../providers/sidebar-provider"
import { useTheme } from "../../../providers/theme-provider"

export const Shell = ({ children }: PropsWithChildren) => {
  return (
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

const UserBadge = () => {
  const { user, isLoading, isError, error } = useMe()

  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ")
  const displayName = name || user?.email

  const fallback = displayName ? displayName[0].toUpperCase() : null

  if (isLoading) {
    return (
      <button className="shadow-borders-base flex max-w-[192px] select-none items-center gap-x-2 overflow-hidden text-ellipsis whitespace-nowrap rounded-full py-1 pl-1 pr-2.5">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-[9px] w-[70px]" />
      </button>
    )
  }

  if (isError) {
    throw error
  }

  return (
    <DropdownMenu.Trigger asChild>
      <button
        disabled={!user}
        className={clx(
          "shadow-borders-base flex max-w-[192px] select-none items-center gap-x-2 overflow-hidden text-ellipsis whitespace-nowrap rounded-full py-1 pl-1 pr-2.5 outline-none"
        )}
      >
        {fallback ? (
          <Avatar size="xsmall" fallback={fallback} />
        ) : (
          <Skeleton className="h-5 w-5 rounded-full" />
        )}
        {displayName ? (
          <Text
            size="xsmall"
            weight="plus"
            leading="compact"
            className="truncate"
          >
            {displayName}
          </Text>
        ) : (
          <Skeleton className="h-[9px] w-[70px]" />
        )}
      </button>
    </DropdownMenu.Trigger>
  )
}

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()

  return (
    <DropdownMenu.SubMenu>
      <DropdownMenu.SubMenuTrigger className="rounded-md">
        <CircleHalfSolid className="text-ui-fg-subtle mr-2" />
        Theme
      </DropdownMenu.SubMenuTrigger>
      <DropdownMenu.SubMenuContent>
        <DropdownMenu.RadioGroup value={theme}>
          <DropdownMenu.RadioItem
            value="light"
            onClick={(e) => {
              e.preventDefault()
              setTheme("light")
            }}
          >
            Light
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem
            value="dark"
            onClick={(e) => {
              e.preventDefault()
              setTheme("dark")
            }}
          >
            Dark
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.SubMenuContent>
    </DropdownMenu.SubMenu>
  )
}

const Logout = () => {
  const navigate = useNavigate()
  const { mutateAsync: logoutMutation } = useLogout()

  const handleLayout = async () => {
    await logoutMutation(undefined, {
      onSuccess: () => {
        /**
         * When the user logs out, we want to clear the query cache
         */
        queryClient.clear()
        navigate("/login")
      },
    })
  }

  return (
    <DropdownMenu.Item onClick={handleLayout}>
      <div className="flex items-center gap-x-2">
        <ArrowRightOnRectangle className="text-ui-fg-subtle" />
        <span>Logout</span>
      </div>
    </DropdownMenu.Item>
  )
}

const Profile = () => {
  const location = useLocation()

  return (
    <Link to="/settings/profile" state={{ from: location.pathname }}>
      <DropdownMenu.Item>
        <UserIcon className="text-ui-fg-subtle mr-2" />
        Profile
      </DropdownMenu.Item>
    </Link>
  )
}

const LoggedInUser = () => {
  return (
    <DropdownMenu>
      <UserBadge />
      <DropdownMenu.Content align="center">
        <Profile />
        <DropdownMenu.Separator />
        <Link
          // TODO change link once docs are public
          to="https://medusa-docs-v2-git-docs-v2-medusajs.vercel.app/"
          target="_blank"
        >
          <DropdownMenu.Item>
            <BookOpen className="text-ui-fg-subtle mr-2" />
            Documentation
          </DropdownMenu.Item>
        </Link>
        <Link to="https://medusajs.com/changelog/" target="_blank">
          <DropdownMenu.Item>
            <Calendar className="text-ui-fg-subtle mr-2" />
            Changelog
          </DropdownMenu.Item>
        </Link>
        <DropdownMenu.Separator />
        <ThemeToggle />
        <DropdownMenu.Separator />
        <Logout />
      </DropdownMenu.Content>
    </DropdownMenu>
  )
}

const SettingsLink = () => {
  const location = useLocation()

  return (
    <Link
      to="/settings"
      className="flex items-center justify-center"
      state={{ from: location.pathname }}
    >
      <IconButton
        size="small"
        variant="transparent"
        className="text-ui-fg-muted transition-fg hover:text-ui-fg-subtle"
      >
        <CogSixTooth />
      </IconButton>
    </Link>
  )
}

const ToggleNotifications = () => {
  return (
    <IconButton
      size="small"
      variant="transparent"
      className="text-ui-fg-muted transition-fg hover:text-ui-fg-subtle"
    >
      <BellAlert />
    </IconButton>
  )
}

const Searchbar = () => {
  const { toggleSearch } = useSearch()

  return (
    <button
      onClick={toggleSearch}
      className="shadow-borders-base bg-ui-bg-subtle hover:bg-ui-bg-subtle-hover transition-fg focus-visible:shadow-borders-focus text-ui-fg-muted flex w-full max-w-[280px] select-none items-center gap-x-2 rounded-full py-1.5 pl-2 pr-1.5 outline-none"
    >
      <MagnifyingGlass />
      <div className="flex-1 text-left">
        <Text size="small" leading="compact">
          Jump to or search
        </Text>
      </div>
      <Kbd className="rounded-full">⌘K</Kbd>
    </button>
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
      >
        <SidebarLeft className="text-ui-fg-muted" />
      </IconButton>
      <IconButton
        className="hidden max-lg:flex"
        variant="transparent"
        onClick={() => toggle("mobile")}
      >
        <SidebarLeft className="text-ui-fg-muted" />
      </IconButton>
    </div>
  )
}

const Topbar = () => {
  return (
    <div className="grid w-full grid-cols-3 border-b p-3">
      <div className="flex items-center gap-x-1.5">
        <ToggleSidebar />
        <Breadcrumbs />
      </div>
      <div className="flex items-center justify-center">
        <Searchbar />
      </div>
      <div className="flex items-center justify-end gap-x-3">
        <div className="text-ui-fg-muted flex items-center gap-x-1">
          <ToggleNotifications />
          <SettingsLink />
        </div>
        <LoggedInUser />
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
  const { mobile, toggle } = useSidebar()

  return (
    <Dialog.Root open={mobile} onOpenChange={() => toggle("mobile")}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-ui-bg-overlay fixed inset-0" />
        <Dialog.Content className="bg-ui-bg-subtle fixed inset-y-0 left-0 h-screen w-full max-w-[240px] border-r">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
