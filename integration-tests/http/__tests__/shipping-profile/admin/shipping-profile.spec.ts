import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    beforeEach(async () => {
      const appContainer = getContainer()
      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("Admin - Shipping Profiles", () => {
      it("should test the entire lifecycle of a shipping profile", async () => {
        const payload = {
          name: "test-profile-2023",
          type: "custom",
        }

        // Create
        const {
          data: { shipping_profile },
          status,
        } = await api.post("/admin/shipping-profiles", payload, adminHeaders)

        expect(status).toEqual(200)
        expect(shipping_profile).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            created_at: expect.any(String),
            updated_at: expect.any(String),
            ...payload,
          })
        )

        // List
        const {
          data: { shipping_profiles },
        } = await api.get("/admin/shipping-profiles", adminHeaders)

        expect(shipping_profiles.length).toEqual(1)

        // Retrieve
        const {
          data: { shipping_profile: retrievedProfile },
        } = await api.get(
          `/admin/shipping-profiles/${shipping_profile.id}`,
          adminHeaders
        )

        expect(status).toEqual(200)
        expect(retrievedProfile).toEqual(
          expect.objectContaining({
            id: shipping_profile.id,
            updated_at: expect.any(String),
            created_at: expect.any(String),
          })
        )

        // update
        const {
          data: { shipping_profile: updatedProfile },
        } = await api.post(
          `/admin/shipping-profiles/${shipping_profile.id}`,
          {
            name: "test-profile-updated",
            type: "express",
            metadata: {
              my_new_key: "my_new_value",
            },
          },
          adminHeaders
        )

        expect(status).toEqual(200)
        expect(updatedProfile).toEqual(
          expect.objectContaining({
            id: shipping_profile.id,
            name: "test-profile-updated",
            type: "express",
            metadata: {
              my_new_key: "my_new_value",
            },
            updated_at: expect.any(String),
            created_at: expect.any(String),
          })
        )

        // Delete
        const { data } = await api.delete(
          `/admin/shipping-profiles/${shipping_profile.id}`,
          adminHeaders
        )

        expect(data).toEqual({
          id: retrievedProfile.id,
          object: "shipping_profile",
          deleted: true,
        })

        await api
          .get(`/admin/shipping-profiles/${shipping_profile.id}`, adminHeaders)
          .catch((err) => {
            expect(err.response.status).toEqual(404)
          })
      })
    })

    // TODO: Associate products with shipping profiles
  },
})
