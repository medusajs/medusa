import { MockManager } from "medusa-test-utils"
import InventoryService from "../inventory"
import { ProductVariantServiceMock } from "../__mocks__/product-variant"

describe("InventoryService", () => {
  describe("confirmInventory", () => {
    const inventoryService = new InventoryService({
      manager: MockManager,
      productVariantService: ProductVariantServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("returns false when inventory is managed, and no back orders are allowed and the quantity is larger than inventory", async () => {
      await expect(
        inventoryService.confirmInventory("no_bo", 10)
      ).rejects.toThrow(
        `Variant with id: no_bo does not have the required inventory`
      )
    })
    it("returns true when variant is out of stock but allows back orders", async () => {
      const result = await inventoryService.confirmInventory("bo", 100)
      expect(result).toEqual(true)
    })
    it("returns true when variant is out of stock but inventory quantity is not managed", async () => {
      const result = await inventoryService.confirmInventory("no_manage", 10000)
      expect(result).toEqual(true)
    })
    it("returns true when managed variant inventory_quantity > requested quantity", async () => {
      const result = await inventoryService.confirmInventory("10_man", 5)
      expect(result).toEqual(true)
    })
    it("returns false when managed variant inventory_quantity < requested quantity", async () => {
      await expect(
        inventoryService.confirmInventory("10_man", 50)
      ).rejects.toThrow(
        `Variant with id: 10_man does not have the required inventory`
      )
    })
  })
  describe("adjustInventory", () => {
    const inventoryService = new InventoryService({
      manager: MockManager,
      productVariantService: ProductVariantServiceMock,
    })

    beforeEach(async () => {
      jest.clearAllMocks()
    })

    it("should not call update in productVariantService because variant is not managed", async () => {
      await inventoryService.adjustInventory("no_manage", 1000)
      expect(ProductVariantServiceMock.update).toHaveBeenCalledTimes(0)
    })

    it("should call update in productVariantService once", async () => {
      await inventoryService.adjustInventory("10_man", 10)
      expect(ProductVariantServiceMock.update).toHaveBeenCalledTimes(1)
      expect(ProductVariantServiceMock.update).toHaveBeenCalledWith(
        {
          id: "10_man",
          title: "variant_popular",
          inventory_quantity: 10,
          allow_backorder: false,
          manage_inventory: true,
        },
        {
          inventory_quantity: 20,
        }
      )
    })

    it("should update update once for 1man", async () => {
      await inventoryService.adjustInventory("1_man", -1)
      expect(ProductVariantServiceMock.update).toHaveBeenCalledWith(
        {
          id: "1_man",
          title: "variant_popular",
          inventory_quantity: 1,
          allow_backorder: false,
          manage_inventory: true,
        },
        {
          inventory_quantity: 0,
        }
      )
    })
  })
})
