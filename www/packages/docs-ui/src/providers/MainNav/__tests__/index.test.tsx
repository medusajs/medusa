import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, render } from "@testing-library/react"
import { MainNavProvider, useMainNav } from "../index"
import type { NavigationItem, MenuItem } from "types"

// mock data
const defaultUseSiteConfigReturn = {
  config: {
    baseUrl: "",
    basePath: "",
  },
}

// mock hooks
const mockPathname = "/test-path"
const mockUsePathname = vi.fn(() => mockPathname)

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}))

const mockUseSiteConfig = vi.fn(() => defaultUseSiteConfigReturn)

vi.mock("@/providers/SiteConfig", () => ({
  useSiteConfig: () => mockUseSiteConfig(),
}))

const mockShownSidebar = vi.fn(() => null)

vi.mock("@/providers/Sidebar", () => ({
  useSidebar: () => ({
    shownSidebar: mockShownSidebar(),
  }),
}))

const TestComponent = () => {
  const {
    navItems,
    activeItemIndex,
    activeItem,
    logo,
    logoUrl,
    helpNavItem,
    additionalMenuItems,
  } = useMainNav()
  return (
    <div>
      <div data-testid="nav-items-count">{navItems.length}</div>
      <div data-testid="active-index">
        {activeItemIndex !== undefined ? activeItemIndex : "none"}
      </div>
      <div data-testid="active-item">{activeItem?.title || "none"}</div>
      <div data-testid="logo">{logo ? "custom" : "none"}</div>
      <div data-testid="logo-url">{logoUrl || "none"}</div>
      <div data-testid="help-nav-item">
        {helpNavItem ? helpNavItem.title : "none"}
      </div>
      <div data-testid="additional-menu-items">
        {additionalMenuItems?.length || 0}
      </div>
    </div>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockUsePathname.mockReturnValue("/test-path")
  mockUseSiteConfig.mockReturnValue(defaultUseSiteConfigReturn)
  mockShownSidebar.mockReturnValue(null)
})

afterEach(() => {
  cleanup()
})

describe("rendering", () => {
  test("renders children", () => {
    const navItems: NavigationItem[] = []
    const { container } = render(
      <MainNavProvider navItems={navItems}>
        <div>Test</div>
      </MainNavProvider>
    )
    expect(container).toHaveTextContent("Test")
  })
})

describe("useMainNav hook", () => {
  test("provides navItems", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Home",
        link: "/home",
      },
    ]

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("nav-items-count")).toHaveTextContent("1")
  })

  test("finds active item index for matching link", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Home",
        link: "/home",
      },
      {
        type: "link",
        title: "Test",
        link: "/test-path",
      },
    ]

    mockUsePathname.mockReturnValue("/test-path")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("active-index")).toHaveTextContent("1")
    expect(getByTestId("active-item")).toHaveTextContent("Test")
  })

  test("finds active item in dropdown", () => {
    const navItems: NavigationItem[] = [
      {
        type: "dropdown",
        title: "Docs",
        link: "/docs",
        children: [
          {
            type: "link",
            title: "Getting Started",
            link: "/docs/getting-started",
          },
          {
            type: "link",
            title: "API",
            link: "/docs/api",
          },
        ],
      },
    ]

    mockUsePathname.mockReturnValue("/docs/api")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("active-index")).toHaveTextContent("0")
  })

  test("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => {
      render(<TestComponent />)
    }).toThrow("useMainNav must be used within a MainNavProvider")

    consoleSpy.mockRestore()
  })

  test("provides custom logo when passed", () => {
    const navItems: NavigationItem[] = []
    const customLogo = <div>Custom Logo</div>

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems} logo={customLogo}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("logo")).toHaveTextContent("custom")
  })

  test("provides logoUrl when passed", () => {
    const navItems: NavigationItem[] = []

    const { getByTestId } = render(
      <MainNavProvider
        navItems={navItems}
        logoUrl="https://custom-logo-url.com"
      >
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("logo-url")).toHaveTextContent(
      "https://custom-logo-url.com"
    )
  })

  test("provides helpNavItem when passed", () => {
    const navItems: NavigationItem[] = []
    const customHelpNavItem = {
      type: "dropdown" as const,
      title: "Custom Help",
      children: [
        {
          type: "link" as const,
          title: "Support",
          link: "/support",
        },
      ],
    }

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems} helpNavItem={customHelpNavItem}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("help-nav-item")).toHaveTextContent("Custom Help")
  })

  test("provides additionalMenuItems when passed", () => {
    const navItems: NavigationItem[] = []
    const additionalMenuItems: MenuItem[] = [
      {
        type: "link",
        title: "Custom Link 1",
        link: "/custom1",
      },
      {
        type: "link",
        title: "Custom Link 2",
        link: "/custom2",
      },
    ]

    const { getByTestId } = render(
      <MainNavProvider
        navItems={navItems}
        additionalMenuItems={additionalMenuItems}
      >
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("additional-menu-items")).toHaveTextContent("2")
  })

  test("provides default values when optional props not passed", () => {
    const navItems: NavigationItem[] = []

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("logo")).toHaveTextContent("none")
    expect(getByTestId("logo-url")).toHaveTextContent("none")
    expect(getByTestId("help-nav-item")).toHaveTextContent("none")
    expect(getByTestId("additional-menu-items")).toHaveTextContent("0")
  })
})

