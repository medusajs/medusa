import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render, waitFor } from "@testing-library/react"
import { ButtonProps } from "../../Button"

// mock functions
const mockCloseModal = vi.fn()
const mockUseKeyboardShortcut = vi.fn()
const mockCloseDialog = vi.fn()

// mock components
vi.mock("@/providers/Modal", () => ({
  useModal: () => ({ closeModal: mockCloseModal }),
}))

vi.mock("@/hooks/use-keyboard-shortcut", () => ({
  useKeyboardShortcut: (options: unknown) => mockUseKeyboardShortcut(options),
}))

vi.mock("@/components/Modal/Header", () => ({
  ModalHeader: ({ title }: { title?: React.ReactNode }) => (
    <div data-testid="modal-header">{title}</div>
  ),
}))

vi.mock("@/components/Modal/Footer", () => ({
  ModalFooter: ({
    actions,
    children,
  }: {
    actions?: ButtonProps[]
    children?: React.ReactNode
  }) => (
    <div data-testid="modal-footer">
      {actions?.map((action, index) => (
        <button key={index} data-testid="footer-action">
          {action.children}
        </button>
      ))}
      {children}
    </div>
  ),
}))

import { Modal } from "../../Modal"

beforeEach(() => {
  vi.clearAllMocks()
  // Reset body attribute
  document.body.removeAttribute("data-modal")
  // close method on modals doesn't work in tests, so we need to mock it
  window.HTMLDialogElement.prototype.close = mockCloseDialog
})

describe("rendering", () => {
  test("renders modal dialog", () => {
    const { container } = render(<Modal>Content</Modal>)
    const dialog = container.querySelector("dialog")
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveTextContent("Content")
  })

  test("renders with title", () => {
    const { container } = render(<Modal title="Modal Title">Content</Modal>)
    const header = container.querySelector("[data-testid='modal-header']")
    expect(header).toBeInTheDocument()
    expect(header).toHaveTextContent("Modal Title")
  })

  test("does not render header when title is not provided", () => {
    const { container } = render(<Modal>Content</Modal>)
    const header = container.querySelector("[data-testid='modal-header']")
    expect(header).not.toBeInTheDocument()
  })

  test("renders footer with actions", () => {
    const actions: ButtonProps[] = [
      { children: "Cancel" },
      { children: "Save" },
    ]
    const { container } = render(<Modal actions={actions}>Content</Modal>)
    const footer = container.querySelector("[data-testid='modal-footer']")
    expect(footer).toBeInTheDocument()
    const footerActions = container.querySelectorAll(
      "[data-testid='footer-action']"
    )
    expect(footerActions).toHaveLength(2)
    expect(footerActions[0]).toHaveTextContent("Cancel")
    expect(footerActions[1]).toHaveTextContent("Save")
  })

  test("renders footer with footerContent", () => {
    const { container } = render(
      <Modal footerContent={<div>Custom Footer</div>}>Content</Modal>
    )
    const footer = container.querySelector("[data-testid='modal-footer']")
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveTextContent("Custom Footer")
  })

  test("does not render footer when actions and footerContent are not provided", () => {
    const { container } = render(<Modal>Content</Modal>)
    const footer = container.querySelector("[data-testid='modal-footer']")
    expect(footer).not.toBeInTheDocument()
  })

  test("does not render footer when actions array is empty", () => {
    const { container } = render(<Modal actions={[]}>Content</Modal>)
    const footer = container.querySelector("[data-testid='modal-footer']")
    expect(footer).not.toBeInTheDocument()
  })

  test("applies custom className", () => {
    const { container } = render(
      <Modal className="custom-class">Content</Modal>
    )
    const dialog = container.querySelector("dialog")
    expect(dialog).toHaveClass("custom-class")
  })

  test("applies custom modalContainerClassName", () => {
    const { container } = render(
      <Modal modalContainerClassName="custom-container">Content</Modal>
    )
    const containerDiv = container.querySelector(
      "[data-testid='modal-container']"
    )
    expect(containerDiv).toHaveClass("custom-container")
  })

  test("applies custom contentClassName", () => {
    const { container } = render(
      <Modal contentClassName="custom-content">Content</Modal>
    )
    const contentDiv = container.querySelector("[data-testid='modal-content']")
    expect(contentDiv).toHaveClass("custom-content")
  })
})

