import React from "react"
import { describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock providers
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => ({
    isInProduct: false,
    productView: undefined,
  }),
}))

// mock components
vi.mock("@/components/Pagination", () => ({
  Pagination: () => <div>Pagination</div>,
}))

import { Footer } from "../../Footer"

describe("rendering", () => {
  test("doesn't render anything by default", () => {
    const { container } = render(<Footer />)
    expect(container).toBeEmptyDOMElement()
  })

  test("renders feedback component when provided", () => {
    const { container } = render(
      <Footer feedbackComponent={<div>Feedback</div>} />
    )
    expect(container).toContainHTML("<div>Feedback</div>")
  })

  test("renders pagination component when showPagination is true", () => {
    const { container } = render(<Footer showPagination={true} />)
    expect(container).toContainHTML("<div>Pagination</div>")
  })

  test("renders edit component when provided", () => {
    const { container } = render(<Footer editComponent={<div>Edit</div>} />)
    expect(container).toContainHTML("<div>Edit</div>")
  })
})
