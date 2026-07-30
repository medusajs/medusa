import { MedusaContainer } from "@medusajs/types"
import { RBACFieldFilter } from "../rbac-field-filter"

const hasPermissionMock = jest.fn()
const fetchPolicyResourcesMock = jest.fn()

jest.mock("../../../../policies/has-permission", () => ({
  hasPermission: (...args: any[]) => hasPermissionMock(...args),
  fetchPolicyResources: (...args: any[]) => fetchPolicyResourcesMock(...args),
}))

jest.mock("@medusajs/modules-sdk", () => ({
  MedusaModule: {
    getAllJoinerConfigs: () => [
      {
        alias: [{ name: ["product", "products"], entity: "Product" }],
        schema: `
          type Product {
            id: ID
            title: String
            variants: [ProductVariant]
          }

          type ProductVariant {
            id: ID
            sku: String
          }
        `,
      },
    ],
  },
}))

const makeFilter = (policyResources: string[]) => {
  fetchPolicyResourcesMock.mockResolvedValue(new Set(policyResources))

  return new RBACFieldFilter({
    policies: [{ resource: "product", operation: "read" }],
    getActorRoles: async () => ["role_1"],
    container: {} as MedusaContainer,
  })
}

const context = {
  entity: "product",
  parsedFields: {
    fields: new Set(["title", "variants.sku"]),
    starFields: new Set<string>(),
  },
}

describe("RBACFieldFilter", () => {
  beforeEach(() => {
    hasPermissionMock.mockReset()
    fetchPolicyResourcesMock.mockReset()
  })

  it("should exclude fields of a governed entity when the read permission is denied", async () => {
    hasPermissionMock.mockImplementation(async ({ actions }) => {
      return actions.resource !== "product_variant"
    })

    const notAllowedFields = await makeFilter([
      "product",
      "product_variant",
    ]).getNotAllowedFields(context)

    expect(notAllowedFields).toEqual(["variants.sku"])
    expect(
      hasPermissionMock.mock.calls.map(([input]) => input.actions.resource)
    ).toEqual(expect.arrayContaining(["product", "product_variant"]))
  })

  it("should skip entities that are not governed resources without checking permissions", async () => {
    hasPermissionMock.mockResolvedValue(true)

    const notAllowedFields = await makeFilter(["product"]).getNotAllowedFields(
      context
    )

    expect(notAllowedFields).toEqual([])
    expect(
      hasPermissionMock.mock.calls.map(([input]) => input.actions.resource)
    ).toEqual(["product"])
  })

  it("should not check any permission when no resource is governed", async () => {
    hasPermissionMock.mockResolvedValue(false)

    const notAllowedFields = await makeFilter([]).getNotAllowedFields(context)

    expect(notAllowedFields).toEqual([])
    expect(hasPermissionMock).not.toHaveBeenCalled()
  })
})
