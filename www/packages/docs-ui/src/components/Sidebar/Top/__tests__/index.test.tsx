import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock hooks
const defaultUseSidebarReturn = {
  sidebarHistory: [] as string[],
}

const mockUseSidebar = vi.fn(() => defaultUseSidebarReturn)

vi.mock("@/providers/Sidebar", () => ({
  useSidebar: () => mockUseSidebar(),
}))

// mock components
vi.mock("@/components/Sidebar/Top/MobileClose", () => ({
  SidebarTopMobileClose: () => (
    <div data-testid="mobile-close">Mobile Close</div>
  ),
}))

vi.mock("@/components/Sidebar/Child", () => ({
  SidebarChild: () => <div data-testid="sidebar-child">Child</div>,
}))

vi.mock("@/components/DottedSeparator", () => ({
  DottedSeparator: ({ wrapperClassName }: { wrapperClassName?: string }) => (
    <div data-testid="dotted-separator" className={wrapperClassName}>
      Separator
    </div>
  ),
}))

import { SidebarTop } from "../../Top"

beforeEach(() => {
  vi.clearAllMocks()
  mockUseSidebar.mockReturnValue(defaultUseSidebarReturn)
})

describe("rendering", () => {
  test("renders mobile close button", () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(<SidebarTop ref={ref} />)
    const mobileClose = container.querySelector("[data-testid='mobile-close']")
    expect(mobileClose).toBeInTheDocument()
  })

  test("does not render child sidebar when history length is 1 or less", () => {
    mockUseSidebar.mockReturnValue({
      sidebarHistory: ["sidebar1"],
    })
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(<SidebarTop ref={ref} />)
    const child = container.querySelector("[data-testid='sidebar-child']")
    expect(child).not.toBeInTheDocument()
  })

  test("renders child sidebar when history length is greater than 1", () => {
    mockUseSidebar.mockReturnValue({
      sidebarHistory: ["sidebar1", "sidebar2"],
    })
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(<SidebarTop ref={ref} />)
    const child = container.querySelector("[data-testid='sidebar-child']")
    expect(child).toBeInTheDocument()
  })

  test("renders dotted separator when history length is greater than 1", () => {
    mockUseSidebar.mockReturnValue({
      sidebarHistory: ["sidebar1", "sidebar2"],
    })
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(<SidebarTop ref={ref} />)
    const separator = container.querySelector(
      "[data-testid='dotted-separator']"
    )
    expect(separator).toBeInTheDocument()
  })

  test("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<SidebarTop ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
