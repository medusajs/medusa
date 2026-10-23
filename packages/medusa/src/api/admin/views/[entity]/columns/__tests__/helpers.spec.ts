import { HttpTypes } from "@medusajs/framework/types"
import { filterReadableColumns } from "../helpers"

// Permission state each test sets up.
const state = {
  rbacInstalled: true,
  roles: ["role_1"],
  governed: new Set<string>(),
  granted: new Set<string>(),
  unreadableFields: new Set<string>(),
}

const checkedFields: string[][] = []

jest.mock("@medusajs/framework/modules-sdk", () => ({
  MedusaModule: { isInstalled: () => state.rbacInstalled },
}))

jest.mock("@medusajs/framework", () => ({
  fetchPolicyResources: async () => state.governed,
  // Mirrors the real behavior: no roles grant nothing.
  resolvePermissions: async ({ roles, universe }) =>
    new Set(
      roles.length
        ? universe
            .map(({ resource, operation }) => `${resource}:${operation}`)
            .filter((permission) => state.granted.has(permission))
        : []
    ),
}))

jest.mock("@medusajs/framework/http", () => ({
  resolveRoles: async () => state.roles,
  RBACFieldFilter: class {
    async getNotAllowedFields({ parsedFields }) {
      const fields = [...parsedFields.fields] as string[]
      checkedFields.push(fields)
      return fields.filter((field) => state.unreadableFields.has(field))
    }
  },
}))

const req = { auth_context: {}, scope: {} } as any

const column = (
  overrides: Partial<HttpTypes.AdminColumn>
): HttpTypes.AdminColumn => ({
  id: overrides.field!,
  name: overrides.field!,
  field: overrides.field!,
  sortable: true,
  hideable: true,
  default_visible: true,
  data_type: "string",
  ...overrides,
})

const relationshipFilter = (entity: string) => ({
  enabled: true,
  relationship: {
    entity,
    value_field: "id",
    display_field: "name",
    multiple: true,
    endpoint: "/admin/anything",
  },
})

const fields = (columns: HttpTypes.AdminColumn[]) =>
  columns.map((col) => col.field)

describe("filterReadableColumns", () => {
  beforeEach(() => {
    state.rbacInstalled = true
    state.roles = ["role_1"]
    state.governed = new Set(["product", "sales_channel", "stock_location"])
    state.granted = new Set()
    state.unreadableFields = new Set()
    checkedFields.length = 0
  })

  it("returns every column when RBAC is not installed", async () => {
    state.rbacInstalled = false
    state.unreadableFields = new Set(["sales_channels.name"])
    const columns = [
      column({ field: "title" }),
      column({ field: "sales_channels.name" }),
    ]

    expect(await filterReadableColumns(req, "product", columns)).toBe(columns)
  })

  it("drops columns whose field crosses an unreadable relation", async () => {
    state.unreadableFields = new Set(["sales_channels.name"])

    const result = await filterReadableColumns(req, "product", [
      column({ field: "title" }),
      column({ field: "sales_channels.name" }),
    ])

    expect(fields(result)).toEqual(["title"])
  })

  it("drops computed columns with an unreadable required field", async () => {
    state.unreadableFields = new Set(["sales_channels.name"])

    const result = await filterReadableColumns(req, "product", [
      column({ field: "title" }),
      column({
        field: "sales_channels_display",
        computed: {
          type: "list",
          required_fields: ["sales_channels.name"],
          optional_fields: [],
        },
      }),
    ])

    expect(fields(result)).toEqual(["title"])
    expect(checkedFields[0]).toEqual(
      expect.arrayContaining(["sales_channels_display", "sales_channels.name"])
    )
  })

  it("removes an unreadable relationship filter but keeps its column", async () => {
    const result = await filterReadableColumns(req, "product", [
      column({
        field: "sales_channel_names",
        filter: relationshipFilter("SalesChannel"),
      }),
    ])

    expect(fields(result)).toEqual(["sales_channel_names"])
    expect(result[0].filter).toBeUndefined()
  })

  it("drops a filter-only column whose filter is unreadable", async () => {
    const result = await filterReadableColumns(req, "inventory_item", [
      column({ field: "sku" }),
      column({
        field: "location_levels.location_id",
        context: "filter",
        filter: relationshipFilter("StockLocation"),
      }),
    ])

    expect(fields(result)).toEqual(["sku"])
  })

  it("keeps a relationship filter the user can read", async () => {
    state.granted = new Set(["sales_channel:read"])
    const salesChannels = column({
      field: "sales_channel_names",
      filter: relationshipFilter("SalesChannel"),
    })

    const result = await filterReadableColumns(req, "product", [salesChannels])

    expect(result).toEqual([salesChannels])
  })

  it("keeps relationship filters of entities without policies", async () => {
    const brands = column({
      field: "brand_names",
      filter: relationshipFilter("Brand"),
    })

    const result = await filterReadableColumns(req, "product", [brands])

    expect(result).toEqual([brands])
  })

  it("drops governed relationship filters for a user without roles", async () => {
    state.roles = []

    const result = await filterReadableColumns(req, "product", [
      column({
        field: "sales_channel_names",
        filter: relationshipFilter("SalesChannel"),
      }),
      column({ field: "brand_names", filter: relationshipFilter("Brand") }),
    ])

    expect(result.map((col) => [col.field, !!col.filter])).toEqual([
      ["sales_channel_names", false],
      ["brand_names", true],
    ])
  })
})
