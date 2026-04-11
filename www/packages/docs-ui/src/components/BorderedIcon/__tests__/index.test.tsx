import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"
import { BorderedIcon } from ".."

const TestIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      data-testid="test-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 2L2 22h20L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const exampleDataImageUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAACV0lEQVR4nO2Wz2/SURjH/72769q9u9N7757e5f3oYsQgL2p4EUNFURFFEUVxU1ExYiD6gMREjEFE4qJiEBFRERERETGQmD/O/9/H/T8O93rXm+c5zzkzZ855zpnB3Tt37gQAAAAAAABg6U8AADwA4wEAAAAASUVORK5CYII="

describe("rendering", () => {
  test("renders image when provided as icon", () => {
    const { container } = render(<BorderedIcon icon={exampleDataImageUrl} />)
    expect(container).toBeInTheDocument()
    const image = container.querySelector("img")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", exampleDataImageUrl)
    expect(image).toHaveAttribute("alt", "")
    expect(image).toHaveClass("bordered-icon")
    expect(image).toHaveClass("rounded-docs_xs")
    expect(image).toHaveAttribute("width", "28")
    expect(image).toHaveAttribute("height", "28")
  })

  test("renders icon component when provided as IconComponent", () => {
    const { container } = render(<BorderedIcon IconComponent={TestIcon} />)
    expect(container).toBeInTheDocument()
    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass("bordered-icon")
    expect(icon).toHaveClass("rounded-docs_xs")
    expect(icon).toHaveClass("text-medusa-fg-subtle")
  })

  test("render IconComponent even when icon is provided", () => {
    const { container } = render(
      <BorderedIcon icon={exampleDataImageUrl} IconComponent={TestIcon} />
    )
    expect(container).toBeInTheDocument()
    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass("bordered-icon")
    expect(icon).toHaveClass("rounded-docs_xs")
    expect(icon).toHaveClass("text-medusa-fg-subtle")
    const image = container.querySelector("img")
    expect(image).not.toBeInTheDocument()
  })

  test("render icon with custom width and height", () => {
    const { container } = render(
      <BorderedIcon icon={exampleDataImageUrl} iconWidth={32} iconHeight={32} />
    )
    expect(container).toBeInTheDocument()
    const image = container.querySelector("img")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("width", "32")
    expect(image).toHaveAttribute("height", "32")
  })

  test("render icon with custom icon wrapper className", () => {
    const { container } = render(
      <BorderedIcon
        icon={exampleDataImageUrl}
        iconWrapperClassName="test-icon-wrapper"
      />
    )
    expect(container).toBeInTheDocument()
    const span = container.querySelector("span.test-icon-wrapper")
    expect(span).toBeInTheDocument()
  })

  test("render icon with custom wrapper className", () => {
    const { container } = render(
      <BorderedIcon
        icon={exampleDataImageUrl}
        wrapperClassName="test-wrapper"
      />
    )
    expect(container).toBeInTheDocument()
    const span = container.querySelector("span.test-wrapper")
    expect(span).toBeInTheDocument()
  })

  test("render image with custom icon className", () => {
    const { container } = render(
      <BorderedIcon icon={exampleDataImageUrl} iconClassName="test-icon" />
    )
    expect(container).toBeInTheDocument()
    const image = container.querySelector("img.test-icon")
    expect(image).toBeInTheDocument()
  })

  test("render icon component with custom icon className", () => {
    const { container } = render(
      <BorderedIcon IconComponent={TestIcon} iconClassName="test-icon" />
    )
    expect(container).toBeInTheDocument()
    const icon = container.querySelector("svg.test-icon")
    expect(icon).toBeInTheDocument()
  })

  test("render icon with custom icon color className", () => {
    const { container } = render(
      <BorderedIcon
        IconComponent={TestIcon}
        iconColorClassName="test-icon-color"
      />
    )
    expect(container).toBeInTheDocument()
    const icon = container.querySelector("svg")
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass("test-icon-color")
  })
})
