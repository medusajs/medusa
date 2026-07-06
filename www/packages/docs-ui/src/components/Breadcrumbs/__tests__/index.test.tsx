import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { render } from "@testing-library/react"

// mock data
const sidebarHistory = ["sidebar_1", "sidebar_2", "sidebar_3"]
const sidebars = [
  {
    sidebar_id: "sidebar_1",
    title: "sidebar_1",
    items: [
      {
        type: "link",
        title: "sidebar_1_item_1",
        link: "/sidebar_1_item_1",
        isPathHref: true,
        path: "/sidebar_1_item_1",
      },
    ],
  },
  {
    sidebar_id: "sidebar_2",
    title: "sidebar_2",
    items: [
      {
        type: "link",
        title: "sidebar_2_item_1",
        link: "/sidebar_2_item_1",
        isPathHref: true,
        path: "/sidebar_2_item_1",
      },
    ],
  },
  {
    sidebar_id: "sidebar_duplicate",
    title: "sidebar_duplicate",
    items: [
      {
        type: "link",
        title: "sidebar_1_item_1",
        link: "/sidebar_1_item_1",
        isPathHref: true,
        path: "/sidebar_1_item_1",
      },
    ],
  },
]
const baseUrl = "https://example.com"
const basePath = "/docs"

// mock functions
const getSidebar = (sidebar_id: string) => {
  return sidebars.find((sidebar) => sidebar.sidebar_id === sidebar_id)
}
const getSidebarFirstLinkChild = (sidebar: Sidebar.Sidebar) => {
  return sidebar.items[0] as Sidebar.SidebarItemLink | undefined
}
const mockUseSidebar = vi.fn(() => ({
  sidebarHistory,
  getSidebarFirstLinkChild,
  getSidebar,
}))

// mock components
vi.mock("@/providers/Sidebar", () => ({
  useSidebar: () => mockUseSidebar(),
}))

vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => ({
    config: {
      breadcrumbOptions: {
        startItems: [{ title: "start", link: "/start" }],
      },
      baseUrl,
      basePath,
    },
  }),
}))

import { Breadcrumbs } from ".."
import { Sidebar } from "types"

beforeEach(() => {
  mockUseSidebar.mockReturnValue({
    sidebarHistory,
    getSidebarFirstLinkChild,
    getSidebar,
  })
})

describe("rendering", () => {
  test("renders config start item only when no sidebar history is provided", () => {
    mockUseSidebar.mockReturnValue({
      sidebarHistory: [],
      getSidebarFirstLinkChild: () => undefined,
      getSidebar,
    })
    const { container } = render(<Breadcrumbs />)
    expect(container).toBeInTheDocument()
    const startItem = container.querySelector("a[href='/start']")
    expect(startItem).toBeInTheDocument()
  })

  test("renders breadcrumbs for sidebar with one history item", () => {
    mockUseSidebar.mockReturnValue({
      sidebarHistory: ["sidebar_1"],
      getSidebarFirstLinkChild,
      getSidebar,
    })
    const { container } = render(<Breadcrumbs />)
    expect(container).toBeInTheDocument()
    const breadcrumbs = container.querySelectorAll("a")
    expect(breadcrumbs).toHaveLength(2)
    expect(breadcrumbs[0]).toHaveTextContent("start")
    expect(breadcrumbs[1]).toHaveTextContent("sidebar_1")
    expect(breadcrumbs[1]).toHaveAttribute("href", "/sidebar_1_item_1")
  })

  test("renders breadcrumbs for sidebar with two history items", () => {
    mockUseSidebar.mockReturnValue({
      sidebarHistory: ["sidebar_1", "sidebar_2"],
      getSidebarFirstLinkChild,
      getSidebar,
    })
    const { container } = render(<Breadcrumbs />)
    expect(container).toBeInTheDocument()
    const breadcrumbs = container.querySelectorAll("a")
    expect(breadcrumbs).toHaveLength(3)
    expect(breadcrumbs[0]).toHaveTextContent("start")
    expect(breadcrumbs[1]).toHaveTextContent("sidebar_1")
    expect(breadcrumbs[1]).toHaveAttribute("href", "/sidebar_1_item_1")
    expect(breadcrumbs[2]).toHaveTextContent("sidebar_2")
    expect(breadcrumbs[2]).toHaveAttribute("href", "/sidebar_2_item_1")
  })

  test("deduplicates breadcrumb items with the same link", () => {
    mockUseSidebar.mockReturnValue({
      sidebarHistory: ["sidebar_1", "sidebar_duplicate"],
      getSidebarFirstLinkChild,
      getSidebar,
    })
    const { container } = render(<Breadcrumbs />)
    expect(container).toBeInTheDocument()
    const breadcrumbs = container.querySelectorAll("a")
    // start + sidebar_1 only (sidebar_duplicate has same link, deduplicated)
    expect(breadcrumbs).toHaveLength(2)
    expect(breadcrumbs[0]).toHaveTextContent("start")
    expect(breadcrumbs[1]).toHaveTextContent("sidebar_1")
    expect(breadcrumbs[1]).toHaveAttribute("href", "/sidebar_1_item_1")
  })

  test("renders json-ld breadcrumb list", () => {
    mockUseSidebar.mockReturnValue({
      sidebarHistory: ["sidebar_1", "sidebar_2"],
      getSidebarFirstLinkChild,
      getSidebar,
    })
    const { container } = render(<Breadcrumbs />)
    expect(container).toBeInTheDocument()
    const jsonLd = container.querySelector("script[type='application/ld+json']")
    expect(jsonLd).toBeInTheDocument()
    expect(jsonLd).toHaveAttribute("type", "application/ld+json")
    const content = jsonLd?.textContent
    expect(content).toBeDefined()
    const parsedContent = JSON.parse(content!)
    const baseLink = `${baseUrl}${basePath}`.replace(/\/+$/, "")
    expect(parsedContent).toEqual({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "start",
          item: `${baseLink}/start`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "sidebar_1",
          item: `${baseLink}/sidebar_1_item_1`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "sidebar_2",
          item: `${baseLink}/sidebar_2_item_1`,
        },
      ],
    })
  })
})
