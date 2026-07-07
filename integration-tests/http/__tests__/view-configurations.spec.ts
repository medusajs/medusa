import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { adminHeaders, createAdminUser } from "../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_VIEW_CONFIGURATIONS: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    describe("View Configurations API", () => {
      let adminHeader
      let secondAdminHeader
      let secondAdminUserId
      let adminUserId

      beforeAll(async () => {
        const container = getContainer()
        const { user: adminUser } = await createAdminUser(
          dbConnection,
          adminHeaders,
          container
        )
        adminHeader = adminHeaders.headers
        adminUserId = adminUser.id

        // Create a second admin user
        const secondAdminHeaders = { headers: {} }
        const { user: secondAdminUser } = await createAdminUser(
          dbConnection,
          secondAdminHeaders,
          container,
          { email: "admin2@test.com" }
        )
        secondAdminUserId = secondAdminUser.id
        secondAdminHeader = secondAdminHeaders.headers

        await dbUtils.snapshot()
      })

      describe("POST /admin/views/{entity}/configurations", () => {
        it("should create a personal view configuration", async () => {
          const payload = {
            name: "My Order View",
            configuration: {
              visible_columns: ["id", "display_id", "created_at"],
              column_order: ["display_id", "id", "created_at"],
            },
          }

          const response = await api.post(
            "/admin/views/orders/configurations",
            payload,
            {
              headers: secondAdminHeader,
            }
          )

          expect(response.status).toBe(200)
          expect(response.data.view_configuration).toMatchObject({
            entity: "orders",
            name: "My Order View",
            user_id: secondAdminUserId,
            configuration: payload.configuration,
          })
          expect(response.data.view_configuration.is_system_default).toBeFalsy()
        })

        it("should create a system default view as admin", async () => {
          const payload = {
            name: "Default Order View",
            is_system_default: true,
            configuration: {
              visible_columns: ["id", "display_id", "created_at", "total"],
              column_order: ["display_id", "created_at", "total", "id"],
            },
          }

          const response = await api.post(
            "/admin/views/orders/configurations",
            payload,
            {
              headers: adminHeader,
            }
          )

          expect(response.status).toBe(200)
          expect(response.data.view_configuration).toMatchObject({
            entity: "orders",
            name: "Default Order View",
            user_id: null,
            is_system_default: true,
            configuration: payload.configuration,
          })
        })
      })

      describe("GET /admin/views/{entity}/configurations", () => {
        let systemView
        let personalView
        let otherUserView

        beforeEach(async () => {
          const container = getContainer()
          const settingsService = container.resolve("settings")

          // Create system default view
          systemView = await settingsService.createViewConfigurations({
            entity: "orders",
            name: "System Default",
            is_system_default: true,
            user_id: null,
            configuration: {
              visible_columns: ["id", "display_id"],
              column_order: ["display_id", "id"],
            },
          })

          // Create personal view for non-admin user
          personalView = await settingsService.createViewConfigurations({
            entity: "orders",
            name: "My Personal View",
            is_system_default: false,
            user_id: secondAdminUserId,
            configuration: {
              visible_columns: ["id", "total"],
              column_order: ["total", "id"],
            },
          })

          // Create view for another user
          otherUserView = await settingsService.createViewConfigurations({
            entity: "orders",
            name: "Other User View",
            is_system_default: false,
            user_id: "other-user-id",
            configuration: {
              visible_columns: ["id"],
              column_order: ["id"],
            },
          })
        })

        it("should list system defaults and personal views", async () => {
          const response = await api.get("/admin/views/orders/configurations", {
            headers: secondAdminHeader,
          })

          expect(response.status).toBe(200)
          expect(response.data.view_configurations).toHaveLength(2)
          expect(response.data.view_configurations).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: systemView.id }),
              expect.objectContaining({ id: personalView.id }),
            ])
          )
          // Should not include other user's view
          expect(response.data.view_configurations).not.toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: otherUserView.id }),
            ])
          )
        })

        it("should filter by entity", async () => {
          const response = await api.get(
            "/admin/views/products/configurations",
            {
              headers: secondAdminHeader,
            }
          )

          expect(response.status).toBe(200)
          expect(response.data.view_configurations).toHaveLength(0)
        })
      })

      describe("GET /admin/views/{entity}/configurations/:id", () => {
        let viewConfig

        beforeEach(async () => {
          const container = getContainer()
          const settingsService = container.resolve("settings")

          viewConfig = await settingsService.createViewConfigurations({
            entity: "orders",
            name: "Test View",
            is_system_default: false,
            user_id: secondAdminUserId,
            configuration: {
              visible_columns: ["id"],
              column_order: ["id"],
            },
          })
        })

        it("should retrieve own view configuration", async () => {
          const response = await api.get(
            `/admin/views/orders/configurations/${viewConfig.id}`,
            {
              headers: secondAdminHeader,
            }
          )

          expect(response.status).toBe(200)
          expect(response.data.view_configuration).toMatchObject({
            id: viewConfig.id,
            entity: "orders",
            name: "Test View",
          })
        })

        it("should prevent access to other user's view", async () => {
          const container = getContainer()
          const settingsService = container.resolve("settings")

          const otherView = await settingsService.createViewConfigurations({
            entity: "orders",
            name: "Other View",
            is_system_default: false,
            user_id: "other-user-id",
            configuration: {
              visible_columns: ["id"],
              column_order: ["id"],
            },
          })

          const response = await api
            .get(`/admin/views/orders/configurations/${otherView.id}`, {
              headers: secondAdminHeader,
            })
            .catch((e) => e.response)

          expect(response.status).toBe(400)
        })
      })

      describe("POST /admin/views/{entity}/configurations/:id", () => {
        let viewConfig

        beforeEach(async () => {
          const container = getContainer()
          const settingsService = container.resolve("settings")

          viewConfig = await settingsService.createViewConfigurations({
            entity: "orders",
            name: "Test View",
            is_system_default: false,
            user_id: secondAdminUserId,
            configuration: {
              visible_columns: ["id"],
              column_order: ["id"],
            },
          })
        })

        it("should update own view configuration", async () => {
          const payload = {
            name: "Updated View",
            configuration: {
              visible_columns: ["id", "total"],
              column_order: ["total", "id"],
            },
          }

          const response = await api.post(
            `/admin/views/orders/configurations/${viewConfig.id}`,
            payload,
            {
              headers: secondAdminHeader,
            }
          )

          expect(response.status).toBe(200)
          expect(response.data.view_configuration).toMatchObject({
            id: viewConfig.id,
            name: "Updated View",
            configuration: payload.configuration,
          })
        })
      })

      describe("DELETE /admin/views/{entity}/configurations/:id", () => {
        let viewConfig

        beforeEach(async () => {
          const container = getContainer()
          const settingsService = container.resolve("settings")

          viewConfig = await settingsService.createViewConfigurations({
            entity: "orders",
            name: "Test View",
            is_system_default: false,
            user_id: secondAdminUserId,
            configuration: {
              visible_columns: ["id"],
              column_order: ["id"],
            },
          })
        })

        it("should delete own view configuration", async () => {
          const response = await api.delete(
            `/admin/views/orders/configurations/${viewConfig.id}`,
            {
              headers: secondAdminHeader,
            }
          )

          expect(response.status).toBe(200)
          expect(response.data).toMatchObject({
            id: viewConfig.id,
            object: "view_configuration",
            deleted: true,
          })

          // Verify it's deleted
          const getResponse = await api
            .get(`/admin/views/orders/configurations/${viewConfig.id}`, {
              headers: secondAdminHeader,
            })
            .catch((e) => e.response)

          expect(getResponse.status).toBe(404)
        })
      })

      describe("GET /admin/views/{entity}/configurations/active", () => {
        beforeEach(async () => {
          const container = getContainer()
          const settingsService = container.resolve("settings")

          // Create and set active view
          const viewConfig = await settingsService.createViewConfigurations({
            entity: "orders",
            name: "Active View",
            is_system_default: false,
            user_id: secondAdminUserId,
            configuration: {
              visible_columns: ["id", "total"],
              column_order: ["total", "id"],
            },
          })

          await settingsService.setActiveViewConfiguration(
            "orders",
            secondAdminUserId,
            viewConfig.id
          )
        })

        it("should retrieve active view configuration", async () => {
          const response = await api.get(
            "/admin/views/orders/configurations/active",
            {
              headers: secondAdminHeader,
            }
          )

          expect(response.status).toBe(200)
          expect(response.data.view_configuration).toMatchObject({
            entity: "orders",
            name: "Active View",
            user_id: secondAdminUserId,
          })
        })

        it("should return null when no active view", async () => {
          const response = await api.get(
            "/admin/views/products/configurations/active",
            {
              headers: secondAdminHeader,
            }
          )

          expect(response.status).toBe(200)
          expect(response.data.view_configuration).toBeNull()
        })
      })

      describe("POST /admin/views/{entity}/configurations/active", () => {
        let viewConfig

        beforeEach(async () => {
          const container = getContainer()
          const settingsService = container.resolve("settings")

          viewConfig = await settingsService.createViewConfigurations({
            entity: "orders",
            name: "Test View",
            is_system_default: false,
            user_id: secondAdminUserId,
            configuration: {
              visible_columns: ["id"],
              column_order: ["id"],
            },
          })
        })

        it("should set active view configuration", async () => {
          const response = await api.post(
            "/admin/views/orders/configurations/active",
            {
              view_configuration_id: viewConfig.id,
            },
            {
              headers: secondAdminHeader,
            }
          )

          expect(response.status).toBe(200)
          expect(response.data.success).toBe(true)

          // Verify it's active
          const activeResponse = await api.get(
            "/admin/views/orders/configurations/active",
            {
              headers: secondAdminHeader,
            }
          )

          expect(activeResponse.data.view_configuration.id).toBe(viewConfig.id)
        })

        it("should clear active view and return to default when setting view_configuration_id to null", async () => {
          // First set an active view
          await api.post(
            "/admin/views/orders/configurations/active",
            {
              view_configuration_id: viewConfig.id,
            },
            {
              headers: secondAdminHeader,
            }
          )

          // Verify it's active
          let activeResponse = await api.get(
            "/admin/views/orders/configurations/active",
            {
              headers: secondAdminHeader,
            }
          )
          expect(activeResponse.data.view_configuration.id).toBe(viewConfig.id)

          // Now clear the active view
          const clearResponse = await api.post(
            "/admin/views/orders/configurations/active",
            {
              view_configuration_id: null,
            },
            {
              headers: secondAdminHeader,
            }
          )

          expect(clearResponse.status).toBe(200)
          expect(clearResponse.data.success).toBe(true)

          // Verify the active view is cleared
          activeResponse = await api.get(
            "/admin/views/orders/configurations/active",
            {
              headers: secondAdminHeader,
            }
          )

          // Debug output
          if (activeResponse.data.view_configuration) {
            console.log("Active view after clearing:", {
              id: activeResponse.data.view_configuration.id,
              name: activeResponse.data.view_configuration.name,
              is_system_default:
                activeResponse.data.view_configuration.is_system_default,
            })
          }

          // Should either return null or a system default if one exists
          if (activeResponse.data.view_configuration) {
            expect(
              activeResponse.data.view_configuration.is_system_default
            ).toBe(true)
          } else {
            expect(activeResponse.data.view_configuration).toBeNull()
          }
          expect(activeResponse.data.is_default_active).toBe(true)
        })
      })

      describe("System Default Views", () => {
        it("should make system default views available to all users", async () => {
          const container = getContainer()

          // Create a third admin user
          const thirdAdminHeaders = { headers: {} }
          const { user: thirdAdminUser } = await createAdminUser(
            dbConnection,
            thirdAdminHeaders,
            container,
            { email: "admin3@test.com" }
          )

          // Admin 1 creates a system default view
          const systemDefaultView = await api.post(
            "/admin/views/orders/configurations",
            {
              name: "System Default View",
              configuration: {
                visible_columns: ["id", "display_id", "created_at"],
                column_order: ["display_id", "id", "created_at"],
              },
              is_system_default: true,
            },
            adminHeaders
          )

          expect(systemDefaultView.status).toEqual(200)
          expect(systemDefaultView.data.view_configuration.user_id).toBeNull()

          // Admin 3 should be able to see this view
          const viewsForAdmin3 = await api.get(
            "/admin/views/orders/configurations",
            thirdAdminHeaders
          )

          expect(viewsForAdmin3.status).toEqual(200)
          const systemDefaults = viewsForAdmin3.data.view_configurations.filter(
            (v: any) => v.is_system_default
          )
          expect(systemDefaults).toHaveLength(1)
          expect(systemDefaults[0].name).toEqual("System Default View")

          // Admin 3 should also be able to retrieve it directly
          const directRetrieve = await api.get(
            `/admin/views/orders/configurations/${systemDefaultView.data.view_configuration.id}`,
            thirdAdminHeaders
          )

          expect(directRetrieve.status).toEqual(200)
          expect(directRetrieve.data.view_configuration.name).toEqual(
            "System Default View"
          )
        })

        it("should allow creating system default without name", async () => {
          // Create a system default view without providing a name
          const systemDefaultView = await api.post(
            "/admin/views/customers/configurations",
            {
              is_system_default: true,
              configuration: {
                visible_columns: ["id", "email", "first_name", "last_name"],
                column_order: ["email", "first_name", "last_name", "id"],
              },
              // Note: no name field
            },
            adminHeaders
          )

          expect(systemDefaultView.status).toEqual(200)
          expect(systemDefaultView.data.view_configuration.user_id).toBeNull()
          expect(
            systemDefaultView.data.view_configuration.is_system_default
          ).toBe(true)
          // Name should be undefined/null when not provided
          expect(systemDefaultView.data.view_configuration.name).toBeFalsy()
        })

        it("should set view as active when created with set_active flag", async () => {
          // Create a view with set_active = true
          const viewConfig = await api.post(
            "/admin/views/orders/configurations",
            {
              name: "Auto-Active View",
              configuration: {
                visible_columns: ["id", "display_id", "status"],
                column_order: ["display_id", "status", "id"],
              },
              set_active: true,
            },
            { headers: secondAdminHeader }
          )

          expect(viewConfig.status).toEqual(200)

          // Verify the view is now active
          const activeView = await api.get(
            "/admin/views/orders/configurations/active",
            { headers: secondAdminHeader }
          )

          expect(activeView.status).toEqual(200)
          expect(activeView.data.view_configuration).toBeTruthy()
          expect(activeView.data.view_configuration.id).toEqual(
            viewConfig.data.view_configuration.id
          )
          expect(activeView.data.view_configuration.name).toEqual(
            "Auto-Active View"
          )
        })

        it("should set view as active when updated with set_active flag", async () => {
          const container = getContainer()
          const settingsService = container.resolve("settings")

          // Create two views
          const view1 = await settingsService.createViewConfigurations({
            entity: "orders",
            name: "View 1",
            is_system_default: false,
            user_id: secondAdminUserId,
            configuration: {
              visible_columns: ["id"],
              column_order: ["id"],
            },
          })

          const view2 = await settingsService.createViewConfigurations({
            entity: "orders",
            name: "View 2",
            is_system_default: false,
            user_id: secondAdminUserId,
            configuration: {
              visible_columns: ["id", "total"],
              column_order: ["total", "id"],
            },
          })

          // Set view1 as active initially
          await settingsService.setActiveViewConfiguration(
            "orders",
            secondAdminUserId,
            view1.id
          )

          // Update view2 with set_active flag
          const updateResponse = await api.post(
            `/admin/views/orders/configurations/${view2.id}`,
            {
              name: "Updated View 2",
              set_active: true,
            },
            { headers: secondAdminHeader }
          )

          expect(updateResponse.status).toEqual(200)

          // Verify view2 is now the active view
          const activeView = await api.get(
            "/admin/views/orders/configurations/active",
            { headers: secondAdminHeader }
          )

          expect(activeView.status).toEqual(200)
          expect(activeView.data.view_configuration.id).toEqual(view2.id)
          expect(activeView.data.view_configuration.name).toEqual(
            "Updated View 2"
          )
        })

        it("should allow resetting system default to code-level defaults", async () => {
          // Create a system default view
          const systemDefaultView = await api.post(
            "/admin/views/orders/configurations",
            {
              name: "Custom System Default",
              is_system_default: true,
              configuration: {
                visible_columns: ["id", "status", "total"],
                column_order: ["status", "total", "id"],
              },
            },
            adminHeaders
          )

          expect(systemDefaultView.status).toEqual(200)
          const viewId = systemDefaultView.data.view_configuration.id

          // Verify it exists
          let viewsList = await api.get(
            "/admin/views/orders/configurations",
            adminHeaders
          )
          expect(
            viewsList.data.view_configurations.some((v: any) => v.id === viewId)
          ).toBe(true)

          // Delete the system default view (reset to code defaults)
          const deleteResponse = await api.delete(
            `/admin/views/orders/configurations/${viewId}`,
            adminHeaders
          )

          expect(deleteResponse.status).toEqual(200)
          expect(deleteResponse.data.deleted).toBe(true)

          // Verify it's gone
          viewsList = await api.get(
            "/admin/views/orders/configurations",
            adminHeaders
          )
          expect(
            viewsList.data.view_configurations.some((v: any) => v.id === viewId)
          ).toBe(false)

          // Getting active view should return null (falls back to code defaults)
          const activeView = await api.get(
            "/admin/views/orders/configurations/active",
            adminHeaders
          )
          expect(activeView.data.view_configuration).toBeNull()
        })

        it("should return system default view when created and no user view is active", async () => {
          // Step 1: Create a system default view
          const systemDefaultView = await api.post(
            "/admin/views/orders/configurations",
            {
              name: "System Default Orders",
              is_system_default: true,
              configuration: {
                visible_columns: [
                  "id",
                  "display_id",
                  "created_at",
                  "customer",
                  "total",
                ],
                column_order: [
                  "display_id",
                  "customer",
                  "total",
                  "created_at",
                  "id",
                ],
                filters: {},
                sorting: { id: "created_at", desc: true },
                search: "",
              },
            },
            adminHeaders
          )

          expect(systemDefaultView.status).toEqual(200)
          expect(
            systemDefaultView.data.view_configuration.is_system_default
          ).toBe(true)

          // Step 2: Retrieve active view - should return the system default
          const activeView = await api.get(
            "/admin/views/orders/configurations/active",
            { headers: secondAdminHeader }
          )

          expect(activeView.status).toEqual(200)
          expect(activeView.data.view_configuration).toBeTruthy()
          expect(activeView.data.view_configuration.id).toEqual(
            systemDefaultView.data.view_configuration.id
          )
          expect(activeView.data.view_configuration.name).toEqual(
            "System Default Orders"
          )
          expect(activeView.data.view_configuration.is_system_default).toBe(
            true
          )
          expect(activeView.data.is_default_active).toBe(true)
          expect(activeView.data.default_type).toEqual("system")
        })
      })

      describe("Filter, Sorting, and Search Persistence", () => {
        it("should save and restore filters, sorting, and search configuration", async () => {
          // Create a view with filters, sorting, and search
          const viewConfig = await api.post(
            "/admin/views/orders/configurations",
            {
              name: "Filtered View",
              configuration: {
                visible_columns: ["id", "status", "total", "created_at"],
                column_order: ["status", "total", "created_at", "id"],
                filters: {
                  status: ["pending", "completed"],
                  total: { gte: 100 },
                },
                sorting: { id: "created_at", desc: true },
                search: "test search",
              },
            },
            { headers: secondAdminHeader }
          )

          expect(viewConfig.status).toEqual(200)
          expect(
            viewConfig.data.view_configuration.configuration.filters
          ).toEqual({
            status: ["pending", "completed"],
            total: { gte: 100 },
          })
          expect(
            viewConfig.data.view_configuration.configuration.sorting
          ).toEqual({
            id: "created_at",
            desc: true,
          })
          expect(
            viewConfig.data.view_configuration.configuration.search
          ).toEqual("test search")

          // Retrieve the view and verify filters are preserved
          const getResponse = await api.get(
            `/admin/views/orders/configurations/${viewConfig.data.view_configuration.id}`,
            { headers: secondAdminHeader }
          )

          expect(getResponse.status).toEqual(200)
          expect(
            getResponse.data.view_configuration.configuration.filters
          ).toEqual({
            status: ["pending", "completed"],
            total: { gte: 100 },
          })
        })

        it("should remove filters when updating a view without filters", async () => {
          // Create a view with filters
          const viewConfig = await api.post(
            "/admin/views/orders/configurations",
            {
              name: "View with Filters",
              configuration: {
                visible_columns: ["id", "status", "total"],
                column_order: ["status", "total", "id"],
                filters: {
                  status: ["pending", "completed"],
                  total: { gte: 100 },
                },
                sorting: { id: "total", desc: true },
                search: "initial search",
              },
            },
            { headers: secondAdminHeader }
          )

          expect(viewConfig.status).toEqual(200)
          const viewId = viewConfig.data.view_configuration.id

          // Update the view to remove filters
          const updateResponse = await api.post(
            `/admin/views/orders/configurations/${viewId}`,
            {
              configuration: {
                visible_columns: ["id", "status", "total"],
                column_order: ["status", "total", "id"],
                filters: {}, // Empty filters object
                sorting: null, // Remove sorting
                search: "", // Clear search
              },
            },
            { headers: secondAdminHeader }
          )

          expect(updateResponse.status).toEqual(200)

          // Verify filters were removed
          expect(
            updateResponse.data.view_configuration.configuration.filters
          ).toEqual({})
          expect(
            updateResponse.data.view_configuration.configuration.sorting
          ).toBeNull()
          expect(
            updateResponse.data.view_configuration.configuration.search
          ).toEqual("")

          // Retrieve again to double-check persistence
          const getResponse = await api.get(
            `/admin/views/orders/configurations/${viewId}`,
            { headers: secondAdminHeader }
          )

          expect(getResponse.status).toEqual(200)
          expect(
            getResponse.data.view_configuration.configuration.filters
          ).toEqual({})
          expect(
            getResponse.data.view_configuration.configuration.sorting
          ).toBeNull()
          expect(
            getResponse.data.view_configuration.configuration.search
          ).toEqual("")
        })

        it("should update only specific filters while keeping others", async () => {
          // Create a view with multiple filters
          const viewConfig = await api.post(
            "/admin/views/orders/configurations",
            {
              name: "Multi-Filter View",
              configuration: {
                visible_columns: ["id", "status", "total", "created_at"],
                column_order: ["status", "total", "created_at", "id"],
                filters: {
                  status: ["pending", "completed"],
                  total: { gte: 100, lte: 1000 },
                  created_at: { gte: "2024-01-01" },
                },
                sorting: { id: "created_at", desc: true },
                search: "customer",
              },
            },
            { headers: secondAdminHeader }
          )

          expect(viewConfig.status).toEqual(200)
          const viewId = viewConfig.data.view_configuration.id

          // Update to remove only the 'total' filter
          const updateResponse = await api.post(
            `/admin/views/orders/configurations/${viewId}`,
            {
              configuration: {
                visible_columns: ["id", "status", "total", "created_at"],
                column_order: ["status", "total", "created_at", "id"],
                filters: {
                  status: ["pending", "completed"],
                  created_at: { gte: "2024-01-01" },
                  // 'total' filter removed
                },
                sorting: { id: "created_at", desc: true },
                search: "customer",
              },
            },
            { headers: secondAdminHeader }
          )

          expect(updateResponse.status).toEqual(200)
          expect(
            updateResponse.data.view_configuration.configuration.filters
          ).toEqual({
            status: ["pending", "completed"],
            created_at: { gte: "2024-01-01" },
          })
          expect(
            updateResponse.data.view_configuration.configuration.filters.total
          ).toBeUndefined()
        })
      })
    })
  },
})
