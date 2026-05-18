import { IMaterialModuleService } from "@medusajs/framework/types"
import { Module, Modules } from "@medusajs/framework/utils"
import { MaterialModuleService } from "@services"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createBasicMaterialFixture,
  createSalesMaterialFixture,
  createComboItemFixture,
} from "../__fixtures__"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IMaterialModuleService>({
  moduleName: Modules.MATERIAL,
  testSuite: ({ service }) => {
    it(`should export the appropriate linkable configuration`, () => {
      const linkable = Module(Modules.MATERIAL, {
        service: MaterialModuleService,
      }).linkable

      expect(Object.keys(linkable).sort()).toEqual([
        "basicMaterial",
        "comboItem",
        "salesMaterial",
      ])

      Object.keys(linkable).forEach((key) => {
        delete linkable[key].toJSON
      })

      expect(linkable.basicMaterial).toEqual({
        id: {
          linkable: "basic_material_id",
          entity: "BasicMaterial",
          primaryKey: "id",
          serviceName: "material",
          field: "basicMaterial",
        },
      })
    })

    describe("Material Module Service", () => {
      describe("BasicMaterial", () => {
        describe("creating", () => {
          it("should create a basic material", async function () {
            const material = await service.createBasicMaterials(
              createBasicMaterialFixture
            )

            expect(material).toEqual(
              expect.objectContaining({
                material_code: "BM001",
                material_name: "Test T-Shirt",
                spu_code: "SPU001",
                material_type: "finished",
              })
            )
          })

          it("should create multiple basic materials", async function () {
            const materials = await service.createBasicMaterials([
              createBasicMaterialFixture,
              {
                material_code: "BM002",
                material_name: "Test Pants",
                material_type: "finished",
              },
            ])

            expect(materials).toHaveLength(2)
          })
        })

        describe("retrieving", () => {
          it("should retrieve by id", async function () {
            const created = await service.createBasicMaterials(
              createBasicMaterialFixture
            )
            const material = await service.retrieveBasicMaterial(created.id)
            expect(material.material_code).toEqual("BM001")
          })
        })

        describe("listing", () => {
          it("should list and count", async function () {
            await service.createBasicMaterials([
              createBasicMaterialFixture,
              {
                material_code: "BM002",
                material_name: "Test Pants",
                material_type: "finished",
              },
            ])

            const [materials, count] = await service.listAndCountBasicMaterials()
            expect(materials).toHaveLength(2)
            expect(count).toEqual(2)
          })

          it("should filter by material_type", async function () {
            await service.createBasicMaterials([
              createBasicMaterialFixture,
              {
                material_code: "BM002",
                material_name: "Test Box",
                material_type: "box",
              },
            ])

            const materials = await service.listBasicMaterials({
              material_type: "box",
            })
            expect(materials).toHaveLength(1)
            expect(materials[0].material_name).toEqual("Test Box")
          })
        })

        describe("updating", () => {
          it("should update material name", async function () {
            const created = await service.createBasicMaterials(
              createBasicMaterialFixture
            )
            const updated = await service.updateBasicMaterials({
              id: created.id,
              material_name: "Updated T-Shirt",
            })
            expect(updated.material_name).toEqual("Updated T-Shirt")
          })
        })

        describe("deleting", () => {
          it("should delete a material", async function () {
            const created = await service.createBasicMaterials(
              createBasicMaterialFixture
            )
            await service.deleteBasicMaterials(created.id)
            const materials = await service.listBasicMaterials()
            expect(materials).toHaveLength(0)
          })
        })
      })

      describe("SalesMaterial", () => {
        const shopId = "shop_test_001"

        describe("creating", () => {
          it("should create a sales material", async function () {
            const material = await service.createSalesMaterials(
              createSalesMaterialFixture(shopId)
            )

            expect(material).toEqual(
              expect.objectContaining({
                shop_id: shopId,
                sales_code: "SM001",
                sales_name: "Test Sales Material",
                status: "active",
              })
            )
          })
        })

        describe("listing", () => {
          it("should list and count", async function () {
            await service.createSalesMaterials([
              createSalesMaterialFixture(shopId),
              { ...createSalesMaterialFixture(shopId), sales_code: "SM002" },
            ])

            const [materials, count] =
              await service.listAndCountSalesMaterials()
            expect(materials).toHaveLength(2)
            expect(count).toEqual(2)
          })

          it("should filter by status", async function () {
            await service.createSalesMaterials([
              createSalesMaterialFixture(shopId),
              { ...createSalesMaterialFixture(shopId), sales_code: "SM002", status: "inactive" },
            ])

            const materials = await service.listSalesMaterials({
              status: "inactive",
            })
            expect(materials).toHaveLength(1)
          })
        })

        describe("updating", () => {
          it("should update sales name", async function () {
            const created = await service.createSalesMaterials(
              createSalesMaterialFixture(shopId)
            )
            const updated = await service.updateSalesMaterials({
              id: created.id,
              sales_name: "Updated Sales",
            })
            expect(updated.sales_name).toEqual("Updated Sales")
          })
        })

        describe("deleting", () => {
          it("should delete a sales material", async function () {
            const created = await service.createSalesMaterials(
              createSalesMaterialFixture(shopId)
            )
            await service.deleteSalesMaterials(created.id)
            const materials = await service.listSalesMaterials()
            expect(materials).toHaveLength(0)
          })
        })
      })

      describe("ComboItem", () => {
        describe("creating", () => {
          it("should create a combo item", async function () {
            const parent = await service.createBasicMaterials({
              material_code: "BM_PARENT",
              material_name: "Gift Box",
              material_type: "box",
            })
            const child = await service.createBasicMaterials({
              material_code: "BM_CHILD",
              material_name: "T-Shirt",
              material_type: "finished",
            })

            const combo = await service.createComboItems(
              createComboItemFixture(parent.id, child.id)
            )

            expect(combo).toEqual(
              expect.objectContaining({
                parent_material_id: parent.id,
                child_material_id: child.id,
                quantity: 2,
                is_optional: false,
              })
            )
          })
        })

        describe("listing", () => {
          it("should list and count", async function () {
            const parent = await service.createBasicMaterials({
              material_code: "BM_PARENT",
              material_name: "Gift Box",
              material_type: "box",
            })
            const child1 = await service.createBasicMaterials({
              material_code: "BM_C1",
              material_name: "Item 1",
              material_type: "finished",
            })
            const child2 = await service.createBasicMaterials({
              material_code: "BM_C2",
              material_name: "Item 2",
              material_type: "finished",
            })

            await service.createComboItems([
              createComboItemFixture(parent.id, child1.id),
              { ...createComboItemFixture(parent.id, child2.id), quantity: 1 },
            ])

            const [items, count] = await service.listAndCountComboItems()
            expect(items).toHaveLength(2)
            expect(count).toEqual(2)
          })
        })

        describe("deleting", () => {
          it("should delete a combo item", async function () {
            const parent = await service.createBasicMaterials({
              material_code: "BM_PARENT",
              material_name: "Gift Box",
              material_type: "box",
            })
            const child = await service.createBasicMaterials({
              material_code: "BM_CHILD",
              material_name: "T-Shirt",
              material_type: "finished",
            })

            const created = await service.createComboItems(
              createComboItemFixture(parent.id, child.id)
            )
            await service.deleteComboItems(created.id)
            const items = await service.listComboItems()
            expect(items).toHaveLength(0)
          })
        })
      })
    })
  },
})
