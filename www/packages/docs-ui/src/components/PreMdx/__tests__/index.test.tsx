import React from "react"
import { describe, expect, test } from "vitest"
import { render } from "@testing-library/react"
import { PreMdx } from "../index"

describe("rendering", () => {
  test("doesn't wrap a code block in a pre element", () => {
    const { container } = render(
      <PreMdx>
        <code className="language-ts">console.log("test")</code>
      </PreMdx>
    )
    expect(container.querySelector("pre")).not.toBeInTheDocument()
    expect(container.querySelector("code")).toHaveTextContent(
      'console.log("test")'
    )
  })

  test("wraps code without a language in a pre element", () => {
    const { container } = render(
      <PreMdx className="test-class">
        <code>plain text</code>
      </PreMdx>
    )
    const pre = container.querySelector("pre")
    expect(pre).toBeInTheDocument()
    expect(pre).toHaveClass("test-class")
    expect(pre).toHaveTextContent("plain text")
  })
})
