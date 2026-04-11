import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"

// mock components
vi.mock("@medusajs/icons", () => ({
  InformationCircleSolid: () => <svg data-testid="info-icon" />,
  XCircleSolid: () => <svg data-testid="error-icon" />,
  ExclamationCircleSolid: () => <svg data-testid="warning-icon" />,
  CheckCircleSolid: () => <svg data-testid="success-icon" />,
}))

vi.mock("@/components/Button", () => ({
  Button: ({
    onClick,
    children,
  }: {
    onClick?: () => void
    children: React.ReactNode
  }) => (
    <button onClick={onClick} data-testid="button">
      {children}
    </button>
  ),
}))

import { NotificationItemLayoutDefault } from "../../Default"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("rendering", () => {
  test("renders notification layout", () => {
    const { container } = render(
      <NotificationItemLayoutDefault handleClose={vi.fn()} />
    )
    const layout = container.querySelector("[data-testid='default-layout']")
    expect(layout).toBeInTheDocument()
  })

  test("renders title", () => {
    const { container } = render(
      <NotificationItemLayoutDefault title="Test Title" handleClose={vi.fn()} />
    )
    const title = container.querySelector("[data-testid='layout-title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Test Title")
  })

  test("renders text", () => {
    const { container } = render(
      <NotificationItemLayoutDefault text="Test text" handleClose={vi.fn()} />
    )
    const content = container.querySelector("[data-testid='layout-content']")
    expect(content).toBeInTheDocument()
    expect(content).toHaveTextContent("Test text")
  })

  test("renders children", () => {
    const { container } = render(
      <NotificationItemLayoutDefault handleClose={vi.fn()}>
        <div data-testid="child">Child Content</div>
      </NotificationItemLayoutDefault>
    )
    const child = container.querySelector("[data-testid='child']")
    expect(child).toBeInTheDocument()
    expect(child).toHaveTextContent("Child Content")
  })

  test("renders info icon for info type", () => {
    const { container } = render(
      <NotificationItemLayoutDefault type="info" handleClose={vi.fn()} />
    )
    const icon = container.querySelector("[data-testid='info-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("renders error icon for error type", () => {
    const { container } = render(
      <NotificationItemLayoutDefault type="error" handleClose={vi.fn()} />
    )
    const icon = container.querySelector("[data-testid='error-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("renders warning icon for warning type", () => {
    const { container } = render(
      <NotificationItemLayoutDefault type="warning" handleClose={vi.fn()} />
    )
    const icon = container.querySelector("[data-testid='warning-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("renders success icon for success type", () => {
    const { container } = render(
      <NotificationItemLayoutDefault type="success" handleClose={vi.fn()} />
    )
    const icon = container.querySelector("[data-testid='success-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("renders custom icon for custom type", () => {
    const CustomIcon = <div data-testid="custom-icon">Custom</div>
    const { container } = render(
      <NotificationItemLayoutDefault
        type="custom"
        CustomIcon={CustomIcon}
        handleClose={vi.fn()}
      />
    )
    const icon = container.querySelector("[data-testid='custom-icon']")
    expect(icon).toBeInTheDocument()
  })

  test("does not render icon for none type", () => {
    const { container } = render(
      <NotificationItemLayoutDefault type="none" handleClose={vi.fn()} />
    )
    const icons = container.querySelectorAll("svg")
    expect(icons).toHaveLength(0)
  })

  test("renders close button when isClosable is true", () => {
    const { container } = render(
      <NotificationItemLayoutDefault isClosable={true} handleClose={vi.fn()} />
    )
    const button = container.querySelector("[data-testid='button']")
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent("Close")
  })

  test("does not render close button when isClosable is false", () => {
    const { container } = render(
      <NotificationItemLayoutDefault isClosable={false} handleClose={vi.fn()} />
    )
    const button = container.querySelector("[data-testid='button']")
    expect(button).not.toBeInTheDocument()
  })

  test("renders custom close button text", () => {
    const { container } = render(
      <NotificationItemLayoutDefault
        closeButtonText="Dismiss"
        handleClose={vi.fn()}
      />
    )
    const button = container.querySelector("[data-testid='button']")
    expect(button).toHaveTextContent("Dismiss")
  })

  test("does not render content section when text and children are not provided", () => {
    const { container } = render(
      <NotificationItemLayoutDefault title="Title" handleClose={vi.fn()} />
    )
    const contentSection = container.querySelector(
      "[data-testid='layout-content']"
    )
    expect(contentSection).not.toBeInTheDocument()
  })
})

describe("interactions", () => {
  test("calls handleClose when close button is clicked", () => {
    const mockHandleClose = vi.fn()
    const { container } = render(
      <NotificationItemLayoutDefault handleClose={mockHandleClose} />
    )
    const button = container.querySelector("[data-testid='button']")
    fireEvent.click(button!)
    expect(mockHandleClose).toHaveBeenCalledTimes(1)
  })
})
