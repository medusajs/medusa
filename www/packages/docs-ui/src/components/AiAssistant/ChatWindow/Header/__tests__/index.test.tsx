import React from "react"
import { expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import * as AiAssistantMocks from "../../../__mocks__"

vi.mock("@/providers/AiAssistant", () => ({
  useAiAssistant: () => AiAssistantMocks.mockUseAiAssistant(),
}))

import { AiAssistantChatWindowHeader } from "../../Header"

test("handles chat window close", () => {
  const { container } = render(<AiAssistantChatWindowHeader />)
  const button = container.querySelector("button")
  const xMark = button?.querySelector("svg")
  expect(button).toBeInTheDocument()
  expect(xMark).toBeInTheDocument()
  expect(xMark).toHaveClass("text-medusa-fg-muted")
  expect(xMark).toHaveAttribute("height", "15")
  expect(xMark).toHaveAttribute("width", "15")
})

test("calls setChatOpened(false) when button is clicked", () => {
  // Reset the mock before each test
  AiAssistantMocks.mockSetChatOpened.mockClear()

  const { container } = render(<AiAssistantChatWindowHeader />)
  const button = container.querySelector("button")

  expect(button).toBeInTheDocument()

  fireEvent.click(button!)

  expect(AiAssistantMocks.mockSetChatOpened).toHaveBeenCalledTimes(1)
  expect(AiAssistantMocks.mockSetChatOpened).toHaveBeenCalledWith(false)
})
