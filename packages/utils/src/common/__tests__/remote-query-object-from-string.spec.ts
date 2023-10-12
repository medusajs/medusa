import { remoteQueryObjectFromString } from "../remote-query-object-from-string"

const fields = [
  "id",
  "created_at",
  "updated_at",
  "deleted_at",
  "url",
  "metadata",
  "tags.id",
  "tags.created_at",
  "tags.updated_at",
  "tags.deleted_at",
  "tags.value",
  "options.id",
  "options.created_at",
  "options.updated_at",
  "options.deleted_at",
  "options.title",
  "options.product_id",
  "options.metadata",
  "options.values.id",
  "options.values.created_at",
  "options.values.updated_at",
  "options.values.deleted_at",
  "options.values.value",
  "options.values.option_id",
  "options.values.variant_id",
  "options.values.metadata",
]

describe("remoteQueryObjectFromString", function () {
  it("should return a remote query object", function () {
    const output = remoteQueryObjectFromString({
      entryPoint: "product",
      variables: {},
      fields,
    })

    expect(output).toEqual({
      product: {
        __args: {},
        fields: [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
          "url",
          "metadata",
        ],
        tags: {
          fields: ["id", "created_at", "updated_at", "deleted_at", "value"],
        },

        options: {
          fields: [
            "id",
            "created_at",
            "updated_at",
            "deleted_at",
            "title",
            "product_id",
            "metadata",
          ],
          values: {
            fields: [
              "id",
              "created_at",
              "updated_at",
              "deleted_at",
              "value",
              "option_id",
              "variant_id",
              "metadata",
            ],
          },
        },
      },
    })
  })
})
