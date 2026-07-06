import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { NavigationItemDropdown, MenuItem } from "types"
import { ButtonProps } from "../../Button"

// mock data
const mockConfig = {
  baseUrl: "https://docs.medusajs.com",
  logo: "/logo.png",
  features: {
    aiAssistant: true,
  },
}

const defaultUseSiteConfigReturn = {
  config: mockConfig,
}

// mock functions
const mockSetMobileSidebarOpen = vi.fn()
const mockUseSiteConfig = vi.fn(() => defaultUseSiteConfigReturn)

const defaultUseSidebarReturn = {
  setMobileSidebarOpen: mockSetMobileSidebarOpen,
  isSidebarShown: true,
}

const defaultUseLayoutReturn = {
  showCollapsedNavbar: false,
  mainContentRef: React.createRef<HTMLDivElement>(),
}
const mockUseSidebar = vi.fn(() => defaultUseSidebarReturn)
const mockUseLayout = vi.fn(() => defaultUseLayoutReturn)

const defaultUseMainNavReturn = {
  logo: undefined as React.ReactNode | undefined,
  logoUrl: undefined as string | undefined,
  helpNavItem: undefined as
    | NavigationItemDropdown
    | undefined,
  additionalMenuItems: undefined as
    | MenuItem[]
    | undefined,
  navItems: [],
}
const mockUseMainNav = vi.fn(() => defaultUseMainNavReturn)

// mock components
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))

vi.mock("@/providers/Sidebar", () => ({
  useSidebar: () => mockUseSidebar(),
}))

vi.mock("@/providers/Layout", () => ({
  useLayout: () => mockUseLayout(),
}))

vi.mock("@/providers/MainNav", () => ({
  useMainNav: () => mockUseMainNav(),
}))

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock("@/components/Icons", () => ({
  ColoredMedusaIcon: ({ variant }: { variant?: string }) => (
    <svg data-testid="logo-icon" data-variant={variant} />
  ),
}))

vi.mock("@/components/Button", () => ({
  Button: (props: ButtonProps) => <button {...props} />,
}))

vi.mock("@/components/Search/ModalOpener", () => ({
  SearchModalOpener: () => <div data-testid="search-modal-opener" />,
}))

vi.mock("@/components/AiAssistant/TriggerButton", () => ({
  AiAssistantTriggerButton: () => <div data-testid="ai-assistant-trigger" />,
}))

vi.mock("@/components/Icons/SidebarLeft", () => ({
  SidebarLeftIcon: () => <svg data-testid="sidebar-left-icon" />,
}))

vi.mock("@/components/MainNav/Items", () => ({
  MainNavItems: ({ className }: { className?: string }) => (
    <ul data-testid="nav-items" className={className} />
  ),
}))

vi.mock("@/components/MainNav/DesktopMenu", () => ({
  MainNavDesktopMenu: () => <div data-testid="desktop-menu" />,
}))

vi.mock("@/components/MainNav/MobileMenu", () => ({
  MainNavMobileMenu: () => <div data-testid="mobile-menu" />,
}))

vi.mock("@/components/MainNav/Version", () => ({
  MainNavVersion: () => <div data-testid="version" />,
}))

vi.mock("@/components/MainNav/Items/Dropdown", () => ({
  MainNavItemDropdown: ({
    item,
    className,
    wrapperClassName,
  }: {
    item: unknown
    className?: string
    wrapperClassName?: string
  }) => (
    <div
      data-testid="help-dropdown"
      className={className}
      data-wrapper-class={wrapperClassName}
    >
      {JSON.stringify(item)}
    </div>
  ),
}))

import { MainNav } from "../../MainNav"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseSidebar.mockReturnValue(defaultUseSidebarReturn)
  mockUseLayout.mockReturnValue(defaultUseLayoutReturn)
  mockUseMainNav.mockReturnValue(defaultUseMainNavReturn)
  mockUseSiteConfig.mockReturnValue(defaultUseSiteConfigReturn)
})

