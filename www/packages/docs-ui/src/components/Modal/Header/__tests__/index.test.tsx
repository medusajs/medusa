import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { ButtonProps } from "../../../Button"

// mock functions
const mockCloseModal = vi.fn()

// mock components
vi.mock("@/providers/Modal", () => ({
  useModal: () => ({ closeModal: mockCloseModal }),
}))
vi.mock("@/components/Button", () => ({
  Button: (props: ButtonProps) => <button {...props} data-testid="button" />,
}))

import { ModalHeader } from "../index"

beforeEach(() => {
  vi.clearAllMocks()
})

describe("renders", () => {
  test("renders with title", () => {
    const { container } = render(<ModalHeader title="Title" />)
    expect(container).toBeInTheDocument()
    const title = container.querySelector("[data-testid='title']")
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent("Title")
  })

  test("renders with close button", () => {
    const { container } = render(<ModalHeader />)
    expect(container).toBeInTheDocument()
    const closeButton = container.querySelector("[data-testid='button']")
    expect(closeButton).toBeInTheDocument()
    const xMark = closeButton?.querySelector("svg")
    expect(xMark).toBeInTheDocument()
  })
})

describe("interactions", () => {
  test("calls closeModal when close button is clicked", () => {
    const { container } = render(<ModalHeader />)
    const closeButton = container.querySelector("[data-testid='button']")
    expect(closeButton).toBeInTheDocument()
    fireEvent.click(closeButton!)
    expect(mockCloseModal).toHaveBeenCalledTimes(1)
  })
})
