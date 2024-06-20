import { Modules } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import { ProductStatus } from "@medusajs/utils"
import { Product, ProductOption } from "@models"
import { moduleIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IProductModuleService>({
  moduleName: Modules.PRODUCT,
  testSuite: ({ MikroOrmWrapper, service }) => {
    describe("ProductModuleService product options", () => {
      let optionOne: ProductOption
      let optionTwo: ProductOption
      let productOne: Product
      let productTwo: Product

      beforeEach(async () => {
        const testManager = await MikroOrmWrapper.forkManager()
        productOne = testManager.create(Product, {
          id: "product-1",
          title: "product 1",
          status: ProductStatus.PUBLISHED,
        })

        productTwo = testManager.create(Product, {
          id: "product-2",
          title: "product 2",
          status: ProductStatus.PUBLISHED,
        })

        optionOne = testManager.create(ProductOption, {
          id: "option-1",
          title: "option 1",
          product: productOne,
        })

        optionTwo = testManager.create(ProductOption, {
          id: "option-2",
          title: "option 1",
          product: productTwo,
        })

        await testManager.persistAndFlush([optionOne, optionTwo])
      })

      describe("listOptions", () => {
        it("should return options and count queried by ID", async () => {
          const options = await service.listProductOptions({
            id: optionOne.id,
          })

          expect(options).toEqual([
            expect.objectContaining({
              id: optionOne.id,
            }),
          ])
        })

        it("should return options and count based on the options and filter parameter", async () => {
          let options = await service.listProductOptions(
            {
              id: optionOne.id,
            },
            {
              take: 1,
            }
          )

          expect(options).toEqual([
            expect.objectContaining({
              id: optionOne.id,
            }),
          ])

          options = await service.listProductOptions({}, { take: 1, skip: 1 })

          expect(options).toEqual([
            expect.objectContaining({
              id: optionTwo.id,
            }),
          ])
        })

        it("should return only requested fields and relations for options", async () => {
          const options = await service.listProductOptions(
            {
              id: optionOne.id,
            },
            {
              select: ["title", "product.id"],
              relations: ["product"],
              take: 1,
            }
          )

          expect(options).toEqual([
            {
              id: optionOne.id,
              title: optionOne.title,
              product_id: productOne.id,
              product: {
                id: productOne.id,
                type_id: null,
                collection_id: null,
              },
            },
          ])
        })
      })

      describe("listAndCountOptions", () => {
        it("should return options and count queried by ID", async () => {
          const [options, count] = await service.listAndCountProductOptions({
            id: optionOne.id,
          })

          expect(count).toEqual(1)
          expect(options).toEqual([
            expect.objectContaining({
              id: optionOne.id,
            }),
          ])
        })

        it("should return options and count based on the options and filter parameter", async () => {
          let [options, count] = await service.listAndCountProductOptions(
            {
              id: optionOne.id,
            },
            {
              take: 1,
            }
          )

          expect(count).toEqual(1)
          expect(options).toEqual([
            expect.objectContaining({
              id: optionOne.id,
            }),
          ])
          ;[options, count] = await service.listAndCountProductOptions(
            {},
            { take: 1 }
          )

          expect(count).toEqual(2)
          ;[options, count] = await service.listAndCountProductOptions(
            {},
            { take: 1, skip: 1 }
          )

          expect(count).toEqual(2)
          expect(options).toEqual([
            expect.objectContaining({
              id: optionTwo.id,
            }),
          ])
        })

        it("should return only requested fields and relations for options", async () => {
          const [options, count] = await service.listAndCountProductOptions(
            {
              id: optionOne.id,
            },
            {
              select: ["title", "product.id"],
              relations: ["product"],
              take: 1,
            }
          )

          expect(count).toEqual(1)
          expect(options).toEqual([
            {
              id: optionOne.id,
              title: optionOne.title,
              product_id: productOne.id,
              product: {
                id: productOne.id,
                type_id: null,
                collection_id: null,
              },
            },
          ])
        })
      })

      describe("retrieveOption", () => {
        it("should return the requested option", async () => {
          const option = await service.retrieveProductOption(optionOne.id)

          expect(option).toEqual(
            expect.objectContaining({
              id: optionOne.id,
            })
          )
        })

        it("should return requested attributes when requested through config", async () => {
          const option = await service.retrieveProductOption(optionOne.id, {
            select: ["id", "product.title"],
            relations: ["product"],
          })

          expect(option).toEqual(
            expect.objectContaining({
              id: optionOne.id,
              product: {
                id: "product-1",
                handle: "product-1",
                title: "product 1",
                type_id: null,
                collection_id: null,
              },
              product_id: "product-1",
            })
          )
        })

        it("should throw an error when a option with ID does not exist", async () => {
          let error

          try {
            await service.retrieveProductOption("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            `ProductOption with id: does-not-exist was not found`
          )
        })
      })

      describe("deleteOptions", () => {
        const optionId = "option-1"

        it("should delete the product option given an ID successfully", async () => {
          await service.deleteProductOptions([optionId])

          const options = await service.listProductOptions({
            id: optionId,
          })

          expect(options).toHaveLength(0)
        })
      })

      describe("updateOptions", () => {
        const optionId = "option-1"

        it("should update the title of the option successfully", async () => {
          await service.upsertProductOptions([
            {
              id: optionId,
              title: "new test",
            },
          ])

          const productOption = await service.retrieveProductOption(optionId)

          expect(productOption.title).toEqual("new test")
        })

        it("should throw an error when an id does not exist", async () => {
          let error

          try {
            await service.updateProductOptions("does-not-exist", {})
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            `ProductOption with id: does-not-exist was not found`
          )
        })
      })

      describe("createOptions", () => {
        it("should create a option successfully", async () => {
          const res = await service.createProductOptions([
            {
              title: "test",
              values: [],
              product_id: productOne.id,
            },
          ])

          const [productOption] = await service.listProductOptions(
            {
              title: "test",
            },
            {
              select: ["id", "title", "product.id"],
              relations: ["product"],
            }
          )

          expect(productOption).toEqual(
            expect.objectContaining({
              title: "test",
              product: expect.objectContaining({
                id: productOne.id,
              }),
            })
          )
        })
      })
    })
  },
})
