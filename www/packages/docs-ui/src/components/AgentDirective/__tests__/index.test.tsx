import React from "react"
import { expect, test } from "vitest"
import { render } from "@testing-library/react"
import { AgentDirective } from "../../AgentDirective"

test("links to the root llms.txt", () => {
  const { container } = render(<AgentDirective />)
  const link = container.querySelector("a")
  expect(link).toHaveAttribute("href", "/llms.txt")
})

test("is hidden from assistive tech and keyboard navigation", () => {
  const { container } = render(<AgentDirective />)
  expect(container.firstChild).toHaveClass("sr-only")
  expect(container.firstChild).toHaveAttribute("aria-hidden", "true")
  expect(container.querySelector("a")).toHaveAttribute("tabindex", "-1")
})
