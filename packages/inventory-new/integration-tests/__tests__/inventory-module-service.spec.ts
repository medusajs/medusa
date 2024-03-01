import { SuiteOptions, moduleIntegrationTestRunner } from "medusa-test-utils"

import { IInventoryServiceNext } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  moduleName: Modules.FULFILLMENT,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IInventoryServiceNext>) => {
    describe("Inventory Module Service", () => {
      describe("create", () => {
        it("should create an inventory item", async () => {
          const data = { sku: "test-sku", origin_country: "test-country" }
          const inventoryItem = await service.create(data)

          expect(inventoryItem).toEqual(
            expect.objectContaining({ id: expect.any(String), ...data })
          )
        })
      })
    })
  },
})
