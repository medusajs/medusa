import { describe, expect, it, vi } from "vitest"

vi.mock("../../../../../../hooks/api/shipping-profiles", () => ({
  useShippingProfiles: vi.fn(),
  useDeleteShippingProfile: vi.fn(),
}))

vi.mock("../shipping-options-row-actions", () => ({
  ShippingOptionsRowActions: () => null,
}))

import { createShippingProfileTableAdapter } from "../shipping-profile-table-adapter"

describe("createShippingProfileTableAdapter", () => {
  const mockT = ((key: string) => key) as any

  it("should generate the correct detail route with /settings/locations/ prefix", () => {
    const adapter = createShippingProfileTableAdapter({ t: mockT })

    expect(adapter.getRowHref({ id: "sp_123" } as any)).toEqual(
      "/settings/locations/shipping-profiles/sp_123"
    )
  })
})
