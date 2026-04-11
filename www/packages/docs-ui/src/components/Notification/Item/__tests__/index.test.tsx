import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock components
vi.mock("react-transition-group", () => ({
  CSSTransition: ({
    children,
  }: {
    children: React.ReactNode
    nodeRef?: React.RefObject<HTMLElement>
  }) => <>{children}</>,
}))

vi.mock("@/components/Notification/Item/Layout/Default", () => ({
  NotificationItemLayoutDefault: ({
    title,
    handleClose,
    children,
  }: {
    title?: string
    handleClose: () => void
    children?: React.ReactNode
  }) => (
    <div data-testid="default-layout">
      <div data-testid="layout-title">{title}</div>
      <button onClick={handleClose} data-testid="layout-close">
        Close
      </button>
      {children}
    </div>
  ),
}))

import { NotificationItem } from "../../Item"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders notification item with title and default layout", () => {
    const { container } = render(<NotificationItem title="Test" />)
    const item = container.querySelector("[data-testid='notification-item']")
    expect(item).toBeInTheDocument()
    const layout = container.querySelector("[data-testid='default-layout']")
    expect(layout).toBeInTheDocument()
  })

  test("renders with empty layout", () => {
    const { container } = render(
      <NotificationItem layout="empty">
        <div data-testid="custom-content">Custom</div>
      </NotificationItem>
    )
    const layout = container.querySelector("[data-testid='default-layout']")
    expect(layout).not.toBeInTheDocument()
    const customContent = container.querySelector(
      "[data-testid='custom-content']"
    )
    expect(customContent).toBeInTheDocument()
  })

  test("applies bottom placement classes", () => {
    const { container } = render(<NotificationItem placement="bottom" />)
    const item = container.querySelector("div")
    expect(item).toHaveClass("md:bottom-docs_1")
    expect(item).toHaveClass("bottom-0")
  })

  test("applies top placement classes", () => {
    const { container } = render(<NotificationItem placement="top" />)
    const item = container.querySelector("div")
    expect(item).toHaveClass("md:top-docs_1")
    expect(item).toHaveClass("top-0")
  })

  test("applies custom className", () => {
    const { container } = render(<NotificationItem className="custom-class" />)
    const item = container.querySelector("div")
    expect(item).toHaveClass("custom-class")
  })

  test("applies opacity-0 when show is false", () => {
    const { container } = render(<NotificationItem show={false} />)
    const item = container.querySelector("div")
    expect(item).toHaveClass("!opacity-0")
  })

  test("does not apply opacity-0 when show is true", () => {
    const { container } = render(<NotificationItem show={true} />)
    const item = container.querySelector("div")
    expect(item).not.toHaveClass("!opacity-0")
  })
})

describe("interactions", () => {
  test("calls handleClose when close is triggered", () => {
    const mockSetShow = vi.fn()
    const mockOnClose = vi.fn()
    const { container } = render(
      <NotificationItem setShow={mockSetShow} onClose={mockOnClose} />
    )
    const closeButton = container.querySelector("[data-testid='layout-close']")
    fireEvent.click(closeButton!)
    expect(mockSetShow).toHaveBeenCalledWith(false)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test("passes onClose to empty layout children", () => {
    const ChildComponent = ({ onClose }: { onClose?: () => void }) => (
      <button onClick={onClose} data-testid="child-close">
        Child Close
      </button>
    )
    const mockOnClose = vi.fn()
    const { container } = render(
      <NotificationItem layout="empty" onClose={mockOnClose}>
        <ChildComponent />
      </NotificationItem>
    )
    const childClose = container.querySelector("[data-testid='child-close']")
    fireEvent.click(childClose!)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
})
