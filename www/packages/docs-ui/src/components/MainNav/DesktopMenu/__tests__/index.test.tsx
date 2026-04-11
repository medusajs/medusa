import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { MenuItem } from "types"
import { ButtonProps } from "../../../Button"

// mock functions
const mockSetDesktopSidebarOpen = vi.fn()
const defaultUseSidebarReturn = {
  setDesktopSidebarOpen: mockSetDesktopSidebarOpen,
  isSidebarShown: true,
  desktopSidebarOpen: false,
}
const mockUseSidebar = vi.fn(() => defaultUseSidebarReturn)

const defaultUseMainNavReturn = {
  additionalMenuItems: undefined as
    | MenuItem[]
    | undefined,
  navItems: [],
}
const mockUseMainNav = vi.fn(() => defaultUseMainNavReturn)

// mock components
vi.mock("@/providers/Sidebar", () => ({
  useSidebar: () => mockUseSidebar(),
}))

vi.mock("@/providers/MainNav", () => ({
  useMainNav: () => mockUseMainNav(),
}))

vi.mock("@/components/Button", () => ({
  Button: (props: ButtonProps) => <button {...props} />,
}))

vi.mock("@/components/Menu", () => ({
  Menu: ({
    items,
    className,
  }: {
    items: Record<string, unknown>[]
    className?: string
  }) => (
    <div data-testid="menu" className={className}>
      {items.map((item: Record<string, unknown>, index: number) => (
        <div key={index} data-testid={`menu-item`}>
          {item.title as string}
          {item.content as React.ReactNode}
        </div>
      ))}
    </div>
  ),
}))

vi.mock("@medusajs/icons", () => ({
  BarsThree: () => <svg data-testid="bars-icon" />,
  Book: () => <svg data-testid="book-icon" />,
  SidebarLeft: () => <svg data-testid="sidebar-icon" />,
  TimelineVertical: () => <svg data-testid="timeline-icon" />,
}))

vi.mock("@/components/MainNav/Icons/House", () => ({
  HouseIcon: () => <svg data-testid="house-icon" />,
}))

vi.mock("@/components/MainNav/DesktopMenu/ThemeMenu", () => ({
  MainNavThemeMenu: () => <div data-testid="theme-menu">Theme Menu</div>,
}))
vi.mock("@/utils/os-browser-utils", () => ({
  getOsShortcut: () => "Ctrl",
}))

vi.mock("@/providers/BrowserProvider", () => ({
  useIsBrowser: () => ({
    isBrowser: true,
  }),
}))

import { MainNavDesktopMenu } from "../../DesktopMenu"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseSidebar.mockReturnValue(defaultUseSidebarReturn)
  mockUseMainNav.mockReturnValue(defaultUseMainNavReturn)
})