describe("rendering", () => {
  test("renders main nav", () => {
    const { container } = render(<MainNav />)
    const nav = container.querySelector("[data-testid='main-nav']")
    expect(nav).toBeInTheDocument()
    const logoLink = container.querySelector("[data-testid='logo-link']")
    expect(logoLink).toBeInTheDocument()
    const icon = container.querySelector("[data-testid='logo-icon']")
    expect(icon).toBeInTheDocument()
    const searchOpener = container.querySelector(
      "[data-testid='search-modal-opener']"
    )
    expect(searchOpener).toBeInTheDocument()
    const aiTrigger = container.querySelector(
      "[data-testid='ai-assistant-trigger']"
    )
    expect(aiTrigger).toBeInTheDocument()
    const desktopMenu = container.querySelector("[data-testid='desktop-menu']")
    expect(desktopMenu).toBeInTheDocument()
    const mobileMenu = container.querySelector("[data-testid='mobile-menu']")
    expect(mobileMenu).toBeInTheDocument()
    const version = container.querySelector("[data-testid='version']")
    const helpDropdown = container.querySelector(
      "[data-testid='help-dropdown']"
    )
    expect(version).toBeInTheDocument()
    expect(helpDropdown).toBeInTheDocument()
  })

  test("does not render ai assistant trigger when ai assistant feature is disabled", () => {
    mockUseSiteConfig.mockReturnValueOnce({
      config: {
        ...mockConfig,
        features: {
          aiAssistant: false,
        },
      },
    })
    const { container } = render(<MainNav />)
    const aiTrigger = container.querySelector(
      "[data-testid='ai-assistant-trigger']"
    )
    expect(aiTrigger).not.toBeInTheDocument()
  })

  test("renders nav items when not collapsed", () => {
    const { container } = render(<MainNav />)
    const navItems = container.querySelector("[data-testid='nav-items']")
    expect(navItems).toBeInTheDocument()
  })

  test("renders mobile sidebar button when sidebar is shown", () => {
    const { container } = render(<MainNav />)
    const button = container.querySelector(
      "[data-testid='mobile-sidebar-button']"
    )
    expect(button).toBeInTheDocument()
  })

  test("does not render mobile sidebar button when sidebar is not shown", () => {
    mockUseSidebar.mockReturnValueOnce({
      ...defaultUseSidebarReturn,
      isSidebarShown: false,
      setMobileSidebarOpen: mockSetMobileSidebarOpen,
    })
    const { container } = render(<MainNav />)
    const button = container.querySelector(
      "[data-testid='mobile-sidebar-button']"
    )
    expect(button).not.toBeInTheDocument()
  })

  test("applies custom className", () => {
    const { container } = render(<MainNav className="custom-class" />)
    const nav = container.querySelector("[data-testid='main-nav']")
    expect(nav).toHaveClass("custom-class")
  })

  test("applies custom itemsClassName", () => {
    const { container } = render(
      <MainNav itemsClassName="custom-items-class" />
    )
    const navItems = container.querySelector("[data-testid='nav-items']")
    expect(navItems).toHaveClass("custom-items-class")
  })

  test("always shows border-b on nav content regardless of collapse state", () => {
    const { container } = render(<MainNav />)
    const topBar = container.querySelector("[data-testid='main-nav-content']")
    expect(topBar).toBeInTheDocument()
    expect(topBar).toHaveClass("border-b")
    expect(topBar).toHaveClass("border-medusa-border-base")
  })

  test("adjusts layout when collapsed", () => {
    mockUseLayout.mockReturnValueOnce({
      ...defaultUseLayoutReturn,
      showCollapsedNavbar: true,
    })
    const { container } = render(<MainNav />)
    const topBar = container.querySelector("[data-testid='main-nav-content']")
    expect(topBar).toBeInTheDocument()
    expect(topBar).toHaveClass("border-b border-medusa-border-base")
    const actionsContainer = container.querySelector(
      "[data-testid='main-nav-actions']"
    )
    expect(actionsContainer).toBeInTheDocument()
    expect(actionsContainer).toHaveClass("flex-grow justify-between")
    const collapsedNavItems = container.querySelector(
      "[data-testid='collapsed-nav-items']"
    )
    expect(collapsedNavItems).toBeInTheDocument()
  })

  test("renders custom logo when provided", () => {
    mockUseMainNav.mockReturnValueOnce({
      ...defaultUseMainNavReturn,
      logo: <div data-testid="custom-logo">Custom Logo</div>,
    })
    const { container } = render(<MainNav />)
    const customLogo = container.querySelector("[data-testid='custom-logo']")
    expect(customLogo).toBeInTheDocument()
    expect(customLogo).toHaveTextContent("Custom Logo")
    const defaultLogo = container.querySelector("[data-testid='logo-icon']")
    expect(defaultLogo).not.toBeInTheDocument()
  })

  test("renders default logo when custom logo not provided", () => {
    const { container } = render(<MainNav />)
    const defaultLogo = container.querySelector("[data-testid='logo-icon']")
    expect(defaultLogo).toBeInTheDocument()
  })

  test("uses custom logoUrl when provided", () => {
    mockUseMainNav.mockReturnValueOnce({
      ...defaultUseMainNavReturn,
      logoUrl: "https://custom-url.com",
    })
    const { container } = render(<MainNav />)
    const logoLink = container.querySelector("[data-testid='logo-link']")
    expect(logoLink).toHaveAttribute("href", "https://custom-url.com")
  })

  test("uses baseUrl as logoUrl when custom logoUrl not provided", () => {
    const { container } = render(<MainNav />)
    const logoLink = container.querySelector("[data-testid='logo-link']")
    expect(logoLink).toHaveAttribute("href", mockConfig.baseUrl)
  })

  test("renders custom helpNavItem when provided", () => {
    const customHelpItem = {
      type: "dropdown" as const,
      title: "Custom Help",
      children: [
        {
          type: "link" as const,
          title: "Custom Support",
          link: "https://custom-support.com",
        },
      ],
    }
    mockUseMainNav.mockReturnValueOnce({
      ...defaultUseMainNavReturn,
      helpNavItem: customHelpItem,
    })
    const { container } = render(<MainNav />)
    const helpDropdown = container.querySelector(
      "[data-testid='help-dropdown']"
    )
    expect(helpDropdown).toBeInTheDocument()
    expect(helpDropdown?.textContent).toContain("Custom Help")
    expect(helpDropdown?.textContent).toContain("Custom Support")
  })

  test("renders default help dropdown when custom helpNavItem not provided", () => {
    const { container } = render(<MainNav />)
    const helpDropdown = container.querySelector(
      "[data-testid='help-dropdown']"
    )
    expect(helpDropdown).toBeInTheDocument()
    expect(helpDropdown?.textContent).toContain("Help")
    expect(helpDropdown?.textContent).toContain("Troubleshooting")
  })
})

describe("interaction", () => {
  test("opens mobile sidebar when button is clicked", () => {
    const { container } = render(<MainNav />)
    const button = container.querySelector(
      "[data-testid='mobile-sidebar-button']"
    )
    fireEvent.click(button!)
    expect(mockSetMobileSidebarOpen).toHaveBeenCalledWith(true)
  })
})
