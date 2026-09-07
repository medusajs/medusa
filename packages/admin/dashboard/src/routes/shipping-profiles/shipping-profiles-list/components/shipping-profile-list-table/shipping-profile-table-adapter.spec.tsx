import { describe, expect, it, vi } from "vitest"
import { TFunction } from "i18next"

vi.mock("../../../../../hooks/api/shipping-profiles", () => ({
  useShippingProfiles: () => ({
    shipping_profiles: [],
    count: 0,
    isError: false,
    error: null,
    isLoading: false,
  }),
}))

vi.mock("./shipping-options-row-actions", () => ({
  ShippingOptionsRowActions: () => null,
}))

import { createShippingProfileTableAdapter } from "./shipping-profile-table-adapter"

const t = ((key: string) => key) as TFunction<"translation", undefined>

describe("createShippingProfileTableAdapter", () => {
  it("links rows to the registered shipping profile detail route", () => {
    const adapter = createShippingProfileTableAdapter({ t })
    const row = { id: "sp_123" } as Parameters<
      NonNullable<typeof adapter.getRowHref>
    >[0]

    expect(adapter.getRowHref?.(row)).toEqual(
      "/settings/locations/shipping-profiles/sp_123"
    )
  })
})
