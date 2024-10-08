import { expectTypeOf } from "expect-type"
import { FixtureEntryPoints } from "../__fixtures__/remote-query"
import {
  QueryGraphFunction,
  RemoteQueryFunctionReturnPagination,
} from "../remote-query"

describe("Query", () => {
  describe("Infer via queryConfig", () => {
    it("should infer return type of a known entry", async () => {
      const graph = (() => {}) as unknown as QueryGraphFunction
      const result = await graph({
        entity: "product",
        fields: ["handle", "id"],
      })

      expectTypeOf(result).toEqualTypeOf<{
        data: FixtureEntryPoints["product"][]
        metadata?: RemoteQueryFunctionReturnPagination
      }>()
    })

    it("should infer as any for an known entry", async () => {
      const graph = (() => {}) as unknown as QueryGraphFunction
      const result = await graph({
        entity: "foo",
        fields: ["handle", "id"],
      })

      expectTypeOf(result).toEqualTypeOf<{
        data: any[]
        metadata?: RemoteQueryFunctionReturnPagination
      }>()
    })
  })
})
