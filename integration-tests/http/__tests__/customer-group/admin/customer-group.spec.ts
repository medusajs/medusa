import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let customer1
    let group

    beforeEach(async () => {
      const appContainer = getContainer()
      await createAdminUser(dbConnection, adminHeaders, appContainer)

      group = (
        await api.post(
          "/admin/customer-groups",
          {
            name: "vip-customers",
            metadata: {
              data1: "value1",
            },
          },
          adminHeaders
        )
      ).data.customer_group

      customer1 = (
        await api.post(
          "/admin/customers",
          {
            email: "test1@email.com",
          },
          adminHeaders
        )
      ).data.customer
    })

    describe("POST /admin/customer-groups", () => {
      it("creates customer group", async () => {
        const payload = {
          name: "test group",
        }

        const response = await api.post(
          "/admin/customer-groups",
          payload,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer_group).toEqual(
          expect.objectContaining({
            name: "test group",
          })
        )
      })

      it("should fail to create duplicate customer group", async () => {
        expect.assertions(3)

        const payload = {
          name: "vip-customers",
        }

        await api
          .post("/admin/customer-groups", payload, adminHeaders)
          .catch((err) => {
            console.log(err)
            // BREAKING: Duplicate error is now 400
            expect(err.response.status).toEqual(400)
            expect(err.response.data.type).toEqual("invalid_data")
            expect(err.response.data.message).toEqual(
              "Customer group with name: vip-customers, already exists."
            )
          })
      })
    })

    describe("DELETE /admin/customer-groups", () => {
      it("should remove customer group", async () => {
        expect.assertions(3)

        const deleteResponse = await api.delete(
          `/admin/customer-groups/${group.id}`,
          adminHeaders
        )

        expect(deleteResponse.data).toEqual({
          id: group.id,
          object: "customer_group",
          deleted: true,
        })

        await api
          .get(`/admin/customer-groups/${group.id}`, adminHeaders)
          .catch((error) => {
            expect(error.response.data.type).toEqual("not_found")
            expect(error.response.data.message).toEqual(
              `Customer group with id: ${group.id} not found`
            )
          })
      })

      it("should remove customer group from customer upon deletion", async () => {
        expect.assertions(3)

        await api.post(
          `/admin/customer-groups/${group.id}/customers`,
          { add: [customer1.id] },
          adminHeaders
        )

        const customerPreDeletion = await api.get(
          `/admin/customers/${customer1.id}?fields=*groups`,
          adminHeaders
        )

        expect(customerPreDeletion.data.customer).toEqual(
          expect.objectContaining({
            groups: [
              expect.objectContaining({
                id: group.id,
              }),
            ],
          })
        )

        const deleteResponse = await api
          .delete(`/admin/customer-groups/${group.id}`, adminHeaders)
          .catch((err) => console.log(err))

        expect(deleteResponse.data).toEqual({
          id: group.id,
          object: "customer_group",
          deleted: true,
        })

        const customerRes = await api.get(
          `/admin/customers/${customer1.id}?fields=*groups`,
          adminHeaders
        )

        expect(customerRes.data.customer).toEqual(
          expect.objectContaining({
            groups: [],
          })
        )
      })
    })

    // BREAKING: This endpoint has been removed in favor of `GET /admin/customers?customer_group_id=...`
    //  Keeping this test to keep a record of it
    describe("GET /admin/customer-groups/{id}/customers", () => {
      it("should list customers in group and count", async () => {
        await api.post(
          `/admin/customer-groups/${group.id}/customers`,
          { add: [customer1.id] },
          adminHeaders
        )

        const response = await api.get(
          `/admin/customers?groups=${group.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.customers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: customer1.id,
            }),
          ])
        )
      })
    })

    describe("POST /admin/customer-groups/:id", () => {
      it("should update group name & metadata", async () => {
        const body = {
          name: "vip-customers-v2",
          metadata: {
            metaKey1: `metaValue1`,
          },
        }

        const response = await api.post(
          `/admin/customer-groups/${group.id}`,
          body,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer_group).toEqual(
          expect.objectContaining({
            id: group.id,
            name: "vip-customers-v2",
            metadata: {
              data1: "value1",
              metaKey1: `metaValue1`,
            },
          })
        )
      })

      it("should delete `metadata` nested key", async () => {
        const body = {
          name: "vip-customers-v2",
          metadata: {
            data1: null, // delete
            data2: "val2", // insert
          },
        }

        const response = await api.post(
          `/admin/customer-groups/${group.id}?fields=*customers`,
          body,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer_group).toEqual(
          expect.objectContaining({
            id: group.id,
            name: "vip-customers-v2",
            metadata: { data1: null, data2: "val2" },
            customers: [],
          })
        )
      })
    })

    describe("GET /admin/customer-groups", () => {
      it("should retreive a list of customer groups", async () => {
        const response = await api.get(
          `/admin/customer-groups?fields=*customers`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.customer_groups[0]).toEqual(
          expect.objectContaining({ id: group.id })
        )
        expect(response.data.customer_groups[0]).toHaveProperty("customers")
      })

      it("should retrieve a list of customer groups filtered by name using `q` param", async () => {
        const response = await api.get(
          `/admin/customer-groups?q=vip-customers`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.count).toEqual(1)
        expect(response.data.customer_groups).toEqual([
          expect.objectContaining({ id: group.id }),
        ])
        expect(response.data.customer_groups[0]).not.toHaveProperty("customers")
      })
    })

    describe("GET /admin/customer-groups/:id", () => {
      it("should get customer group", async () => {
        const response = await api.get(
          `/admin/customer-groups/${group.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer_group).toEqual(
          expect.objectContaining({
            id: group.id,
            name: "vip-customers",
          })
        )
        expect(response.data.customer_group).not.toHaveProperty("customers")
      })

      it("gets customer group with `customers` prop", async () => {
        const response = await api.get(
          `/admin/customer-groups/${group.id}?fields=*customers`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.customer_group).toEqual(
          expect.objectContaining({
            id: group.id,
            name: "vip-customers",
          })
        )
        expect(response.data.customer_group.customers).toEqual([])
      })

      it("throws error when a customer group doesn't exist", async () => {
        await api
          .get(`/admin/customer-groups/does-not-exist`, adminHeaders)
          .catch((err) => {
            expect(err.response.status).toEqual(404)
            expect(err.response.data.type).toEqual("not_found")
            expect(err.response.data.message).toEqual(
              `Customer group with id: does-not-exist not found`
            )
          })
      })
    })
  },
})
