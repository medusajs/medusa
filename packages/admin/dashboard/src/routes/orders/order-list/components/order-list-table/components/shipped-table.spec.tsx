// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// `shipped-table.tsx` imports `useOrders`, which pulls in `lib/client` -
// that module reads build-time defines (`__AUTH_TYPE__` etc.) injected by
// the Vite config and isn't available under a plain component test. These
// cell components don't exercise data fetching, so the hook is mocked out
// purely to keep module evaluation side-effect free.
vi.mock("../../../../../../hooks/api/orders", () => ({
  useOrders: () => ({
    orders: [],
    count: 0,
    isLoading: false,
    isError: false,
    error: undefined,
  }),
}))

import { CarrierCell, getMostRecentShippedFulfillment } from "./shipped-table"

afterEach(() => {
  cleanup()
})

describe("getMostRecentShippedFulfillment", () => {
  it("returns null when there are no fulfillments", () => {
    expect(getMostRecentShippedFulfillment(undefined)).toBeNull()
    expect(getMostRecentShippedFulfillment(null)).toBeNull()
    expect(getMostRecentShippedFulfillment([])).toBeNull()
  })

  it("excludes canceled fulfillments and fulfillments that haven't shipped yet", () => {
    const result = getMostRecentShippedFulfillment([
      {
        id: "ful_canceled",
        provider_id: "fp_canceled-carrier_v1",
        shipped_at: "2024-01-01T00:00:00.000Z",
        canceled_at: "2024-01-02T00:00:00.000Z",
      } as any,
      {
        id: "ful_unshipped",
        provider_id: "fp_unshipped-carrier_v1",
        shipped_at: null,
        canceled_at: null,
      } as any,
    ])

    expect(result).toBeNull()
  })

  it("picks the most recently shipped fulfillment among several", () => {
    const older = {
      id: "ful_older",
      provider_id: "fp_old-carrier_v1",
      shipped_at: "2024-01-01T00:00:00.000Z",
      canceled_at: null,
    } as any
    const newer = {
      id: "ful_newer",
      provider_id: "fp_new-carrier_v1",
      shipped_at: "2024-02-01T00:00:00.000Z",
      canceled_at: null,
    } as any

    expect(getMostRecentShippedFulfillment([older, newer])).toBe(newer)
    expect(getMostRecentShippedFulfillment([newer, older])).toBe(newer)
  })
})

describe("CarrierCell", () => {
  it("renders the formatted provider name for a shipped fulfillment", () => {
    render(
      <CarrierCell
        fulfillment={
          {
            id: "ful_1",
            provider_id: "fp_easypost",
            shipped_at: "2024-01-01T00:00:00.000Z",
            canceled_at: null,
          } as any
        }
      />
    )

    expect(screen.getByText("Easypost")).toBeTruthy()
  })

  it("renders a placeholder when there is no shipped fulfillment", () => {
    const { container } = render(<CarrierCell fulfillment={null} />)

    expect(container.textContent).not.toBe("")
    expect(screen.queryByText("Easypost")).toBeNull()
  })
})
