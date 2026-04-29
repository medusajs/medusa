import React from "react"
import { describe, expect, test } from "vitest"
import { render } from "@testing-library/react"

import { CodeBlockCollapsibleLines } from "../../Lines"

describe("render", () => {
  test("render with children, type start, and collapsed", () => {
    const { container } = render(
      <CodeBlockCollapsibleLines type="start" collapsed={true}>
        <div>Hello</div>
        <div>World</div>
        <div>!</div>
        <div>...</div>
      </CodeBlockCollapsibleLines>
    )
    expect(container).toBeInTheDocument()
    expect(container.childElementCount).toBe(2)
    expect(container.firstChild).toHaveTextContent("!")
    expect(container.lastChild).toHaveTextContent("...")
  })
  test("render with children, type end, and collapsed", () => {
    const { container } = render(
      <CodeBlockCollapsibleLines type="end" collapsed={true}>
        <div>Hello</div>
        <div>World</div>
        <div>!</div>
        <div>...</div>
      </CodeBlockCollapsibleLines>
    )
    expect(container).toBeInTheDocument()
    expect(container.childElementCount).toBe(2)
    expect(container.firstChild).toHaveTextContent("Hello")
    expect(container.lastChild).toHaveTextContent("World")
  })
  test("render with children, type start, and not collapsed", () => {
    const { container } = render(
      <CodeBlockCollapsibleLines type="start" collapsed={false}>
        <div>Hello</div>
        <div>World</div>
        <div>!</div>
        <div>...</div>
      </CodeBlockCollapsibleLines>
    )
    expect(container).toBeInTheDocument()
    expect(container.childElementCount).toBe(4)
    expect(container.firstChild).toHaveTextContent("Hello")
    expect(container.lastChild).toHaveTextContent("...")
  })
  test("render with children, type end, and not collapsed", () => {
    const { container } = render(
      <CodeBlockCollapsibleLines type="end" collapsed={false}>
        <div>Hello</div>
        <div>World</div>
        <div>!</div>
        <div>...</div>
      </CodeBlockCollapsibleLines>
    )
    expect(container).toBeInTheDocument()
    expect(container.childElementCount).toBe(4)
    expect(container.firstChild).toHaveTextContent("Hello")
    expect(container.lastChild).toHaveTextContent("...")
  })
})
