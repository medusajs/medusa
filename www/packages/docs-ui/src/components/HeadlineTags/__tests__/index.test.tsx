import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock next/link
vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.ComponentProps<"a">) => (
    <a {...props}>{children}</a>
  ),
}))

import { HeadlineTags } from "../index"

describe("rendering", () => {
  test("renders with string tags", () => {
    const { container } = render(<HeadlineTags tags={["tag1", "tag2"]} />)
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("div")
    expect(wrapper).toBeInTheDocument()
    expect(container).toHaveTextContent("[tag1]")
    expect(container).toHaveTextContent("[tag2]")
    const separators = container.querySelectorAll("span.text-medusa-fg-subtle")
    expect(separators.length).toBeGreaterThan(0)
  })

  test("renders with link tags", () => {
    const { container } = render(
      <HeadlineTags
        tags={[
          { text: "tag1", link: "/link1" },
          { text: "tag2", link: "/link2" },
        ]}
      />
    )
    expect(container).toBeInTheDocument()
    const links = container.querySelectorAll("a")
    expect(links).toHaveLength(2)
    expect(links[0]).toHaveAttribute("href", "/link1")
    expect(links[0]).toHaveTextContent("[tag1]")
    expect(links[1]).toHaveAttribute("href", "/link2")
    expect(links[1]).toHaveTextContent("[tag2]")
  })

  test("renders with mixed string and link tags", () => {
    const { container } = render(
      <HeadlineTags
        tags={["string-tag", { text: "link-tag", link: "/link" }]}
      />
    )
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("[string-tag]")
    expect(container).toHaveTextContent("[link-tag]")
    const links = container.querySelectorAll("a")
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute("href", "/link")
    expect(links[0]).toHaveTextContent("[link-tag]")
  })

  test("renders separators between tags", () => {
    const { container } = render(
      <HeadlineTags tags={["tag1", "tag2", "tag3"]} />
    )
    expect(container).toBeInTheDocument()
    const text = container.textContent
    expect(text).toContain("·")
    const separatorMatches = text?.match(/·/g)
    expect(separatorMatches).toHaveLength(2)
  })

  test("does not render separator after last tag", () => {
    const { container } = render(<HeadlineTags tags={["single-tag"]} />)
    expect(container).toBeInTheDocument()
    expect(container).toHaveTextContent("[single-tag]")
    const text = container.textContent
    expect(text).not.toContain("·")
  })

  test("renders with custom className", () => {
    const { container } = render(
      <HeadlineTags tags={["tag1"]} className="custom-class" />
    )
    expect(container).toBeInTheDocument()
    const wrapper = container.querySelector("div")
    expect(wrapper).toHaveClass("custom-class")
  })
})
