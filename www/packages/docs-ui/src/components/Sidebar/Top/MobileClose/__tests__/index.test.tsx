import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock hooks
const mockSetMobileSidebarOpen = vi.fn()

const defaultUseSidebarReturn = {
  setMobileSidebarOpen: mockSetMobileSidebarOpen,
}

const mockUseSidebar = vi.fn(() => defaultUseSidebarReturn)

vi.mock("@/providers/Sidebar", () => ({
  useSidebar: () => mockUseSidebar(),
}))

// mock components
vi.mock("@/components/Button", () => ({
  Button: ({
    variant,
    onClick,
    className,
    children,
  }: {
    variant?: string
    onClick?: () => void
    className?: string
    children: React.ReactNode
  }) => (
    <button
      data-variant={variant}
      onClick={onClick}
      className={className}
      data-testid="close-button"
    >
      {children}
    </button>
  ),
}))

vi.mock("@medusajs/icons", () => ({
  XMarkMini: () => <svg data-testid="x-mark-icon" />,
}))

import { SidebarTopMobileClose } from "../../MobileClose"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseSidebar.mockReturnValue(defaultUseSidebarReturn)
})

describe("rendering", () => {
  test("renders mobile close button", () => {
    const { container } = render(<SidebarTopMobileClose />)
    const button = container.querySelector("[data-testid='close-button']")
    expect(button).toBeInTheDocument()
  })

  test("renders X mark icon", () => {
    const { container } = render(<SidebarTopMobileClose />)
    const icon = container.querySelector("[data-testid='x-mark-icon']")
    expect(icon).toBeInTheDocument()
  })
})

describe("interactions", () => {
  test("calls setMobileSidebarOpen when button is clicked", () => {
    const { container } = render(<SidebarTopMobileClose />)
    const button = container.querySelector("[data-testid='close-button']")
    fireEvent.click(button!)
    expect(mockSetMobileSidebarOpen).toHaveBeenCalledWith(false)
  })
})
