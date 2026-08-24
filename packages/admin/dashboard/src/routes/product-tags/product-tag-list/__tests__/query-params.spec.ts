import { describe, expect, it } from "vitest"

import { getProductTagListQueryParams } from "../query-params"

const params = (search: string) => new URLSearchParams(search)

describe("getProductTagListQueryParams", () => {
  it("returns nothing when the URL carries no list params", () => {
    expect(getProductTagListQueryParams(params(""))).toEqual({})
  })

  it("reads unprefixed params", () => {
    expect(getProductTagListQueryParams(params("?order=created_at"))).toEqual({
      order: "created_at",
    })
  })

  it("strips the table prefix so the API sees the bare name", () => {
    expect(
      getProductTagListQueryParams(params("?ptag_order=created_at"))
    ).toEqual({ order: "created_at" })
  })

  it("drops params the endpoint does not accept", () => {
    expect(
      getProductTagListQueryParams(
        params("?ptag_order=created_at&ptag_view=default&sidebar=open")
      )
    ).toEqual({ order: "created_at" })
  })

  it("parses JSON encoded date filters", () => {
    const createdAt = JSON.stringify({ $gte: "2026-01-01" })

    expect(
      getProductTagListQueryParams(
        params(`?ptag_created_at=${encodeURIComponent(createdAt)}`)
      )
    ).toEqual({ created_at: { $gte: "2026-01-01" } })
  })

  it("keeps a plain string when it is not valid JSON", () => {
    expect(getProductTagListQueryParams(params("?ptag_q=shirt"))).toEqual({
      q: "shirt",
    })
  })

  it("prefers the prefixed value when both forms are present", () => {
    expect(
      getProductTagListQueryParams(
        params("?order=updated_at&ptag_order=created_at")
      )
    ).toEqual({ order: "created_at" })
  })

  it("reads every supported param", () => {
    const result = getProductTagListQueryParams(
      params("?ptag_offset=20&ptag_q=shirt&ptag_order=created_at")
    )

    expect(result).toEqual({ offset: 20, q: "shirt", order: "created_at" })
  })
})
