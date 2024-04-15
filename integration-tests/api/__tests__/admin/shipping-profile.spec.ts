import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { breaking } from "../../../helpers/breaking"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

let {
  simpleProductFactory,
  simpleShippingOptionFactory,
  simpleShippingProfileFactory,
} = {}

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {
    // MEDUSA_FF_MEDUSA_V2: true,
  },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let appContainer

    beforeAll(() => {
      ;({
        simpleProductFactory,
        simpleShippingOptionFactory,
        simpleShippingProfileFactory,
      } = require("../../../factories"))
    })

    beforeEach(async () => {
      appContainer = getContainer()

      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("Admin - Shipping Profiles", () => {
      // TODO: Missing update tests
      it("should test the entire lifecycle of a shipping profile", async () => {
        const payload = {
          name: "test-profile-2023",
          type: "custom",
        }

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

        const {
          data: { shipping_profiles },
        } = await api.get("/admin/shipping-profiles", adminHeaders)

        // In V1, response should contain default and gift_card profiles too
        expect(shipping_profiles.length).toEqual(
          breaking(
            () => 3,
            () => 1
          )
        )

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

    describe("POST /admin/shipping-profiles", () => {
      // TODO: There is no invalid types in V2 yet, so this will fail
      it("fails to create a shipping profile with invalid type", async () => {
        expect.assertions(2)

        const payload = {
          name: "test-profile-2023",
          type: "invalid",
        }

        await api
          .post("/admin/shipping-profiles", payload, adminHeaders)
          .catch((err) => {
            expect(err.response.status).toEqual(400)
            expect(err.response.data.message).toEqual(
              "type must be one of 'default', 'custom', 'gift_card'"
            )
          })
      })

      it("updates a shipping profile", async () => {
        // TODO: Update is not added yet
        const testProducts = await Promise.all(
          [...Array(5).keys()].map(async () => {
            return await simpleProductFactory(dbConnection)
          })
        )

        const testShippingOptions = await Promise.all(
          [...Array(5).keys()].map(async () => {
            return await simpleShippingOptionFactory(dbConnection)
          })
        )

        const payload = {
          name: "test-profile-2023",
          type: "custom",
          metadata: {
            my_key: "my_value",
          },
        }

        const {
          data: { shipping_profile: created },
        } = await api.post("/admin/shipping-profiles", payload, adminHeaders)

        const updatePayload = {
          name: "test-profile-2023-updated",
          products: testProducts.map((p) => p.id),
          shipping_options: testShippingOptions.map((o) => o.id),
          metadata: {
            my_key: "",
            my_new_key: "my_new_value",
          },
        }

        const {
          data: { shipping_profile },
          status,
        } = await api.post(
          `/admin/shipping-profiles/${created.id}`,
          updatePayload,
          adminHeaders
        )

        expect(status).toEqual(200)
        expect(shipping_profile).toEqual(
          expect.objectContaining({
            name: "test-profile-2023-updated",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            metadata: {
              my_new_key: "my_new_value",
            },
            deleted_at: null,
            type: "custom",
          })
        )

        const {
          data: { products },
        } = await api.get(`/admin/products`, adminHeaders)

        expect(products.length).toEqual(5)
        expect(products).toEqual(
          expect.arrayContaining(
            testProducts.map((p) => {
              return expect.objectContaining({
                id: p.id,
                profile_id: shipping_profile.id,
              })
            })
          )
        )

        const {
          data: { shipping_options },
        } = await api.get(`/admin/shipping-options`, adminHeaders)

        const numberOfShippingOptionsWithProfile = shipping_options.filter(
          (so) => so.profile_id === shipping_profile.id
        ).length

        expect(numberOfShippingOptionsWithProfile).toEqual(5)
        expect(shipping_options).toEqual(
          expect.arrayContaining(
            testShippingOptions.map((o) => {
              return expect.objectContaining({
                id: o.id,
                profile_id: shipping_profile.id,
              })
            })
          )
        )
      })
    })

    describe("DELETE /admin/shipping-profiles", () => {
      it("deletes a shipping profile", async () => {
        expect.assertions(2)

        const profile = await simpleShippingProfileFactory(dbConnection)

        const { status } = await api.delete(
          `/admin/shipping-profiles/${profile.id}`,
          adminHeaders
        )

        expect(status).toEqual(200)
        await api
          .get(`/admin/shipping-profiles/${profile.id}`, adminHeaders)
          .catch((err) => {
            expect(err.response.status).toEqual(404)
          })
      })
    })
  },
})
