import { MedusaApp } from "@zjedene-medusa/modules-sdk"
import { medusaIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import { IProductModuleService } from "@zjedene-medusa/types"
import { Modules } from "@zjedene-medusa/utils"

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
