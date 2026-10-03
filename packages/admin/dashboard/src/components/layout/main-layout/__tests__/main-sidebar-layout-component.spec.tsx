import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock("@medusajs/ui", () => ({
  clx: (...classes: unknown[]) => classes.filter(Boolean).join(" "),
  Text: ({ children }: { children?: unknown }) =>
    createElement("span", null, children as never),
  IconButton: ({ children }: { children?: unknown }) =>
    createElement("button", null, children as never),
  Divider: () => createElement("div", { role: "separator" }),
}))

vi.mock("@medusajs/icons", () => ({
  MinusMini: () => createElement("svg"),
}))

import { MainSidebarLayoutComponent } from "../main-sidebar-layout-component"

const render = (sections: Record<string, unknown>) =>
  renderToStaticMarkup(
    createElement(MainSidebarLayoutComponent, {
      sections: sections as never,
    })
  )

describe("MainSidebarLayoutComponent", () => {
  it("renders a group header for every section that has entries", () => {
    const html = render({
      top: [createElement("a", { key: "s" }, "search-entry")],
      sales: [createElement("a", { key: "o" }, "orders-entry")],
      catalog: [createElement("a", { key: "p" }, "products-entry")],
      customers: [],
      marketing: [],
      extensions: [],
    })

    expect(html).toContain("app.nav.main.groups.sales")
    expect(html).toContain("app.nav.main.groups.catalog")
    expect(html).toContain("orders-entry")
    expect(html).toContain("products-entry")
    expect(html).toContain("search-entry")
  })

  it("omits groups without visible entries", () => {
    const html = render({
      top: [],
      sales: [createElement("a", { key: "o" }, "orders-entry")],
      catalog: [],
      customers: [],
      marketing: [],
      extensions: [],
    })

    expect(html).not.toContain("app.nav.main.groups.catalog")
    expect(html).not.toContain("app.nav.main.groups.customers")
    expect(html).not.toContain("app.nav.main.groups.marketing")
    expect(html).not.toContain("app.nav.common.extensions")
  })

  it("keeps a group that renders a drop target while customizing", () => {
    const html = render({
      top: [],
      sales: createElement("div", null, "dropzone"),
      catalog: [],
      customers: [],
      marketing: [],
      extensions: [],
    })

    expect(html).toContain("app.nav.main.groups.sales")
    expect(html).toContain("dropzone")
  })

  it("separates visible groups with a single divider", () => {
    const html = render({
      top: [],
      sales: [createElement("a", { key: "o" }, "orders-entry")],
      catalog: [],
      customers: [createElement("a", { key: "c" }, "customers-entry")],
      marketing: [],
      extensions: [],
    })

    expect(html.match(/role="separator"/g)).toHaveLength(1)
  })
})
