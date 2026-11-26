import { TooltipProvider } from "@medusajs/ui"
import type { ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { MemoryRouter } from "react-router-dom"

import List, { config, handle } from "../page"

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => `t(${key})` }),
}))

jest.mock("@medusajs/dashboard/components", () => ({
  LayoutComposer: Object.assign(
    ({ sections }: { sections: { main: ReactNode } }) => <>{sections.main}</>,
    { Entry: ({ children }: { children: ReactNode }) => <>{children}</> }
  ),
}))

jest.mock("@medusajs/dashboard/hooks", () => ({
  usePermissions: () => ({
    hasPermission: () => true,
    hasAllPermissions: () => true,
  }),
}))

jest.mock("../../../hooks/api/customers", () => ({
  useCustomers: () => ({ customers: [] }),
}))
jest.mock("../../../hooks/api/draft-orders", () => ({
  useDraftOrders: () => ({
    draft_orders: [
      {
        id: "order_1",
        display_id: 1,
        created_at: "2024-01-01T00:00:00.000Z",
      },
    ],
    count: 1,
    isPending: false,
    isError: false,
  }),
}))
jest.mock("../../../hooks/api/regions", () => ({
  useRegions: () => ({ regions: [] }),
}))
jest.mock("../../../hooks/api/sales-channels", () => ({
  useSalesChannels: () => ({ sales_channels: [] }),
}))

describe("Draft orders list route", () => {
  it("should translate the sidebar label with the dashboard translations", () => {
    expect(config.translationNs).toBe("translation")
    expect(config.label).toBe("draftOrders.domain")
  })

  it("should render the breadcrumb in the admin language", () => {
    const html = renderToStaticMarkup(<>{handle.breadcrumb()}</>)

    expect(html).toBe("t(draftOrders.domain)")
  })

  it("should render the column headers in the admin language", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <TooltipProvider>
          <List />
        </TooltipProvider>
      </MemoryRouter>
    )

    expect(html).toContain("t(orders.fields.displayId)")
    expect(html).toContain("t(fields.date)")
    expect(html).toContain("t(fields.customer)")
    expect(html).toContain("t(fields.salesChannel)")
    expect(html).toContain("t(fields.region)")
    expect(html).not.toContain("Display ID")
    expect(html).not.toContain("Sales Channel")
  })
})
