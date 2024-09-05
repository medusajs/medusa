import { expectTypeOf } from "expect-type"
import { RemoteQueryEntryPoints } from "../remote-query-entry-points"
import { FixtureEntryPoints, SimpleProduct } from "../__fixtures__/remote-query"
import { RemoteQueryObjectConfig } from "../remote-query-object-from-string"
import { remoteQueryObjectFromString } from "@medusajs/utils"
import {
  RemoteQueryFunction,
  RemoteQueryFunctionReturnPagination,
} from "../remote-query"

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

  describe("RemoteQueryFunction", () => {
    describe("providing a RemoteQueryObjectFromStringResult", () => {
      it("should return a non paginated result", async () => {
        const obj = remoteQueryObjectFromString({
          entryPoint: "simple_product",
          fields: ["id", "handle", ""],
        })

        const remoteQueryFunction = {} as RemoteQueryFunction

        const res = await remoteQueryFunction(obj)

        expectTypeOf<typeof res>().toEqualTypeOf<SimpleProduct[]>()
      })

      it("should return a paginated result", async () => {
        const obj = remoteQueryObjectFromString({
          entryPoint: "simple_product",
          variables: {
            skip: 1,
          },
          fields: ["id", "handle", "title"],
        })

        const remoteQueryFunction = {} as RemoteQueryFunction

        const res = await remoteQueryFunction(obj)

        type ExpectedType = {
          rows: SimpleProduct[]
          metadata: RemoteQueryFunctionReturnPagination
        }

        expectTypeOf<typeof res>().toEqualTypeOf<ExpectedType>()
      })

      it("should return any result in case of ambiguity", async () => {
        const pagination = {} as { skip?: number }

        const obj = remoteQueryObjectFromString({
          entryPoint: "simple_product",
          variables: {
            ...pagination,
          },
          fields: ["id", "handle", "title"],
        })

        const remoteQueryFunction = {} as RemoteQueryFunction

        const res = await remoteQueryFunction(obj)

        expectTypeOf<typeof res>().toEqualTypeOf<any>()
      })
    })

    describe("without providing a RemoteQueryObjectFromStringResult", () => {
      it("should return a non paginated result", async () => {
        const remoteQueryFunction = {} as RemoteQueryFunction

        const res = await remoteQueryFunction({
          entryPoint: "simple_product",
          fields: ["id", "handle", "title"],
        })

        expectTypeOf<typeof res>().toEqualTypeOf<SimpleProduct[]>()
      })

      it("should return a paginated result", async () => {
        const remoteQueryFunction = {} as RemoteQueryFunction

        const res = await remoteQueryFunction({
          entryPoint: "simple_product",
          variables: {
            skip: 1,
          },
          fields: ["id", "handle", "title"],
        })

        type ExpectedType = {
          rows: SimpleProduct[]
          metadata: RemoteQueryFunctionReturnPagination
        }

        expectTypeOf<typeof res>().toEqualTypeOf<ExpectedType>()
      })

      it("should return any result in case of ambiguity", async () => {
        const pagination = {} as { skip?: number }

        const remoteQueryFunction = {} as RemoteQueryFunction

        const res = await remoteQueryFunction({
          entryPoint: "simple_product",
          variables: {
            ...pagination,
          },
          fields: ["id", "handle", "title"],
        })

        expectTypeOf<typeof res>().toEqualTypeOf<any>()
      })
    })
  })
})
