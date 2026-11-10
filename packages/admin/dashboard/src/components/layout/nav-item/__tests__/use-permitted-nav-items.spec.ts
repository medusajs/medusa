import { describe, expect, it } from "vitest"
import type { Permission } from "../../../../lib/permissions"
import { filterPermittedNavItems } from "../use-permitted-nav-items"

const granted = new Set<string>(["product:read"])
const hasAll = (permissions: Permission[]) =>
  permissions.every((permission) => granted.has(permission))

describe("filterPermittedNavItems", () => {
  it("keeps items without permissions and items whose permissions are all held", () => {
    const result = filterPermittedNavItems(
      [
        { label: "Open", to: "/open" },
        {
          label: "Gift cards",
          to: "/gift-cards",
          permissions: ["product:read"],
        },
      ],
      hasAll
    )

    expect(result.map((item) => item.to)).toEqual(["/open", "/gift-cards"])
  })

  it("drops items and nested items missing any permission", () => {
    const result = filterPermittedNavItems(
      [
        {
          label: "Store credit",
          to: "/store-credit-accounts",
          permissions: ["product:read", "customer:read"],
        },
        {
          label: "Gift cards",
          to: "/gift-cards",
          permissions: ["product:read"],
          items: [
            { label: "Products", to: "/gift-cards/products" },
            {
              label: "Hidden",
              to: "/gift-cards/hidden",
              permissions: ["order:read"],
            },
          ],
        },
      ],
      hasAll
    )

    expect(result).toHaveLength(1)
    expect(result[0].items?.map((item) => item.to)).toEqual([
      "/gift-cards/products",
    ])
  })
})
