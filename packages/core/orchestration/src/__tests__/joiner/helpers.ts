import { toRemoteJoinerQuery } from "../../joiner/helpers"

describe("toRemoteJoinerQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should transform a simple object to a Remote Joiner Query format", async () => {
    const obj = {
      product: {
        fields: ["id", "title", "handle"],
      },
    }

    const rjQuery = toRemoteJoinerQuery(obj)

    expect(rjQuery).toEqual({
      alias: "product",
      fields: ["id", "title", "handle"],
      expands: [],
    })
  })

  it("should transform a nested object to a Remote Joiner Query format", async () => {
    const obj = {
      product: {
        fields: ["id", "title", "handle"],
        variants: {
          fields: ["sku"],
          shipping_profiles: {
            profile: {
              fields: ["id", "name"],
            },
          },
          options: {
            fields: ["value"],
          },
        },
        options: {
          fields: ["value", "name"],
        },
      },
    }

    const rjQuery = toRemoteJoinerQuery(obj)

    expect(rjQuery).toEqual({
      alias: "product",
      fields: ["id", "title", "handle"],
      expands: [
        {
          property: "variants",
          fields: ["sku"],
        },
        {
          property: "variants.shipping_profiles",
        },
        {
          property: "variants.shipping_profiles.profile",
          fields: ["id", "name"],
        },
        {
          property: "variants.options",
          fields: ["value"],
        },
        {
          property: "options",
          fields: ["value", "name"],
        },
      ],
    })
  })

  it("should transform a nested object with arguments and directives to a Remote Joiner Query format", async () => {
    const obj = {
      product: {
        fields: ["id", "title", "handle"],
        __args: {
          limit: 10,
          offset: 0,
        },
        variants: {
          fields: ["sku"],
          __directives: {
            directiveName: "value",
          },
          shipping_profiles: {
            profile: {
              fields: ["id", "name"],
              __args: {
                context: {
                  customer_group: "cg_123",
                  region_id: "US",
                },
              },
            },
          },
        },
      },
    }

    const rjQuery = toRemoteJoinerQuery(obj)

    expect(rjQuery).toEqual({
      alias: "product",
      fields: ["id", "title", "handle"],
      expands: [
        {
          property: "variants",
          directives: [
            {
              name: "directiveName",
              value: "value",
            },
          ],
          fields: ["sku"],
        },
        {
          property: "variants.shipping_profiles",
        },
        {
          property: "variants.shipping_profiles.profile",
          args: [
            {
              name: "context",
              value: {
                customer_group: "cg_123",
                region_id: "US",
              },
            },
          ],
          fields: ["id", "name"],
        },
      ],
      args: [
        {
          name: "limit",
          value: 10,
        },
        {
          name: "offset",
          value: 0,
        },
      ],
    })
  })

  it("should transform a nested object with arguments and directives to a Remote Joiner Query format only using variables", async () => {
    const obj = {
      product: {
        fields: ["id", "title", "handle"],
        variants: {
          fields: ["sku"],
          __directives: {
            directiveName: "value",
          },
          shipping_profiles: {
            profile: {
              fields: ["id", "name"],
            },
          },
        },
      },
    }

    const rjQuery = toRemoteJoinerQuery(obj, {
      product: {
        limit: 10,
        offset: 0,
      },
      "product.variants.shipping_profiles.profile": {
        context: {
          customer_group: "cg_123",
          region_id: "US",
        },
      },
    })

    expect(rjQuery).toEqual({
      alias: "product",
      fields: ["id", "title", "handle"],
      expands: [
        {
          property: "variants",
          directives: [
            {
              name: "directiveName",
              value: "value",
            },
          ],
          fields: ["sku"],
        },
        {
          property: "variants.shipping_profiles",
        },
        {
          property: "variants.shipping_profiles.profile",
          args: [
            {
              name: "context",
              value: {
                customer_group: "cg_123",
                region_id: "US",
              },
            },
          ],
          fields: ["id", "name"],
        },
      ],
      args: [
        {
          name: "limit",
          value: 10,
        },
        {
          name: "offset",
          value: 0,
        },
      ],
    })
  })
})
