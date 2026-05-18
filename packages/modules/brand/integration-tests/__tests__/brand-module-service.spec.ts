import { IBrandModuleService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { BrandModuleService } from "@services"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { createBrandFixture } from "../__fixtures__"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IBrandModuleService>({
  moduleName: Modules.BRAND,
  testSuite: ({ service }) => {
    it(`should export the appropriate linkable configuration`, () => {
      const linkable = Module(Modules.BRAND, {
        service: BrandModuleService,
      }).linkable

      expect(Object.keys(linkable)).toEqual(["brand"])

      Object.keys(linkable).forEach((key) => {
        delete linkable[key].toJSON
      })

      expect(linkable.brand).toEqual({
        id: {
          linkable: "brand_id",
          entity: "Brand",
          primaryKey: "id",
          serviceName: "brand",
          field: "brand",
        },
      })
    })

    describe("Brand Module Service", () => {
      describe("creating brands", () => {
        it("should create a brand successfully", async function () {
          const brand = await service.createBrands(createBrandFixture)

          expect(brand).toEqual(
            expect.objectContaining({
              name: "Test Brand",
              slug: "test-brand",
            })
          )
        })

        it("should create multiple brands successfully", async function () {
          const brands = await service.createBrands([
            createBrandFixture,
            { name: "Another Brand", slug: "another-brand" },
          ])

          expect(brands).toHaveLength(2)
          expect(brands[0].name).toEqual("Test Brand")
          expect(brands[1].name).toEqual("Another Brand")
        })
      })

      describe("retrieving brands", () => {
        it("should retrieve a brand by id", async function () {
          const created = await service.createBrands(createBrandFixture)
          const brand = await service.retrieveBrand(created.id)

          expect(brand.id).toEqual(created.id)
          expect(brand.name).toEqual("Test Brand")
        })
      })

      describe("listing brands", () => {
        it("should list all brands", async function () {
          await service.createBrands([
            createBrandFixture,
            { name: "Another Brand", slug: "another-brand" },
          ])

          const brands = await service.listBrands()
          expect(brands).toHaveLength(2)
        })

        it("should list and count brands", async function () {
          await service.createBrands([
            createBrandFixture,
            { name: "Another Brand", slug: "another-brand" },
          ])

          const [brands, count] = await service.listAndCountBrands()
          expect(brands).toHaveLength(2)
          expect(count).toEqual(2)
        })

        it("should filter brands by name", async function () {
          await service.createBrands([
            createBrandFixture,
            { name: "Another Brand", slug: "another-brand" },
          ])

          const brands = await service.listBrands({ name: "Test Brand" })
          expect(brands).toHaveLength(1)
          expect(brands[0].name).toEqual("Test Brand")
        })
      })

      describe("updating brands", () => {
        it("should update a brand name", async function () {
          const created = await service.createBrands(createBrandFixture)
          const updated = await service.updateBrands({
            id: created.id,
            name: "Updated Brand",
          })

          expect(updated.name).toEqual("Updated Brand")
          expect(updated.slug).toEqual("test-brand")
        })
      })

      describe("deleting brands", () => {
        it("should delete a brand successfully", async function () {
          const created = await service.createBrands(createBrandFixture)
          await service.deleteBrands(created.id)

          const brands = await service.listBrands()
          expect(brands).toHaveLength(0)
        })

        it("should delete multiple brands", async function () {
          const brands = await service.createBrands([
            createBrandFixture,
            { name: "Another Brand", slug: "another-brand" },
          ])

          await service.deleteBrands([brands[0].id, brands[1].id])

          const remaining = await service.listBrands()
          expect(remaining).toHaveLength(0)
        })
      })
    })
  },
})