describe("open state", () => {
  test("renders as open by default", () => {
    const { container } = render(<Modal>Content</Modal>)
    const dialog = container.querySelector("dialog")
    expect(dialog).toHaveAttribute("open")
  })

  test("renders as open when open prop is true", () => {
    const { container } = render(<Modal open={true}>Content</Modal>)
    const dialog = container.querySelector("dialog")
    expect(dialog).toHaveAttribute("open")
  })

  test("does not render as open when open prop is false", () => {
    const { container } = render(<Modal open={false}>Content</Modal>)
    const dialog = container.querySelector("dialog")
    expect(dialog).not.toHaveAttribute("open")
  })

  test("sets data-modal attribute on body when open", () => {
    render(<Modal open={true}>Content</Modal>)
    expect(document.body).toHaveAttribute("data-modal", "opened")
  })

  test("removes data-modal attribute from body when closed", () => {
    const { rerender } = render(<Modal open={true}>Content</Modal>)
    expect(document.body).toHaveAttribute("data-modal", "opened")
    rerender(<Modal open={false}>Content</Modal>)
    expect(document.body).not.toHaveAttribute("data-modal")
  })
})

describe("interactions", () => {
  test("calls closeModal and onClose when clicking outside content", () => {
    const mockOnClose = vi.fn()
    const { container } = render(<Modal onClose={mockOnClose}>Content</Modal>)
    const dialog = container.querySelector("dialog")
    // Simulate click on dialog backdrop (the dialog element itself)
    fireEvent.click(dialog!)
    expect(mockCloseModal).toHaveBeenCalledTimes(1)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test("does not close when clicking inside content", () => {
    const mockOnClose = vi.fn()
    const { container } = render(<Modal onClose={mockOnClose}>Content</Modal>)
    const contentDiv = container.querySelector("[data-testid='modal-content']")
    fireEvent.click(contentDiv!)
    expect(mockCloseModal).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  test("calls closeModal and onClose when dialog closes", async () => {
    const mockOnClose = vi.fn()
    const { container } = render(<Modal onClose={mockOnClose}>Content</Modal>)
    const dialog = container.querySelector("dialog")
    // click dialog to close
    fireEvent.click(dialog!)
    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalledTimes(1)
      expect(mockOnClose).toHaveBeenCalledTimes(1)
    })
  })

  test("calls closeModal when dialog closes even without onClose prop", async () => {
    const { container } = render(<Modal>Content</Modal>)
    const dialog = container.querySelector("dialog")
    // click dialog to close
    fireEvent.click(dialog!)
    await waitFor(() => {
      expect(mockCloseModal).toHaveBeenCalledTimes(1)
    })
  })
})

describe("keyboard shortcuts", () => {
  test("sets up escape key shortcut", () => {
    render(<Modal open={true}>Content</Modal>)
    expect(mockUseKeyboardShortcut).toHaveBeenCalledWith({
      metakey: false,
      checkEditing: false,
      shortcutKeys: ["escape"],
      action: expect.any(Function),
    })
  })

  test("closes dialog when escape key is pressed and modal is open", () => {
    render(<Modal open={true}>Content</Modal>)
    // Get the action function from the last call
    const lastCall =
      mockUseKeyboardShortcut.mock.calls[
        mockUseKeyboardShortcut.mock.calls.length - 1
      ]
    const action = lastCall[0].action
    // Simulate escape key press
    action()
    expect(mockCloseDialog).toHaveBeenCalledTimes(1)
  })

  test("does not close dialog when escape key is pressed and modal is closed", () => {
    render(<Modal open={false}>Content</Modal>)
    const lastCall =
      mockUseKeyboardShortcut.mock.calls[
        mockUseKeyboardShortcut.mock.calls.length - 1
      ]
    const action = lastCall[0].action
    action()
    // Dialog should remain closed
    expect(mockCloseDialog).not.toHaveBeenCalled()
  })
})

describe("ref handling", () => {
  test("supports function ref", () => {
    const refCallback = vi.fn()
    render(<Modal passedRef={refCallback}>Content</Modal>)
    expect(refCallback).toHaveBeenCalled()
  })

  test("supports object ref", () => {
    const ref = React.createRef<HTMLDialogElement>()
    render(<Modal passedRef={ref}>Content</Modal>)
    expect(ref.current).toBeInstanceOf(HTMLDialogElement)
  })
})

describe("dialog props", () => {
  test("passes through dialog props", () => {
    const { container } = render(<Modal aria-label="Test Modal">Content</Modal>)
    const dialog = container.querySelector("dialog")
    expect(dialog).toHaveAttribute("aria-label", "Test Modal")
  })
})
