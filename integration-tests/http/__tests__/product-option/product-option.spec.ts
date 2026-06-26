import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    let option1
    let option2

    let storeHeaders

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })

      option1 = (
        await api.post(
          "/admin/product-options",
          {
            title: "option1",
            values: ["A", "B", "C"],
          },
          adminHeaders
        )
      ).data.product_option

      option2 = (
        await api.post(
          "/admin/product-options",
          {
            title: "option2",
            values: ["D", "E"],
            is_exclusive: true,
          },
          adminHeaders
        )
      ).data.product_option
    })

    describe("GET /admin/product-options", () => {
      it("should return a list of product options", async () => {
        const res = await api.get("/admin/product-options", adminHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_options).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: "option1",
              is_exclusive: false,
              values: expect.arrayContaining([
                expect.objectContaining({ value: "A" }),
                expect.objectContaining({ value: "B" }),
                expect.objectContaining({ value: "C" }),
              ]),
            }),
            expect.objectContaining({
              title: "option2",
              is_exclusive: true,
              values: expect.arrayContaining([
                expect.objectContaining({ value: "D" }),
                expect.objectContaining({ value: "E" }),
              ]),
            }),
          ])
        )
      })

      it("should return a list of product options matching free text search param", async () => {
        const res = await api.get("/admin/product-options?q=1", adminHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_options.length).toEqual(1)
        expect(res.data.product_options).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ title: "option1" }),
          ])
        )
      })

      it("should return a list of exclusive product options", async () => {
        const res = await api.get(
          "/admin/product-options?is_exclusive=false",
          adminHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.product_options.length).toEqual(1)
        expect(res.data.product_options).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ title: "option1" }),
          ])
        )
      })
    })

    describe("POST /admin/product-options", () => {
      it("should create a product option with value ranks", async () => {
        const option = (
          await api.post(
            `/admin/product-options`,
            {
              title: "option3",
              values: ["D", "E"],
              ranks: {
                E: 1,
                D: 2,
              },
            },
            adminHeaders
          )
        ).data.product_option

        expect(option).toEqual(
          expect.objectContaining({
            title: "option3",
            is_exclusive: false,
            values: expect.arrayContaining([
              expect.objectContaining({
                value: "D",
                rank: 2,
              }),
              expect.objectContaining({
                value: "E",
                rank: 1,
              }),
            ]),
          })
        )
      })

      it("should throw if a rank is specified for invalid value", async () => {
        const error = await api
          .post(
            `/admin/product-options`,
            {
              title: "option3",
              values: ["D", "E"],
              ranks: {
                E: 1,
                invalid: 2,
              },
            },
            adminHeaders
          )
          .catch((err) => err)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          'Value "invalid" is assigned a rank but is not defined in the list of values.'
        )
      })
    })

    describe("GET /admin/product-options/[id]", () => {
      it("should return a product option", async () => {
        const res = await api.get(
          `/admin/product-options/${option1.id}`,
          adminHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.product_option.values.length).toEqual(3)
        expect(res.data.product_option).toEqual(
          expect.objectContaining({
            title: "option1",
            is_exclusive: false,
            values: expect.arrayContaining([
              expect.objectContaining({ value: "A" }),
              expect.objectContaining({ value: "B" }),
              expect.objectContaining({ value: "C" }),
            ]),
          })
        )
      })
    })

    describe("POST /admin/product-options/[id]", () => {
      it("should update a product option", async () => {
        const option = (
          await api.post(
            `/admin/product-options/${option2.id}`,
            {
              is_exclusive: false,
            },
            adminHeaders
          )
        ).data.product_option

        expect(option.values.length).toEqual(2)
        expect(option).toEqual(
          expect.objectContaining({
            title: "option2",
            is_exclusive: false,
            values: expect.arrayContaining([
              expect.objectContaining({ value: "D" }),
              expect.objectContaining({ value: "E" }),
            ]),
          })
        )

        const res = await api.get(
          "/admin/product-options?is_exclusive=true",
          adminHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.product_options.length).toEqual(0)
      })

      it("should fail to update a product option from global to exclusive", async () => {
        const error = await api
          .post(
            `/admin/product-options/${option1.id}`,
            {
              is_exclusive: true,
            },
            adminHeaders
          )
          .catch((err) => err)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          `Cannot change product option: ${option1.id} from global to exclusive.`
        )
      })

      it("should update a product value ranks", async () => {
        const option = (
          await api.post(
            `/admin/product-options/${option2.id}`,
            {
              ranks: {
                D: 2,
                E: 1,
              },
            },
            adminHeaders
          )
        ).data.product_option

        expect(option.values.length).toEqual(2)
        expect(option).toEqual(
          expect.objectContaining({
            title: "option2",
            is_exclusive: true,
            values: expect.arrayContaining([
              expect.objectContaining({
                value: "D",
                rank: 2,
              }),
              expect.objectContaining({
                value: "E",
                rank: 1,
              }),
            ]),
          })
        )
      })

      it("should throw when trying to update an option that does not exist", async () => {
        const error = await api
          .post(
            `/admin/product-options/iDontExist`,
            {
              is_exclusive: false,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data).toEqual({
          message: 'Product option with id "iDontExist" not found',
          type: "not_found",
        })
      })
    })

    describe("DELETE /admin/product-options/[id]", () => {
      it("should delete a product option", async () => {
        await api.delete(`/admin/product-options/${option2.id}`, adminHeaders)

        const res = await api.get("/admin/product-options", adminHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_options.length).toEqual(1)
      })
    })

    describe("GET /store/product-options", () => {
      it("should list product options", async () => {
        const res = await api.get("/store/product-options", storeHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_options.length).toEqual(2)
        expect(res.data.product_options).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: option1.id,
              title: "option1",
            }),
            expect.objectContaining({
              id: option2.id,
              title: "option2",
            }),
          ])
        )
      })

      it("should filter product options by is_exclusive", async () => {
        const res = await api.get(
          "/store/product-options?is_exclusive=true",
          storeHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.product_options).toEqual([
          expect.objectContaining({
            id: option2.id,
            is_exclusive: true,
          }),
        ])
      })

      it("should filter product options by free text search", async () => {
        const res = await api.get("/store/product-options?q=1", storeHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_options).toEqual([
          expect.objectContaining({
            id: option1.id,
            title: "option1",
          }),
        ])
      })
    })

    describe("GET /store/product-options/[id]", () => {
      it("should retrieve a product option", async () => {
        const res = await api.get(
          `/store/product-options/${option1.id}`,
          storeHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.product_option).toEqual(
          expect.objectContaining({
            id: option1.id,
            title: "option1",
          })
        )
      })

      it("should return 404 when the product option does not exist", async () => {
        const error = await api
          .get(`/store/product-options/not-found`, storeHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data.message).toEqual(
          "Product option with id: not-found was not found"
        )
      })
    })
  },
})
