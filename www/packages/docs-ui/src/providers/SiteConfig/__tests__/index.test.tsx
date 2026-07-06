import React from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import { cleanup, fireEvent, render } from "@testing-library/react"
import { SiteConfigProvider, useSiteConfig } from "../index"
import type { DocsConfig } from "types"

// mock global config
vi.mock("@/global-config", () => ({
  globalConfig: {
    baseUrl: "https://global.example.com",
    basePath: "/global",
  },
}))

vi.mock("../..", () => ({
  GITHUB_ISSUES_LINK: "https://github.com/test/issues",
}))

// mock BrowserProvider
vi.mock("@/providers/BrowserProvider", () => ({
  useIsBrowser: () => ({
    isBrowser: true,
  }),
}))

const TestComponent = () => {
  const {
    config,
    setConfig,
    frontmatter,
    setFrontmatter,
    toc,
    setToc,
    isInProduct,
    productView,
  } = useSiteConfig()
  return (
    <div>
      <div data-testid="base-url">{config.baseUrl}</div>
      <div data-testid="project-title">{config.project.title}</div>
      <div data-testid="frontmatter-title">{frontmatter.title || "none"}</div>
      <div data-testid="version-number">{config.version?.number}</div>
      <div data-testid="release-url">{config.version?.releaseUrl}</div>
      <div data-testid="toc-length">{toc?.length || 0}</div>
      <div data-testid="ai-assistant-feature">
        {String(config.features?.aiAssistant ?? false)}
      </div>
      <div data-testid="is-in-product">{String(isInProduct)}</div>
      <div data-testid="product-view">{productView || "none"}</div>
      <button
        data-testid="update-config"
        onClick={() =>
          setConfig((prev) => ({
            ...prev,
            baseUrl: "https://updated.example.com",
          }))
        }
      >
        Update Config
      </button>
      <button
        data-testid="update-frontmatter"
        onClick={() => setFrontmatter({ title: "Updated Title" })}
      >
        Update Frontmatter
      </button>
      <button
        data-testid="update-toc"
        onClick={() =>
          setToc([
            {
              title: "Item 1",
              id: "item1",
              level: 1,
            },
          ])
        }
      >
        Update ToC
      </button>
    </div>
  )
}

