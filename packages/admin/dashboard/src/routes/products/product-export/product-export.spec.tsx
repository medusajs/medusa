import React from "react"
import { renderToString } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"
import { afterEach, describe, expect, it, vi } from "vitest"

import { ProductExport } from "./product-export"

const mocks = vi.hoisted(() => ({
  mutateAsync: vi.fn(),
  isViewConfigEnabled: false,
  buttonClicks: {} as Record<string, () => unknown>,
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

vi.mock("@medusajs/ui", () => ({
  Button: ({ children, onClick }: React.ComponentProps<"button">) => {
    if (typeof children === "string" && onClick) {
      mocks.buttonClicks[children] = onClick as () => unknown
    }
    return <button>{children}</button>
  },
  Heading: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
  toast: {
    info: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock("../../../components/modals", () => {
  const Passthrough = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  )

  return {
    RouteDrawer: Object.assign(Passthrough, {
      Header: Passthrough,
      Title: Passthrough,
      Description: Passthrough,
      Body: Passthrough,
      Footer: Passthrough,
      Close: () => null,
    }),
    useRouteModal: () => ({ handleSuccess: vi.fn() }),
  }
})

vi.mock("./components/export-filters", () => ({
  ExportFilters: () => null,
}))

vi.mock("../../../providers/feature-flag-provider", () => ({
  useFeatureFlag: () => mocks.isViewConfigEnabled,
}))

vi.mock("../../../hooks/api", () => ({
  useExportProducts: () => ({ mutateAsync: mocks.mutateAsync }),
}))

const exportAt = async (url: string) => {
  renderToString(
    <MemoryRouter initialEntries={[url]}>
      <ProductExport />
    </MemoryRouter>
  )

  await mocks.buttonClicks["actions.export"]()
}

describe("ProductExport", () => {
  afterEach(() => {
    mocks.mutateAsync.mockReset()
    mocks.buttonClicks = {}
    mocks.isViewConfigEnabled = false
  })

  it("should send the product list filters from the URL with the export request", async () => {
    await exportAt(
      "/products/export?status=draft&q=shirt&collection_id=pcol_1&tag_id=ptag_1&created_at=%7B%22%24gte%22%3A%222024-01-01%22%7D"
    )

    expect(mocks.mutateAsync).toHaveBeenCalledTimes(1)
    expect(mocks.mutateAsync.mock.calls[0][0]).toEqual({
      payload: {},
      query: expect.objectContaining({
        status: ["draft"],
        q: "shirt",
        collection_id: ["pcol_1"],
        tag_id: ["ptag_1"],
        created_at: { $gte: "2024-01-01" },
      }),
    })
  })

  it("should not send the list fields with the export request", async () => {
    await exportAt("/products/export?status=draft")

    expect(mocks.mutateAsync.mock.calls[0][0].query).not.toHaveProperty(
      "fields"
    )
  })

  it("should send the configurable product list filters from the URL with the export request", async () => {
    mocks.isViewConfigEnabled = true
    const params = new URLSearchParams({
      p_status: JSON.stringify(["draft"]),
      p_q: "shirt",
      "p_collection.id": JSON.stringify(["pcol_1"]),
      p_created_at: JSON.stringify({ $gte: "2024-01-01" }),
      p_handle: JSON.stringify(""),
      p_order: "-created_at",
      p_offset: "20",
    })

    await exportAt(`/products/export?${params.toString()}`)

    expect(mocks.mutateAsync.mock.calls[0][0]).toEqual({
      payload: {},
      query: {
        status: ["draft"],
        q: "shirt",
        collection: { id: ["pcol_1"] },
        created_at: { $gte: "2024-01-01" },
      },
    })
  })
})
