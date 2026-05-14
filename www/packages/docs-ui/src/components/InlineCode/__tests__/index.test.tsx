import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock components
vi.mock("@/components/CopyButton", () => ({
  CopyButton: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="copy-button">{children}</div>
  ),
}))

import { InlineCode } from "../../InlineCode"

describe("rendering", () => {
  test("renders default variant", () => {
    const { container } = render(<InlineCode>Test</InlineCode>)
    const code = container.querySelector("code")
    expect(code).toBeInTheDocument()
    expect(code).toHaveTextContent("Test")
    expect(code).toHaveClass(
      "bg-medusa-tag-neutral-bg group-hover:bg-medusa-tag-neutral-bg-hover group-active:bg-medusa-bg-subtle-pressed group-focus:bg-medusa-bg-subtle-pressed border-medusa-tag-neutral-border"
    )
  })

  test("renders grey-bg variant", () => {
    const { container } = render(
      <InlineCode variant="grey-bg">Test</InlineCode>
    )
    const code = container.querySelector("code")
    expect(code).toBeInTheDocument()
    expect(code).toHaveTextContent("Test")
    expect(code).toHaveClass(
      "bg-medusa-bg-switch-off group-hover:bg-medusa-bg-switch-off-hover group-active:bg-medusa-bg-switch-off-hover group-focus:bg-medusa-switch-off-hover border-medusa-border-strong"
    )
  })
})
