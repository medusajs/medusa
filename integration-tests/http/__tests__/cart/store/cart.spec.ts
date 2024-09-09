import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
    })

    describe("noop", () => {
      it("noop", () => {})
    })
  },
})

// TODO: Implement the tests below, which were migrated from v1.
//   describe("POST /store/carts/:id", () => {
//     let product
//     const pubKeyId = IdMap.getId("pubkey-get-id")

//     beforeEach(async () => {
//       await adminSeeder(dbConnection)

//       await simpleRegionFactory(dbConnection, {
//         id: "test-region",
//       })

//       await simplePublishableApiKeyFactory(dbConnection, {
//         id: pubKeyId,
//         created_by: adminUserId,
//       })

//       product = await simpleProductFactory(dbConnection, {
//         sales_channels: [
//           {
//             id: "sales-channel",
//             name: "Sales channel",
//             description: "Sales channel",
//           },
//           {
//             id: "sales-channel2",
//             name: "Sales channel2",
//             description: "Sales channel2",
//           },
//         ],
//       })
//     })

//     afterEach(async () => {
//       const db = useDb()
//       return await db.teardown()
//     })

//     it("should assign sales channel to order on cart completion if PK is present in the header", async () => {
//       const api = useApi()

//       await api.post(
//         `/admin/api-keys/${pubKeyId}/sales-channels/batch`,
//         {
//           sales_channel_ids: [{ id: "sales-channel" }],
//         },
//         adminHeaders
//       )

//       const customerRes = await api.post("/store/customers", customerData, {
//         withCredentials: true,
//       })

//       const createCartRes = await api.post(
//         "/store/carts",
//         {
//           region_id: "test-region",
//           items: [
//             {
//               variant_id: product.variants[0].id,
//               quantity: 1,
//             },
//           ],
//         },
//         {
//           headers: {
//             "x-medusa-access-token": "test_token",
//             "x-publishable-api-key": pubKeyId,
//           },
//         }
//       )

//       const cart = createCartRes.data.cart

//       await api.post(`/store/carts/${cart.id}`, {
//         customer_id: customerRes.data.customer.id,
//       })

//       await api.post(`/store/carts/${cart.id}/payment-sessions`)

//       const createdOrder = await api.post(
//         `/store/carts/${cart.id}/complete-cart`
//       )

//       expect(createdOrder.data.type).toEqual("order")
//       expect(createdOrder.status).toEqual(200)
//       expect(createdOrder.data.data).toEqual(
//         expect.objectContaining({
//           sales_channel_id: "sales-channel",
//         })
//       )
//     })

//     it("SC from params defines where product is assigned (passed SC still has to be in the scope of PK from the header)", async () => {
//       const api = useApi()

//       await api.post(
//         `/admin/api-keys/${pubKeyId}/sales-channels/batch`,
//         {
//           sales_channel_ids: [
//             { id: "sales-channel" },
//             { id: "sales-channel2" },
//           ],
//         },
//         adminHeaders
//       )

//       const customerRes = await api.post("/store/customers", customerData, {
//         withCredentials: true,
//       })

//       const createCartRes = await api.post(
//         "/store/carts",
//         {
//           sales_channel_id: "sales-channel2",
//           region_id: "test-region",
//           items: [
//             {
//               variant_id: product.variants[0].id,
//               quantity: 1,
//             },
//           ],
//         },
//         {
//           headers: {
//             "x-medusa-access-token": "test_token",
//             "x-publishable-api-key": pubKeyId,
//           },
//         }
//       )

//       const cart = createCartRes.data.cart

//       await api.post(`/store/carts/${cart.id}`, {
//         customer_id: customerRes.data.customer.id,
//       })

//       await api.post(`/store/carts/${cart.id}/payment-sessions`)

//       const createdOrder = await api.post(
//         `/store/carts/${cart.id}/complete-cart`
//       )

//       expect(createdOrder.data.type).toEqual("order")
//       expect(createdOrder.status).toEqual(200)
//       expect(createdOrder.data.data).toEqual(
//         expect.objectContaining({
//           sales_channel_id: "sales-channel2",
//         })
//       )
//     })

//     it("should throw because SC id in the body is not in the scope of PK from the header", async () => {
//       const api = useApi()

//       await api.post(
//         `/admin/api-keys/${pubKeyId}/sales-channels/batch`,
//         {
//           sales_channel_ids: [{ id: "sales-channel" }],
//         },
//         adminHeaders
//       )

//       try {
//         await api.post(
//           "/store/carts",
//           {
//             sales_channel_id: "sales-channel2", // SC not in the PK scope
//             region_id: "test-region",
//             items: [
//               {
//                 variant_id: product.variants[0].id,
//                 quantity: 1,
//               },
//             ],
//           },
//           {
//             headers: {
//               "x-medusa-access-token": "test_token",
//               "x-publishable-api-key": pubKeyId,
//             },
//           }
//         )
//       } catch (error) {
//         expect(error.response.status).toEqual(400)
//         expect(error.response.data.errors[0]).toEqual(
//           `Provided sales channel id param: sales-channel2 is not associated with the Publishable API Key passed in the header of the request.`
//         )
//       }
//     })
//   })
// })
