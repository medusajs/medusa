import React from "react"
import { describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { CardLargeLayout } from "../index"

// mock components
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    target,
    rel,
    onClick,
    "aria-label": ariaLabel,
  }: {
    href: string
    children: React.ReactNode
    className?: string
    target?: string
    rel?: string
    onClick?: () => void
    "aria-label"?: string
  }) => (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={(e) => {
        // can't perform actual navigation in tests
        e.preventDefault()
        onClick?.()
      }}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  ),
}))

describe("rendering", () => {
  test("renders card large layout with title", () => {
    const title = "Title"
    const { container } = render(
      <CardLargeLayout title={title}>Click me</CardLargeLayout>
    )
    expect(container).toBeInTheDocument()
    const titleElement = container.querySelector("[data-testid='title']")
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveTextContent(title)
  })
  test("renders card large layout with text", () => {
    const text = "Text"
    const { container } = render(
      <CardLargeLayout text={text}>Click me</CardLargeLayout>
    )
    expect(container).toBeInTheDocument()
    const textElement = container.querySelector("[data-testid='text']")
    expect(textElement).toBeInTheDocument()
    expect(textElement).toHaveTextContent(text)
  })
  test("renders card large layout with external href", () => {
    const href = "https://example.com"
    const { container } = render(
      <CardLargeLayout href={href}>Click me</CardLargeLayout>
    )
    expect(container).toBeInTheDocument()
    const linkElement = container.querySelector("a")
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute("href", href)
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer")
    expect(linkElement).toHaveAttribute("target", "_blank")
    const arrowUpRightOnBoxElement = container.querySelector(
      "[data-testid='external-icon']"
    )
    expect(arrowUpRightOnBoxElement).toBeInTheDocument()
    const internalIconElement = container.querySelector(
      "[data-testid='internal-icon']"
    )
    expect(internalIconElement).not.toBeInTheDocument()
  })
  test("renders card large layout with internal href", () => {
    const href = "/example"
    const { container } = render(
      <CardLargeLayout href={href}>Click me</CardLargeLayout>
    )
    expect(container).toBeInTheDocument()
    const linkElement = container.querySelector("a")
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute("href", href)
    expect(linkElement).not.toHaveAttribute("target")
    expect(linkElement).not.toHaveAttribute("rel")
    const internalIconElement = container.querySelector(
      "[data-testid='internal-icon']"
    )
    expect(internalIconElement).toBeInTheDocument()
    const arrowUpRightOnBoxElement = container.querySelector(
      "[data-testid='external-icon']"
    )
    expect(arrowUpRightOnBoxElement).not.toBeInTheDocument()
  })
  test("renders card large layout with icon", () => {
    const icon = () => <div data-testid="icon">Icon</div>
    const { container } = render(
      <CardLargeLayout icon={icon}>Click me</CardLargeLayout>
    )
    expect(container).toBeInTheDocument()
    const iconElement = container.querySelector("[data-testid='icon']")
    expect(iconElement).toBeInTheDocument()
  })
  test("renders card large layout with image", () => {
    const image = "https://example.com/image.png"
    const { container } = render(
      <CardLargeLayout image={image}>Click me</CardLargeLayout>
    )
    expect(container).toBeInTheDocument()
    const imageElement = container.querySelector("img")
    expect(imageElement).toBeInTheDocument()
  })
})

describe("interaction", () => {
  test("calls onClick when card with link is clicked", () => {
    const handleClick = vi.fn()
    const { container } = render(
      <CardLargeLayout onClick={handleClick} href="#">Click me</CardLargeLayout>
    )
    expect(container).toBeInTheDocument()
    const linkElement = container.querySelector("a")
    expect(linkElement).toBeInTheDocument()
    fireEvent.click(linkElement!)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})