describe("SiteConfigProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  describe("rendering", () => {
    test("renders children", () => {
      const { container } = render(
        <SiteConfigProvider>
          <div>Test</div>
        </SiteConfigProvider>
      )
      expect(container).toHaveTextContent("Test")
    })
  })

  describe("useSiteConfig hook", () => {
    test("initializes with default config", () => {
      const { getByTestId } = render(
        <SiteConfigProvider>
          <TestComponent />
        </SiteConfigProvider>
      )

      expect(getByTestId("base-url")).toHaveTextContent(
        "https://global.example.com"
      )
      expect(getByTestId("project-title")).toHaveTextContent("")
    })

    test("merges provided config with defaults", () => {
      const config: DocsConfig = {
        baseUrl: "https://custom.example.com",
        basePath: "/custom",
        project: {
          title: "Custom Project",
          key: "custom",
        },
        sidebars: [],
        logo: "",
        version: {
          number: "1.0.0",
          releaseUrl: "https://github.com/test/releases/tag/1.0.0",
          releaseDate: "2024-01-01",
        },
      }

      const { getByTestId } = render(
        <SiteConfigProvider config={config}>
          <TestComponent />
        </SiteConfigProvider>
      )

      expect(getByTestId("base-url")).toHaveTextContent(
        "https://custom.example.com"
      )
      expect(getByTestId("project-title")).toHaveTextContent("Custom Project")
      expect(getByTestId("version-number")).toHaveTextContent("1.0.0")
      expect(getByTestId("release-url")).toHaveTextContent(
        "https://github.com/test/releases/tag/1.0.0"
      )
    })

    test("initializes with empty frontmatter", () => {
      const { getByTestId } = render(
        <SiteConfigProvider>
          <TestComponent />
        </SiteConfigProvider>
      )

      expect(getByTestId("frontmatter-title")).toHaveTextContent("none")
    })

    test("initializes with null toc", () => {
      const { getByTestId } = render(
        <SiteConfigProvider>
          <TestComponent />
        </SiteConfigProvider>
      )

      expect(getByTestId("toc-length")).toHaveTextContent("0")
    })

    test("setConfig updates config", () => {
      const { getByTestId } = render(
        <SiteConfigProvider>
          <TestComponent />
        </SiteConfigProvider>
      )

      fireEvent.click(getByTestId("update-config"))

      expect(getByTestId("base-url")).toHaveTextContent(
        "https://updated.example.com"
      )
    })

    test("setFrontmatter updates frontmatter", () => {
      const { getByTestId } = render(
        <SiteConfigProvider>
          <TestComponent />
        </SiteConfigProvider>
      )

      fireEvent.click(getByTestId("update-frontmatter"))

      expect(getByTestId("frontmatter-title")).toHaveTextContent(
        "Updated Title"
      )
    })

    test("setToc updates toc", () => {
      const { getByTestId } = render(
        <SiteConfigProvider>
          <TestComponent />
        </SiteConfigProvider>
      )

      fireEvent.click(getByTestId("update-toc"))

      expect(getByTestId("toc-length")).toHaveTextContent("1")
    })

    test("enables ai assistant feature by default", () => {
      const { getByTestId } = render(
        <SiteConfigProvider>
          <TestComponent />
        </SiteConfigProvider>
      )

      expect(getByTestId("ai-assistant-feature")).toHaveTextContent("true")
    })

    test("allows overriding ai assistant feature via config", () => {
      const config: DocsConfig = {
        baseUrl: "",
        project: {
          title: "",
          key: "",
        },
        sidebars: [],
        logo: "",
        features: {
          aiAssistant: false,
        },
        version: {
          number: "1.0.0",
          releaseUrl: "",
          releaseDate: "",
        }
      }

      const { getByTestId } = render(
        <SiteConfigProvider config={config}>
          <TestComponent />
        </SiteConfigProvider>
      )

      expect(getByTestId("ai-assistant-feature")).toHaveTextContent("false")
    })

    test("throws error when used outside provider", () => {
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      expect(() => {
        render(<TestComponent />)
      }).toThrow("useSiteConfig must be used inside a SiteConfigProvider")

      consoleSpy.mockRestore()
    })
  })

  describe("product view properties", () => {
    test("initializes with isInProduct false when no product view", () => {
      const { getByTestId } = render(
        <SiteConfigProvider>
          <TestComponent />
        </SiteConfigProvider>
      )

      expect(getByTestId("is-in-product")).toHaveTextContent("false")
      expect(getByTestId("product-view")).toHaveTextContent("none")
    })

    test("detects bloom product view from URL search params", () => {
      // Mock location.search
      delete (global as any).location
      ;(global as any).location = {
        search: "?view=bloom",
      }

      const { getByTestId } = render(
        <SiteConfigProvider>
          <TestComponent />
        </SiteConfigProvider>
      )

      expect(getByTestId("is-in-product")).toHaveTextContent("true")
      expect(getByTestId("product-view")).toHaveTextContent("bloom")
    })

    test("ignores invalid product view from URL", () => {
      // Mock location.search with invalid view
      delete (global as any).location
      ;(global as any).location = {
        search: "?view=invalid",
      }

      const { getByTestId } = render(
        <SiteConfigProvider>
          <TestComponent />
        </SiteConfigProvider>
      )

      expect(getByTestId("is-in-product")).toHaveTextContent("false")
      expect(getByTestId("product-view")).toHaveTextContent("none")
    })

    test("handles missing view parameter", () => {
      // Mock location.search without view parameter
      delete (global as any).location
      ;(global as any).location = {
        search: "?other=param",
      }

      const { getByTestId } = render(
        <SiteConfigProvider>
          <TestComponent />
        </SiteConfigProvider>
      )

      expect(getByTestId("is-in-product")).toHaveTextContent("false")
      expect(getByTestId("product-view")).toHaveTextContent("none")
    })

    test("handles empty search params", () => {
      // Mock location.search as empty
      delete (global as any).location
      ;(global as any).location = {
        search: "",
      }

      const { getByTestId } = render(
        <SiteConfigProvider>
          <TestComponent />
        </SiteConfigProvider>
      )

      expect(getByTestId("is-in-product")).toHaveTextContent("false")
      expect(getByTestId("product-view")).toHaveTextContent("none")
    })
  })
})
