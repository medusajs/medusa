import {
  CreatePriceRuleDTO,
  CreatePriceSetDTO,
  IPricingModuleService,
  PricingTypes,
} from "@medusajs/types"
import { Modules, PriceListStatus, PriceListType } from "@medusajs/utils"
import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { seedPriceData } from "../../../__fixtures__/seed-price-data"

jest.setTimeout(30000)

const defaultRules = {
  customer_group_id: ["vip-customer-group-id", "another-vip-customer-group-id"],
  region_id: ["DE", "DK"],
}

const defaultPriceListPrices: PricingTypes.CreatePriceListPriceDTO[] = [
  {
    amount: 232,
    currency_code: "PLN",
    price_set_id: "price-set-PLN",
  },
  {
    amount: 455,
    currency_code: "EUR",
    price_set_id: "price-set-EUR",
  },
]
const createPriceLists = async (
  service,
  priceListOverride: Partial<
    Omit<PricingTypes.CreatePriceListDTO, "rules" | "prices">
  > = {},
  rules: object = defaultRules,
  prices = defaultPriceListPrices
) => {
  return await service.createPriceLists([
    {
      title: "Test Price List",
      description: "test description",
      type: PriceListType.SALE,
      status: PriceListStatus.ACTIVE,
      rules,
      prices,
      ...priceListOverride,
    },
  ])
}

