import { IProductModuleService } from "@medusajs/types"
import { ProductType } from "@models"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { Modules } from "@medusajs/utils"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IProductModuleService>({
  moduleName: Modules.PRODUCT,
  testSuite: ({ MikroOrmWrapper, service }) => {
    describe("ProductModuleService product types", () => {
      let typeOne: ProductType
      let typeTwo: ProductType

      beforeEach(async () => {
        const testManager = await MikroOrmWrapper.forkManager()

        typeOne = testManager.create(ProductType, {
          id: "type-1",
          value: "type 1",
        })

        typeTwo = testManager.create(ProductType, {
          id: "type-2",
          value: "type",
        })

        await testManager.persistAndFlush([typeOne, typeTwo])
      })

      describe("listTypes", () => {
        it("should return types and count queried by ID", async () => {
          const types = await service.listProductTypes({
            id: typeOne.id,
          })

          expect(types).toEqual([
            expect.objectContaining({
              id: typeOne.id,
            }),
          ])
        })

        it("should return types and count based on the options and filter parameter", async () => {
          let types = await service.listProductTypes(
            {
              id: typeOne.id,
            },
            {
              take: 1,
            }
          )

          expect(types).toEqual([
            expect.objectContaining({
              id: typeOne.id,
            }),
          ])

          types = await service.listProductTypes({}, { take: 1, skip: 1 })

          expect(types).toEqual([
            expect.objectContaining({
              id: typeTwo.id,
            }),
          ])
        })

        it("should return only requested fields for types", async () => {
          const types = await service.listProductTypes(
            {
              id: typeOne.id,
            },
            {
              select: ["value"],
              take: 1,
            }
          )

          expect(types).toEqual([
            {
              id: typeOne.id,
              value: typeOne.value,
            },
          ])
        })
      })

      describe("listAndCountTypes", () => {
        it("should return types and count queried by ID", async () => {
          const [types, count] = await service.listAndCountProductTypes({
            id: typeOne.id,
          })

          expect(count).toEqual(1)
          expect(types).toEqual([
            expect.objectContaining({
              id: typeOne.id,
            }),
          ])
        })

        it("should return types and count based on the options and filter parameter", async () => {
          let [types, count] = await service.listAndCountProductTypes(
            {
              id: typeOne.id,
            },
            {
              take: 1,
            }
          )

          expect(count).toEqual(1)
          expect(types).toEqual([
            expect.objectContaining({
              id: typeOne.id,
            }),
          ])
          ;[types, count] = await service.listAndCountProductTypes(
            {},
            { take: 1 }
          )

          expect(count).toEqual(2)
          ;[types, count] = await service.listAndCountProductTypes(
            {},
            { take: 1, skip: 1 }
          )

          expect(count).toEqual(2)
          expect(types).toEqual([
            expect.objectContaining({
              id: typeTwo.id,
            }),
          ])
        })

        it("should return only requested fields for types", async () => {
          const [types, count] = await service.listAndCountProductTypes(
            {
              id: typeOne.id,
            },
            {
              select: ["value"],
              take: 1,
            }
          )

          expect(count).toEqual(1)
          expect(types).toEqual([
            {
              id: typeOne.id,
              value: typeOne.value,
            },
          ])
        })
      })

      describe("retrieveType", () => {
        it("should return the requested type", async () => {
          const type = await service.retrieveProductType(typeOne.id)

          expect(type).toEqual(
            expect.objectContaining({
              id: typeOne.id,
            })
          )
        })

        it("should return requested attributes when requested through config", async () => {
          const type = await service.retrieveProductType(typeOne.id, {
            select: ["id", "value"],
          })

          expect(type).toEqual({
            id: typeOne.id,
            value: typeOne.value,
          })
        })

        it("should throw an error when a type with ID does not exist", async () => {
          let error

          try {
            await service.retrieveProductType("does-not-exist")
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "ProductType with id: does-not-exist was not found"
          )
        })
      })

      describe("deleteTypes", () => {
        const typeId = "type-1"

        it("should delete the product type given an ID successfully", async () => {
          await service.deleteProductTypes([typeId])

          const types = await service.listProductTypes({
            id: typeId,
          })

          expect(types).toHaveLength(0)
        })
      })

      describe("updateTypes", () => {
        const typeId = "type-1"

        it("should update the value of the type successfully", async () => {
          await service.updateProductTypes(typeId, {
            value: "UK",
          })

          const productType = await service.retrieveProductType(typeId)

          expect(productType.value).toEqual("UK")
        })

        it("should throw an error when an id does not exist", async () => {
          let error

          try {
            await service.updateProductTypes("does-not-exist", {
              value: "UK",
            })
          } catch (e) {
            error = e
          }

          expect(error.message).toEqual(
            "ProductType with id: does-not-exist was not found"
          )
        })
      })

      describe("createTypes", () => {
        it("should create a type successfully", async () => {
          const res = await service.createProductTypes([
            {
              value: "UK",
            },
          ])

          const productType = await service.listProductTypes({
            value: "UK",
          })

          expect(productType[0]?.value).toEqual("UK")
        })
      })
    })
  },
})
