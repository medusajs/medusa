import { MedusaContainer } from "@medusajs/types"
import { RBACFieldFilter } from "../rbac-field-filter"

const fetchPolicyResourcesMock = jest.fn()
const isGrantedMock = jest.fn()

jest.mock("../../../../policies/has-permission", () => ({
  fetchPolicyResources: (...args: any[]) => fetchPolicyResourcesMock(...args),
  isGranted: (...args: any[]) => isGrantedMock(...args),
}))

const { isGranted } = jest.requireActual("../../../../policies/has-permission")

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

const getPermissionsMock = jest.fn()

const makeFilter = (policyResources: string[], permissions: string[]) => {
  fetchPolicyResourcesMock.mockResolvedValue(new Set(policyResources))
  getPermissionsMock.mockResolvedValue(permissions)

  return new RBACFieldFilter({
    getPermissions: getPermissionsMock,
    container: {} as MedusaContainer,
  })
}

const checkedResources = () =>
  isGrantedMock.mock.calls.map(([, resource]) => resource)

const context = {
  entity: "product",
  parsedFields: {
    fields: new Set(["title", "variants.sku"]),
    starFields: new Set<string>(),
  },
}

describe("RBACFieldFilter", () => {
  beforeEach(() => {
    fetchPolicyResourcesMock.mockReset()
    getPermissionsMock.mockReset()
    isGrantedMock.mockReset().mockImplementation(isGranted)
  })

  it("should exclude fields of a governed entity when the read permission is denied", async () => {
    const notAllowedFields = await makeFilter(
      ["product", "product_variant"],
      ["product:read"]
    ).getNotAllowedFields(context)

    expect(notAllowedFields).toEqual(["variants.sku"])
    expect(checkedResources()).toEqual(
      expect.arrayContaining(["product", "product_variant"])
    )
  })

  it("should fetch the permissions once for every checked path", async () => {
    await makeFilter(
      ["product", "product_variant"],
      ["product:read", "product_variant:read"]
    ).getNotAllowedFields(context)

    expect(getPermissionsMock).toHaveBeenCalledTimes(1)
    expect(isGrantedMock.mock.calls.length).toBeGreaterThan(1)
  })

  it("should allow fields of a governed entity granted through a wildcard", async () => {
    const notAllowedFields = await makeFilter(
      ["product", "product_variant"],
      ["product:read", "product_variant:*"]
    ).getNotAllowedFields(context)

    expect(notAllowedFields).toEqual([])
  })

  it("should skip entities that are not governed resources without checking permissions", async () => {
    const notAllowedFields = await makeFilter(
      ["product"],
      ["product:read"]
    ).getNotAllowedFields(context)

    expect(notAllowedFields).toEqual([])
    expect(checkedResources()).toEqual(["product"])
  })

  it("should not check any permission when no resource is governed", async () => {
    const notAllowedFields = await makeFilter([], []).getNotAllowedFields(
      context
    )

    expect(notAllowedFields).toEqual([])
    expect(isGrantedMock).not.toHaveBeenCalled()
  })
})
