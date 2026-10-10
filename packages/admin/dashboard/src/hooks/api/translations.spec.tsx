// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { PropsWithChildren } from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { useReferenceTranslations } from "./translations"

const api = vi.hoisted(() => ({ entities: vi.fn() }))
vi.mock("../../lib/client", () => ({ sdk: { admin: { translation: api } } }))
vi.mock("../../lib/query-client", () => ({ queryClient: {} }))
afterEach(() => {
  cleanup()
  vi.resetAllMocks()
})

function setup() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return renderHook(
    () => useReferenceTranslations("product", ["selected"], { retry: false }),
    { wrapper }
  )
}

const page = (offset: number, count = 45) => ({
  offset,
  limit: 20,
  count,
  data: Array.from({ length: Math.min(20, count - offset) }, (_, index) => ({
    id: `product_${offset + index}`,
    title: `Product ${offset + index}`,
    translations: [{ id: `tr_${offset + index}`, locale_code: "pl-PL" }],
  })),
})

describe("loading all translation rows", () => {
  it("includes all pages, their translations, and preserves the entity selection", async () => {
    api.entities.mockImplementation(async ({ offset }) => page(offset))
    const { result } = setup()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    let all:
      | Awaited<ReturnType<typeof result.current.fetchAllReferences>>
      | undefined
    await act(async () => {
      all = await result.current.fetchAllReferences()
    })
    expect(all!.references).toHaveLength(45)
    expect(all!.translations).toHaveLength(45)
    expect(all!.references[44].id).toBe("product_44")
    expect(api.entities.mock.calls.map(([query]) => query.offset)).toEqual([
      0, 20, 40,
    ])
    expect(
      api.entities.mock.calls.every(
        ([query]) => query.type === "product" && query.id[0] === "selected"
      )
    ).toBe(true)
  })

  it("rejects an incomplete load instead of copying only the first page", async () => {
    api.entities.mockImplementation(async ({ offset }) => {
      if (offset > 0) throw new Error("Page failed")
      return page(offset)
    })
    const { result } = setup()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    await act(async () => {
      await expect(result.current.fetchAllReferences()).rejects.toThrow(
        "Page failed"
      )
    })
  })

  it("does not request another page when every row is already loaded", async () => {
    api.entities.mockImplementation(async ({ offset }) => page(offset, 3))
    const { result } = setup()
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const all = await result.current.fetchAllReferences()
    expect(all.references).toHaveLength(3)
    expect(api.entities).toHaveBeenCalledTimes(1)
  })
})
