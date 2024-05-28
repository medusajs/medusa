import { Modules } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import { ProductStatus } from "@medusajs/utils"
import { Product } from "@models"
import { ProductTypeService } from "@services"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import { createProductAndTypes } from "../../../__fixtures__/product"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.PRODUCT,
  testSuite: ({
    MikroOrmWrapper,
    medusaApp,
  }: SuiteOptions<IProductModuleService>) => {
    describe("ProductType Service", () => {
      let data!: Product[]
      let service: ProductTypeService

      beforeEach(() => {
        service = medusaApp.modules["productService"].productTypeService_
      })

      const productsData = [
        {
          id: "product-1",
          title: "product 1",
          status: ProductStatus.PUBLISHED,
          type: {
            id: "type-1",
            value: "Type 1",
          },
        },
        {
          id: "product-2",
          title: "product",
          status: ProductStatus.PUBLISHED,
          type: {
            id: "type-2",
            value: "Type 2",
          },
        },
      ]

      beforeEach(async () => {
        data = await createProductAndTypes(
          MikroOrmWrapper.forkManager(),
          productsData
        )
      })
      describe("list", () => {
        it("list product type", async () => {
          const typeResults = await service.list()

          expect(typeResults).toEqual([
            expect.objectContaining({
              id: "type-1",
              value: "Type 1",
            }),
            expect.objectContaining({
              id: "type-2",
              value: "Type 2",
            }),
          ])
        })

        it("list product type by id", async () => {
          const typeResults = await service.list({ id: data[0].type.id })

          expect(typeResults).toEqual([
            expect.objectContaining({
              id: "type-1",
              value: "Type 1",
            }),
          ])
        })

        it("list product type by value matching string", async () => {
          const typeResults = await service.list({ value: "Type 1" })

          expect(typeResults).toEqual([
            expect.objectContaining({
              id: "type-1",
              value: "Type 1",
            }),
          ])
        })
      })

      describe("listAndCount", () => {
        it("should return product type and count", async () => {
          const [typeResults, count] = await service.listAndCount()

          expect(count).toEqual(2)
          expect(typeResults).toEqual([
            expect.objectContaining({
              id: "type-1",
              value: "Type 1",
            }),
            expect.objectContaining({
              id: "type-2",
              value: "Type 2",
            }),
          ])
        })

        it("should return product type and count when filtered", async () => {
          const [typeResults, count] = await service.listAndCount({
            id: data[0].type.id,
          })

          expect(count).toEqual(1)
          expect(typeResults).toEqual([
            expect.objectContaining({
              id: "type-1",
            }),
          ])
        })

        it("should return product type and count when using skip and take", async () => {
          const [typeResults, count] = await service.listAndCount(
            {},
            { skip: 1, take: 1 }
          )

          expect(count).toEqual(2)
          expect(typeResults).toEqual([
            expect.objectContaining({
              id: "type-2",
            }),
          ])
        })

        it("should return requested fields", async () => {
          const [typeResults, count] = await service.listAndCount(
            {},
            {
              take: 1,
              select: ["value"],
            }
          )

          const serialized = JSON.parse(JSON.stringify(typeResults))

          expect(count).toEqual(2)
          expect(serialized).toEqual([
            expect.objectContaining({
              id: "type-1",
            }),
          ])
        })
      })

      describe("retrieve", () => {
        const typeId = "type-1"
        const typeValue = "Type 1"

        it("should return type for the given id", async () => {
          const type = await service.retrieve(typeId)

          expect(type).toEqual(
            expect.objectContaining({
              id: typeId,
            })
          )
        })

        it("should throw an error when type with id does not exist", async () => {
          let error

          try {
            await service.retrieve("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "ProductType with id: does-not-exist was not found"
          )
        })

        it("should throw an error when an id is not provided", async () => {
          let error

          try {
            await service.retrieve(undefined as unknown as string)
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual("productType - id must be defined")
        })

        it("should return type based on config select param", async () => {
          const type = await service.retrieve(typeId, {
            select: ["id", "value"],
          })

          const serialized = JSON.parse(JSON.stringify(type))

          expect(serialized).toEqual({
            id: typeId,
            value: typeValue,
          })
        })
      })

      describe("delete", () => {
        const typeId = "type-1"

        it("should delete the product type given an ID successfully", async () => {
          await service.delete([typeId])

          const types = await service.list({
            id: typeId,
          })

          expect(types).toHaveLength(0)
        })
      })

      describe("update", () => {
        const typeId = "type-1"

        it("should update the value of the type successfully", async () => {
          await service.update([
            {
              id: typeId,
              value: "UK",
            },
          ])

          const productType = await service.retrieve(typeId)

          expect(productType.value).toEqual("UK")
        })

        it("should throw an error when an id does not exist", async () => {
          let error

          try {
            await service.update([
              {
                id: "does-not-exist",
                value: "UK",
              },
            ])
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            'ProductType with id "does-not-exist" not found'
          )
        })
      })

      describe("create", () => {
        it("should create a type successfully", async () => {
          await service.create([
            {
              value: "UK",
            },
          ])

          const [productType] = await service.list({
            value: "UK",
          })

          expect(productType.value).toEqual("UK")
        })
      })
    })
  },
})
