import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  createAdminUser,
  adminHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    // TODO: Currently we don't have these endpoints, enable tests once they are added.
    describe("/admin/payment-collections", () => {
      it("lists payment collections", async () => {})
    })
    // describe("/admin/payment-collections/:id", () => {
    //   it("gets payment collection", async () => {
    //     const response = await api.get(
    //       `/admin/payment-collections/${paymentCollection.id}`,
    //       adminHeaders
    //     )

    //     expect(response.data.payment_collection).toEqual(
    //       expect.objectContaining({
    //         id: paymentCollection.id,
    //         type: "order_edit",
    //         status: "not_paid",
    //         description: "paycol description",
    //         amount: 10000,
    //       })
    //     )

    //     expect(response.status).toEqual(200)
    //   })

    //   it("updates a payment collection", async () => {
    //     const response = await api.post(
    //       `/admin/payment-collections/${paymentCollection.id}`,
    //       {
    //         description: "new description",
    //         metadata: {
    //           a: 1,
    //           b: [1, 2, "3"],
    //         },
    //       },
    //       adminHeaders
    //     )

    //     expect(response.status).toEqual(200)
    //     expect(response.data.payment_collection).toEqual(
    //       expect.objectContaining({
    //         id: paymentCollection.id,
    //         type: "order_edit",
    //         amount: 10000,
    //         description: "new description",
    //         metadata: {
    //           a: 1,
    //           b: [1, 2, "3"],
    //         },
    //         authorized_amount: null,
    //       })
    //     )
    //   })

    //   it("marks a payment collection as authorized", async () => {
    //     const response = await api.post(
    //       `/admin/payment-collections/${paymentCollection.id}/authorize`,
    //       undefined,
    //       adminHeaders
    //     )

    //     expect(response.data.payment_collection).toEqual(
    //       expect.objectContaining({
    //         id: paymentCollection.id,
    //         type: "order_edit",
    //         status: "authorized",
    //         description: "paycol description",
    //         amount: 10000,
    //         authorized_amount: 10000,
    //       })
    //     )

    //     expect(response.status).toEqual(200)
    //   })

    //   it("delete a payment collection", async () => {
    //     const response = await api.delete(
    //       `/admin/payment-collections/${paymentCollection.id}`,
    //       adminHeaders
    //     )

    //     expect(response.data).toEqual({
    //       id: paymentCollection.id,
    //       deleted: true,
    //       object: "payment_collection",
    //     })

    //     expect(response.status).toEqual(200)
    //   })

    //   it("throws error when deleting an authorized payment collection", async () => {
    //     await api.post(
    //       `/admin/payment-collections/${paymentCollection.id}/authorize`,
    //       undefined,
    //       adminHeaders
    //     )

    //     try {
    //       await api.delete(
    //         `/admin/payment-collections/${paymentCollection.id}`,
    //         adminHeaders
    //       )

    //       expect(1).toBe(2) // should be ignored
    //     } catch (res) {
    //       expect(res.response.data.message).toBe(
    //         "Cannot delete payment collection with status authorized"
    //       )
    //     }
    //   })
    // })
  },
})
