import {useQueryGraphStep} from "../use-query-graph"
import "../__fixtures__/remote-query"

describe("useQueryGraphStep", () => {
  it("should infer input and return type of a known entry", async () => {
    const test = useQueryGraphStep({
      entity: "product",
      fields: ['foo']
    })

/*    expectTypeOf<typeof test>().toEqualTypeOf<{
      entity: "product"
      fields: number[]
    }>()*/
  })
})
