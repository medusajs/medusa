import { expectTypeOf } from "expect-type"
import { FixtureEntryPoints } from "../__fixtures__/remote-query"
import { QueryGraphFunction } from "../remote-query"

describe("Query", () => {
  describe("Infer via queryConfig", () => {
    it("should infer return type of a known entry", async () => {
      const graph = (() => {}) as unknown as QueryGraphFunction
      const result = await graph({
        entryPoint: "product",
        fields: ["handle", "id"],
      })

      expectTypeOf(result).toEqualTypeOf<{
        rows: FixtureEntryPoints["product"][]
        meta?: any
      }>()
    })

    it("should infer as any for an known entry", async () => {
      const graph = (() => {}) as unknown as QueryGraphFunction
      const result = await graph({
        entryPoint: "foo",
        fields: ["handle", "id"],
      })

      expectTypeOf(result).toEqualTypeOf<{
        rows: any[]
        meta?: any
      }>()
    })
  })
})
