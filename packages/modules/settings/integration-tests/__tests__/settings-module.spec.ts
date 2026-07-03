import { Modules } from "@medusajs/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { SettingsTypes } from "@medusajs/types"

jest.setTimeout(30000)

moduleIntegrationTestRunner<SettingsTypes.ISettingsModuleService>({
  moduleName: Modules.SETTINGS,
  testSuite: ({ service }) => {
    describe("SettingsModuleService", function () {
      describe("ViewConfiguration", function () {
        it("should create a view configuration", async () => {
          const viewConfig = await service.createViewConfigurations({
            entity: "orders",
            name: "My Orders View",
            user_id: "user_123",
            configuration: {
              visible_columns: ["id", "status", "created_at"],
              column_order: ["id", "status", "created_at"],
              column_widths: { id: 100, status: 150 },
              filters: { status: ["pending", "completed"] },
              sorting: { id: "created_at", desc: true },
              search: "",
            },
          })

          expect(viewConfig).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              entity: "orders",
              name: "My Orders View",
              user_id: "user_123",
            })
          )
        })

        it("should update a view configuration and remove filters", async () => {
          // Create a view with filters
          const viewConfig = await service.createViewConfigurations({
            entity: "products",
            name: "Filtered Products View",
            user_id: "user_456",
            configuration: {
              visible_columns: ["id", "title", "status"],
              column_order: ["id", "title", "status"],
              filters: {
                status: ["draft", "published"],
                collection_id: ["col_123", "col_456"],
              },
              sorting: { id: "created_at", desc: true },
            },
          })

          expect(viewConfig.configuration.filters).toEqual({
            status: ["draft", "published"],
            collection_id: ["col_123", "col_456"],
          })

          // Update the view to remove filters
          const updatedConfig = await service.updateViewConfigurations(
            viewConfig.id,
            {
              configuration: {
                visible_columns: ["id", "title", "status"],
                column_order: ["id", "title", "status"],
                filters: {}, // Empty filters object
                sorting: { id: "created_at", desc: true },
              },
            }
          )

          expect(updatedConfig.configuration.filters).toEqual({})

          // Retrieve the view again to ensure filters were persisted as empty
          const retrievedConfig = await service.retrieveViewConfiguration(
            viewConfig.id
          )

          expect(retrievedConfig.configuration.filters).toEqual({})
        })

        it("should update view configuration with partial configuration updates", async () => {
          // Create a view with full configuration
          const viewConfig = await service.createViewConfigurations({
            entity: "customers",
            name: "Customer View",
            user_id: "user_789",
            configuration: {
              visible_columns: ["id", "name", "email"],
              column_order: ["id", "name", "email"],
              filters: {
                has_account: true,
                groups: ["vip", "regular"],
              },
              sorting: { id: "created_at", desc: false },
              search: "test search",
            },
          })

          // Update only filters (should preserve other configuration)
          const updatedConfig = await service.updateViewConfigurations(
            viewConfig.id,
            {
              configuration: {
                visible_columns: ["id", "name", "email"],
                column_order: ["id", "name", "email"],
                filters: { has_account: false }, // Changed filters
                sorting: { id: "created_at", desc: false },
                search: "test search",
              },
            }
          )

          expect(updatedConfig.configuration).toEqual({
            visible_columns: ["id", "name", "email"],
            column_order: ["id", "name", "email"],
            filters: { has_account: false },
            sorting: { id: "created_at", desc: false },
            search: "test search",
            column_widths: {}, // Default value when not provided
          })
        })

        it("should update only the name field without affecting configuration", async () => {
          // Create a view with full configuration
          const viewConfig = await service.createViewConfigurations({
            entity: "orders",
            name: "Original Name",
            user_id: "user_123",
            configuration: {
              visible_columns: ["id", "status", "total"],
              column_order: ["id", "status", "total"],
              column_widths: { id: 100, status: 150, total: 200 },
              filters: { status: ["pending", "completed"] },
              sorting: { id: "created_at", desc: true },
              search: "test search",
            },
          })

          // Update only the name field
          const updatedConfig = await service.updateViewConfigurations(
            viewConfig.id,
            { name: "Updated Name" }
          )

          expect(updatedConfig.name).toBe("Updated Name")
          expect(updatedConfig.configuration).toEqual(viewConfig.configuration)
        })

        it("should completely replace filters when updating configuration", async () => {
          // Create a view with complex filters
          const viewConfig = await service.createViewConfigurations({
            entity: "products",
            name: "Product View",
            user_id: "user_123",
            configuration: {
              visible_columns: ["id", "title"],
              column_order: ["id", "title"],
              filters: {
                status: ["draft", "published"],
                collection_id: ["col_123", "col_456"],
                price_range: { min: 10, max: 100 },
              },
              sorting: { id: "created_at", desc: true },
            },
          })

          // Update with new filters
          const updatedConfig = await service.updateViewConfigurations(
            viewConfig.id,
            {
              configuration: {
                visible_columns: ["id", "title"],
                column_order: ["id", "title"],
                filters: { category: ["electronics"] }, // Completely different filters
                sorting: { id: "created_at", desc: true },
              },
            }
          )

          expect(updatedConfig.configuration.filters).toEqual({
            category: ["electronics"],
          })
          // Verify old filters are gone
          expect(updatedConfig.configuration.filters?.status).toBeUndefined()
          expect(updatedConfig.configuration.filters?.collection_id).toBeUndefined()
          expect(updatedConfig.configuration.filters?.price_range).toBeUndefined()
        })

        it("should remove filters when explicitly set to empty object", async () => {
          // Create a view with filters
          const viewConfig = await service.createViewConfigurations({
            entity: "customers",
            name: "Customer View",
            user_id: "user_123",
            configuration: {
              visible_columns: ["id", "name", "email"],
              column_order: ["id", "name", "email"],
              filters: {
                has_account: true,
                groups: ["vip", "regular"],
              },
              sorting: { id: "created_at", desc: false },
            },
          })

          // Update configuration with empty filters
          const updatedConfig = await service.updateViewConfigurations(
            viewConfig.id,
            {
              configuration: {
                visible_columns: ["id", "name", "email"],
                column_order: ["id", "name", "email"],
                filters: {}, // Empty filters
                sorting: { id: "created_at", desc: false },
              },
            }
          )

          expect(updatedConfig.configuration.filters).toEqual({})
        })

        it("should preserve other configuration properties when updating specific ones", async () => {
          // Create a view with full configuration
          const viewConfig = await service.createViewConfigurations({
            entity: "inventory",
            name: "Inventory View",
            user_id: "user_123",
            configuration: {
              visible_columns: ["id", "sku", "quantity"],
              column_order: ["id", "sku", "quantity"],
              column_widths: { id: 80, sku: 120, quantity: 100 },
              filters: { location: ["warehouse_1"] },
              sorting: { id: "sku", desc: false },
              search: "original search",
            },
          })

          // Update only filters and sorting
          const updatedConfig = await service.updateViewConfigurations(
            viewConfig.id,
            {
              configuration: {
                visible_columns: viewConfig.configuration.visible_columns,
                column_order: viewConfig.configuration.column_order,
                filters: { location: ["warehouse_2"] },
                sorting: { id: "quantity", desc: true },
                // Note: not providing column_widths and search
              },
            }
          )

          expect(updatedConfig.configuration.filters).toEqual({
            location: ["warehouse_2"],
          })
          expect(updatedConfig.configuration.sorting).toEqual({
            id: "quantity",
            desc: true,
          })
          // These should be preserved
          expect(updatedConfig.configuration.visible_columns).toEqual(
            viewConfig.configuration.visible_columns
          )
          expect(updatedConfig.configuration.column_order).toEqual(
            viewConfig.configuration.column_order
          )
          // These should have default values since not provided
          expect(updatedConfig.configuration.column_widths).toEqual({})
          expect(updatedConfig.configuration.search).toBe("")
        })

        it("should handle missing configuration properties with defaults", async () => {
          // Create a view with full configuration
          const viewConfig = await service.createViewConfigurations({
            entity: "payments",
            name: "Payment View",
            user_id: "user_123",
            configuration: {
              visible_columns: ["id", "amount", "status"],
              column_order: ["id", "amount", "status"],
              column_widths: { id: 100, amount: 150, status: 120 },
              filters: { status: ["completed"] },
              sorting: { id: "created_at", desc: true },
              search: "payment search",
            },
          })

          // Update with partial configuration (only visible_columns)
          const updatedConfig = await service.updateViewConfigurations(
            viewConfig.id,
            {
              configuration: {
                visible_columns: ["id", "amount"],
                column_order: ["id", "amount"],
                // Not providing filters, sorting, search, column_widths
              },
            }
          )

          expect(updatedConfig.configuration).toEqual({
            visible_columns: ["id", "amount"],
            column_order: ["id", "amount"],
            column_widths: {}, // Default
            filters: {}, // Default
            sorting: null, // Default
            search: "", // Default
          })
        })

        it("should update multiple view configurations when using selector", async () => {
          // Create multiple views for the same entity
          const view1 = await service.createViewConfigurations({
            entity: "orders",
            name: "Orders View 1",
            user_id: "user_123",
            configuration: {
              visible_columns: ["id", "status"],
              column_order: ["id", "status"],
              filters: { status: ["pending"] },
            },
          })

          const view2 = await service.createViewConfigurations({
            entity: "orders",
            name: "Orders View 2",
            user_id: "user_456",
            configuration: {
              visible_columns: ["id", "total"],
              column_order: ["id", "total"],
              filters: { status: ["completed"] },
            },
          })

          const view3 = await service.createViewConfigurations({
            entity: "products", // Different entity
            name: "Products View",
            user_id: "user_123",
            configuration: {
              visible_columns: ["id", "title"],
              column_order: ["id", "title"],
            },
          })

          // Update using selector for entity "orders"
          const updatedConfigs = await service.updateViewConfigurations(
            { entity: "orders" },
            {
              configuration: {
                visible_columns: ["id", "status", "total"],
                column_order: ["id", "status", "total"],
                filters: {},
              },
            }
          )

          // Should return an array
          expect(Array.isArray(updatedConfigs)).toBe(true)
          expect(updatedConfigs).toHaveLength(2)

          // Both orders views should be updated
          const updatedIds = updatedConfigs.map((v) => v.id).sort()
          expect(updatedIds).toEqual([view1.id, view2.id].sort())

          // All should have the new configuration
          updatedConfigs.forEach((config) => {
            expect(config.configuration.visible_columns).toEqual([
              "id",
              "status",
              "total",
            ])
            expect(config.configuration.filters).toEqual({})
          })

          // Products view should not be affected
          const productView = await service.retrieveViewConfiguration(view3.id)
          expect(productView.configuration.visible_columns).toEqual(["id", "title"])
        })

        it("should return empty array when no views match selector", async () => {
          // Try to update with a selector that matches no views
          const result = await service.updateViewConfigurations(
            { entity: "non_existent_entity" },
            { name: "New Name" }
          )

          expect(Array.isArray(result)).toBe(true)
          expect(result).toHaveLength(0)
        })

        it("should handle null values in configuration", async () => {
          // Create a view with sorting
          const viewConfig = await service.createViewConfigurations({
            entity: "shipping",
            name: "Shipping View",
            user_id: "user_123",
            configuration: {
              visible_columns: ["id", "carrier", "tracking"],
              column_order: ["id", "carrier", "tracking"],
              sorting: { id: "created_at", desc: true },
              search: "fedex",
            },
          })

          // Update with sorting: null
          const updatedConfig = await service.updateViewConfigurations(
            viewConfig.id,
            {
              configuration: {
                visible_columns: viewConfig.configuration.visible_columns,
                column_order: viewConfig.configuration.column_order,
                sorting: null,
                search: "", // Also test empty string
              },
            }
          )

          expect(updatedConfig.configuration.sorting).toBeNull()
          expect(updatedConfig.configuration.search).toBe("")
        })
      })

      describe("LayoutConfiguration", function () {
        it("should create a user layout configuration via setLayoutConfiguration", async () => {
          const result = await service.setLayoutConfiguration(
            "product.details",
            "user_123",
            {
              widgets: {
                "widget-general": { hidden: false, section: "main", order: 0 },
                "widget-pricing": { hidden: true },
              },
            }
          )

          expect(result).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              zone: "product.details",
              user_id: "user_123",
              is_system_default: false,
              configuration: {
                widgets: {
                  "widget-general": {
                    hidden: false,
                    section: "main",
                    order: 0,
                  },
                  "widget-pricing": { hidden: true },
                },
              },
            })
          )
        })

        it("should upsert user layout configuration replacing widgets wholesale", async () => {
          await service.setLayoutConfiguration("product.details", "user_123", {
            widgets: {
              "widget-general": { hidden: false },
              "widget-pricing": { hidden: true },
              "widget-media": { order: 2 },
            },
          })

          // Second call should replace, not merge
          const updated = await service.setLayoutConfiguration(
            "product.details",
            "user_123",
            {
              widgets: {
                "widget-general": { hidden: true },
                // widget-pricing and widget-media intentionally omitted
              },
            }
          )

          expect(updated.configuration.widgets).toEqual({
            "widget-general": { hidden: true },
          })
          // Removed widgets must not survive the replacement
          expect(
            updated.configuration.widgets["widget-pricing"]
          ).toBeUndefined()
          expect(updated.configuration.widgets["widget-media"]).toBeUndefined()
        })

        it("should keep one record per user per zone after multiple upserts", async () => {
          await service.setLayoutConfiguration("order.details", "user_abc", {
            widgets: { "widget-a": { hidden: false } },
          })
          await service.setLayoutConfiguration("order.details", "user_abc", {
            widgets: { "widget-b": { hidden: true } },
          })

          const configs = await service.listLayoutConfigurations({
            zone: "order.details",
            user_id: "user_abc",
          })

          expect(configs).toHaveLength(1)
          expect(configs[0].configuration.widgets).toEqual({
            "widget-b": { hidden: true },
          })
        })

        it("should create a system default layout configuration", async () => {
          const result = await service.setSystemDefaultLayoutConfiguration(
            "customer.details",
            {
              widgets: {
                "widget-info": { hidden: false, order: 0 },
              },
            }
          )

          expect(result).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              zone: "customer.details",
              user_id: null,
              is_system_default: true,
              configuration: {
                widgets: {
                  "widget-info": { hidden: false, order: 0 },
                },
              },
            })
          )
        })

        it("should upsert system default layout configuration replacing widgets wholesale", async () => {
          await service.setSystemDefaultLayoutConfiguration("order.list", {
            widgets: {
              "widget-filters": { hidden: false },
              "widget-table": { order: 1 },
            },
          })

          const updated = await service.setSystemDefaultLayoutConfiguration(
            "order.list",
            {
              widgets: {
                "widget-filters": { hidden: true },
                // widget-table intentionally omitted
              },
            }
          )

          expect(updated.configuration.widgets).toEqual({
            "widget-filters": { hidden: true },
          })
          expect(updated.configuration.widgets["widget-table"]).toBeUndefined()

          // Still only one system default record
          const configs = await service.listLayoutConfigurations({
            zone: "order.list",
            is_system_default: true,
          })
          expect(configs).toHaveLength(1)
        })

        it("should return null from getSystemDefaultLayoutConfiguration when none exists", async () => {
          const result = await service.getSystemDefaultLayoutConfiguration(
            "zone.without.default"
          )

          expect(result).toBeNull()
        })

        it("should return the system default from getSystemDefaultLayoutConfiguration", async () => {
          await service.setSystemDefaultLayoutConfiguration("product.list", {
            widgets: { "widget-header": { order: 0 } },
          })

          const result =
            await service.getSystemDefaultLayoutConfiguration("product.list")

          expect(result).not.toBeNull()
          expect(result!.zone).toBe("product.list")
          expect(result!.is_system_default).toBe(true)
          expect(result!.configuration.widgets).toEqual({
            "widget-header": { order: 0 },
          })
        })

        it("should clear user layout configuration", async () => {
          await service.setLayoutConfiguration("product.details", "user_del", {
            widgets: { "widget-x": { hidden: false } },
          })

          await service.clearLayoutConfiguration("product.details", "user_del")

          const configs = await service.listLayoutConfigurations({
            zone: "product.details",
            user_id: "user_del",
          })
          expect(configs).toHaveLength(0)
        })

        it("should no-op clearLayoutConfiguration when no config exists", async () => {
          await expect(
            service.clearLayoutConfiguration(
              "zone.nothing.here",
              "user_nonexistent"
            )
          ).resolves.not.toThrow()
        })

        it("should not affect system default when clearing user config", async () => {
          await service.setSystemDefaultLayoutConfiguration("product.details", {
            widgets: { "widget-default": { order: 0 } },
          })
          await service.setLayoutConfiguration("product.details", "user_999", {
            widgets: { "widget-personal": { hidden: false } },
          })

          await service.clearLayoutConfiguration("product.details", "user_999")

          const systemDefault =
            await service.getSystemDefaultLayoutConfiguration("product.details")
          expect(systemDefault).not.toBeNull()
          expect(systemDefault!.configuration.widgets).toEqual({
            "widget-default": { order: 0 },
          })
        })

        it("should isolate layout configurations across zones", async () => {
          await service.setLayoutConfiguration("zone.a", "user_123", {
            widgets: { "widget-a1": { hidden: false } },
          })
          await service.setLayoutConfiguration("zone.b", "user_123", {
            widgets: { "widget-b1": { hidden: true } },
          })

          const zoneA = await service.listLayoutConfigurations({
            zone: "zone.a",
            user_id: "user_123",
          })
          const zoneB = await service.listLayoutConfigurations({
            zone: "zone.b",
            user_id: "user_123",
          })

          expect(zoneA).toHaveLength(1)
          expect(zoneA[0].configuration.widgets["widget-a1"]).toBeDefined()
          expect(zoneB).toHaveLength(1)
          expect(zoneB[0].configuration.widgets["widget-b1"]).toBeDefined()
        })

        it("should isolate layout configurations across users", async () => {
          await service.setLayoutConfiguration("shared.zone", "user_A", {
            widgets: { "widget-x": { hidden: false } },
          })
          await service.setLayoutConfiguration("shared.zone", "user_B", {
            widgets: { "widget-x": { hidden: true } },
          })

          const userAConfigs = await service.listLayoutConfigurations({
            zone: "shared.zone",
            user_id: "user_A",
          })
          const userBConfigs = await service.listLayoutConfigurations({
            zone: "shared.zone",
            user_id: "user_B",
          })

          expect(userAConfigs[0].configuration.widgets["widget-x"]).toEqual({
            hidden: false,
          })
          expect(userBConfigs[0].configuration.widgets["widget-x"]).toEqual({
            hidden: true,
          })
        })

        it("should handle empty widgets object", async () => {
          const result = await service.setLayoutConfiguration(
            "product.details",
            "user_empty",
            { widgets: {} }
          )

          expect(result.configuration.widgets).toEqual({})
        })

        describe("getActiveLayoutScope / setActiveLayoutScope", function () {
          it("should return null when no scope preference exists", async () => {
            const scope = await service.getActiveLayoutScope(
              "product.details",
              "user_new"
            )

            expect(scope).toBeNull()
          })

          it("should set and retrieve personal scope", async () => {
            await service.setActiveLayoutScope(
              "product.details",
              "user_123",
              "personal"
            )

            const scope = await service.getActiveLayoutScope(
              "product.details",
              "user_123"
            )

            expect(scope).toBe("personal")
          })

          it("should set and retrieve default scope", async () => {
            await service.setActiveLayoutScope(
              "order.details",
              "user_456",
              "default"
            )

            const scope = await service.getActiveLayoutScope(
              "order.details",
              "user_456"
            )

            expect(scope).toBe("default")
          })

          it("should update scope from personal to default", async () => {
            await service.setActiveLayoutScope(
              "product.details",
              "user_789",
              "personal"
            )
            await service.setActiveLayoutScope(
              "product.details",
              "user_789",
              "default"
            )

            const scope = await service.getActiveLayoutScope(
              "product.details",
              "user_789"
            )

            expect(scope).toBe("default")
          })

          it("should clear scope by setting it to null", async () => {
            await service.setActiveLayoutScope(
              "product.details",
              "user_321",
              "personal"
            )
            await service.setActiveLayoutScope(
              "product.details",
              "user_321",
              null
            )

            const scope = await service.getActiveLayoutScope(
              "product.details",
              "user_321"
            )

            expect(scope).toBeNull()
          })

          it("should isolate scope preferences across zones", async () => {
            await service.setActiveLayoutScope(
              "zone.a",
              "user_iso",
              "personal"
            )
            await service.setActiveLayoutScope("zone.b", "user_iso", "default")

            const scopeA = await service.getActiveLayoutScope(
              "zone.a",
              "user_iso"
            )
            const scopeB = await service.getActiveLayoutScope(
              "zone.b",
              "user_iso"
            )

            expect(scopeA).toBe("personal")
            expect(scopeB).toBe("default")
          })

          it("should isolate scope preferences across users", async () => {
            await service.setActiveLayoutScope(
              "shared.zone",
              "user_X",
              "personal"
            )
            await service.setActiveLayoutScope(
              "shared.zone",
              "user_Y",
              "default"
            )

            const scopeX = await service.getActiveLayoutScope(
              "shared.zone",
              "user_X"
            )
            const scopeY = await service.getActiveLayoutScope(
              "shared.zone",
              "user_Y"
            )

            expect(scopeX).toBe("personal")
            expect(scopeY).toBe("default")
          })
        })
      })
    })
  },
})
