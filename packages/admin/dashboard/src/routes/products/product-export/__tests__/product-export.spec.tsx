// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import type { ComponentProps, PropsWithChildren } from "react"
import { MemoryRouter } from "react-router-dom"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ProductExport } from "../product-export"

const { mutateAsync } = vi.hoisted(() => ({ mutateAsync: vi.fn() }))

vi.mock("@medusajs/ui", () => ({
  Button: ({
    children,
    size: _size,
    variant: _variant,
    ...props
  }: ComponentProps<"button"> & {
    size?: string
    variant?: string
  }) => <button {...props}>{children}</button>,
  Heading: ({ children }: PropsWithChildren) => <h2>{children}</h2>,
  toast: { info: vi.fn(), error: vi.fn() },
}))

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock("../../../../components/modals", () => {
  const Wrapper = ({ children }: PropsWithChildren) => <div>{children}</div>

  return {
    RouteDrawer: Object.assign(Wrapper, {
      Header: Wrapper,
      Title: Wrapper,
      Description: Wrapper,
      Body: Wrapper,
      Footer: Wrapper,
      Close: Wrapper,
    }),
    useRouteModal: () => ({ handleSuccess: vi.fn() }),
  }
})

vi.mock("../../../../hooks/api", () => ({
  useExportProducts: () => ({ mutateAsync }),
}))

vi.mock("../../../../hooks/table/query", async () => {
  const { useProductTableQuery } = await import(
    "../../../../hooks/table/query/use-product-table-query"
  )
  return { useProductTableQuery }
})

vi.mock("../components/export-filters", () => ({
  ExportFilters: () => null,
}))

afterEach(cleanup)

beforeEach(() => {
  mutateAsync.mockReset()
  mutateAsync.mockResolvedValue({})
})

const exportProducts = async (params = new URLSearchParams()) => {
  render(
    <MemoryRouter initialEntries={[`/products/export?${params}`]}>
      <ProductExport />
    </MemoryRouter>
  )

  fireEvent.click(screen.getByRole("button", { name: "actions.export" }))
  await waitFor(() => expect(mutateAsync).toHaveBeenCalledOnce())

  return mutateAsync.mock.calls[0][0]
}

describe("ProductExport", () => {
  it("passes the product list's unprefixed status filter to the export request", async () => {
    const request = await exportProducts(
      new URLSearchParams({ status: "draft" })
    )

    expect(request.query.status).toEqual(["draft"])
    expect(request.query).not.toHaveProperty("fields")
    expect(request.payload).toEqual({})
  })

  it("preserves search, relation and date filters from the product list", async () => {
    const created_at = { $gte: "2026-01-01" }
    const updated_at = { $lte: "2026-10-01" }
    const request = await exportProducts(
      new URLSearchParams({
        q: "shirt",
        collection_id: "pcol_1,pcol_2",
        category_id: "pcat_1",
        tag_id: "ptag_1",
        type_id: "ptyp_1",
        sales_channel_id: "sc_1",
        created_at: JSON.stringify(created_at),
        updated_at: JSON.stringify(updated_at),
      })
    )

    expect(request.query).toMatchObject({
      q: "shirt",
      collection_id: ["pcol_1", "pcol_2"],
      category_id: ["pcat_1"],
      tag_id: ["ptag_1"],
      type_id: ["ptyp_1"],
      sales_channel_id: ["sc_1"],
      created_at,
      updated_at,
    })
  })

  it("allows exporting without product list filters", async () => {
    const request = await exportProducts()

    expect(request.query).toMatchObject({ limit: 20, offset: 0 })
    expect(request.query.status).toBeUndefined()
    expect(request.query.q).toBeUndefined()
    expect(request.query).not.toHaveProperty("fields")
  })
})
