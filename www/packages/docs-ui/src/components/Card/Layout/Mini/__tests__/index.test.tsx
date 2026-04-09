import React from "react"
import {  describe, expect, test, vi } from "vitest"
import { fireEvent, render } from "@testing-library/react"
import { BorderedIconProps } from "../../../../BorderedIcon"

// mock data
const exampleDataImageUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAACV0lEQVR4nO2Wz2/SURjH/72769q9u9N7757e5f3oYsQgL2p4EUNFURFFEUVxU1ExYiD6gMREjEFE4qJiEBFRERERETGQmD/O/9/H/T8O93rXm+c5zzkzZ855zpnB3Tt37gQAAAAAAABg6U8AADwA4wEAAAAASUVORK5CYII="

// mock components
vi.mock("@/components/BorderedIcon", () => ({
  BorderedIcon: (props: BorderedIconProps) => (
    <div data-testid="bordered-icon">
      BorderedIcon {props.icon} {props.IconComponent && <props.IconComponent />}
    </div>
  ),
}))
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
vi.mock("@/components/ThemeImage", () => ({
  ThemeImage: (props: ThemeImageProps) => (
    <div data-testid="theme-image" className={props.className}>
      ThemeImage {props.light} {props.dark} {props.className}
    </div>
  ),
}))
vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
    style,
  }: {
    src: string
    alt?: string
    width?: number
    height?: number
    className?: string
    style?: React.CSSProperties
  }) => (
    <img
      src={src}
      alt={alt || ""}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  ),
}))
import { CardLayoutMini } from "../../Mini"
import { ThemeImageProps } from "../../../../ThemeImage"

describe("rendering", () => {
  test("renders card mini layout with title", () => {
    const title = "Title"
    const { container } = render(
      <CardLayoutMini title={title}>Click me</CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const titleElement = container.querySelector("[data-testid='title']")
    expect(titleElement).toBeInTheDocument()
    expect(titleElement).toHaveTextContent(title)
  })
  test("renders card mini layout with text", () => {
    const text = "Text"
    const { container } = render(
      <CardLayoutMini text={text}>Click me</CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const textElement = container.querySelector("[data-testid='text']")
    expect(textElement).toBeInTheDocument()
    expect(textElement).toHaveTextContent(text)
  })
  test("renders card mini layout with external href", () => {
    const href = "https://example.com"
    const { container } = render(
      <CardLayoutMini href={href}>Click me</CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const linkElement = container.querySelector("a")
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute("href", href)
    expect(linkElement).toHaveAttribute("rel", "noopener noreferrer")
    expect(linkElement).toHaveAttribute("target", "_blank")
  })
  test("renders card mini layout with internal href", () => {
    const href = "/example"
    const { container } = render(
      <CardLayoutMini href={href}>Click me</CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const linkElement = container.querySelector("a")
    expect(linkElement).toBeInTheDocument()
    expect(linkElement).toHaveAttribute("href", href)
    expect(linkElement).not.toHaveAttribute("target")
    expect(linkElement).not.toHaveAttribute("rel")
  })
  test("renders card mini layout with icon", () => {
    const icon = () => <div data-testid="icon">Icon</div>
    const { container } = render(
      <CardLayoutMini icon={icon}>Click me</CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const iconElement = container.querySelector("[data-testid='icon']")
    expect(iconElement).toBeInTheDocument()
  })
  test("renders card mini layout with image", () => {
    const { container } = render(
      <CardLayoutMini image={exampleDataImageUrl}>Click me</CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const imageElement = container.querySelector("img")
    expect(imageElement).toBeInTheDocument()
    expect(imageElement).toHaveAttribute("src", exampleDataImageUrl)
  })
  test("renders card mini layout with theme image", () => {
    const themeImage = {
      light: exampleDataImageUrl,
      dark: exampleDataImageUrl,
    }
    const { container } = render(
      <CardLayoutMini themeImage={themeImage}>Click me</CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const themeImageElement = container.querySelector(
      "[data-testid='theme-image']"
    )
    expect(themeImageElement).toBeInTheDocument()
    expect(themeImageElement).toHaveTextContent(
      "ThemeImage " + exampleDataImageUrl + " " + exampleDataImageUrl
    )
  })
  test("renders card mini layout with closeable", () => {
    const { container } = render(
      <CardLayoutMini closeable>Click me</CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const closeButtonElement = container.querySelector(
      "[data-testid='close-button']"
    )
    expect(closeButtonElement).toBeInTheDocument()
    const closeIconElement = container.querySelector(
      "[data-testid='close-icon']"
    )
    expect(closeIconElement).toBeInTheDocument()
  })
  test("renders card mini layout with onClose", () => {
    const onClose = vi.fn()
    const { container } = render(
      <CardLayoutMini closeable onClose={onClose}>
        Click me
      </CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const closeButtonElement = container.querySelector(
      "[data-testid='close-button']"
    )
    expect(closeButtonElement).toBeInTheDocument()
    fireEvent.click(closeButtonElement!)
    expect(onClose).toHaveBeenCalled()
  })
  test("renders card mini layout with className", () => {
    const className = "test-class"
    const { container } = render(
      <CardLayoutMini className={className}>Click me</CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const cardElement = container.querySelector("div")
    expect(cardElement).toBeInTheDocument()
    expect(cardElement).toHaveClass(className)
  })
  test("renders card mini layout with imageDimensions", () => {
    const imageDimensions = { width: 100, height: 100 }
    const { container } = render(
      <CardLayoutMini
        imageDimensions={imageDimensions}
        image={exampleDataImageUrl}
      >
        Click me
      </CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const imageElement = container.querySelector("img")
    expect(imageElement).toBeInTheDocument()
    expect(imageElement).toHaveAttribute(
      "width",
      imageDimensions.width.toString()
    )
    expect(imageElement).toHaveAttribute(
      "height",
      imageDimensions.height.toString()
    )
    expect(imageElement).toHaveStyle({
      width: `${imageDimensions.width}px`,
      height: `${imageDimensions.height}px`,
    })
  })
  test("renders card mini layout with iconClassName and image", () => {
    const iconClassName = "test-class"
    const { container } = render(
      <CardLayoutMini image={exampleDataImageUrl} iconClassName={iconClassName}>
        Click me
      </CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const imageElement = container.querySelector("img")
    expect(imageElement).toBeInTheDocument()
    expect(imageElement).toHaveClass(iconClassName)
  })
  test("renders card mini layout with iconClassName and theme image", () => {
    const iconClassName = "test-class"
    const themeImage = {
      light: exampleDataImageUrl,
      dark: exampleDataImageUrl,
    }
    const { container } = render(
      <CardLayoutMini themeImage={themeImage} iconClassName={iconClassName}>
        Click me
      </CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const themeImageElement = container.querySelector(
      "[data-testid='theme-image']"
    )
    expect(themeImageElement).toBeInTheDocument()
    expect(themeImageElement).toHaveClass(iconClassName)
  })
})

describe("interaction", () => {
  test("calls onClick when card mini layout with link is clicked", () => {
    const onClick = vi.fn()
    const { container } = render(
      <CardLayoutMini onClick={onClick} href="#">Click me</CardLayoutMini>
    )
    expect(container).toBeInTheDocument()
    const link = container.querySelector("a")
    expect(link).toBeInTheDocument()
    fireEvent.click(link!)
    expect(onClick).toHaveBeenCalled()
  })
})