describe("sidebar_id matching", () => {
  test("finds active item by sidebar_id on top-level link", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Home",
        link: "/home",
      },
      {
        type: "link",
        title: "Docs",
        link: "/docs",
        sidebar_id: "docs-sidebar",
      },
      {
        type: "link",
        title: "API",
        link: "/api",
      },
    ]

    mockShownSidebar.mockReturnValue({ sidebar_id: "docs-sidebar" })
    mockUsePathname.mockReturnValue("/some-other-path")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("active-index")).toHaveTextContent("1")
    expect(getByTestId("active-item")).toHaveTextContent("Docs")
  })

  test("finds active item by sidebar_id on top-level dropdown", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Home",
        link: "/home",
      },
      {
        type: "dropdown",
        title: "Products",
        link: "/products",
        sidebar_id: "products-sidebar",
        children: [
          {
            type: "link",
            title: "Product A",
            link: "/products/a",
          },
        ],
      },
    ]

    mockShownSidebar.mockReturnValue({ sidebar_id: "products-sidebar" })
    mockUsePathname.mockReturnValue("/unrelated-path")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("active-index")).toHaveTextContent("1")
    expect(getByTestId("active-item")).toHaveTextContent("Products")
  })

  test("finds active item by sidebar_id on dropdown child link", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Home",
        link: "/home",
      },
      {
        type: "dropdown",
        title: "Resources",
        link: "/resources",
        children: [
          {
            type: "link",
            title: "Guides",
            link: "/resources/guides",
            sidebar_id: "guides-sidebar",
          },
          {
            type: "link",
            title: "Tutorials",
            link: "/resources/tutorials",
          },
        ],
      },
    ]

    mockShownSidebar.mockReturnValue({ sidebar_id: "guides-sidebar" })
    mockUsePathname.mockReturnValue("/different-path")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("active-index")).toHaveTextContent("1")
    expect(getByTestId("active-item")).toHaveTextContent("Resources")
  })

  test("finds active item by sidebar_id on sub-menu item", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Home",
        link: "/home",
      },
      {
        type: "dropdown",
        title: "Documentation",
        link: "/docs",
        children: [
          {
            type: "sub-menu",
            title: "Advanced",
            items: [
              {
                type: "link",
                title: "Configuration",
                link: "/docs/config",
                sidebar_id: "config-sidebar",
              },
              {
                type: "link",
                title: "Deployment",
                link: "/docs/deployment",
              },
            ],
          },
        ],
      },
    ]

    mockShownSidebar.mockReturnValue({ sidebar_id: "config-sidebar" })
    mockUsePathname.mockReturnValue("/another-path")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("active-index")).toHaveTextContent("1")
    expect(getByTestId("active-item")).toHaveTextContent("Documentation")
  })

  test("matches item by sidebar_id even when URL does not match", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Home",
        link: "/home",
      },
      {
        type: "link",
        title: "Docs",
        link: "/docs",
        sidebar_id: "docs-sidebar",
      },
    ]

    // URL doesn't match /docs, but sidebar_id matches
    mockShownSidebar.mockReturnValue({ sidebar_id: "docs-sidebar" })
    mockUsePathname.mockReturnValue("/unrelated-path")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("active-index")).toHaveTextContent("1")
    expect(getByTestId("active-item")).toHaveTextContent("Docs")
  })

  test("returns no active item when sidebar_id does not match", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Home",
        link: "/home",
        sidebar_id: "home-sidebar",
      },
      {
        type: "link",
        title: "Docs",
        link: "/docs",
        sidebar_id: "docs-sidebar",
      },
    ]

    mockShownSidebar.mockReturnValue({ sidebar_id: "nonexistent-sidebar" })
    mockUsePathname.mockReturnValue("/unrelated-path")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("active-index")).toHaveTextContent("none")
    expect(getByTestId("active-item")).toHaveTextContent("none")
  })

  test("falls back to URL matching when no sidebar_id matches", () => {
    const navItems: NavigationItem[] = [
      {
        type: "link",
        title: "Home",
        link: "/home",
        sidebar_id: "home-sidebar",
      },
      {
        type: "link",
        title: "Docs",
        link: "/docs",
      },
    ]

    mockShownSidebar.mockReturnValue({ sidebar_id: "nonexistent-sidebar" })
    mockUsePathname.mockReturnValue("/docs")

    const { getByTestId } = render(
      <MainNavProvider navItems={navItems}>
        <TestComponent />
      </MainNavProvider>
    )

    expect(getByTestId("active-index")).toHaveTextContent("1")
    expect(getByTestId("active-item")).toHaveTextContent("Docs")
  })
})
