import { Region } from "@medusajs/medusa"
import { IPricingModuleService } from "@medusajs/types"
import { simpleSalesChannelFactory } from "../../../../factories"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createDefaultRuleTypes } from "../../../helpers/create-default-rule-types"
import {medusaIntegrationTestRunner} from "medusa-test-utils";

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_MEDUSA_V2: true,
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe.skip("POST /admin/products", () => {
      let appContainer

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        const manager = dbConnection.manager
        await adminSeeder(dbConnection)
        await createDefaultRuleTypes(appContainer)

        await manager.insert(Region, {
          id: "test-region",
          name: "Test Region",
          currency_code: "usd",
          tax_rate: 0,
        })

        await simpleSalesChannelFactory(dbConnection, { is_default: true })
      })

      it("should create prices with region_id and currency_code context", async () => {
        const data = {
          title: "test product",
          options: [{ title: "test-option" }],
          variants: [
            {
              title: "test variant",
              prices: [
                {
                  amount: 66600,
                  region_id: "test-region",
                },
                {
                  amount: 55500,
                  currency_code: "usd",
                },
              ],
              options: [{ value: "test-option" }],
            },
          ],
        }

        let response = await api.post(
          "/admin/products?relations=variants.prices",
          data,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          product: expect.objectContaining({
            id: expect.any(String),
            title: "test product",
            variants: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                title: "test variant",
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    amount: 66600,
                    currency_code: "usd",
                  }),
                  expect.objectContaining({
                    amount: 55500,
                    currency_code: "usd",
                  }),
                ]),
              }),
            ]),
          }),
        })

        const pricingModuleService: IPricingModuleService =
          appContainer.resolve("pricingModuleService")

        const [_, count] = await pricingModuleService.listAndCount()
        expect(count).toEqual(1)
      })
    })
  },
})
