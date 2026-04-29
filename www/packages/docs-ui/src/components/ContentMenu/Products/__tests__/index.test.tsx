import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock data
const mockConfig = {
  baseUrl: "https://docs.medusajs.com",
  basePath: "",
}
const defaultUseSiteConfigReturn = {
  frontmatter: {
    products: ["product", "cart"],
  },
  config: mockConfig,
}
const productProduct = products.find((p) => p.name === "product")
const cartProduct = products.find((p) => p.name === "cart")

// mock functions
const mockUseSiteConfig = vi.fn(() => defaultUseSiteConfigReturn)

// mock components
vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))
vi.mock("@/components/BorderedIcon", () => ({
  BorderedIcon: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bordered-icon">{children}</div>
  ),
}))
vi.mock("@/components/ContentMenu/Section", () => ({
  ContentMenuSection: ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => (
    <div data-testid="content-menu-section" data-title={title}>
      {children}
    </div>
  ),
}))

import { ContentMenuProducts } from "../../Products"
import { products } from "../../../../constants"

beforeEach(() => {
  mockUseSiteConfig.mockReturnValue(defaultUseSiteConfigReturn)
})

describe("render", () => {
  test("renders inside Modules used section", () => {
    const { container } = render(<ContentMenuProducts />)
    const section = container.querySelector(
      "[data-testid='content-menu-section']"
    )
    expect(section).toBeInTheDocument()
    expect(section).toHaveAttribute("data-title", "Modules used")
  })

  test("render product menu", () => {
    const { container } = render(<ContentMenuProducts />)
    expect(container).toBeInTheDocument()
    const productLinks = container.querySelectorAll(
      "a[data-testid='product-link']"
    )
    expect(productLinks).toHaveLength(2)
    expect(productLinks[0]).toBeInTheDocument()
    expect(productLinks[0]).toHaveAttribute(
      "href",
      `https://docs.medusajs.com${cartProduct?.path}`
    )
    expect(productLinks[0]).toHaveTextContent(cartProduct!.title)

    expect(productLinks[1]).toBeInTheDocument()
    expect(productLinks[1]).toHaveAttribute(
      "href",
      `https://docs.medusajs.com${productProduct?.path}`
    )
    expect(productLinks[1]).toHaveTextContent(productProduct!.title)
  })
})
