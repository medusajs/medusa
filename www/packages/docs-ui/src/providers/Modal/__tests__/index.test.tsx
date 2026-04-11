import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"
import { ModalProvider, useModal } from "../index"

// mock components
vi.mock("@/components/Modal", () => ({
  Modal: ({
    children,
    open,
    onClose,
    ...props
  }: {
    children?: React.ReactNode
    open?: boolean
    onClose?: () => void
    [key: string]: unknown
  }) => (
    <div data-testid="modal" data-open={open} onClick={onClose} {...props}>
      {children}
    </div>
  ),
}))

const TestComponent = () => {
  const { modalProps, setModalProps, closeModal } = useModal()
  return (
    <div>
      <div data-testid="has-modal">{modalProps ? "yes" : "no"}</div>
      <button
        data-testid="open-modal"
        onClick={() =>
          setModalProps({
            children: <div>Modal Content</div>,
            open: true,
          })
        }
      >
        Open Modal
      </button>
      <button data-testid="close-modal" onClick={closeModal}>
        Close Modal
      </button>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})

describe("rendering", () => {
  test("renders children", () => {
    const { container } = render(
      <ModalProvider>
        <div>Test</div>
      </ModalProvider>
    )
    expect(container).toHaveTextContent("Test")
  })

  test("renders modal when modalProps is set", () => {
    const { getByTestId } = render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    )

    expect(getByTestId("has-modal")).toHaveTextContent("no")
    expect(() => getByTestId("modal")).toThrow()

    fireEvent.click(getByTestId("open-modal"))

    expect(getByTestId("has-modal")).toHaveTextContent("yes")
    expect(getByTestId("modal")).toBeInTheDocument()
    expect(getByTestId("modal")).toHaveAttribute("data-open", "true")
  })

  test("renders overlay when modal is open", () => {
    const { getByTestId, container } = render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    )

    fireEvent.click(getByTestId("open-modal"))

    const overlay = container.querySelector(".bg-medusa-bg-overlay")
    expect(overlay).toBeInTheDocument()
  })
})

describe("useModal hook", () => {
  test("modalProps is null initially", () => {
    const { getByTestId } = render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    )

    expect(getByTestId("has-modal")).toHaveTextContent("no")
  })

  test("setModalProps sets modalProps", () => {
    const { getByTestId } = render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    )

    fireEvent.click(getByTestId("open-modal"))

    expect(getByTestId("has-modal")).toHaveTextContent("yes")
    expect(getByTestId("modal")).toBeInTheDocument()
  })

  test("closeModal clears modalProps", () => {
    const { getByTestId } = render(
      <ModalProvider>
        <TestComponent />
      </ModalProvider>
    )

    fireEvent.click(getByTestId("open-modal"))
    expect(getByTestId("has-modal")).toHaveTextContent("yes")

    fireEvent.click(getByTestId("close-modal"))

    expect(getByTestId("has-modal")).toHaveTextContent("no")
    expect(() => getByTestId("modal")).toThrow()
  })

  test("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow("useModal must be used within a ModalProvider")

    consoleSpy.mockRestore()
  })
})
