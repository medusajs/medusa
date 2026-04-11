import React from "react"
import { describe, expect, test } from "vitest"
import { render } from "@testing-library/react"

import { CodeBlockCollapsibleFade } from "../../Fade"

describe("render", () => {
  test("render collapsible fade start and collapsed", () => {
    const { container } = render(
      <CodeBlockCollapsibleFade type="start" collapsed={true} />
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("span")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("w-full left-0")
    expect(wrapper).toHaveClass("top-[36px]")
    const fade = container.querySelector(
      "[data-testid='collapsible-fade-start']"
    )
    expect(fade).toBeInTheDocument()
  })
  test("render collapsible fade end and collapsed", () => {
    const { container } = render(
      <CodeBlockCollapsibleFade type="end" collapsed={true} />
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("span")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("w-full left-0")
    expect(wrapper).toHaveClass("bottom-[36px]")
    const fade = container.querySelector("[data-testid='collapsible-fade-end']")
    expect(fade).toBeInTheDocument()
  })
  test("render when not collapsed", () => {
    const { container } = render(
      <CodeBlockCollapsibleFade type="start" collapsed={false} />
    )
    expect(container).toBeInTheDocument()
    const fade = container.querySelector(
      "[data-testid='collapsible-fade-start']"
    )
    expect(fade).not.toBeInTheDocument()
    const fadeEnd = container.querySelector(
      "[data-testid='collapsible-fade-end']"
    )
    expect(fadeEnd).not.toBeInTheDocument()
  })
  test("render with type start and hasHeader", () => {
    const { container } = render(
      <CodeBlockCollapsibleFade
        type="start"
        collapsed={true}
        hasHeader={true}
      />
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("span")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("left-[6px] w-[calc(100%-12px)]")
    expect(wrapper).toHaveClass("top-[44px]")
  })
  test("render with type end and hasHeader", () => {
    const { container } = render(
      <CodeBlockCollapsibleFade type="end" collapsed={true} hasHeader={true} />
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("span")
    expect(wrapper).toBeInTheDocument()
    expect(wrapper).toHaveClass("left-[6px] w-[calc(100%-12px)]")
    expect(wrapper).toHaveClass("bottom-[44px]")
  })
})
