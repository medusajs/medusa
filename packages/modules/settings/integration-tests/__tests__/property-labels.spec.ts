import { Modules } from "@medusajs/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { SettingsTypes } from "@medusajs/types"

jest.setTimeout(30000)

moduleIntegrationTestRunner<SettingsTypes.ISettingsModuleService>({
  moduleName: Modules.SETTINGS,
  testSuite: ({ service }) => {
    describe("PropertyLabel", function () {
      describe("createPropertyLabels", function () {
        it("should create a property label", async () => {
          const label = await service.createPropertyLabels({
            entity: "Order",
            property: "display_id",
            label: "Order Number",
            description: "The public-facing order identifier",
          })

          expect(label).toEqual(
            expect.objectContaining({
              id: expect.stringMatching(/^plbl_/),
              entity: "Order",
              property: "display_id",
              label: "Order Number",
              description: "The public-facing order identifier",
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
            })
          )
        })

        it("should create a property label without description", async () => {
          const label = await service.createPropertyLabels({
            entity: "Product",
            property: "title",
            label: "Product Name",
          })

          expect(label).toEqual(
            expect.objectContaining({
              id: expect.stringMatching(/^plbl_/),
              entity: "Product",
              property: "title",
              label: "Product Name",
              description: null,
            })
          )
        })

        it("should create multiple property labels", async () => {
          const labels = await service.createPropertyLabels([
            {
              entity: "Order",
              property: "status",
              label: "Order Status",
            },
            {
              entity: "Order",
              property: "total",
              label: "Order Total",
            },
            {
              entity: "Product",
              property: "handle",
              label: "URL Slug",
            },
          ])

          expect(labels).toHaveLength(3)
          expect(labels).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                entity: "Order",
                property: "status",
                label: "Order Status",
              }),
              expect.objectContaining({
                entity: "Order",
                property: "total",
                label: "Order Total",
              }),
              expect.objectContaining({
                entity: "Product",
                property: "handle",
                label: "URL Slug",
              }),
            ])
          )
        })

        it("should create labels for nested properties", async () => {
          const label = await service.createPropertyLabels({
            entity: "Order",
            property: "customer.email",
            label: "Customer Email",
          })

          expect(label).toEqual(
            expect.objectContaining({
              entity: "Order",
              property: "customer.email",
              label: "Customer Email",
            })
          )
        })
      })

      describe("listPropertyLabels", function () {
        it("should list all property labels", async () => {
          await service.createPropertyLabels([
            { entity: "Order", property: "id", label: "ID" },
            { entity: "Order", property: "status", label: "Status" },
            { entity: "Product", property: "title", label: "Title" },
          ])

          const labels = await service.listPropertyLabels()

          expect(labels).toHaveLength(3)
        })

        it("should filter property labels by entity", async () => {
          await service.createPropertyLabels([
            { entity: "Order", property: "id", label: "Order ID" },
            { entity: "Order", property: "status", label: "Order Status" },
            { entity: "Product", property: "id", label: "Product ID" },
          ])

          const orderLabels = await service.listPropertyLabels({
            entity: "Order",
          })

          expect(orderLabels).toHaveLength(2)
          expect(orderLabels.every((l) => l.entity === "Order")).toBe(true)
        })

        it("should filter property labels by property", async () => {
          await service.createPropertyLabels([
            { entity: "Order", property: "id", label: "Order ID" },
            { entity: "Product", property: "id", label: "Product ID" },
            { entity: "Customer", property: "email", label: "Email" },
          ])

          const idLabels = await service.listPropertyLabels({ property: "id" })

          expect(idLabels).toHaveLength(2)
          expect(idLabels.every((l) => l.property === "id")).toBe(true)
        })

        it("should filter property labels by entity and property", async () => {
          await service.createPropertyLabels([
            { entity: "Order", property: "id", label: "Order ID" },
            { entity: "Product", property: "id", label: "Product ID" },
          ])

          const labels = await service.listPropertyLabels({
            entity: "Order",
            property: "id",
          })

          expect(labels).toHaveLength(1)
          expect(labels[0]).toEqual(
            expect.objectContaining({
              entity: "Order",
              property: "id",
              label: "Order ID",
            })
          )
        })
      })

      describe("updatePropertyLabels", function () {
        it("should update a property label by ID", async () => {
          const label = await service.createPropertyLabels({
            entity: "Order",
            property: "display_id",
            label: "Display ID",
          })

          const [updated] = await service.updatePropertyLabels([
            {
              id: label.id,
              label: "Order Number",
              description: "The customer-facing order number",
            },
          ])

          expect(updated.label).toBe("Order Number")
          expect(updated.description).toBe("The customer-facing order number")
        })

        it("should update multiple property labels", async () => {
          const labels = await service.createPropertyLabels([
            { entity: "Order", property: "status", label: "Status" },
            { entity: "Order", property: "total", label: "Total" },
          ])

          const updated = await service.updatePropertyLabels([
            { id: labels[0].id, label: "Order Status" },
            { id: labels[1].id, label: "Order Total" },
          ])

          expect(updated).toHaveLength(2)
          expect(updated.find((l) => l.id === labels[0].id)?.label).toBe(
            "Order Status"
          )
          expect(updated.find((l) => l.id === labels[1].id)?.label).toBe(
            "Order Total"
          )
        })

        it("should update only the provided fields", async () => {
          const label = await service.createPropertyLabels({
            entity: "Product",
            property: "title",
            label: "Title",
            description: "Original description",
          })

          const [updated] = await service.updatePropertyLabels([
            { id: label.id, label: "Product Name" },
          ])

          expect(updated.label).toBe("Product Name")
          expect(updated.description).toBe("Original description")
        })
      })

      describe("deletePropertyLabels", function () {
        it("should delete a property label by ID", async () => {
          const label = await service.createPropertyLabels({
            entity: "Order",
            property: "id",
            label: "Order ID",
          })

          await service.deletePropertyLabels(label.id)

          const labels = await service.listPropertyLabels({ entity: "Order" })
          expect(labels).toHaveLength(0)
        })

        it("should delete multiple property labels by ID", async () => {
          const labels = await service.createPropertyLabels([
            { entity: "Order", property: "id", label: "Order ID" },
            { entity: "Order", property: "status", label: "Status" },
            { entity: "Product", property: "id", label: "Product ID" },
          ])

          await service.deletePropertyLabels([labels[0].id, labels[1].id])

          const remaining = await service.listPropertyLabels()
          expect(remaining).toHaveLength(1)
          expect(remaining[0].entity).toBe("Product")
        })
      })

      describe("listPropertyLabels", function () {
        it("should list all labels", async () => {
          await service.createPropertyLabels([
            { entity: "Order", property: "id", label: "Order ID" },
            { entity: "Order", property: "status", label: "Order Status" },
            { entity: "Product", property: "id", label: "Product ID" },
          ])

          const labels = await service.listPropertyLabels()

          expect(labels).toHaveLength(3)
        })
      })

      describe("retrievePropertyLabel", function () {
        it("should retrieve a specific label by id", async () => {
          const label = await service.createPropertyLabels({
            entity: "Order",
            property: "display_id",
            label: "Order Number",
          })

          const retrievedLabel = await service.retrievePropertyLabel(label.id)

          expect(retrievedLabel).toEqual(
            expect.objectContaining({
              id: label.id,
            })
          )
        })
      })

      describe("upsertPropertyLabels", function () {
        it("should upsert a new label", async () => {
          const labels = await service.upsertPropertyLabels([
            {
              entity: "Order",
              property: "display_id",
              label: "Order Number",
            },
          ])

          expect(labels[0]).toEqual(
            expect.objectContaining({
              entity: "Order",
              property: "display_id",
              label: "Order Number",
            })
          )
        })

        it("should update an existing label", async () => {
          const label = await service.createPropertyLabels({
            entity: "Order",
            property: "display_id",
            label: "Order Number",
          })

          const upsertedLabels = await service.upsertPropertyLabels([
            {
              id: label.id,
              label: "Updated Order Number",
              description: "Updated description",
            },
          ])

          expect(upsertedLabels[0].label).toBe("Updated Order Number")
          expect(upsertedLabels[0].description).toBe("Updated description")

          // Verify only one label exists
          const labels = await service.listPropertyLabels({
            entity: "Order",
            property: "display_id",
          })
          expect(labels).toHaveLength(1)
        })
      })

      describe("deletePropertyLabel", function () {
        it("should delete a label by entity and property", async () => {
          const label = await service.createPropertyLabels({
            entity: "Order",
            property: "display_id",
            label: "Order Number",
          })

          await service.deletePropertyLabels(label.id)

          const labels = await service.listPropertyLabels({
            entity: "Order",
            property: "display_id",
          })
          expect(labels).toHaveLength(0)
        })

        it("should not throw if label does not exist", async () => {
          await expect(
            service.deletePropertyLabels(["nonexistent"])
          ).resolves.not.toThrow()
        })
      })

      describe("PropertyLabelDTO shape validation", function () {
        it("should have correct PropertyLabelDTO shape", async () => {
          const label = await service.createPropertyLabels({
            entity: "Order",
            property: "display_id",
            label: "Order Number",
            description: "The order identifier",
          })

          // Validate all expected fields exist
          expect(label).toHaveProperty("id")
          expect(label).toHaveProperty("entity")
          expect(label).toHaveProperty("property")
          expect(label).toHaveProperty("label")
          expect(label).toHaveProperty("description")
          expect(label).toHaveProperty("created_at")
          expect(label).toHaveProperty("updated_at")

          // Validate types
          expect(typeof label.id).toBe("string")
          expect(typeof label.entity).toBe("string")
          expect(typeof label.property).toBe("string")
          expect(typeof label.label).toBe("string")
          expect(
            label.description === null || typeof label.description === "string"
          ).toBe(true)
          expect(label.created_at).toBeInstanceOf(Date)
          expect(label.updated_at).toBeInstanceOf(Date)

          // Validate ID prefix
          expect(label.id).toMatch(/^plbl_/)
        })
      })
    })
  },
})
