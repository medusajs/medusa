import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { afterEach, describe, expect, it, vi } from "vitest"

import { MainLayout } from "../main-layout"

const mocks = vi.hoisted(() => ({
  menuItems: [] as Record<string, unknown>[],
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("../../../../hooks/use-resource-permissions", () => {
  const allowed = () => ({ canRead: true })
  return {
    useCampaignPermissions: allowed,
    useCustomerGroupPermissions: allowed,
    useCustomerPermissions: allowed,
    useInventoryItemPermissions: allowed,
    useOrderPermissions: allowed,
    usePriceListPermissions: allowed,
    useProductCategoryPermissions: allowed,
    useProductCollectionPermissions: allowed,
    useProductPermissions: allowed,
    usePromotionPermissions: allowed,
    useReservationItemPermissions: allowed,
    useResourcePermissions: allowed,
  }
})

vi.mock("../../../../providers/extension-provider", () => ({
  useExtension: () => ({
    getMenu: () => mocks.menuItems,
    getWidgets: () => [],
  }),
}))

vi.mock("../../../../providers/search-provider", () => ({
  useSearch: () => ({ toggleSearch: vi.fn() }),
}))

vi.mock("../../../../hooks/api/store", () => ({
  useStore: () => ({ store: undefined, isPending: true }),
}))

vi.mock("../../../../hooks/api", () => ({
  useLogout: () => ({ mutateAsync: vi.fn() }),
}))

vi.mock("../../../../lib/query-client", () => ({
  queryClient: { clear: vi.fn() },
}))

vi.mock("../../../../hooks/use-document-direction", () => ({
  useDocumentDirection: () => "ltr",
}))

vi.mock("../../../common/permission-guard", () => ({
  PermissionGuard: () => null,
}))

vi.mock("../../user-menu", () => ({
  UserMenu: () => null,
}))

vi.mock("../../shell", () => ({
  Shell: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock("../../../layout-composer", () => {
  const LayoutComposer = ({
    sections,
  }: {
    sections: { main: React.ReactNode }
  }) => <>{sections.main}</>
  LayoutComposer.Entry = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  )
  return { LayoutComposer }
})

vi.mock("../../nav-item", () => ({
  usePermittedNavItems: (items: unknown[]) => items,
  NavItem: ({ to, items }: { to: string; items?: { to: string }[] }) => (
    <p>{`${to}=[${(items ?? []).map((item) => item.to).join(",")}]`}</p>
  ),
}))

const renderNav = () => {
  const markup = renderToStaticMarkup(
    <MemoryRouter>
      <MainLayout />
    </MemoryRouter>
  )

  return Object.fromEntries(
    [...markup.matchAll(/<p>([^=<]+)=\[([^\]]*)\]<\/p>/g)].map(
      ([, to, items]) => [to, items ? items.split(",") : []]
    )
  )
}

describe("MainLayout", () => {
  afterEach(() => {
    mocks.menuItems = []
  })

  it("should nest an extension route under the core Orders route", () => {
    mocks.menuItems = [
      { label: "Draft Orders", to: "/draft-orders", nested: "/orders" },
    ]

    const nav = renderNav()

    expect(nav["/orders"]).toEqual(["/draft-orders"])
    expect(nav["/draft-orders"]).toBeUndefined()
  })

  it("should nest an extension route under a core route without children", () => {
    mocks.menuItems = [
      { label: "Custom Prices", to: "/custom-prices", nested: "/price-lists" },
    ]

    const nav = renderNav()

    expect(nav["/price-lists"]).toEqual(["/custom-prices"])
  })

  it("should keep core children when nesting an extension route", () => {
    mocks.menuItems = [{ label: "Bundles", to: "/bundles", nested: "/products" }]

    const nav = renderNav()

    expect(nav["/products"]).toEqual([
      "/collections",
      "/categories",
      "/product-options",
      "/bundles",
    ])
  })
})