moduleIntegrationTestRunner<IPricingModuleService>({
  moduleName: Modules.PRICING,
  testSuite: ({ MikroOrmWrapper, service }) => {
    describe("PricingModule Service - Calculate Price", () => {
      describe("calculatePrices", () => {
        beforeEach(async () => {
          const priceSetsData = [
            { id: "price-set-EUR" },
            { id: "price-set-PLN" },
          ] as unknown as CreatePriceSetDTO[]

          const pricesData = [
            {
              id: "price-PLN",
              title: "price PLN",
              price_set_id: "price-set-PLN",
              currency_code: "PLN",
              amount: 1000,
              min_quantity: 1,
              max_quantity: 10,
              rules_count: 0,
            },
            {
              id: "price-company_id-EUR",
              title: "price EUR - company_id",
              price_set_id: "price-set-EUR",
              currency_code: "EUR",
              amount: 500,
              min_quantity: 1,
              max_quantity: 10,
              rules_count: 1,
            },
            {
              id: "price-company_id-PLN",
              title: "price PLN - company_id",
              price_set_id: "price-set-PLN",
              currency_code: "PLN",
              amount: 400,
              min_quantity: 1,
              max_quantity: 5,
              rules_count: 1,
            },
            {
              id: "price-region_id-PLN",
              title: "price PLN - region_id",
              price_set_id: "price-set-PLN",
              currency_code: "PLN",
              amount: 300,
              min_quantity: 1,
              max_quantity: 4,
              rules_count: 1,
            },
            {
              id: "price-region_id+company_id-PLN",
              title: "price region_id + company_id",
              price_set_id: "price-set-PLN",
              currency_code: "PLN",
              amount: 999,
              min_quantity: 1,
              max_quantity: 10,
              rules_count: 2,
            },
            {
              id: "price-region_id-PLN-5-qty",
              title: "price PLN - region_id 5 qty",
              price_set_id: "price-set-PLN",
              currency_code: "PLN",
              amount: 250,
              min_quantity: 4,
              max_quantity: 10,
              rules_count: 1,
            },
            {
              id: "price-region_id_company_id-PL-EUR",
              title: "price PLN - region_id PL with EUR currency",
              price_set_id: "price-set-PLN",
              currency_code: "EUR",
              amount: 200,
              min_quantity: 1,
              max_quantity: 3,
              rules_count: 2,
            },
            {
              id: "price-region_id_company_id-PL-EUR-4-qty",
              title:
                "price PLN - region_id PL with EUR currency for quantity 4",
              price_set_id: "price-set-PLN",
              currency_code: "EUR",
              amount: 50,
              min_quantity: 4,
              max_quantity: 10,
              rules_count: 2,
            },
            {
              id: "price-region_id_company_id-PL-EUR-customer-group",
              title:
                "price PLN - region_id PL with EUR currency for customer group",
              price_set_id: "price-set-PLN",
              currency_code: "EUR",
              amount: 100,
              min_quantity: 1,
              max_quantity: 3,
              rules_count: 3,
            },
          ]

          const priceRuleData = [
            {
              id: "price-rule-company_id-EUR",
              price_set_id: "price-set-EUR",
              attribute: "company_id",
              value: "EUR",
              price_list_id: "test",
              price_id: "price-company_id-EUR",
            },
            {
              id: "price-rule-company_id-PLN",
              price_set_id: "price-set-PLN",
              attribute: "company_id",
              value: "medusa-company-id",
              price_list_id: "test",
              price_id: "price-company_id-PLN",
            },
            {
              id: "price-rule-region_id-PLN",
              price_set_id: "price-set-PLN",
              attribute: "region_id",
              value: "PL",
              price_list_id: "test",
              price_id: "price-region_id-PLN",
            },
            {
              id: "price-rule-region_id+company_id-PL",
              price_set_id: "price-set-PLN",
              attribute: "region_id",
              value: "PL",
              price_list_id: "test",
              price_id: "price-region_id+company_id-PLN",
            },
            {
              id: "price-rule-region_id+company_id-medusa-company-id",
              price_set_id: "price-set-PLN",
              attribute: "company_id",
              value: "medusa-company-id",
              price_list_id: "test",
              price_id: "price-region_id+company_id-PLN",
            },
            {
              id: "price-rule-region_id-PLN-5-qty",
              price_set_id: "price-set-PLN",
              attribute: "region_id",
              value: "PL",
              price_list_id: "test",
              price_id: "price-region_id-PLN-5-qty",
            },
            {
              id: "price-rule-region_id-company_id-PL",
              price_set_id: "price-set-PLN",
              attribute: "region_id",
              value: "PL",
              price_list_id: "test",
              price_id: "price-region_id_company_id-PL-EUR",
            },
            {
              id: "price-rule-region_id-company_id-PLN",
              price_set_id: "price-set-PLN",
              attribute: "company_id",
              value: "medusa-company-id",
              price_list_id: "test",
              price_id: "price-region_id_company_id-PL-EUR",
            },
            {
              id: "price-rule-region_id-company_id-PL-4-qty",
              price_set_id: "price-set-PLN",
              attribute: "region_id",
              value: "PL",
              price_list_id: "test",
              price_id: "price-region_id_company_id-PL-EUR-4-qty",
            },
            {
              id: "price-rule-region_id-company_id-PLN-4-qty",
              price_set_id: "price-set-PLN",
              attribute: "company_id",
              value: "medusa-company-id",
              price_list_id: "test",
              price_id: "price-region_id_company_id-PL-EUR-4-qty",
            },
            {
              id: "price-rule-region_id-currency_customer_group_code-PL",
              price_set_id: "price-set-PLN",
              attribute: "region_id",
              value: "PL",
              price_list_id: "test",
              price_id: "price-region_id_company_id-PL-EUR-customer-group",
            },
            {
              id: "price-rule-region_id-currency_customer_group_code-PLN",
              price_set_id: "price-set-PLN",
              attribute: "company_id",
              value: "medusa-company-id",
              price_list_id: "test",
              price_id: "price-region_id_company_id-PL-EUR-customer-group",
            },
            {
              id: "price-rule-region_id-currency_customer_group_code-test_customer_group",
              price_set_id: "price-set-PLN",
              attribute: "customer_group_id",
              value: "test-customer-group",
              price_list_id: "test",
              price_id: "price-region_id_company_id-PL-EUR-customer-group",
            },
          ] as unknown as CreatePriceRuleDTO[]

          await seedPriceData(MikroOrmWrapper.forkManager(), {
            priceSetsData,
            pricesData,
            priceRuleData,
          })
        })

        it("should throw an error when currency code is not set", async () => {
          let result = service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {}
          )

          await expect(result).rejects.toThrow(
            "Method calculatePrices requires currency_code in the pricing context"
          )

          result = service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            { context: { region_id: "DE" } }
          )

          await expect(result).rejects.toThrow(
            "Method calculatePrices requires currency_code in the pricing context"
          )
        })

        it("should return filled prices when 1 context is present and price is setup for PLN", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: { currency_code: "PLN" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-EUR",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: 1000,
              is_original_price_price_list: false,
              original_amount: 1000,
              currency_code: "PLN",
              calculated_price: {
                id: "price-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 10,
              },
              original_price: {
                id: "price-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 10,
              },
            },
          ])
        })

        it("should return filled prices when 1 context is present and price is setup for PLN region_id", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: { currency_code: "PLN", region_id: "PL" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-EUR",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: 300,
              is_original_price_price_list: false,
              original_amount: 300,
              currency_code: "PLN",
              calculated_price: {
                id: "price-region_id-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 4,
              },
              original_price: {
                id: "price-region_id-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 4,
              },
            },
          ])
        })

        it("should return filled prices when 1 context is present and price is setup for PLN currency_code", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: { currency_code: "PLN" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-EUR",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: 1000,
              is_original_price_price_list: false,
              original_amount: 1000,
              currency_code: "PLN",
              calculated_price: {
                id: "price-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 10,
              },
              original_price: {
                id: "price-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 10,
              },
            },
          ])
        })

        it("should return null prices when 1 context is present and price is NOT setup", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: { currency_code: "EUR", does_not_exist: "EUR" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-EUR",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
          ])
        })

        it("should return filled prices when 2 contexts are present and price is setup", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: { currency_code: "PLN", region_id: "PL" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-EUR",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: 300,
              is_original_price_price_list: false,
              original_amount: 300,
              currency_code: "PLN",
              calculated_price: {
                id: "price-region_id-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 4,
              },
              original_price: {
                id: "price-region_id-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 4,
              },
            },
          ])
        })

        it("should return filled prices when 2 contexts are present and price is not setup", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: { currency_code: "PLN", company_id: "doesnotexist" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-EUR",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: 1000,
              is_original_price_price_list: false,
              original_amount: 1000,
              currency_code: "PLN",
              calculated_price: {
                id: "price-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 10,
              },
              original_price: {
                id: "price-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 10,
              },
            },
          ])
        })

        it("should return filled prices when 2 contexts are present and price is setup along with declaring quantity", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-PLN"] },
            {
              context: { currency_code: "PLN", region_id: "PL", quantity: 5 },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: 250,
              is_original_price_price_list: false,
              original_amount: 250,
              currency_code: "PLN",
              calculated_price: {
                id: "price-region_id-PLN-5-qty",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 4,
                max_quantity: 10,
              },
              original_price: {
                id: "price-region_id-PLN-5-qty",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 4,
                max_quantity: 10,
              },
            },
          ])
        })

        it("should return filled prices when 3 contexts are present and price is partially setup for 2", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: {
                currency_code: "PLN",
                region_id: "PL",
                customer_group_id: "test-customer-group",
                company_id: "does-not-exist",
              },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-EUR",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: 300,
              is_original_price_price_list: false,
              original_amount: 300,
              currency_code: "PLN",
              calculated_price: {
                id: "price-region_id-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 4,
              },
              original_price: {
                id: "price-region_id-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 4,
              },
            },
          ])
        })

        it("should return filled prices when 3 contexts are present and price is setup for 3", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: {
                currency_code: "EUR",
                region_id: "PL",
                customer_group_id: "test-customer-group",
                company_id: "medusa-company-id",
              },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-EUR",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
            // Currency Code + Region value + customer group id
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: 100,
              is_original_price_price_list: false,
              original_amount: 100,
              currency_code: "EUR",
              calculated_price: {
                id: "price-region_id_company_id-PL-EUR-customer-group",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 3,
              },
              original_price: {
                id: "price-region_id_company_id-PL-EUR-customer-group",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 3,
              },
            },
          ])
        })

        it("should return filled prices when 3 contexts are present and price is setup for 3, but value is incorrect for 2. It falls back to 1 rule context when 1 rule is not setup", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: {
                currency_code: "PLN",
                region_id: "PL",
                customer_group_id: "does-not-exist",
                company_id: "does-not-exist",
              },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-EUR",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
            // PLN price set is not setup for EUR currency_code so it will default to a null set
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: 300,
              is_original_price_price_list: false,
              original_amount: 300,
              currency_code: "PLN",
              calculated_price: {
                id: "price-region_id-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 4,
              },
              original_price: {
                id: "price-region_id-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 4,
              },
            },
          ])
        })

        it("should return filled prices when 3 contexts are present and price is setup for 3, but value is incorrect for 2. It falls back to default value", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: {
                currency_code: "PLN",
                region_id: "does-not-exist",
                customer_group_id: "does-not-exist",
                company_id: "does-not-exist",
              },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-EUR",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
            // PLN price set is not setup for EUR currency_code so it will default to a null set
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: 1000,
              is_original_price_price_list: false,
              original_amount: 1000,
              currency_code: "PLN",
              calculated_price: {
                id: "price-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 10,
              },
              original_price: {
                id: "price-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 10,
              },
            },
          ])
        })

        it("should return null prices when 2 context is present and prices are NOT setup", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: { currency_code: "EUR", does_not_exist_2: "Berlin" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-EUR",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
          ])
        })

        it("should return filled prices when 2 context is present and prices are setup, but only for one of the contexts", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: {
                currency_code: "PLN",
                region_id: "PL",
                city: "Berlin",
              },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-EUR",
              is_calculated_price_price_list: false,
              calculated_amount: null,
              is_original_price_price_list: false,
              original_amount: null,
              currency_code: null,
              calculated_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: null,
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              calculated_amount: 300,
              is_original_price_price_list: false,
              original_amount: 300,
              currency_code: "PLN",
              calculated_price: {
                id: "price-region_id-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 4,
              },
              original_price: {
                id: "price-region_id-PLN",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 4,
              },
            },
          ])
        })

        describe.only("Price Lists", () => {
          it("should return price list prices when price list conditions match", async () => {
            await createPriceLists(service)

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "PLN",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: false,
                calculated_amount: null,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: null,
                calculated_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                calculated_amount: 232,
                is_original_price_price_list: false,
                original_amount: 400,
                currency_code: "PLN",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: expect.any(String),
                  price_list_type: "sale",
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: expect.any(String),
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 5,
                },
              },
            ])
          })

          it("should return best price list price first when price list conditions match", async () => {
            await createPriceLists(service)
            await createPriceLists(
              service,
              {},
              {},
              defaultPriceListPrices.map((price) => {
                return { ...price, amount: price.amount / 2 }
              })
            )

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "PLN",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: false,
                calculated_amount: null,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: null,
                calculated_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                calculated_amount: 116,
                is_original_price_price_list: false,
                original_amount: 400,
                currency_code: "PLN",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: expect.any(String),
                  price_list_type: "sale",
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: expect.any(String),
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 5,
                },
              },
            ])
          })

          it("should return price list prices when price list dont have rules, but context is loaded", async () => {
            await createPriceLists(service, {}, {})

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "PLN",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: false,
                calculated_amount: null,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: null,
                calculated_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                calculated_amount: 232,
                is_original_price_price_list: false,
                original_amount: 400,
                currency_code: "PLN",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: expect.any(String),
                  price_list_type: "sale",
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: expect.any(String),
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 5,
                },
              },
            ])
          })

          it("should return price list prices when price list dont have any rules", async () => {
            await createPriceLists(service, {}, {})

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "PLN",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: false,
                calculated_amount: null,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: null,
                calculated_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                calculated_amount: 232,
                is_original_price_price_list: false,
                original_amount: 1000,
                currency_code: "PLN",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: expect.any(String),
                  price_list_type: "sale",
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: expect.any(String),
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 10,
                },
              },
            ])
          })

          it("should return price list prices when price list conditions match for override", async () => {
            await createPriceLists(service, { type: PriceListType.OVERRIDE })

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "PLN",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: false,
                calculated_amount: null,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: null,
                calculated_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                calculated_amount: 232,
                is_original_price_price_list: true,
                original_amount: 232,
                currency_code: "PLN",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: expect.any(String),
                  price_list_type: "override",
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: expect.any(String),
                  price_list_id: expect.any(String),
                  price_list_type: "override",
                  min_quantity: null,
                  max_quantity: null,
                },
              },
            ])
          })

          it("should not return price list prices when price list conditions only partially match", async () => {
            await createPriceLists(service)
            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "PLN",
                  region_id: "PL",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "does-not-exist",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: false,
                calculated_amount: null,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: null,
                calculated_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: false,
                calculated_amount: 300,
                is_original_price_price_list: false,
                original_amount: 300,
                currency_code: "PLN",
                calculated_price: {
                  id: "price-region_id-PLN",
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 4,
                },
                original_price: {
                  id: "price-region_id-PLN",
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 4,
                },
              },
            ])
          })

          it("should not return price list prices when price list conditions dont match", async () => {
            await createPriceLists(service)
            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "PLN",
                  region_id: "PL",
                  customer_group_id: "does-not-exist",
                  company_id: "does-not-exist",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: false,
                calculated_amount: null,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: null,
                calculated_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: false,
                calculated_amount: 300,
                is_original_price_price_list: false,
                original_amount: 300,
                currency_code: "PLN",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 4,
                },
                original_price: {
                  id: expect.any(String),
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 4,
                },
              },
            ])
          })

          it("should return price list prices for pricelist with valid pricing interval", async () => {
            const yesterday = ((today) =>
              new Date(today.setDate(today.getDate() - 1)))(new Date())
            const tomorrow = ((today) =>
              new Date(today.setDate(today.getDate() + 1)))(new Date())

            await createPriceLists(
              service,
              {
                starts_at: yesterday,
                ends_at: tomorrow,
              },
              {}
            )

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "PLN",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: false,
                calculated_amount: null,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: null,
                calculated_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                calculated_amount: 232,
                is_original_price_price_list: false,
                original_amount: 400,
                currency_code: "PLN",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: expect.any(String),
                  price_list_type: "sale",
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: expect.any(String),
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 5,
                },
              },
            ])
          })

          it("should not return price list prices for upcoming pricelist", async () => {
            const tomorrow = ((today) =>
              new Date(today.setDate(today.getDate() + 1)))(new Date())

            const tenDaysFromToday = ((today) =>
              new Date(today.setDate(today.getDate() + 10)))(new Date())

            await createPriceLists(
              service,
              {
                starts_at: tomorrow,
                ends_at: tenDaysFromToday,
              },
              {}
            )

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "PLN",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: false,
                calculated_amount: null,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: null,
                calculated_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: false,
                calculated_amount: 400,
                is_original_price_price_list: false,
                original_amount: 400,
                currency_code: "PLN",
                calculated_price: {
                  id: "price-company_id-PLN",
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 5,
                },
                original_price: {
                  id: "price-company_id-PLN",
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 5,
                },
              },
            ])
          })

          it("should not return price list prices for expired pricelist", async () => {
            const yesterday = ((today) =>
              new Date(today.setDate(today.getDate() - 1)))(new Date())
            const tenDaysAgo = ((today) =>
              new Date(today.setDate(today.getDate() - 10)))(new Date())

            await createPriceLists(
              service,
              {
                starts_at: tenDaysAgo,
                ends_at: yesterday,
              },
              {}
            )

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "PLN",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: false,
                calculated_amount: null,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: null,
                calculated_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: false,
                calculated_amount: 400,
                is_original_price_price_list: false,
                original_amount: 400,
                currency_code: "PLN",
                calculated_price: {
                  id: "price-company_id-PLN",
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 5,
                },
                original_price: {
                  id: "price-company_id-PLN",
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 5,
                },
              },
            ])
          })

          it("should return price list prices for price list with customer groupst", async () => {
            const [{ id }] = await createPriceLists(
              service,
              {},
              {
                customer_group_id: [
                  "vip-customer-group-id",
                  "vip-customer-group-id-1",
                ],
              },
              [
                {
                  amount: 200,
                  currency_code: "EUR",
                  price_set_id: "price-set-EUR",
                },
              ]
            )

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR"] },
              {
                context: {
                  currency_code: "EUR",
                  customer_group_id: "vip-customer-group-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: true,
                calculated_amount: 200,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: "EUR",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: id,
                  price_list_type: "sale",
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
            ])
          })

          it("should return price list prices when price list conditions match within prices", async () => {
            await createPriceLists(service, {}, { region_id: ["DE", "PL"] }, [
              ...defaultPriceListPrices,
              {
                amount: 111,
                currency_code: "PLN",
                price_set_id: "price-set-PLN",
                rules: {
                  region_id: "DE",
                },
              },
            ])

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "PLN",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: false,
                calculated_amount: null,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: null,
                calculated_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                calculated_amount: 111,
                is_original_price_price_list: false,
                original_amount: 400,
                currency_code: "PLN",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: expect.any(String),
                  price_list_type: "sale",
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: expect.any(String),
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 5,
                },
              },
            ])
          })

          it("should not return price list prices when price list conditions are met but price rules are not", async () => {
            await createPriceLists(service, {}, { region_id: ["DE", "PL"] }, [
              ...defaultPriceListPrices,
              {
                amount: 111,
                currency_code: "PLN",
                price_set_id: "price-set-PLN",
                rules: {
                  region_id: "PL",
                },
              },
            ])

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "PLN",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: false,
                calculated_amount: null,
                is_original_price_price_list: false,
                original_amount: null,
                currency_code: null,
                calculated_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: null,
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: null,
                  max_quantity: null,
                },
              },
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                calculated_amount: 232,
                is_original_price_price_list: false,
                original_amount: 400,
                currency_code: "PLN",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: expect.any(String),
                  price_list_type: "sale",
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: expect.any(String),
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 5,
                },
              },
            ])
          })
        })
      })
    })
  },
})
