import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { ButtonProps } from "@/components/Button"

// mock components
vi.mock("@/components/Button", () => ({
  Button: (props: ButtonProps) => <button {...props} />,
}))

vi.mock("@medusajs/icons", () => ({
  BarsThree: () => <svg data-testid="bars-icon" />,
  XMark: () => <svg data-testid="xmark-icon" />,
  ArrowUturnLeft: () => <svg data-testid="arrow-icon" />,
}))

vi.mock("react-transition-group", () => ({
  CSSTransition: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  SwitchTransition: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}))

vi.mock("@/components/MainNav/MobileMenu/Main", () => ({
  MainNavMobileMainMenu: ({
    setSelectedMenus,
    onOpenLink,
  }: {
    setSelectedMenus: (fn: (prev: unknown[]) => unknown[]) => void
    onOpenLink?: () => void
  }) => (
    <div data-testid="main-menu">
      <button
        data-testid="test-set-menu"
        onClick={() => setSelectedMenus(() => [{ title: "Test", menu: [] }])}
      >
        Set Menu
      </button>
      {onOpenLink && (
        <button data-testid="test-open-link" onClick={onOpenLink}>
          Open Link
        </button>
      )}
    </div>
  ),
}))

vi.mock("@/components/MainNav/MobileMenu/SubMenu", () => ({
  MainNavMobileSubMenu: ({
    title,
    setSelectedMenus,
    onOpenLink,
  }: {
    title: string
    setSelectedMenus: (fn: (prev: unknown[]) => unknown[]) => void
    onOpenLink?: () => void
  }) => (
    <div data-testid="sub-menu">
      <div>{title}</div>
      <button
        data-testid="test-back"
        onClick={() => setSelectedMenus((prev) => prev.slice(0, -1))}
      >
        Back
      </button>
      {onOpenLink && (
        <button data-testid="test-open-link" onClick={onOpenLink}>
          Open Link
        </button>
      )}
    </div>
  ),
}))

import { MainNavMobileMenu } from "../../MobileMenu"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders menu button", () => {
    const { container } = render(<MainNavMobileMenu />)
    const button = container.querySelector("[data-testid='menu-button']")
    expect(button).toBeInTheDocument()
  })

  test("rendering when closed", () => {
    const { container } = render(<MainNavMobileMenu />)
    const icon = container.querySelector("[data-testid='bars-icon']")
    expect(icon).toBeInTheDocument()
    const mainMenu = container.querySelector("[data-testid='main-menu']")
    expect(mainMenu).toBeInTheDocument()
    const panel = container.querySelector("[data-testid='menu-panel']")
    expect(panel).toHaveClass("-left-full")
  })
})

describe("interaction", () => {
  test("shows xmark icon when open", () => {
    const { container } = render(<MainNavMobileMenu />)
    const button = container.querySelector("[data-testid='menu-button']")
    fireEvent.click(button!)
    const icon = container.querySelector("[data-testid='xmark-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("shows menu panel when open", () => {
    const { container } = render(<MainNavMobileMenu />)
    const button = container.querySelector("[data-testid='menu-button']")
    fireEvent.click(button!)
    const panel = container.querySelector("[data-testid='menu-panel']")
    expect(panel).toHaveClass("left-0")
  })

  test("toggles menu when button is clicked", () => {
    const { container } = render(<MainNavMobileMenu />)
    const button = container.querySelector("[data-testid='menu-button']")
    const panel = container.querySelector("[data-testid='menu-panel']")

    expect(panel).toHaveClass("-left-full")
    fireEvent.click(button!)
    expect(panel).toHaveClass("left-0")

    fireEvent.click(button!)
    expect(panel).toHaveClass("-left-full")
  })

  test("shows sub-menu when selected", () => {
    const { container } = render(<MainNavMobileMenu />)
    const setMenuButton = container.querySelector(
      "[data-testid='test-set-menu']"
    )
    fireEvent.click(setMenuButton!)
    const subMenu = container.querySelector("[data-testid='sub-menu']")
    expect(subMenu).toBeInTheDocument()
  })

  test("shows back button in sub-menu", () => {
    const { container } = render(<MainNavMobileMenu />)
    const setMenuButton = container.querySelector(
      "[data-testid='test-set-menu']"
    )
    fireEvent.click(setMenuButton!)
    const backButton = container.querySelector("[data-testid='test-back']")
    expect(backButton).toBeInTheDocument()
  })

  test("goes back to main menu when back is clicked", () => {
    const { container } = render(<MainNavMobileMenu />)
    const setMenuButton = container.querySelector(
      "[data-testid='test-set-menu']"
    )
    fireEvent.click(setMenuButton!)
    const backButton = container.querySelector("[data-testid='test-back']")
    fireEvent.click(backButton!)
    const mainMenu = container.querySelector("[data-testid='main-menu']")
    expect(mainMenu).toBeInTheDocument()
  })

  test("calls onOpenLink when link is opened", () => {
    const { container } = render(<MainNavMobileMenu />)
    const setMenuButton = container.querySelector(
      "[data-testid='test-set-menu']"
    )
    fireEvent.click(setMenuButton!)
    const openLinkButton = container.querySelector(
      "[data-testid='test-open-link']"
    )
    fireEvent.click(openLinkButton!)
    const panel = container.querySelector("[data-testid='menu-panel']")
    expect(panel).toHaveClass("-left-full")
  })
})
