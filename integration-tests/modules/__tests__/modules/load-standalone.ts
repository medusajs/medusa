import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { MedusaApp } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConfig: { clientUrl } }) => {
    describe("Standalone Modules", () => {
      beforeAll(async () => {
        process.env.DATABASE_URL = clientUrl
      })

      afterAll(async () => {
        process.env.DATABASE_URL = undefined
      })

      it("Should migrate database and initialize Product module using connection string from environment variable ", async function () {
        const { modules, runMigrations } = await MedusaApp({
          modulesConfig: {
            [Modules.PRODUCT]: true,
          },
        })

        await runMigrations()

        const product = modules[
          Modules.PRODUCT
        ] as unknown as IProductModuleService

        const productList = await product.listProducts()

        expect(productList).toEqual(expect.arrayContaining([]))
      })
    })
  },
})
