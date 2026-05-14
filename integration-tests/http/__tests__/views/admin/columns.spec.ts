import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ModuleRegistrationName } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(300000)

const env = { MEDUSA_FF_VIEW_CONFIGURATIONS: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    beforeEach(async () => {
      const container = getContainer()
      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("GET /admin/views/:entity/columns", () => {
      describe("orders entity", () => {
        let order, seeder

        beforeEach(async () => {
          // Create an order with all relationships
          seeder = await createOrderSeeder({
            api,
            container: getContainer(),
          })
          order = seeder.order
        })

        it("should return all order columns including relationships", async () => {
          const response = await api.get(
            `/admin/views/orders/columns`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.columns).toBeDefined()
          expect(Array.isArray(response.data.columns)).toBe(true)

          // Check for direct fields
          const displayIdColumn = response.data.columns.find(
            (c) => c.id === "display_id"
          )
          expect(displayIdColumn).toBeDefined()
          expect(displayIdColumn).toMatchObject({
            id: "display_id",
            name: "Display Id",
            field: "display_id",
            data_type: "string",
            semantic_type: "identifier",
            context: "both",
          })

          // Check for missing relationships
          const salesChannelColumns = response.data.columns.filter((c) =>
            c.id.startsWith("sales_channel")
          )

          const orderExtraColumns = response.data.columns.filter((c) =>
            c.id.startsWith("order_extra")
          )

          // Check for shipping address columns
          const shippingAddressColumns = response.data.columns.filter((c) =>
            c.id.startsWith("shipping_address")
          )

          // Check that we DON'T have the sales_channel relationship object
          const salesChannelField = response.data.columns.find(
            (c) => c.id === "sales_channel"
          )
          expect(salesChannelField).toBeUndefined()

          // Check that sales_channel.name is marked as default visible
          const salesChannelNameField = response.data.columns.find(
            (c) => c.id === "sales_channel.name"
          )
          expect(salesChannelNameField).toBeDefined()
          expect(salesChannelNameField).toMatchObject({
            id: "sales_channel.name",
            field: "sales_channel.name",
            default_visible: true,
          })

          // Check that other sales_channel fields are NOT default visible
          const salesChannelIdField = response.data.columns.find(
            (c) => c.id === "sales_channel.id"
          )
          expect(salesChannelIdField).toBeDefined()
          expect(salesChannelIdField.default_visible).toBe(false)

          const salesChannelDescriptionField = response.data.columns.find(
            (c) => c.id === "sales_channel.description"
          )
          if (salesChannelDescriptionField) {
            expect(salesChannelDescriptionField.default_visible).toBe(false)
          }

          // Check that we have the customer_display computed column
          const customerDisplayField = response.data.columns.find(
            (c) => c.id === "customer_display"
          )
          expect(customerDisplayField).toBeDefined()
          expect(customerDisplayField).toMatchObject({
            id: "customer_display",
            name: "Customer",
            field: "customer_display",
            data_type: "string",
            semantic_type: "computed",
            context: "display",
            default_visible: true,
            sortable: false,
            computed: {
              type: "customer_name",
              required_fields: [
                "customer.first_name",
                "customer.last_name",
                "customer.email",
              ],
              optional_fields: ["customer.phone"],
            },
            default_order: 300,
            category: "relationship",
          })

          // Check that we have the country computed column
          const countryField = response.data.columns.find(
            (c) => c.id === "country"
          )
          expect(countryField).toBeDefined()
          expect(countryField).toMatchObject({
            id: "country",
            name: "Country",
            field: "country",
            data_type: "string",
            semantic_type: "computed",
            context: "display",
            default_visible: true,
            sortable: false,
            computed: {
              type: "country_code",
              required_fields: ["shipping_address.country_code"],
              optional_fields: [],
            },
            default_order: 800,
            category: "metadata",
          })

          // Check that we DON'T have customer or shipping_address objects
          const customerField = response.data.columns.find(
            (c) => c.id === "customer"
          )
          expect(customerField).toBeUndefined()

          const shippingAddressField = response.data.columns.find(
            (c) => c.id === "shipping_address"
          )
          expect(shippingAddressField).toBeUndefined()

          // Group columns by type
          const directFields = response.data.columns.filter(
            (c) => !c.id.includes(".")
          )
          const relationshipFields = response.data.columns.filter((c) =>
            c.id.includes(".")
          )

          // Check that important fields have proper ordering
          const displayIdField = response.data.columns.find(
            (c) => c.id === "display_id"
          )
          expect(displayIdField?.default_order).toBe(100)
          expect(displayIdField?.category).toBe("identifier")

          const totalField = response.data.columns.find((c) => c.id === "total")
          expect(totalField?.default_order).toBe(700)
          expect(totalField?.category).toBe("metric")

          const createdAtField = response.data.columns.find(
            (c) => c.id === "created_at"
          )
          expect(createdAtField?.default_order).toBe(200)
          expect(createdAtField?.category).toBe("timestamp")
        })

        it("should check filtering behavior", async () => {
          const response = await api.get(
            `/admin/views/orders/columns`,
            adminHeaders
          )

          // Check which fields might be getting filtered
          const allFieldIds = response.data.columns.map((c) => c.id)

          // Check for fields that might be filtered by suffixes
          const linkFields = allFieldIds.filter((id) => id.includes("_link"))
          expect(linkFields).toHaveLength(0)
        })
      })

      describe("products entity", () => {
        it("should return product columns", async () => {
          const response = await api.get(
            `/admin/views/products/columns`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.columns).toBeDefined()
          expect(Array.isArray(response.data.columns)).toBe(true)

          // Check for product-specific fields
          const titleColumn = response.data.columns.find(
            (c) => c.id === "title"
          )
          expect(titleColumn).toBeDefined()
          expect(titleColumn).toMatchObject({
            id: "title",
            name: "Title",
            field: "title",
            default_visible: false,
          })

          const handleColumn = response.data.columns.find(
            (c) => c.id === "handle"
          )
          expect(handleColumn).toBeDefined()
          expect(handleColumn).toMatchObject({
            id: "handle",
            name: "Handle",
            field: "handle",
            default_visible: false,
          })
        })
      })

      describe("unsupported entity", () => {
        it("should return 400 for unsupported entity", async () => {
          const response = await api
            .get(`/admin/views/unsupported-entity/columns`, adminHeaders)
            .catch((e) => e.response)

          expect(response.status).toEqual(400)
          expect(response.data.message).toContain("Unsupported entity")
        })
      })
    })
  },
})
