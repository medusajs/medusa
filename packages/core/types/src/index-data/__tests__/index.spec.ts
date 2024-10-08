import { expectTypeOf } from "expect-type"
import "../__fixtures__/index-service-entry-points"
import { IndexOperatorMap as OperatorMap } from "../index-operator-map"
import { IndexQueryConfig, OrderBy } from "../query-config"

describe("IndexQueryConfig", () => {
  it("should infer the config types properly", async () => {
    type IndexConfig = IndexQueryConfig<"product">

    expectTypeOf<IndexConfig["fields"]>().toEqualTypeOf<
      (
        | "id"
        | "title"
        | "variants.*"
        | "variants.id"
        | "variants.product_id"
        | "variants.sku"
        | "variants.prices.*"
        | "variants.prices.amount"
      )[]
    >()

    expectTypeOf<IndexConfig["filters"]>().toEqualTypeOf<
      | {
          id?: string | string[] | OperatorMap<string>
          title?: string | string[] | OperatorMap<string>
          variants?: {
            id?: string | string[] | OperatorMap<string>
            product_id?: string | string[] | OperatorMap<string>
            sku?: string | string[] | OperatorMap<string>
            prices?: {
              amount?: number | number[] | OperatorMap<number>
            }
          }
        }
      | undefined
    >()

    expectTypeOf<IndexConfig["pagination"]>().toEqualTypeOf<
      | {
          skip?: number
          take?: number
          order?: {
            id?: OrderBy
            title?: OrderBy
            variants?: {
              id?: OrderBy
              product_id?: OrderBy
              sku?: OrderBy
              prices?: {
                amount?: OrderBy
              }
            }
          }
        }
      | undefined
    >()
  })
})
