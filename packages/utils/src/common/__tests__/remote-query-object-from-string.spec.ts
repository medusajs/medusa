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
      variables: {
        q: "name",
        options: {
          name: "option_name",
        },
        "options.values": {
          value: 123,
        },
      },
      fields,
    })

    expect(output).toEqual({
      product: {
        __args: {
          q: "name",
        },
        fields: [
          "id",
          "created_at",
          "updated_at",
          "deleted_at",
          "url",
          "metadata",
        ],
        isServiceAccess: false,
        tags: {
          fields: ["id", "created_at", "updated_at", "deleted_at", "value"],
        },

        options: {
          __args: {
            name: "option_name",
          },
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
            __args: {
              value: 123,
            },
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

  it("should return a remote query object using service entry point", function () {
    const output = remoteQueryObjectFromString({
      service: "product",
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
        isServiceAccess: true,
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
