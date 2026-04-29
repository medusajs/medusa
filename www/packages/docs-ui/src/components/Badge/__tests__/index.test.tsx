import React from "react"
import { expect, test } from "vitest"
import { render, screen } from "@testing-library/react"
import { Badge } from "../../Badge"

test("renders children", () => {
  render(<Badge variant="purple">Test Badge</Badge>)
  expect(screen.getByText("Test Badge")).toBeInTheDocument()
})

test("renders purple badge", () => {
  const { container } = render(<Badge variant="purple">Test Badge</Badge>)
  const badge = container.querySelector(".badge")
  expect(badge).toBeInTheDocument()
  expect(badge).toHaveClass(
    "bg-medusa-tag-purple-bg",
    "text-medusa-tag-purple-text",
    "border-medusa-tag-purple-border"
  )
})

test("renders orange badge", () => {
  const { container } = render(<Badge variant="orange">Test Badge</Badge>)
  const badge = container.querySelector(".badge")
  expect(badge).toBeInTheDocument()
  expect(badge).toHaveClass(
    "bg-medusa-tag-orange-bg",
    "text-medusa-tag-orange-text",
    "border-medusa-tag-orange-border"
  )
})

test("renders green badge", () => {
  const { container } = render(<Badge variant="green">Test Badge</Badge>)
  const badge = container.querySelector(".badge")
  expect(badge).toBeInTheDocument()
  expect(badge).toHaveClass(
    "bg-medusa-tag-green-bg",
    "text-medusa-tag-green-text",
    "border-medusa-tag-green-border"
  )
})

test("renders blue badge", () => {
  const { container } = render(<Badge variant="blue">Test Badge</Badge>)
  const badge = container.querySelector(".badge")
  expect(badge).toBeInTheDocument()
  expect(badge).toHaveClass(
    "bg-medusa-tag-blue-bg",
    "text-medusa-tag-blue-text",
    "border-medusa-tag-blue-border"
  )
})

test("renders red badge", () => {
  const { container } = render(<Badge variant="red">Test Badge</Badge>)
  const badge = container.querySelector(".badge")
  expect(badge).toBeInTheDocument()
  expect(badge).toHaveClass(
    "bg-medusa-tag-red-bg",
    "text-medusa-tag-red-text",
    "border-medusa-tag-red-border"
  )
})

test("renders neutral badge", () => {
  const { container } = render(<Badge variant="neutral">Test Badge</Badge>)
  const badge = container.querySelector(".badge")
  expect(badge).toBeInTheDocument()
  expect(badge).toHaveClass(
    "bg-medusa-tag-neutral-bg",
    "text-medusa-tag-neutral-text",
    "border-medusa-tag-neutral-border"
  )
})

test("renders code badge", () => {
  const { container } = render(<Badge variant="code">Test Badge</Badge>)
  const badge = container.querySelector(".badge")
  expect(badge).toBeInTheDocument()
  expect(badge).toHaveClass(
    "bg-medusa-contrast-bg-subtle",
    "text-medusa-contrast-fg-secondary",
    "border-medusa-contrast-border-bot"
  )
})

test("renders shaded badge", () => {
  const { container } = render(
    <Badge variant="purple" badgeType="shaded">
      Test Badge
    </Badge>
  )
  const badge = container.querySelector(".badge")
  const shadedBgIcon = container.querySelector("svg")
  expect(badge).toBeInTheDocument()
  expect(badge).toHaveClass("px-[3px]", "!bg-transparent", "relative")
  expect(shadedBgIcon).toBeInTheDocument()
  expect(shadedBgIcon).toHaveClass(
    "absolute",
    "top-0",
    "left-0",
    "w-full",
    "h-full"
  )
  const rect = shadedBgIcon?.querySelector("rect")
  expect(rect).toBeInTheDocument()
  expect(rect).toHaveAttribute("fill", "var(--docs-tags-purple-border)")
})

test("doesn't render shaded badge if badgeType is not shaded", () => {
  const { container } = render(<Badge variant="purple">Test Badge</Badge>)
  const badge = container.querySelector(".badge")
  expect(badge).toBeInTheDocument()
  expect(badge).not.toHaveClass("px-[3px]", "!bg-transparent", "relative")
  const shadedBgIcon = container.querySelector("svg")
  expect(shadedBgIcon).not.toBeInTheDocument()
})

test("renders with correct class name", () => {
  const { container } = render(
    <Badge variant="purple" className="test-class">
      Test Badge
    </Badge>
  )
  const badge = container.querySelector(".test-class")
  expect(badge).toBeInTheDocument()
})

test("renders children wrapper with correct class name", () => {
  const { container } = render(
    <Badge variant="purple" childrenWrapperClassName="test-class">
      Test Badge
    </Badge>
  )
  const childrenWrapper = container.querySelector(".test-class")
  expect(childrenWrapper).toBeInTheDocument()
})

test("passes HTML attributes to the badge", () => {
  const { container } = render(
    <Badge variant="purple" data-testid="test-id">
      Test Badge
    </Badge>
  )
  const badge = container.querySelector("[data-testid='test-id']")
  expect(badge).toBeInTheDocument()
})
