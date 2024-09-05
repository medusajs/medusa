import { expectTypeOf } from "expect-type"
import { RemoteQueryEntryPoints } from "../remote-query-entry-points"
import { FixtureEntryPoints } from "../__fixtures__/remote-query"
import { RemoteQueryObjectConfig } from "../remote-query-object-from-string"

describe("RemoteQuery", () => {
  describe("RemoteQueryEntryPoints", () => {
    it("should include declaration merging types with the defined entry points", () => {
      expectTypeOf<RemoteQueryEntryPoints>().toMatchTypeOf<FixtureEntryPoints>()
    })
  })

  describe("RemoteQueryObjectConfig", () => {
    it("should return the correct type for fields when using a string entry point", () => {
      type Result = RemoteQueryObjectConfig<"simple_product">["fields"]
      expectTypeOf<Result>().toEqualTypeOf<
        (
          | "*"
          | "id"
          | "handle"
          | "title"
          | "variants.id"
          | "variants.*"
          | "sales_channels.id"
          | "sales_channels.*"
          | "sales_channels.name"
          | "sales_channels_link.*"
          | "sales_channels_link.product_id"
          | "sales_channels_link.sales_channel_id"
        )[]
      >()
    })

    it("should fail return the correct type for fields when using a string entry point", () => {
      type Result = RemoteQueryObjectConfig<"simple_product">["fields"]
      expectTypeOf<Result>().toEqualTypeOf<
        // @ts-expect-error
        (
          | "*"
          | "foo"
          | "id"
          | "handle"
          | "title"
          | "variants.id"
          | "variants.*"
          | "sales_channels.id"
          | "sales_channels.*"
          | "sales_channels.name"
          | "sales_channels_link.*"
          | "sales_channels_link.product_id"
          | "sales_channels_link.sales_channel_id"
        )[]
      >()
    })
  })
})
