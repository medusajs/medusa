import {
  CreatePriceRuleDTO,
  CreatePriceSetDTO,
  IPricingModuleService,
} from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { PriceSet } from "@models"

import { initialize } from "../../../../src"

import { DB_URL, MikroOrmWrapper } from "../../../utils"

import { seedPriceData } from "../../../__fixtures__/seed-price-data"

jest.setTimeout(30000)

describe("PricingModule Service - Calculate Price", () => {
  let service: IPricingModuleService
  let testManager: SqlEntityManager
  let repositoryManager: SqlEntityManager
  let data!: PriceSet[]

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    repositoryManager = MikroOrmWrapper.forkManager()
    testManager = MikroOrmWrapper.forkManager()
    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
    })
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

  describe("calculatePrices", () => {
    beforeEach(async () => {
      const currencyData = [
        {
          symbol: "zł",
          name: "Polish Zloty",
          symbol_native: "zł",
          code: "PLN",
        },
        {
          symbol: "€",
          name: "Euro",
          symbol_native: "€",
          code: "EUR",
        },
      ]

      const moneyAmountsData = [
        {
          id: "money-amount-PLN",
          currency_code: "PLN",
          amount: 1000,
          min_quantity: 1,
          max_quantity: 10,
        },
        {
          id: "money-amount-company_id-EUR",
          currency_code: "EUR",
          amount: 500,
          min_quantity: 1,
          max_quantity: 10,
        },
        {
          id: "money-amount-company_id-PLN",
          currency_code: "PLN",
          amount: 400,
          min_quantity: 1,
          max_quantity: 5,
        },
        {
          id: "money-amount-region_id-PLN",
          currency_code: "PLN",
          amount: 300,
          min_quantity: 1,
          max_quantity: 4,
        },
        {
          id: "money-amount-region_id+company_id-PLN",
          currency_code: "PLN",
          amount: 999,
          min_quantity: 1,
          max_quantity: 10,
        },
        {
          id: "money-amount-region_id-PLN-5-qty",
          currency_code: "PLN",
          amount: 250,
          min_quantity: 4,
          max_quantity: 10,
        },
        {
          id: "money-amount-region_id-PL-EUR",
          currency_code: "EUR",
          amount: 200,
          min_quantity: 1,
          max_quantity: 3,
        },
        {
          id: "money-amount-region_id-PL-EUR-4-qty",
          currency_code: "EUR",
          amount: 50,
          min_quantity: 4,
          max_quantity: 10,
        },
        {
          id: "money-amount-region_id-PL-EUR-customer-group",
          currency_code: "EUR",
          amount: 100,
          min_quantity: 1,
          max_quantity: 3,
        },
      ]

      const priceSetsData = [
        {
          id: "price-set-EUR",
        },
        {
          id: "price-set-PLN",
        },
      ] as unknown as CreatePriceSetDTO[]

      const priceSetMoneyAmountsData = [
        {
          id: "psma-PLN",
          title: "psma PLN",
          price_set: "price-set-PLN",
          money_amount: "money-amount-PLN",
          number_rules: 0,
        },
        {
          id: "psma-company_id-EUR",
          title: "psma EUR - company_id",
          price_set: "price-set-EUR",
          money_amount: "money-amount-company_id-EUR",
          number_rules: 1,
        },
        {
          id: "psma-company_id-PLN",
          title: "psma PLN - company_id",
          price_set: "price-set-PLN",
          money_amount: "money-amount-company_id-PLN",
          number_rules: 1,
        },
        {
          id: "psma-region_id-PLN",
          title: "psma PLN - region_id",
          price_set: "price-set-PLN",
          money_amount: "money-amount-region_id-PLN",
          number_rules: 1,
        },
        {
          id: "psma-region_id+company_id-PLN",
          title: "psma region_id + company_id",
          price_set: "price-set-PLN",
          money_amount: "money-amount-region_id+company_id-PLN",
          number_rules: 2,
        },
        {
          id: "psma-region_id-PLN-5-qty",
          title: "psma PLN - region_id 5 qty",
          price_set: "price-set-PLN",
          money_amount: "money-amount-region_id-PLN-5-qty",
          number_rules: 1,
        },
        {
          id: "psma-region_id_company_id-PL-EUR",
          title: "psma PLN - region_id PL with EUR currency",
          price_set: "price-set-PLN",
          money_amount: "money-amount-region_id-PL-EUR",
          number_rules: 2,
        },
        {
          id: "psma-region_id_company_id-PL-EUR-4-qty",
          title: "psma PLN - region_id PL with EUR currency for quantity 4",
          price_set: "price-set-PLN",
          money_amount: "money-amount-region_id-PL-EUR-4-qty",
          number_rules: 2,
        },
        {
          id: "psma-region_id_company_id-PL-EUR-customer-group",
          title: "psma PLN - region_id PL with EUR currency for customer group",
          price_set: "price-set-PLN",
          money_amount: "money-amount-region_id-PL-EUR-customer-group",
          number_rules: 3,
        },
      ]

      const ruleTypesData = [
        {
          id: "rule-type-company_id",
          name: "rule type company id",
          rule_attribute: "company_id",
          default_priority: 2,
        },
        {
          id: "rule-type-region_id",
          name: "rule type region id",
          rule_attribute: "region_id",
          default_priority: 1,
        },
        {
          id: "rule-type-customer_group_id",
          name: "rule type customer group id",
          rule_attribute: "customer_group_id",
          default_priority: 3,
        },
      ]

      const priceRuleData = [
        {
          id: "price-rule-company_id-EUR",
          price_set_id: "price-set-EUR",
          rule_type_id: "rule-type-company_id",
          value: "EUR",
          price_list_id: "test",
          price_set_money_amount_id: "psma-company_id-EUR",
        },
        {
          id: "price-rule-company_id-PLN",
          price_set_id: "price-set-PLN",
          rule_type_id: "rule-type-company_id",
          value: "medusa-company-id",
          price_list_id: "test",
          price_set_money_amount_id: "psma-company_id-PLN",
        },
        {
          id: "price-rule-region_id-PLN",
          price_set_id: "price-set-PLN",
          rule_type_id: "rule-type-region_id",
          value: "PL",
          price_list_id: "test",
          price_set_money_amount_id: "psma-region_id-PLN",
        },
        {
          id: "price-rule-region_id+company_id-PL",
          price_set_id: "price-set-PLN",
          rule_type_id: "rule-type-region_id",
          value: "PL",
          price_list_id: "test",
          price_set_money_amount_id: "psma-region_id+company_id-PLN",
        },
        {
          id: "price-rule-region_id+company_id-medusa-company-id",
          price_set_id: "price-set-PLN",
          rule_type_id: "rule-type-company_id",
          value: "medusa-company-id",
          price_list_id: "test",
          price_set_money_amount_id: "psma-region_id+company_id-PLN",
        },
        {
          id: "price-rule-region_id-PLN-5-qty",
          price_set_id: "price-set-PLN",
          rule_type_id: "rule-type-region_id",
          value: "PL",
          price_list_id: "test",
          price_set_money_amount_id: "psma-region_id-PLN-5-qty",
        },
        {
          id: "price-rule-region_id-company_id-PL",
          price_set_id: "price-set-PLN",
          rule_type_id: "rule-type-region_id",
          value: "PL",
          price_list_id: "test",
          price_set_money_amount_id: "psma-region_id_company_id-PL-EUR",
        },
        {
          id: "price-rule-region_id-company_id-PLN",
          price_set_id: "price-set-PLN",
          rule_type_id: "rule-type-company_id",
          value: "medusa-company-id",
          price_list_id: "test",
          price_set_money_amount_id: "psma-region_id_company_id-PL-EUR",
        },
        {
          id: "price-rule-region_id-company_id-PL-4-qty",
          price_set_id: "price-set-PLN",
          rule_type_id: "rule-type-region_id",
          value: "PL",
          price_list_id: "test",
          price_set_money_amount_id: "psma-region_id_company_id-PL-EUR-4-qty",
        },
        {
          id: "price-rule-region_id-company_id-PLN-4-qty",
          price_set_id: "price-set-PLN",
          rule_type_id: "rule-type-company_id",
          value: "medusa-company-id",
          price_list_id: "test",
          price_set_money_amount_id: "psma-region_id_company_id-PL-EUR-4-qty",
        },
        {
          id: "price-rule-region_id-currency_customer_group_code-PL",
          price_set_id: "price-set-PLN",
          rule_type_id: "rule-type-region_id",
          value: "PL",
          price_list_id: "test",
          price_set_money_amount_id:
            "psma-region_id_company_id-PL-EUR-customer-group",
        },
        {
          id: "price-rule-region_id-currency_customer_group_code-PLN",
          price_set_id: "price-set-PLN",
          rule_type_id: "rule-type-company_id",
          value: "medusa-company-id",
          price_list_id: "test",
          price_set_money_amount_id:
            "psma-region_id_company_id-PL-EUR-customer-group",
        },
        {
          id: "price-rule-region_id-currency_customer_group_code-test_customer_group",
          price_set_id: "price-set-PLN",
          rule_type_id: "rule-type-customer_group_id",
          value: "test-customer-group",
          price_list_id: "test",
          price_set_money_amount_id:
            "psma-region_id_company_id-PL-EUR-customer-group",
        },
      ] as unknown as CreatePriceRuleDTO[]

      await seedPriceData(MikroOrmWrapper.forkManager(), {
        currencyData,
        moneyAmountsData,
        priceSetsData,
        priceSetMoneyAmountsData,
        priceSetMoneyAmountRulesData: [],
        priceRuleData,
        ruleTypesData,
      })
    })

    it("should throw an error when currency code is not set", async () => {
      let result = service.calculatePrices(
        { id: ["price-set-EUR", "price-set-PLN"] },
        {}
      )

      expect(result).rejects.toThrow(
        "currency_code is a required input in the pricing context"
      )

      result = service.calculatePrices(
        { id: ["price-set-EUR", "price-set-PLN"] },
        { context: { region_id: "DE" } }
      )

      expect(result).rejects.toThrow(
        "currency_code is a required input in the pricing context"
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
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
        {
          id: "price-set-PLN",
          amount: "1000",
          currency_code: "PLN",
          min_quantity: "1",
          max_quantity: "10",
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
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
        {
          id: "price-set-PLN",
          amount: "300",
          currency_code: "PLN",
          min_quantity: "1",
          max_quantity: "4",
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
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
        {
          id: "price-set-PLN",
          amount: "1000",
          currency_code: "PLN",
          min_quantity: "1",
          max_quantity: "10",
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
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
        {
          id: "price-set-PLN",
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
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
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
        {
          id: "price-set-PLN",
          amount: "300",
          currency_code: "PLN",
          min_quantity: "1",
          max_quantity: "4",
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
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
        {
          id: "price-set-PLN",
          amount: "1000",
          currency_code: "PLN",
          min_quantity: "1",
          max_quantity: "10",
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
          amount: "250",
          currency_code: "PLN",
          min_quantity: "4",
          max_quantity: "10",
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
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
        {
          id: "price-set-PLN",
          amount: "300",
          currency_code: "PLN",
          min_quantity: "1",
          max_quantity: "4",
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
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
        // Currency Code + Region value + customer group id
        {
          id: "price-set-PLN",
          amount: "100",
          currency_code: "EUR",
          min_quantity: "1",
          max_quantity: "3",
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
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
        // PLN price set is not setup for EUR currency_code so it will default to a null set
        {
          id: "price-set-PLN",
          amount: "300",
          currency_code: "PLN",
          min_quantity: "1",
          max_quantity: "4",
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
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
        // PLN price set is not setup for EUR currency_code so it will default to a null set
        {
          id: "price-set-PLN",
          amount: "1000",
          currency_code: "PLN",
          min_quantity: "1",
          max_quantity: "10",
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
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
        {
          id: "price-set-PLN",
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
      ])
    })

    it("should return filled prices when 2 context is present and prices are setup, but only for one of the contexts", async () => {
      const priceSetsResult = await service.calculatePrices(
        { id: ["price-set-EUR", "price-set-PLN"] },
        {
          context: { currency_code: "PLN", region_id: "PL", city: "Berlin" },
        }
      )

      expect(priceSetsResult).toEqual([
        {
          id: "price-set-EUR",
          amount: null,
          currency_code: null,
          min_quantity: null,
          max_quantity: null,
        },
        {
          id: "price-set-PLN",
          amount: "300",
          currency_code: "PLN",
          min_quantity: "1",
          max_quantity: "4",
        },
      ])
    })
  })
})
