import {
  CreatePriceRuleDTO,
  CreatePriceSetDTO,
  IPricingModuleService,
  PricingTypes,
} from "@medusajs/framework/types"
import {
  Modules,
  PriceListStatus,
  PriceListType,
} from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { withOperator } from "../../../__fixtures__/price-rule"
import { seedPriceData } from "../../../__fixtures__/seed-price-data"

jest.setTimeout(30000)

const defaultRules = {
  customer_group_id: ["vip-customer-group-id", "another-vip-customer-group-id"],
  region_id: ["DE", "DK"],
}

const defaultPriceListPrices: PricingTypes.CreatePriceListPriceDTO[] = [
  {
    amount: 232,
    currency_code: "pln",
    price_set_id: "price-set-PLN",
  },
  {
    amount: 455,
    currency_code: "eur",
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
            { id: "price-set-ETH" },
          ] as unknown as CreatePriceSetDTO[]

          const pricesData = [
            {
              id: "price-PLN",
              title: "price PLN",
              price_set_id: "price-set-PLN",
              currency_code: "pln",
              amount: 1000,
              min_quantity: 1,
              max_quantity: 10,
              rules_count: 0,
            },
            {
              id: "price-PLN-min-quantity-only",
              title: "price PLN - min quantity only",
              price_set_id: "price-set-PLN",
              currency_code: "pln",
              amount: 1250,
              min_quantity: 20,
              max_quantity: null,
              rules_count: 0,
            },
            {
              id: "price-ETH",
              title: "price ETH",
              price_set_id: "price-set-ETH",
              currency_code: "eth",
              amount: {
                value: "12345678988754.00000010000000085",
              },
              min_quantity: 1,
              max_quantity: 10,
              rules_count: 0,
            },
            {
              id: "price-company_id-EUR",
              title: "price EUR - company_id",
              price_set_id: "price-set-EUR",
              currency_code: "eur",
              amount: 500,
              min_quantity: 1,
              max_quantity: 10,
              rules_count: 1,
            },
            {
              id: "price-company_id-PLN",
              title: "price PLN - company_id",
              price_set_id: "price-set-PLN",
              currency_code: "pln",
              amount: 400,
              min_quantity: 1,
              max_quantity: 5,
              rules_count: 1,
            },
            {
              id: "price-region_id-PLN",
              title: "price PLN - region_id",
              price_set_id: "price-set-PLN",
              currency_code: "pln",
              amount: 300,
              min_quantity: 1,
              max_quantity: 4,
              rules_count: 1,
            },
            {
              id: "price-region_id+company_id-PLN",
              title: "price region_id + company_id",
              price_set_id: "price-set-PLN",
              currency_code: "pln",
              amount: 999,
              min_quantity: 1,
              max_quantity: 10,
              rules_count: 2,
            },
            {
              id: "price-region_id-PLN-5-qty",
              title: "price PLN - region_id 5 qty",
              price_set_id: "price-set-PLN",
              currency_code: "pln",
              amount: 250,
              min_quantity: 4,
              max_quantity: 10,
              rules_count: 1,
            },
            {
              id: "price-region_id_company_id-PL-EUR",
              title: "price PLN - region_id PL with EUR currency",
              price_set_id: "price-set-PLN",
              currency_code: "eur",
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
              currency_code: "eur",
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
              currency_code: "eur",
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

        it("should successfully calculate prices with complex context", async () => {
          const context = {
            id: "cart_01JRDH08QD8CZ0KJDVE410KM1J",
            currency_code: "pln",
            email: "tony@stark-industries.com",
            region_id: "reg_01JRDH08ENY3276P6133BVXGWJ",
            created_at: "2025-04-09T14:59:24.526Z",
            updated_at: "2025-04-09T14:59:24.526Z",
            completed_at: null,
            total: 1500,
            subtotal: 1428.5714285714287,
            tax_total: 71.42857142857143,
            discount_total: 0,
            discount_subtotal: 0,
            discount_tax_total: 0,
            original_total: 1500,
            original_tax_total: 71.42857142857143,
            item_total: 1500,
            item_subtotal: 1428.5714285714287,
            item_tax_total: 71.42857142857143,
            original_item_total: 1500,
            original_item_subtotal: 1428.5714285714287,
            original_item_tax_total: 71.42857142857143,
            shipping_total: 0,
            shipping_subtotal: 0,
            shipping_tax_total: 0,
            original_shipping_tax_total: 0,
            original_shipping_subtotal: 0,
            original_shipping_total: 0,
            credit_line_subtotal: 0,
            credit_line_tax_total: 0,
            credit_line_total: 0,
            metadata: null,
            sales_channel_id: "sc_01JRDH08KWX1AR5SB0A3THWWQQ",
            shipping_address_id: "caaddr_01JRDH08QDXHV9SJXKHT04TXK0",
            customer_id: "cus_01JRDH08ATYB5AMFEZDTWCQWNK",
            items: [
              {
                id: "cali_01JRDH08QDQH3CB1DE4S79HREC",
                thumbnail: null,
                variant_id: "variant_01JRDH08GJCZQB4GZCDDTYMD1V",
                product_id: "prod_01JRDH08FPZ6QBZQ096B310RM7",
                product_type_id: null,
                product_title: "Medusa T-Shirt",
                product_description: null,
                product_subtitle: null,
                product_type: null,
                product_collection: null,
                product_handle: "t-shirt",
                variant_sku: "SHIRT-S-BLACK",
                variant_barcode: null,
                variant_title: "S / Black",
                requires_shipping: true,
                metadata: {},
                created_at: "2025-04-09T14:59:24.526Z",
                updated_at: "2025-04-09T14:59:24.526Z",
                title: "S / Black",
                quantity: 1,
                unit_price: 1500,
                compare_at_unit_price: null,
                is_tax_inclusive: true,
                tax_lines: [
                  {
                    id: "calitxl_01JRDH08RJEQ4WXXDTJYWV7B4M",
                    description: "CA Default Rate",
                    code: "CADEFAULT",
                    rate: 5,
                    provider_id: "system",
                  },
                ],
                adjustments: [],
                product: {
                  id: "prod_01JRDH08FPZ6QBZQ096B310RM7",
                  collection_id: null,
                  type_id: null,
                  categories: [],
                  tags: [],
                },
              },
            ],
            shipping_methods: [],
            shipping_address: {
              id: "caaddr_01JRDH08QDXHV9SJXKHT04TXK0",
              first_name: null,
              last_name: null,
              company: null,
              address_1: "test address 1",
              address_2: "test address 2",
              city: "SF",
              postal_code: "94016",
              country_code: "US",
              province: "CA",
              phone: null,
            },
            billing_address: null,
            credit_lines: [],
            customer: {
              id: "cus_01JRDH08ATYB5AMFEZDTWCQWNK",
              email: "tony@stark-industries.com",
              groups: [],
            },
            region: {
              id: "reg_01JRDH08ENY3276P6133BVXGWJ",
              name: "US",
              currency_code: "usd",
              automatic_taxes: true,
              countries: [
                {
                  iso_2: "us",
                  iso_3: "usa",
                  num_code: "840",
                  name: "UNITED STATES",
                  display_name: "United States",
                  region_id: "reg_01JRDH08ENY3276P6133BVXGWJ",
                  metadata: null,
                  created_at: "2025-04-09T14:59:20.275Z",
                  updated_at: "2025-04-09T14:59:24.250Z",
                  deleted_at: null,
                },
              ],
            },
            promotions: [],
          }

          const calculatedPrice = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            { context: context as any }
          )

          expect(calculatedPrice).toEqual([
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 1000,
              raw_calculated_amount: {
                value: "1000",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 1000,
              raw_original_amount: {
                value: "1000",
                precision: 20,
              },
              currency_code: "pln",
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

        it("should successfully calculate prices where only min quantity is set", async () => {
          const context = {
            currency_code: "pln",
            region_id: "PL",
            quantity: 255,
          }

          const calculatedPrice = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            { context }
          )

          expect(calculatedPrice).toEqual([
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 1250,
              raw_calculated_amount: {
                value: "1250",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 1250,
              raw_original_amount: {
                value: "1250",
                precision: 20,
              },
              currency_code: "pln",
              calculated_price: {
                id: "price-PLN-min-quantity-only",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 20,
                max_quantity: null,
              },
              original_price: {
                id: "price-PLN-min-quantity-only",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 20,
                max_quantity: null,
              },
            },
          ])
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

        it("calculating prices when listing price sets should return null when there are no prices", async () => {
          const [newSet] = await service.createPriceSets([{}])
          const calculatePricesResult = await service.calculatePrices(
            { id: [newSet.id] },
            { context: { currency_code: "pln" } }
          )

          const priceSetsResult = await service.listPriceSets(
            {
              id: [newSet.id],
              context: { currency_code: "pln" },
            },
            { relations: ["calculated_price"] }
          )

          expect(calculatePricesResult).toEqual([])
          expect(priceSetsResult[0].calculated_price).toEqual(null)
        })

        it("should return filled prices when 1 context is present and price is setup for PLN", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: { currency_code: "pln" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 1000,
              raw_calculated_amount: {
                value: "1000",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 1000,
              raw_original_amount: {
                value: "1000",
                precision: 20,
              },
              currency_code: "pln",
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

        it("should return filled prices when 1 context is present and price is setup for ETH", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-ETH"] },
            {
              context: { currency_code: "eth" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-ETH",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 12345678988754.000000100000001,
              raw_calculated_amount: {
                value: "12345678988754.00000010000000085",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 12345678988754.000000100000001,
              raw_original_amount: {
                value: "12345678988754.00000010000000085",
                precision: 20,
              },
              currency_code: "eth",
              calculated_price: {
                id: "price-ETH",
                price_list_id: null,
                price_list_type: null,
                min_quantity: 1,
                max_quantity: 10,
              },
              original_price: {
                id: "price-ETH",
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
              context: { currency_code: "pln", region_id: "PL" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 300,
              raw_calculated_amount: {
                value: "300",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 300,
              raw_original_amount: {
                value: "300",
                precision: 20,
              },
              currency_code: "pln",
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
              context: { currency_code: "pln" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 1000,
              raw_calculated_amount: {
                value: "1000",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 1000,
              raw_original_amount: {
                value: "1000",
                precision: 20,
              },
              currency_code: "pln",
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
              context: { currency_code: "eur", does_not_exist: "EUR" },
            }
          )

          expect(priceSetsResult).toEqual([])
        })

        it("should return filled prices when 2 contexts are present and price is setup", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: { currency_code: "pln", region_id: "PL" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 300,
              raw_calculated_amount: {
                value: "300",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 300,
              raw_original_amount: {
                value: "300",
                precision: 20,
              },
              currency_code: "pln",
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
              context: { currency_code: "pln", company_id: "doesnotexist" },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 1000,
              raw_calculated_amount: {
                value: "1000",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 1000,
              raw_original_amount: {
                value: "1000",
                precision: 20,
              },
              currency_code: "pln",
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
              context: { currency_code: "pln", region_id: "PL", quantity: 5 },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 250,
              raw_calculated_amount: {
                value: "250",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 250,
              raw_original_amount: {
                value: "250",
                precision: 20,
              },
              currency_code: "pln",
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
                currency_code: "pln",
                region_id: "PL",
                customer_group_id: "test-customer-group",
                company_id: "does-not-exist",
              },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 300,
              raw_calculated_amount: {
                value: "300",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 300,
              raw_original_amount: {
                value: "300",
                precision: 20,
              },
              currency_code: "pln",
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
                currency_code: "eur",
                region_id: "PL",
                customer_group_id: "test-customer-group",
                company_id: "medusa-company-id",
              },
            }
          )

          expect(priceSetsResult).toEqual([
            // Currency Code + Region value + customer group id
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 100,
              raw_calculated_amount: {
                value: "100",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 100,
              raw_original_amount: {
                value: "100",
                precision: 20,
              },
              currency_code: "eur",
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
                currency_code: "pln",
                region_id: "PL",
                customer_group_id: "does-not-exist",
                company_id: "does-not-exist",
              },
            }
          )

          expect(priceSetsResult).toEqual([
            // PLN price set is not setup for EUR currency_code so it will default to a null set
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 300,
              raw_calculated_amount: {
                value: "300",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 300,
              raw_original_amount: {
                value: "300",
                precision: 20,
              },
              currency_code: "pln",
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
                currency_code: "pln",
                region_id: "does-not-exist",
                customer_group_id: "does-not-exist",
                company_id: "does-not-exist",
              },
            }
          )

          expect(priceSetsResult).toEqual([
            // PLN price set is not setup for EUR currency_code so it will default to a null set
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 1000,
              raw_calculated_amount: {
                value: "1000",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 1000,
              raw_original_amount: {
                value: "1000",
                precision: 20,
              },
              currency_code: "pln",
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
              context: { currency_code: "eur", does_not_exist_2: "Berlin" },
            }
          )

          expect(priceSetsResult).toEqual([])
        })

        it("should return filled prices when 2 context is present and prices are setup, but only for one of the contexts", async () => {
          const priceSetsResult = await service.calculatePrices(
            { id: ["price-set-EUR", "price-set-PLN"] },
            {
              context: {
                currency_code: "pln",
                region_id: "PL",
                city: "Berlin",
              },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: "price-set-PLN",
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 300,
              raw_calculated_amount: {
                value: "300",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 300,
              raw_original_amount: {
                value: "300",
                precision: 20,
              },
              currency_code: "pln",
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

        it("should return a price of 0", async () => {
          const priceSet = await service.createPriceSets({
            prices: [
              {
                amount: 0,
                currency_code: "usd",
              },
            ],
          })

          const priceSetsResult = await service.calculatePrices(
            { id: [priceSet.id] },
            {
              context: {
                currency_code: "usd",
              },
            }
          )

          expect(priceSetsResult).toEqual([
            {
              id: priceSet.id,
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 0,
              raw_calculated_amount: {
                value: "0",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 0,
              raw_original_amount: {
                value: "0",
                precision: 20,
              },
              currency_code: "usd",
              calculated_price: {
                id: expect.any(String),
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
              original_price: {
                id: expect.any(String),
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            },
          ])
        })

        describe("Price Lists", () => {
          it("should return price list prices when price list conditions match", async () => {
            await createPriceLists(service)

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "pln",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 232,
                raw_calculated_amount: {
                  value: "232",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 400,
                raw_original_amount: {
                  value: "400",
                  precision: 20,
                },
                currency_code: "pln",
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

          it("should return cheapest price list price first when price list conditions match", async () => {
            await createPriceLists(
              service,
              {
                title: "Test Price List One",
                description: "test description",
                type: PriceListType.OVERRIDE,
                status: PriceListStatus.ACTIVE,
              },
              {},
              defaultPriceListPrices
            )

            await createPriceLists(
              service,
              {
                title: "Test Price List Two",
                description: "test description",
                type: PriceListType.OVERRIDE,
                status: PriceListStatus.ACTIVE,
              },
              {},
              defaultPriceListPrices.map((price) => {
                return { ...price, amount: price.amount / 2 }
              })
            )

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-PLN"] },
              {
                context: {
                  currency_code: "pln",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 116,
                raw_calculated_amount: {
                  value: "116",
                  precision: 20,
                },
                is_original_price_price_list: true,
                is_original_price_tax_inclusive: false,
                original_amount: 116,
                raw_original_amount: {
                  value: "116",
                  precision: 20,
                },
                currency_code: "pln",
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

          it("should return price list prices when price list dont have rules, but context is loaded", async () => {
            await createPriceLists(service, {}, {})

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "pln",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 232,
                raw_calculated_amount: {
                  value: "232",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 400,
                raw_original_amount: {
                  value: "400",
                  precision: 20,
                },
                currency_code: "pln",
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
                  currency_code: "pln",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 232,
                raw_calculated_amount: {
                  value: "232",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 1000,
                raw_original_amount: {
                  value: "1000",
                  precision: 20,
                },
                currency_code: "pln",
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

          it("should return default prices when the price list price is higher than the default price when the price list is of type SALE", async () => {
            await createPriceLists(service, undefined, undefined, [
              {
                amount: 2500,
                currency_code: "pln",
                price_set_id: "price-set-PLN",
              },
              {
                amount: 2500,
                currency_code: "eur",
                price_set_id: "price-set-EUR",
              },
            ])

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "pln",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: false,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 1000,
                raw_calculated_amount: {
                  value: "1000",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 1000,
                raw_original_amount: {
                  value: "1000",
                  precision: 20,
                },
                currency_code: "pln",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: null,
                  price_list_type: null,
                  min_quantity: 1,
                  max_quantity: 10,
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

          it("should return price list prices even if the price list price is higher than the default price when the price list is of type OVERRIDE", async () => {
            await createPriceLists(
              service,
              { type: PriceListType.OVERRIDE },
              {},
              [
                {
                  amount: 2500,
                  currency_code: "pln",
                  price_set_id: "price-set-PLN",
                },
                {
                  amount: 2500,
                  currency_code: "eur",
                  price_set_id: "price-set-EUR",
                },
              ]
            )

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "pln",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 2500,
                raw_calculated_amount: {
                  value: "2500",
                  precision: 20,
                },
                is_original_price_price_list: true,
                is_original_price_tax_inclusive: false,
                original_amount: 2500,
                raw_original_amount: {
                  value: "2500",
                  precision: 20,
                },
                currency_code: "pln",
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

          it("should return price list prices when price list conditions match for override", async () => {
            await createPriceLists(service, { type: PriceListType.OVERRIDE })

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "pln",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 232,
                raw_calculated_amount: {
                  value: "232",
                  precision: 20,
                },
                is_original_price_price_list: true,
                is_original_price_tax_inclusive: false,
                original_amount: 232,
                raw_original_amount: {
                  value: "232",
                  precision: 20,
                },
                currency_code: "pln",
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
                  currency_code: "pln",
                  region_id: "PL",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "does-not-exist",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: false,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 300,
                raw_calculated_amount: {
                  value: "300",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 300,
                raw_original_amount: {
                  value: "300",
                  precision: 20,
                },
                currency_code: "pln",
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
                  currency_code: "pln",
                  region_id: "PL",
                  customer_group_id: "does-not-exist",
                  company_id: "does-not-exist",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: false,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 300,
                raw_calculated_amount: {
                  value: "300",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 300,
                raw_original_amount: {
                  value: "300",
                  precision: 20,
                },
                currency_code: "pln",
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
                  currency_code: "pln",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 232,
                raw_calculated_amount: {
                  value: "232",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 400,
                raw_original_amount: {
                  value: "400",
                  precision: 20,
                },
                currency_code: "pln",
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
                  currency_code: "pln",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: false,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 400,
                raw_calculated_amount: {
                  value: "400",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 400,
                raw_original_amount: {
                  value: "400",
                  precision: 20,
                },
                currency_code: "pln",
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
                  currency_code: "pln",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: false,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 400,
                raw_calculated_amount: {
                  value: "400",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 400,
                raw_original_amount: {
                  value: "400",
                  precision: 20,
                },
                currency_code: "pln",
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

          it("should return price list prices for price list with customer groups", async () => {
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
                  currency_code: "eur",
                  price_set_id: "price-set-EUR",
                },
              ]
            )

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR"] },
              {
                context: {
                  currency_code: "eur",
                  customer_group_id: "vip-customer-group-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: true,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 200,
                raw_calculated_amount: {
                  value: "200",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: null,
                raw_original_amount: null,
                currency_code: "eur",
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
                currency_code: "pln",
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
                  currency_code: "pln",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 111,
                raw_calculated_amount: {
                  value: "111",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 400,
                raw_original_amount: {
                  value: "400",
                  precision: 20,
                },
                currency_code: "pln",
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

          it("should return price list prices for multiple price lists with customer groups", async () => {
            const [{ id }] = await createPriceLists(
              service,
              { type: "override" },
              {
                ["customer.groups.id"]: ["vip-customer-group-id"],
              },
              [
                {
                  amount: 600,
                  currency_code: "eur",
                  price_set_id: "price-set-EUR",
                },
              ]
            )

            const [{ id: idTwo }] = await createPriceLists(
              service,
              { type: "override" },
              {
                ["customer.groups.id"]: ["vip-customer-group-id-1"],
              },
              [
                {
                  amount: 400,
                  currency_code: "eur",
                  price_set_id: "price-set-EUR",
                },
              ]
            )

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-EUR"] },
              {
                context: {
                  currency_code: "eur",
                  // @ts-ignore
                  customer: {
                    groups: {
                      id: ["vip-customer-group-id", "vip-customer-group-id-1"],
                    },
                  },
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-EUR",
                is_calculated_price_price_list: true,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 400,
                raw_calculated_amount: {
                  value: "400",
                  precision: 20,
                },
                is_original_price_price_list: true,
                is_original_price_tax_inclusive: false,
                original_amount: 400,
                raw_original_amount: {
                  value: "400",
                  precision: 20,
                },
                currency_code: "eur",
                calculated_price: {
                  id: expect.any(String),
                  price_list_id: idTwo,
                  price_list_type: "override",
                  min_quantity: null,
                  max_quantity: null,
                },
                original_price: {
                  id: expect.any(String),
                  price_list_id: idTwo,
                  price_list_type: "override",
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
                currency_code: "pln",
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
                  currency_code: "pln",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 111,
                raw_calculated_amount: {
                  value: "111",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 400,
                raw_original_amount: {
                  value: "400",
                  precision: 20,
                },
                currency_code: "pln",
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
                currency_code: "pln",
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
                  currency_code: "pln",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              {
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 232,
                raw_calculated_amount: {
                  value: "232",
                  precision: 20,
                },
                is_original_price_price_list: false,
                is_original_price_tax_inclusive: false,
                original_amount: 400,
                raw_original_amount: {
                  value: "400",
                  precision: 20,
                },
                currency_code: "pln",
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

          it("should not return price list prices when price is deleted", async () => {
            const [priceList] = await createPriceLists(
              service,
              {},
              { region_id: ["DE", "PL"] },
              [
                {
                  amount: 111,
                  currency_code: "pln",
                  price_set_id: "price-set-PLN",
                  rules: {
                    region_id: "DE",
                  },
                },
              ]
            )

            const priceSetsResult1 = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "pln",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult1).toEqual([
              expect.objectContaining({
                id: "price-set-PLN",
                is_calculated_price_price_list: true,
                calculated_amount: 111,
                is_original_price_price_list: false,
                original_amount: 400,
              }),
            ])

            await service.softDeletePrices(priceList.prices.map((p) => p.id))

            const priceSetsResult2 = await service.calculatePrices(
              { id: ["price-set-EUR", "price-set-PLN"] },
              {
                context: {
                  currency_code: "pln",
                  region_id: "DE",
                  customer_group_id: "vip-customer-group-id",
                  company_id: "medusa-company-id",
                },
              }
            )

            expect(priceSetsResult2).toEqual([
              expect.objectContaining({
                id: "price-set-PLN",
                is_calculated_price_price_list: false,
                calculated_amount: 400,
                is_original_price_price_list: false,
                original_amount: 400,
              }),
            ])
          })
        })

        describe("Tax inclusivity", () => {
          it("should return the currency tax inclusivity for the selected price when it is not region-based", async () => {
            await (service as any).createPricePreferences([
              {
                attribute: "currency_code",
                value: "pln",
                is_tax_inclusive: true,
              },
            ])

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-PLN"] },
              {
                context: { currency_code: "pln" },
              }
            )

            expect(priceSetsResult).toEqual([
              expect.objectContaining({
                id: "price-set-PLN",
                is_calculated_price_tax_inclusive: true,
                calculated_amount: 1000,
                raw_calculated_amount: {
                  value: "1000",
                  precision: 20,
                },
                is_original_price_tax_inclusive: true,
                original_amount: 1000,
                raw_original_amount: {
                  value: "1000",
                  precision: 20,
                },
                currency_code: "pln",
              }),
            ])
          })

          it("should return the region tax inclusivity for the selected price when it is region-based", async () => {
            await (service as any).createPricePreferences([
              {
                attribute: "currency_code",
                value: "pln",
                is_tax_inclusive: false,
              },
              {
                attribute: "region_id",
                value: "PL",
                is_tax_inclusive: true,
              },
            ])

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-PLN"] },
              {
                context: { currency_code: "pln", region_id: "PL" },
              }
            )

            expect(priceSetsResult).toEqual([
              expect.objectContaining({
                id: "price-set-PLN",
                is_calculated_price_tax_inclusive: true,
                calculated_amount: 300,
                raw_calculated_amount: {
                  value: "300",
                  precision: 20,
                },
                is_original_price_tax_inclusive: true,
                original_amount: 300,
                raw_original_amount: {
                  value: "300",
                  precision: 20,
                },
                currency_code: "pln",
              }),
            ])
          })

          it("should return the region tax inclusivity for the selected price when there are multiple region preferences", async () => {
            await (service as any).createPricePreferences([
              {
                attribute: "region_id",
                value: "DE",
                is_tax_inclusive: false,
              },
              {
                attribute: "region_id",
                value: "PL",
                is_tax_inclusive: true,
              },
            ])

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-PLN"] },
              {
                context: { currency_code: "pln", region_id: "PL" },
              }
            )

            expect(priceSetsResult).toEqual([
              expect.objectContaining({
                id: "price-set-PLN",
                is_calculated_price_tax_inclusive: true,
                calculated_amount: 300,
                raw_calculated_amount: {
                  value: "300",
                  precision: 20,
                },
                is_original_price_tax_inclusive: true,
                original_amount: 300,
                raw_original_amount: {
                  value: "300",
                  precision: 20,
                },
                currency_code: "pln",
              }),
            ])
          })

          it("should return the appropriate tax inclusive setting for each calculated and original price", async () => {
            await createPriceLists(service, {}, {})
            await (service as any).createPricePreferences([
              {
                attribute: "currency_code",
                value: "pln",
                is_tax_inclusive: false,
              },
              {
                attribute: "region_id",
                value: "PL",
                is_tax_inclusive: true,
              },
            ])

            const priceSetsResult = await service.calculatePrices(
              { id: ["price-set-PLN"] },
              {
                context: {
                  currency_code: "pln",
                  region_id: "PL",
                },
              }
            )

            expect(priceSetsResult).toEqual([
              expect.objectContaining({
                id: "price-set-PLN",
                is_calculated_price_tax_inclusive: false,
                calculated_amount: 232,
                raw_calculated_amount: {
                  value: "232",
                  precision: 20,
                },
                is_original_price_tax_inclusive: true,
                original_amount: 300,
                raw_original_amount: {
                  value: "300",
                  precision: 20,
                },
                currency_code: "pln",
              }),
            ])
          })
        })
      })

      describe("calculatePrices", () => {
        let priceSet1

        it("should return accurate prices when using custom price rule operators", async () => {
          priceSet1 = await service.createPriceSets({
            prices: [
              {
                amount: 50,
                currency_code: "usd",
                rules: {
                  region_id: "de",
                  total: withOperator("between", 300, 400),
                },
              },
              {
                amount: 100,
                currency_code: "usd",
                rules: {
                  region_id: "de",
                  total: withOperator("betweenEquals", 400, 500),
                },
              },
              {
                amount: 150,
                currency_code: "usd",
                rules: {
                  region_id: "de",
                  total: withOperator("excludingMin", 500, 600),
                },
              },
              {
                amount: 200,
                currency_code: "usd",
                rules: {
                  region_id: "de",
                  total: withOperator("excludingMax", 600, 700),
                },
              },
            ],
          })

          let priceSetsResult = await service.calculatePrices(
            { id: [priceSet1.id] },
            {
              context: {
                currency_code: "usd",
                region_id: "de",
                total: 350,
              },
            }
          )

          expect(priceSetsResult).toEqual([
            expect.objectContaining({
              is_calculated_price_price_list: false,
              is_calculated_price_tax_inclusive: false,
              calculated_amount: 50,
              raw_calculated_amount: {
                value: "50",
                precision: 20,
              },
              is_original_price_price_list: false,
              is_original_price_tax_inclusive: false,
              original_amount: 50,
              raw_original_amount: {
                value: "50",
                precision: 20,
              },
              currency_code: "usd",
              calculated_price: expect.objectContaining({
                id: expect.any(String),
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              }),
              original_price: {
                id: expect.any(String),
                price_list_id: null,
                price_list_type: null,
                min_quantity: null,
                max_quantity: null,
              },
            }),
          ])

          priceSetsResult = await service.calculatePrices(
            { id: [priceSet1.id] },
            {
              context: {
                currency_code: "usd",
                region_id: "de",
                total: 300,
              },
            }
          )

          expect(priceSetsResult).toEqual([])

          priceSetsResult = await service.calculatePrices(
            { id: [priceSet1.id] },
            {
              context: {
                currency_code: "usd",
                region_id: "de",
                total: 400,
              },
            }
          )

          expect(priceSetsResult).toEqual([
            expect.objectContaining({ calculated_amount: 100 }),
          ])

          priceSetsResult = await service.calculatePrices(
            { id: [priceSet1.id] },
            {
              context: {
                currency_code: "usd",
                region_id: "de",
                total: 500,
              },
            }
          )

          expect(priceSetsResult).toEqual([
            expect.objectContaining({ calculated_amount: 100 }),
          ])

          priceSetsResult = await service.calculatePrices(
            { id: [priceSet1.id] },
            {
              context: {
                currency_code: "usd",
                region_id: "de",
                total: 501,
              },
            }
          )

          expect(priceSetsResult).toEqual([
            expect.objectContaining({ calculated_amount: 150 }),
          ])

          priceSetsResult = await service.calculatePrices(
            { id: [priceSet1.id] },
            {
              context: {
                currency_code: "usd",
                region_id: "de",
                total: 601,
              },
            }
          )

          expect(priceSetsResult).toEqual([
            expect.objectContaining({ calculated_amount: 200 }),
          ])

          priceSetsResult = await service.calculatePrices(
            { id: [priceSet1.id] },
            {
              context: {
                currency_code: "usd",
                region_id: "de",
                total: 900,
              },
            }
          )

          expect(priceSetsResult).toEqual([])
        })
      })
    })
  },
})