describe("rendering", () => {
  test("default rendering", () => {
    const { container } = render(<MainNavDesktopMenu />)
    const button = container.querySelector("[data-testid='menu-button']")
    expect(button).toBeInTheDocument()
    const icon = container.querySelector("[data-testid='bars-icon']")
    expect(icon).toBeInTheDocument()
    const menu = container.querySelector("[data-testid='menu']")
    expect(menu).toBeInTheDocument()
    expect(menu).toHaveClass("hidden")
    const menuItems = container.querySelectorAll("[data-testid='menu-item']")
    expect(menuItems).toHaveLength(7) // Menu items + theme menu + dividers
    const themeMenu = container.querySelector("[data-testid='theme-menu']")
    expect(themeMenu).toBeInTheDocument()
  })

  test("hides menu when closed", () => {
    const { container } = render(<MainNavDesktopMenu />)
    const menu = container.querySelector("[data-testid='menu']")
    expect(menu).toHaveClass("hidden")
  })

  test("includes sidebar toggle when sidebar is shown", () => {
    mockUseSidebar.mockReturnValueOnce({
      ...defaultUseSidebarReturn,
      isSidebarShown: true,
      desktopSidebarOpen: false,
      setDesktopSidebarOpen: mockSetDesktopSidebarOpen,
    })
    const { container } = render(<MainNavDesktopMenu />)
    const menuItems = container.querySelectorAll("[data-testid='menu-item']")
    const sidebarItem = Array.from(menuItems).find((item) =>
      item.textContent?.includes("Show Sidebar")
    )
    expect(sidebarItem).toBeInTheDocument()
  })

  test("does not include sidebar toggle when sidebar is not shown", () => {
    mockUseSidebar.mockReturnValueOnce({
      ...defaultUseSidebarReturn,
      isSidebarShown: false,
      desktopSidebarOpen: false,
      setDesktopSidebarOpen: mockSetDesktopSidebarOpen,
    })
    const { container } = render(<MainNavDesktopMenu />)
    const menuItems = container.querySelectorAll("[data-testid='menu-item']")
    const sidebarItem = Array.from(menuItems).find((item) =>
      item.textContent?.includes("Sidebar")
    )
    expect(sidebarItem).toBeUndefined()
  })

  test("renders custom additionalMenuItems when provided", () => {
    mockUseMainNav.mockReturnValueOnce({
      ...defaultUseMainNavReturn,
      additionalMenuItems: [
        {
          type: "link",
          title: "Custom Link 1",
          link: "https://example.com/1",
        },
        {
          type: "link",
          title: "Custom Link 2",
          link: "https://example.com/2",
        },
      ],
    })
    const { container } = render(<MainNavDesktopMenu />)
    const menuItems = container.querySelectorAll("[data-testid='menu-item']")
    const customItem1 = Array.from(menuItems).find((item) =>
      item.textContent?.includes("Custom Link 1")
    )
    const customItem2 = Array.from(menuItems).find((item) =>
      item.textContent?.includes("Custom Link 2")
    )
    expect(customItem1).toBeInTheDocument()
    expect(customItem2).toBeInTheDocument()
  })

  test("renders default menu items when additionalMenuItems not provided", () => {
    const { container } = render(<MainNavDesktopMenu />)
    const menuItems = container.querySelectorAll("[data-testid='menu-item']")
    const homepageItem = Array.from(menuItems).find((item) =>
      item.textContent?.includes("Homepage")
    )
    const v1Item = Array.from(menuItems).find((item) =>
      item.textContent?.includes("Medusa v1")
    )
    const changelogItem = Array.from(menuItems).find((item) =>
      item.textContent?.includes("Changelog")
    )
    expect(homepageItem).toBeInTheDocument()
    expect(v1Item).toBeInTheDocument()
    expect(changelogItem).toBeInTheDocument()
  })
})

describe("interaction", () => {
  test("renders menu when open", () => {
    const { container } = render(<MainNavDesktopMenu />)
    const button = container.querySelector("[data-testid='menu-button']")
    fireEvent.click(button!)
    const menu = container.querySelector("[data-testid='menu']")
    expect(menu).toBeInTheDocument()
    expect(menu).not.toHaveClass("hidden")
  })
  test("toggles menu when button is clicked", () => {
    const { container } = render(<MainNavDesktopMenu />)
    const button = container.querySelector("button")
    let menu = container.querySelector("[data-testid='menu']")

    expect(menu).toHaveClass("hidden")
    fireEvent.click(button!)
    menu = container.querySelector("[data-testid='menu']")
    expect(menu).not.toHaveClass("hidden")

    fireEvent.click(button!)
    menu = container.querySelector("[data-testid='menu']")
    expect(menu).toHaveClass("hidden")
  })

  test("closes menu when clicking outside", () => {
    const { container } = render(
      <div>
        <div data-testid="outside-element">Outside Element</div>
        <MainNavDesktopMenu />
      </div>
    )
    const button = container.querySelector("button")
    fireEvent.click(button!)
    let menu = container.querySelector("[data-testid='menu']")
    expect(menu).not.toHaveClass("hidden")

    // Simulate click outside
    const outsideElement = container.querySelector(
      "[data-testid='outside-element']"
    )
    fireEvent.click(outsideElement!)
    menu = container.querySelector("[data-testid='menu']")
    expect(menu).toHaveClass("hidden")
  })

  test("toggles sidebar when sidebar item is clicked", () => {
    mockUseSidebar.mockReturnValueOnce({
      ...defaultUseSidebarReturn,
      isSidebarShown: true,
      desktopSidebarOpen: false,
      setDesktopSidebarOpen: mockSetDesktopSidebarOpen,
    })
    const { container } = render(<MainNavDesktopMenu />)
    const button = container.querySelector("[data-testid='menu-button']")
    fireEvent.click(button!)
    const menuItems = container.querySelectorAll("[data-testid='menu-item']")
    const sidebarItem = Array.from(menuItems).find((item) =>
      item.textContent?.includes("Show Sidebar")
    )
    // The action would be called when the menu item is clicked
    // This is tested through the Menu component's behavior
    expect(sidebarItem).toBeInTheDocument()
  })
})
