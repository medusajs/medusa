import { IProductModuleService } from "@medusajs/framework/types"
import {
  Modules,
  ProductStatus,
  toMikroORMEntity,
} from "@medusajs/framework/utils"
import { Product, ProductOption } from "@models"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { ProductProductOption } from "../../../src/models"

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

        // Create products
        productOne = testManager.create(toMikroORMEntity(Product), {
          id: "product-1",
          title: "product 1",
          handle: "product-1",
          status: ProductStatus.PUBLISHED,
        })

        productTwo = testManager.create(toMikroORMEntity(Product), {
          id: "product-2",
          title: "product 2",
          handle: "product-2",
          status: ProductStatus.PUBLISHED,
        })

        // Create options (without linking products yet)
        optionOne = testManager.create(toMikroORMEntity(ProductOption), {
          id: "option-1",
          title: "option 1",
        })

        optionTwo = testManager.create(toMikroORMEntity(ProductOption), {
          id: "option-2",
          title: "option 2",
        })

        // Create pivot entities to link products ↔ options
        const productOptionOneLink = testManager.create(
          toMikroORMEntity(ProductProductOption),
          {
            id: "prodopt-1",
            product: productOne,
            product_option: optionOne,
          }
        )

        const productOptionTwoLink = testManager.create(
          toMikroORMEntity(ProductProductOption),
          {
            id: "prodopt-2",
            product: productTwo,
            product_option: optionTwo,
          }
        )

        // Persist everything
        await testManager.persistAndFlush([
          productOne,
          productTwo,
          optionOne,
          optionTwo,
          productOptionOneLink,
          productOptionTwoLink,
        ])
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
              select: ["title", "products.id"],
              relations: ["products"],
              take: 1,
            }
          )

          expect(options).toEqual([
            {
              id: optionOne.id,
              title: optionOne.title,
              products: [
                {
                  id: productOne.id,
                },
              ],
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
              select: ["title", "products.id"],
              relations: ["products"],
              take: 1,
            }
          )

          expect(count).toEqual(1)
          expect(options).toEqual([
            {
              id: optionOne.id,
              title: optionOne.title,
              products: [
                {
                  id: productOne.id,
                },
              ],
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
            select: ["id", "products.handle", "products.title"],
            relations: ["products"],
          })

          expect(option).toEqual(
            expect.objectContaining({
              id: optionOne.id,
              products: [
                {
                  id: "product-1",
                  handle: "product-1",
                  title: "product 1",
                },
              ],
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

        it("should throw when changing a global option to exclusive", async () => {
          let error

          try {
            await service.updateProductOptions(optionId, {
              is_exclusive: true,
            })
          } catch (e) {
            error = e
          }

          expect(error?.message).toEqual(
            `Cannot change product option: ${optionId} from global to exclusive.`
          )
        })

        it("should currently allow changing an exclusive option to global", async () => {
          const [exclusiveOption] = await service.createProductOptions([
            {
              title: "exclusive option",
              is_exclusive: true,
              values: ["v1"],
            },
          ])

          expect(exclusiveOption.is_exclusive).toBe(true)

          const updated = await service.updateProductOptions(
            exclusiveOption.id,
            { is_exclusive: false }
          )

          expect(updated.is_exclusive).toBe(false)

          const retrieved = await service.retrieveProductOption(
            exclusiveOption.id
          )
          expect(retrieved.is_exclusive).toBe(false)
        })
      })

      describe("createOptions", () => {
        it("should create a option successfully", async () => {
          const res = await service.createProductOptions([
            {
              title: "test",
              values: [],
            },
          ])

          const [productOption] = await service.listProductOptions(
            {
              title: "test",
            },
            {
              select: ["id", "title", "products.id"],
              relations: ["products"],
            }
          )

          expect(productOption).toEqual(
            expect.objectContaining({
              title: "test",
              products: [],
            })
          )
        })
      })
    })
  },
})
