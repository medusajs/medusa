import { ObjectToRemoteQueryFields } from "../object-to-remote-query-fields"
import { expectTypeOf } from "expect-type"

describe("ObjectToRemoteQueryFields", () => {
  it("should return all the nested paths properties from an object", () => {
    type Object = {
      id: string
      title: string
      description: string
      date: Date
      variants: {
        __typename: string
        id: string
        sku: string
        title: string
      }[]
      sales_channel: {
        __typename: string
        id: string
        name: string
        value: string
      }
      metadata: Record<string, unknown>
    }

    type Paths = ObjectToRemoteQueryFields<Object>

    expectTypeOf<Paths>().toEqualTypeOf<
      | "*"
      | "date"
      | "metadata"
      | "id"
      | "title"
      | "description"
      | "variants.*"
      | "variants.id"
      | "variants.sku"
      | "variants.title"
      | "sales_channel.*"
      | "sales_channel.id"
      | "sales_channel.name"
      | "sales_channel.value"
    >()
  })

  it("should return all the nested paths properties from an object with nullable and undefined", () => {
    type Maybe<T> = T | null

    type Object = {
      id: string
      title: string
      description: string
      date: Date
      variants: Maybe<
        Maybe<{
          __typename: string
          id: string
          sku: string
          title: string
        }>[]
      >
      sales_channel?: Maybe<{
        __typename: string
        id: string
        name: string
        value: string
      }>
      metadata: Record<string, unknown>
    }

    type Paths = ObjectToRemoteQueryFields<Object>

    expectTypeOf<Paths>().toEqualTypeOf<
      | "*"
      | "id"
      | "metadata"
      | "date"
      | "title"
      | "description"
      | "variants.*"
      | "variants.id"
      | "variants.sku"
      | "variants.title"
      | "sales_channel.*"
      | "sales_channel.id"
      | "sales_channel.name"
      | "sales_channel.value"
    >()
  })

  it("should fail return all the nested paths properties from an object with nullable and undefined", () => {
    type Maybe<T> = T | null

    type Object = {
      id: string
      title: string
      description: string
      date: Date
      variants: Maybe<
        Maybe<{
          id: string
          sku: string
          title: string
        }>[]
      >
      sales_channel?: Maybe<{
        id: string
        name: string
        value: string
      }>
      metadata: Record<string, unknown>
    }

    type Paths = ObjectToRemoteQueryFields<Object>

    expectTypeOf<Paths>().toEqualTypeOf<
      // @ts-expect-error
      | "foo"
      | "*"
      | "date"
      | "metadata"
      | "id"
      | "title"
      | "description"
      | "variants.*"
      | "variants.id"
      | "variants.sku"
      | "variants.title"
      | "sales_channel.*"
      | "sales_channel.id"
      | "sales_channel.name"
      | "sales_channel.value"
    >()
  })
})
