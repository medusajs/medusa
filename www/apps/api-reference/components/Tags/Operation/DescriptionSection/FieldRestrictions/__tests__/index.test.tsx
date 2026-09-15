import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"

// mock components and hooks
vi.mock("@/providers/area", () => ({
  useArea: () => ({ area: "store" }),
}))
vi.mock("docs-ui", () => ({
  Details: ({
    summaryElm,
    children,
    ...props
  }: {
    summaryElm: React.ReactNode
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <div {...props}>
      {summaryElm}
      {children}
    </div>
  ),
  DetailsSummary: ({
    title,
    subtitle,
    ...props
  }: {
    title: React.ReactNode
    subtitle: React.ReactNode
    [key: string]: unknown
  }) => (
    <div data-testid="details-summary" {...props}>
      <span data-testid="details-summary-title">{title}</span>
      <span data-testid="details-summary-subtitle">{subtitle}</span>
    </div>
  ),
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a data-testid="link" href={href}>
      {children}
    </a>
  ),
}))

import TagsOperationDescriptionSectionFieldRestrictions from ".."

beforeEach(() => {
  vi.clearAllMocks()
  cleanup()
})

describe("rendering", () => {
  test("renders the allowed fields with a link to the area's docs", () => {
    const { container } = render(
      <TagsOperationDescriptionSectionFieldRestrictions
        allowed={["id", "email"]}
      />
    )

    const allowedElement = container.querySelector(
      "[data-testid='field-restrictions-allowed']"
    )
    expect(allowedElement).toBeInTheDocument()
    expect(allowedElement).toHaveTextContent("id")
    expect(allowedElement).toHaveTextContent("email")
    expect(
      container.querySelector("[data-testid='field-restrictions-disallowed']")
    ).not.toBeInTheDocument()
    expect(container.querySelector("[data-testid='link']")).toHaveAttribute(
      "href",
      "/store/select-fields-and-relations#allowed-and-disallowed-fields"
    )
  })

  test("renders the disallowed fields with a note for patterns", () => {
    const { container } = render(
      <TagsOperationDescriptionSectionFieldRestrictions
        disallowed={["carts", "/_link$/"]}
      />
    )

    const disallowedElement = container.querySelector(
      "[data-testid='field-restrictions-disallowed']"
    )
    expect(disallowedElement).toBeInTheDocument()
    expect(disallowedElement).toHaveTextContent("carts")
    expect(disallowedElement).toHaveTextContent("/_link$/")
    expect(disallowedElement).toHaveTextContent("are regular expressions")
    expect(
      container.querySelector("[data-testid='field-restrictions-allowed']")
    ).not.toBeInTheDocument()
  })

  test("does not render the patterns note when there are no patterns", () => {
    const { container } = render(
      <TagsOperationDescriptionSectionFieldRestrictions allowed={["id"]} />
    )

    expect(
      container.querySelector("[data-testid='field-restrictions-allowed']")
    ).not.toHaveTextContent("are regular expressions")
  })

  test("renders both allowed and disallowed fields", () => {
    const { container } = render(
      <TagsOperationDescriptionSectionFieldRestrictions
        allowed={["id", "email"]}
        disallowed={["carts"]}
      />
    )

    expect(
      container.querySelector("[data-testid='field-restrictions-allowed']")
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-testid='field-restrictions-disallowed']")
    ).toBeInTheDocument()
  })
})
