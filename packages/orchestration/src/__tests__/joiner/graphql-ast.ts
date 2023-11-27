import GraphQLParser from "../../joiner/graphql-ast"

describe("RemoteJoiner.parseQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("Simple query with fields", async () => {
    const graphqlQuery = `
      query {
        order {
          id
          number
          date
        }
      }
    `
    const parser = new GraphQLParser(graphqlQuery)
    const rjQuery = parser.parseQuery()

    expect(rjQuery).toEqual({
      alias: "order",
      fields: ["id", "number", "date"],
      expands: [],
    })
  })

  it("Simple query with fields and arguments", async () => {
    const graphqlQuery = `
      query {
          order(
              id: "ord_123",
              another_arg: 987,
              complexArg: {
                  id: "123",
                  name: "test",
                  nestedArg: {
                      nest_id: "abc",
                      num: 123
                  }
              }
          ) {
              id
              number
              date
          }
      }
    `
    const parser = new GraphQLParser(graphqlQuery)
    const rjQuery = parser.parseQuery()

    expect(rjQuery).toEqual({
      alias: "order",
      fields: ["id", "number", "date"],
      expands: [],
      args: [
        {
          name: "id",
          value: "ord_123",
        },
        {
          name: "another_arg",
          value: 987,
        },
        {
          name: "complexArg",
          value: {
            id: "123",
            name: "test",
            nestedArg: {
              nest_id: "abc",
              num: 123,
            },
          },
        },
      ],
    })
  })

  it("Simple query with mapping fields to services", async () => {
    const graphqlQuery = `
      query {
          order {
              id
              number
              date
              products {
                product_id
                variant_id
                order
                variant {
                  name
                  sku
                }
              }
          }
      }
    `
    const parser = new GraphQLParser(graphqlQuery, {})
    const rjQuery = parser.parseQuery()

    expect(rjQuery).toEqual({
      alias: "order",
      fields: ["id", "number", "date", "products"],
      expands: [
        {
          property: "products",
          fields: ["product_id", "variant_id", "order", "variant"],
        },
        {
          property: "products.variant",
          fields: ["name", "sku"],
        },
      ],
    })
  })

  it("Nested query with fields", async () => {
    const graphqlQuery = `
      query {
        order {
          id
          number
          date
          products {
            product_id
            variant_id
            order
            variant {
              name
              sku
            }
          }
        }
      }
    `
    const parser = new GraphQLParser(graphqlQuery)
    const rjQuery = parser.parseQuery()

    expect(rjQuery).toEqual({
      alias: "order",
      fields: ["id", "number", "date", "products"],
      expands: [
        {
          property: "products",
          fields: ["product_id", "variant_id", "order", "variant"],
        },
        {
          property: "products.variant",
          fields: ["name", "sku"],
        },
      ],
    })
  })

  it("Nested query with fields and arguments", async () => {
    const graphqlQuery = `
      query {
        order (order_id: "ord_123") {
          id
          number
          date
          products (limit: 10) {
            product_id
            variant_id
            order
            variant (complexArg: { id: "123", name: "test", nestedArg: { nest_id: "abc", num: 123 } }, region_id: "reg_123") {
              name
              sku
            }
          }
        }
      }
    `
    const parser = new GraphQLParser(graphqlQuery)
    const rjQuery = parser.parseQuery()

    expect(rjQuery).toEqual({
      alias: "order",
      fields: ["id", "number", "date", "products"],
      expands: [
        {
          property: "products",
          fields: ["product_id", "variant_id", "order", "variant"],
          args: [
            {
              name: "limit",
              value: 10,
            },
          ],
        },
        {
          property: "products.variant",
          fields: ["name", "sku"],
          args: [
            {
              name: "complexArg",
              value: {
                id: "123",
                name: "test",
                nestedArg: {
                  nest_id: "abc",
                  num: 123,
                },
              },
            },
            {
              name: "region_id",
              value: "reg_123",
            },
          ],
        },
      ],
      args: [
        {
          name: "order_id",
          value: "ord_123",
        },
      ],
    })
  })

  it("Nested query with fields and arguments using variables", async () => {
    const graphqlQuery = `
      query($orderId: ID, $anotherArg: String, $randomVariable: nonValidatedType) {
        order (order_id: $orderId, anotherArg: $anotherArg) {
          id
          number
          date
          products (randomValue: $randomVariable) {
            product_id
            variant_id
            order
          }
        }
      }
    `
    const parser = new GraphQLParser(graphqlQuery, {
      orderId: 123,
      randomVariable: { complex: { num: 12343, str: "str_123" } },
      anotherArg: "any string",
    })
    const rjQuery = parser.parseQuery()

    expect(rjQuery).toEqual({
      alias: "order",
      fields: ["id", "number", "date", "products"],
      expands: [
        {
          property: "products",
          fields: ["product_id", "variant_id", "order"],
          args: [
            {
              name: "randomValue",
              value: {
                complex: {
                  num: 12343,
                  str: "str_123",
                },
              },
            },
          ],
        },
      ],
      args: [
        {
          name: "order_id",
          value: 123,
        },
        {
          name: "anotherArg",
          value: "any string",
        },
      ],
    })
  })

  it("Nested query with fields and directives", async () => {
    const graphqlQuery = `
      query {
        order(regularArgs: 123) {
          id
          number @include(if: "date > '2020-01-01'")
          date
          products {
            product_id 
            variant_id
            variant @count {
              name @lowerCase
              sku @include(if: "name == 'test'")
            }
          }
        }
      }
    `
    const parser = new GraphQLParser(graphqlQuery)
    const rjQuery = parser.parseQuery()

    expect(rjQuery).toEqual({
      alias: "order",
      fields: ["id", "number", "date", "products"],
      expands: [
        {
          property: "products",
          fields: ["product_id", "variant_id", "variant"],
          directives: {
            variant: [
              {
                name: "count",
              },
            ],
          },
        },
        {
          property: "products.variant",
          fields: ["name", "sku"],
          directives: {
            name: [
              {
                name: "lowerCase",
              },
            ],
            sku: [
              {
                name: "include",
                args: [
                  {
                    name: "if",
                    value: "name == 'test'",
                  },
                ],
              },
            ],
          },
        },
      ],
      args: [
        {
          name: "regularArgs",
          value: 123,
        },
      ],
      directives: {
        number: [
          {
            name: "include",
            args: [
              {
                name: "if",
                value: "date > '2020-01-01'",
              },
            ],
          },
        ],
      },
    })
  })
})
