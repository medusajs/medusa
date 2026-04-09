import React from "react"
import { describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { CardDefaultLayout } from "../index"
import { IconProps } from "@medusajs/icons/dist/types"
import { LinkProps } from "../../../../Link"
import { BorderedIconProps } from "../../../../BorderedIcon"
import { BadgeProps } from "../../../../Badge"

// mock components
vi.mock("@/components/BorderedIcon", () => ({
  BorderedIcon: (props: BorderedIconProps) => (
    <div>
      BorderedIcon {props.icon} {props.IconComponent && <props.IconComponent />}
    </div>
  ),
}))
vi.mock("@/components/Link", () => ({
  Link: (props: LinkProps) => <a {...props} />,
}))
vi.mock("@/components/Badge", () => ({
  Badge: (props: BadgeProps) => (
    <div>
      Badge {props.variant} - {props.children}
    </div>
  ),
}))

describe("rendering", () => {
  test("renders card default layout", () => {
    const { container } = render(
      <CardDefaultLayout>Click me</CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const cardContent = container.querySelector("div")
    expect(cardContent).toBeInTheDocument()
    expect(cardContent).toHaveClass("flex")
    expect(cardContent).toHaveTextContent("Click me")
  })
  test("renders card default layout with icon", () => {
    const icon = (props: IconProps) => <div data-testid="icon">Icon</div>
    const { container } = render(
      <CardDefaultLayout icon={icon}>Click me</CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const borderedIcon = container.querySelector("[data-testid='icon']")
    expect(borderedIcon).toBeInTheDocument()
    expect(borderedIcon).toHaveTextContent("Icon")
  })
  test("renders card default layout with image", () => {
    const image = "https://example.com/image.png"
    const { container } = render(
      <CardDefaultLayout image={image}>Click me</CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const borderedIcon = container.querySelector("div")
    expect(borderedIcon).toBeInTheDocument()
    expect(borderedIcon).toHaveTextContent(image)
  })
  test("renders card default layout with title", () => {
    const title = "Title"
    const { container } = render(
      <CardDefaultLayout title={title}>Click me</CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const titleElement = container.querySelector("[data-testid='title']")
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveTextContent(title)
  })
  test("renders card default layout with text", () => {
    const text = "Text"
    const { container } = render(
      <CardDefaultLayout text={text}>Click me</CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const textElement = container.querySelector("[data-testid='text']")
    expect(textElement).toBeInTheDocument()
    expect(textElement).toHaveTextContent(text)
  })
  test("renders card default layout with badge", () => {
    const badge = { variant: "blue", children: "Badge" } as BadgeProps
    const { container } = render(
      <CardDefaultLayout badge={badge}>Click me</CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const badgeElement = container.querySelector("div")
    expect(badgeElement).toBeInTheDocument()
    expect(badgeElement).toHaveTextContent("Badge blue - Badge")
  })
  test("renders card default layout with right icon", () => {
    const rightIcon = () => <div data-testid="right-icon">RightIcon</div>
    const { container } = render(
      <CardDefaultLayout rightIcon={rightIcon}>Click me</CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const rightIconElement = container.querySelector(
      "[data-testid='right-icon']"
    )
    expect(rightIconElement).toBeInTheDocument()
    expect(rightIconElement).toHaveTextContent("RightIcon")
  })
  test("renders card default layout with external href", () => {
    const href = "https://example.com"
    const { container } = render(
      <CardDefaultLayout href={href}>Click me</CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const linkElement = container.querySelector("a")
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute("href", href)
    expect(linkElement).toHaveAttribute("target", "_blank")
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer")
    const arrowUpRightOnBoxElement = container.querySelector(
      "[data-testid='external-icon']"
    )
    expect(arrowUpRightOnBoxElement).toBeInTheDocument()
    const internalIconElement = container.querySelector(
      "[data-testid='internal-icon']"
    )
    expect(internalIconElement).not.toBeInTheDocument()
  })
  test("renders card default with internal link", () => {
    const href = "/example"
    const { container } = render(
      <CardDefaultLayout href={href}>Click me</CardDefaultLayout>
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
})

describe("highlight text", () => {
  test("highlight text not provided", () => {
    const { container } = render(
      <CardDefaultLayout title="Title with highlight">
        Click me
      </CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const highlightTextElement = container.querySelector(
      "[data-testid='highlight-text']"
    )
    expect(highlightTextElement).not.toBeInTheDocument()
  })
  test("highlight text in title", () => {
    const { container } = render(
      <CardDefaultLayout
        title="Title with highlight"
        highlightText={["highlight"]}
      >
        Click me
      </CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const highlightTextElement = container.querySelector(
      "[data-testid='highlight-text']"
    )
    expect(highlightTextElement).toBeInTheDocument()
    expect(highlightTextElement).toHaveTextContent("highlight")
  })
  test("highlight text not in title", () => {
    const { container } = render(
      <CardDefaultLayout
        title="Title without highlight"
        highlightText={["not-highlight"]}
      >
        Click me
      </CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const highlightTextElement = container.querySelector(
      "[data-testid='highlight-text']"
    )
    expect(highlightTextElement).not.toBeInTheDocument()
  })
  test("highlight text in text", () => {
    const { container } = render(
      <CardDefaultLayout
        text="Text with highlight"
        highlightText={["highlight"]}
      >
        Click me
      </CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const highlightTextElement = container.querySelector(
      "[data-testid='highlight-text']"
    )
    expect(highlightTextElement).toBeInTheDocument()
    expect(highlightTextElement).toHaveTextContent("highlight")
  })
  test("highlight text not in text", () => {
    const { container } = render(
      <CardDefaultLayout
        text="Text without highlight"
        highlightText={["not-highlight"]}
      >
        Click me
      </CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const highlightTextElement = container.querySelector(
      "[data-testid='highlight-text']"
    )
    expect(highlightTextElement).not.toBeInTheDocument()
  })
})

describe("interaction", () => {
  test("onClick is called when card's link is clicked", () => {
    const handleClick = vi.fn()
    const { container } = render(
      <CardDefaultLayout onClick={handleClick} href="#">Click me</CardDefaultLayout>
    )
    expect(container).toBeInTheDocument()
    const link = container.querySelector("a")
    expect(link).toBeInTheDocument()
    fireEvent.click(link!)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})