import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { buildSchemaObjectRepresentation } from "../build-config"

// Mock MedusaModule only
jest.mock("@medusajs/framework/modules-sdk", () => ({
  MedusaModule: {
    getAllJoinerConfigs: jest.fn(),
  },
}))

// No need to mock @medusajs/framework/utils since we're using the actual implementations

describe("buildSchemaObjectRepresentation", () => {
  // Setup mocks before each test
  beforeEach(() => {
    jest.clearAllMocks()

    // Mock MedusaModule.getAllJoinerConfigs
    ;(MedusaModule.getAllJoinerConfigs as jest.Mock).mockReturnValue([])
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it("should a simple object representation for a single entity", () => {
    const schema = "type Product { id: ID! }"

    const output = buildSchemaObjectRepresentation(schema)

    delete (output as any).executableSchema

    expect(output).toEqual({
      objectRepresentation: {
        _serviceNameModuleConfigMap: {},
        Product: {
          entity: "Product",
          parents: [],
          alias: "",
          listeners: [],
          moduleConfig: null,
          fields: ["id"],
        },
        _schemaPropertiesMap: {
          "": {
            isInverse: false,
            isList: undefined,
            ref: {
              entity: "Product",
              parents: [],
              alias: "",
              listeners: [],
              moduleConfig: null,
              fields: ["id"],
            },
          },
        },
      },
      entitiesMap: expect.objectContaining({
        Product: expect.objectContaining({
          name: "Product",
        }),
      }),
    })
  })

  it("should process entities", () => {
    const moduleSchema = `
      type Product { 
        id: ID! 
        title: String!
      }
    `

    const productModuleJoinerConfig = {
      serviceName: "ProductService",
      schema: moduleSchema,
      alias: [
        {
          name: "product",
          entity: "Product",
        },
      ],
    }

    ;(MedusaModule.getAllJoinerConfigs as jest.Mock).mockReturnValue([
      productModuleJoinerConfig,
    ])

    const indexSchema = `
      type Product @Listeners(values: ["product.created"]) { 
        id: ID! 
        title: String!
      }
    `

    const { objectRepresentation, entitiesMap } =
      buildSchemaObjectRepresentation(indexSchema)

    expect(entitiesMap).toEqual(
      expect.objectContaining({
        Product: expect.objectContaining({
          name: "Product",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            title: expect.objectContaining({
              name: "title",
            }),
          },
        }),
      })
    )

    expect(objectRepresentation["Product"]).toBeDefined()
    expect(objectRepresentation["Product"].entity).toBe("Product")
    expect(objectRepresentation["Product"].listeners).toEqual([
      "product.created",
    ])
    expect(objectRepresentation["Product"].alias).toBe("product")

    expect(objectRepresentation["Product"].fields).toBeDefined()
    expect(objectRepresentation["Product"].fields).toEqual(["id", "title"])

    expect(objectRepresentation._schemaPropertiesMap["product"]).toBeDefined()
    expect(objectRepresentation._schemaPropertiesMap["product"].ref).toEqual({
      entity: "Product",
      parents: [],
      alias: "product",
      listeners: ["product.created"],
      moduleConfig: productModuleJoinerConfig,
      fields: ["id", "title"],
    })
  })

  it("should handle parent-child relationships between entities", () => {
    const schema = `
      type Product { 
        id: ID! 
        title: String!
        variants: [ProductVariant!]
      }
      
      type ProductVariant {
        id: ID!
        title: String!
        product: Product!
      }
    `

    const productModuleJoinerConfig = {
      serviceName: "ProductService",
      schema: schema,
      alias: [
        {
          name: "product",
          entity: "Product",
        },
        {
          name: "variant",
          entity: "ProductVariant",
        },
      ],
    }

    ;(MedusaModule.getAllJoinerConfigs as jest.Mock).mockReturnValue([
      productModuleJoinerConfig,
    ])

    const indexSchema = `
      type Product @Listeners(values: ["product.created"]) { 
        id: ID! 
        title: String!
        variants: [ProductVariant!]
      }

      type ProductVariant @Listeners(values: ["variant.created"]) {
        id: ID!
        title: String!
      }
    `

    const { objectRepresentation, entitiesMap } =
      buildSchemaObjectRepresentation(indexSchema)

    expect(entitiesMap).toEqual(
      expect.objectContaining({
        Product: expect.objectContaining({
          name: "Product",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            title: expect.objectContaining({
              name: "title",
            }),
            variants: expect.objectContaining({
              name: "variants",
            }),
          },
        }),
      })
    )

    expect(objectRepresentation["Product"]).toBeDefined()
    expect(objectRepresentation["Product"].entity).toBe("Product")
    expect(objectRepresentation["Product"].parents).toEqual([])
    expect(objectRepresentation["Product"].listeners).toEqual([
      "product.created",
    ])
    expect(objectRepresentation["Product"].alias).toBe("product")

    expect(objectRepresentation["Product"].fields).toBeDefined()
    expect(objectRepresentation["Product"].fields).toEqual(["id", "title"])

    expect(objectRepresentation["ProductVariant"]).toBeDefined()
    expect(objectRepresentation["ProductVariant"].entity).toBe("ProductVariant")
    expect(objectRepresentation["ProductVariant"].parents).toEqual([
      expect.objectContaining({
        ref: objectRepresentation["Product"],
        targetProp: "variants",
      }),
    ])

    const productRefExpectation = {
      entity: "Product",
      parents: [],
      alias: "product",
      listeners: ["product.created"],
      moduleConfig: productModuleJoinerConfig,
      fields: ["id", "title"],
    }

    expect(objectRepresentation._schemaPropertiesMap["product"].ref).toEqual(
      productRefExpectation
    )

    const variantRefExpectation = {
      entity: "ProductVariant",
      parents: [
        {
          ref: productRefExpectation,
          targetProp: "variants",
          inverseSideProp: "product",
          isList: true,
        },
      ],
      alias: "variant",
      listeners: ["variant.created"],
      moduleConfig: productModuleJoinerConfig,
      fields: ["id", "title", "product.id"],
    }

    expect(objectRepresentation._schemaPropertiesMap["variant"]).toBeDefined()
    expect(objectRepresentation._schemaPropertiesMap["variant"].ref).toEqual(
      variantRefExpectation
    )

    expect(
      objectRepresentation._schemaPropertiesMap["product.variants"]
    ).toBeDefined()
    expect(
      objectRepresentation._schemaPropertiesMap["product.variants"].ref
    ).toEqual(variantRefExpectation)
  })

  it("should handle deep nested parent-child relationships between entities", () => {
    const schema = `
      type Category { 
        id: ID! 
        name: String!
        products: [Product!]
      }
      
      type Product { 
        id: ID! 
        title: String!
        variants: [ProductVariant!]
        category: Category!
      }
      
      type ProductVariant {
        id: ID!
        title: String!
        options: [VariantOption!]
        product: Product!
      }
      
      type VariantOption {
        id: ID!
        value: String!
        product_variant: ProductVariant!
      }
    `

    const moduleJoinerConfig = {
      serviceName: "ProductService",
      schema: schema,
      alias: [
        {
          name: "category",
          entity: "Category",
        },
        {
          name: "product",
          entity: "Product",
        },
        {
          name: "variant",
          entity: "ProductVariant",
        },
        {
          name: "option",
          entity: "VariantOption",
        },
      ],
    }

    ;(MedusaModule.getAllJoinerConfigs as jest.Mock).mockReturnValue([
      moduleJoinerConfig,
    ])

    const indexSchema = `
      type Category @Listeners(values: ["category.created"]) { 
        id: ID! 
        name: String!
        products: [Product!]
      }
      
      type Product @Listeners(values: ["product.created"]) { 
        id: ID! 
        title: String!
        variants: [ProductVariant!]
      }
      
      type ProductVariant @Listeners(values: ["variant.created"]) {
        id: ID!
        title: String!
        options: [VariantOption!]
      }
      
      type VariantOption @Listeners(values: ["option.created"]) {
        id: ID!
        value: String!
      }
    `

    const { objectRepresentation, entitiesMap } =
      buildSchemaObjectRepresentation(indexSchema)

    // Verify entitiesMap structure
    expect(entitiesMap).toEqual(
      expect.objectContaining({
        Category: expect.objectContaining({
          name: "Category",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            name: expect.objectContaining({
              name: "name",
            }),
            products: expect.objectContaining({
              name: "products",
            }),
          },
        }),
        Product: expect.objectContaining({
          name: "Product",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            title: expect.objectContaining({
              name: "title",
            }),
            variants: expect.objectContaining({
              name: "variants",
            }),
          },
        }),
        ProductVariant: expect.objectContaining({
          name: "ProductVariant",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            title: expect.objectContaining({
              name: "title",
            }),
            options: expect.objectContaining({
              name: "options",
            }),
          },
        }),
        VariantOption: expect.objectContaining({
          name: "VariantOption",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            value: expect.objectContaining({
              name: "value",
            }),
          },
        }),
      })
    )

    // Verify that all entities exist in the objectRepresentation
    expect(objectRepresentation["Category"]).toBeDefined()
    expect(objectRepresentation["Category"].entity).toBe("Category")
    expect(objectRepresentation["Category"].parents).toEqual([])
    expect(objectRepresentation["Category"].listeners).toEqual([
      "category.created",
    ])
    expect(objectRepresentation["Category"].alias).toBe("category")
    expect(objectRepresentation["Category"].fields).toEqual(["id", "name"])

    expect(objectRepresentation["Product"]).toBeDefined()
    expect(objectRepresentation["Product"].entity).toBe("Product")
    expect(objectRepresentation["Product"].listeners).toEqual([
      "product.created",
    ])
    expect(objectRepresentation["Product"].alias).toBe("product")
    expect(objectRepresentation["Product"].fields).toEqual([
      "id",
      "title",
      "category.id",
    ])

    expect(objectRepresentation["ProductVariant"]).toBeDefined()
    expect(objectRepresentation["ProductVariant"].entity).toBe("ProductVariant")
    expect(objectRepresentation["ProductVariant"].listeners).toEqual([
      "variant.created",
    ])
    expect(objectRepresentation["ProductVariant"].alias).toBe("variant")
    expect(objectRepresentation["ProductVariant"].fields).toEqual([
      "id",
      "title",
      "product.id",
    ])

    expect(objectRepresentation["VariantOption"]).toBeDefined()
    expect(objectRepresentation["VariantOption"].entity).toBe("VariantOption")
    expect(objectRepresentation["VariantOption"].listeners).toEqual([
      "option.created",
    ])
    expect(objectRepresentation["VariantOption"].alias).toBe("option")
    expect(objectRepresentation["VariantOption"].fields).toEqual([
      "id",
      "value",
      "product_variant.id",
    ])

    // Check parent-child relationships
    expect(objectRepresentation["Product"].parents).toEqual([
      expect.objectContaining({
        ref: objectRepresentation["Category"],
        targetProp: "products",
      }),
    ])

    expect(objectRepresentation["ProductVariant"].parents).toEqual([
      expect.objectContaining({
        ref: objectRepresentation["Product"],
        targetProp: "variants",
      }),
    ])

    expect(objectRepresentation["VariantOption"].parents).toEqual([
      expect.objectContaining({
        ref: objectRepresentation["ProductVariant"],
        targetProp: "options",
      }),
    ])

    // Create reference expectation objects for each entity
    const categoryRefExpectation = {
      entity: "Category",
      parents: [],
      alias: "category",
      listeners: ["category.created"],
      moduleConfig: moduleJoinerConfig,
      fields: ["id", "name"],
    }

    const productRefExpectation = {
      entity: "Product",
      parents: [
        {
          ref: categoryRefExpectation,
          targetProp: "products",
          inverseSideProp: "category",
          isList: true,
        },
      ],
      alias: "product",
      listeners: ["product.created"],
      moduleConfig: moduleJoinerConfig,
      fields: ["id", "title", "category.id"],
    }

    const variantRefExpectation = {
      entity: "ProductVariant",
      parents: [
        {
          ref: productRefExpectation,
          targetProp: "variants",
          inverseSideProp: "product",
          isList: true,
        },
      ],
      alias: "variant",
      listeners: ["variant.created"],
      moduleConfig: moduleJoinerConfig,
      fields: ["id", "title", "product.id"],
    }

    const optionRefExpectation = {
      entity: "VariantOption",
      parents: [
        {
          ref: variantRefExpectation,
          targetProp: "options",
          inverseSideProp: "product_variant",
          isList: true,
        },
      ],
      alias: "option",
      listeners: ["option.created"],
      moduleConfig: moduleJoinerConfig,
      fields: ["id", "value", "product_variant.id"],
    }

    // Check that aliases are correctly set in the schema properties map
    expect(objectRepresentation._schemaPropertiesMap["category"]).toBeDefined()
    expect(objectRepresentation._schemaPropertiesMap["category"].ref).toEqual(
      categoryRefExpectation
    )

    expect(objectRepresentation._schemaPropertiesMap["product"]).toBeDefined()
    expect(objectRepresentation._schemaPropertiesMap["product"].ref).toEqual(
      productRefExpectation
    )

    expect(objectRepresentation._schemaPropertiesMap["variant"]).toBeDefined()
    expect(objectRepresentation._schemaPropertiesMap["variant"].ref).toEqual(
      variantRefExpectation
    )

    expect(objectRepresentation._schemaPropertiesMap["option"]).toBeDefined()
    expect(objectRepresentation._schemaPropertiesMap["option"].ref).toEqual(
      optionRefExpectation
    )

    // Check nested paths
    expect(
      objectRepresentation._schemaPropertiesMap["category.products"]
    ).toBeDefined()
    expect(
      objectRepresentation._schemaPropertiesMap["category.products"].ref
    ).toEqual(productRefExpectation)

    expect(
      objectRepresentation._schemaPropertiesMap["product.variants"]
    ).toBeDefined()
    expect(
      objectRepresentation._schemaPropertiesMap["product.variants"].ref
    ).toEqual(variantRefExpectation)

    expect(
      objectRepresentation._schemaPropertiesMap["variant.options"]
    ).toBeDefined()
    expect(
      objectRepresentation._schemaPropertiesMap["variant.options"].ref
    ).toEqual(optionRefExpectation)
  })

  it("should handle entities with various field types", () => {
    const schema = `
      type Product { 
        id: ID! 
        title: String!
        price: Float!
        inStock: Boolean!
        inventory: Int!
        metadata: JSON
        createdAt: DateTime
        tags: [String!]
      }
    `

    const productModuleJoinerConfig = {
      serviceName: "ProductService",
      schema: schema,
      alias: [
        {
          name: "product",
          entity: "Product",
        },
      ],
    }

    ;(MedusaModule.getAllJoinerConfigs as jest.Mock).mockReturnValue([
      productModuleJoinerConfig,
    ])

    const indexSchema = `
      type Product @Listeners(values: ["product.created"]) { 
        id: ID! 
        title: String!
        price: Float!
        inStock: Boolean!
        inventory: Int!
        metadata: JSON
        createdAt: DateTime
        tags: [String!]
      }

      scalar JSON
      scalar DateTime
    `

    const { objectRepresentation, entitiesMap } =
      buildSchemaObjectRepresentation(indexSchema)

    // Verify entitiesMap structure
    expect(entitiesMap).toEqual(
      expect.objectContaining({
        Product: expect.objectContaining({
          name: "Product",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            title: expect.objectContaining({
              name: "title",
            }),
            price: expect.objectContaining({
              name: "price",
            }),
            inStock: expect.objectContaining({
              name: "inStock",
            }),
            inventory: expect.objectContaining({
              name: "inventory",
            }),
            metadata: expect.objectContaining({
              name: "metadata",
            }),
            createdAt: expect.objectContaining({
              name: "createdAt",
            }),
            tags: expect.objectContaining({
              name: "tags",
            }),
          },
        }),
      })
    )

    expect(objectRepresentation["Product"]).toBeDefined()
    expect(objectRepresentation["Product"].entity).toBe("Product")
    expect(objectRepresentation["Product"].parents).toEqual([])
    expect(objectRepresentation["Product"].listeners).toEqual([
      "product.created",
    ])
    expect(objectRepresentation["Product"].alias).toBe("product")
    expect(objectRepresentation["Product"].moduleConfig).toBe(
      productModuleJoinerConfig
    )

    // Check that all fields are included
    expect(objectRepresentation["Product"].fields).toEqual([
      "id",
      "title",
      "price",
      "inStock",
      "inventory",
      "metadata",
      "createdAt",
      "tags",
    ])

    // Create reference expectation object for the entity
    const productRefExpectation = {
      entity: "Product",
      parents: [],
      alias: "product",
      listeners: ["product.created"],
      moduleConfig: productModuleJoinerConfig,
      fields: [
        "id",
        "title",
        "price",
        "inStock",
        "inventory",
        "metadata",
        "createdAt",
        "tags",
      ],
    }

    // Check that alias is correctly set in the schema properties map
    expect(objectRepresentation._schemaPropertiesMap["product"]).toBeDefined()
    expect(objectRepresentation._schemaPropertiesMap["product"].ref).toEqual(
      productRefExpectation
    )

    // Check that module config is set correctly in the service map
    expect(objectRepresentation._serviceNameModuleConfigMap).toEqual(
      expect.objectContaining({
        ProductService: productModuleJoinerConfig,
      })
    )
  })

  it("should handle entities with multiple listeners", () => {
    const schema = `
      type Product { 
        id: ID! 
        title: String!
      }
    `

    const productModuleJoinerConfig = {
      serviceName: "ProductService",
      schema: schema,
      alias: [
        {
          name: "product",
          entity: "Product",
        },
      ],
    }

    ;(MedusaModule.getAllJoinerConfigs as jest.Mock).mockReturnValue([
      productModuleJoinerConfig,
    ])

    const indexSchema = `
      type Product @Listeners(values: ["product.created", "product.updated", "product.deleted"]) { 
        id: ID! 
        title: String!
      }
    `

    const { objectRepresentation, entitiesMap } =
      buildSchemaObjectRepresentation(indexSchema)

    // Verify entitiesMap structure
    expect(entitiesMap).toEqual(
      expect.objectContaining({
        Product: expect.objectContaining({
          name: "Product",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            title: expect.objectContaining({
              name: "title",
            }),
          },
        }),
      })
    )

    expect(objectRepresentation["Product"]).toBeDefined()
    expect(objectRepresentation["Product"].entity).toBe("Product")
    expect(objectRepresentation["Product"].parents).toEqual([])
    expect(objectRepresentation["Product"].listeners).toEqual([
      "product.created",
      "product.updated",
      "product.deleted",
    ])
    expect(objectRepresentation["Product"].alias).toBe("product")
    expect(objectRepresentation["Product"].moduleConfig).toBe(
      productModuleJoinerConfig
    )
    expect(objectRepresentation["Product"].fields).toEqual(["id", "title"])

    // Create reference expectation object for the entity
    const productRefExpectation = {
      entity: "Product",
      parents: [],
      alias: "product",
      listeners: ["product.created", "product.updated", "product.deleted"],
      moduleConfig: productModuleJoinerConfig,
      fields: ["id", "title"],
    }

    // Check that alias is correctly set in the schema properties map
    expect(objectRepresentation._schemaPropertiesMap["product"]).toBeDefined()
    expect(objectRepresentation._schemaPropertiesMap["product"].ref).toEqual(
      productRefExpectation
    )

    // Check that module config is set correctly in the service map
    expect(objectRepresentation._serviceNameModuleConfigMap).toEqual(
      expect.objectContaining({
        ProductService: productModuleJoinerConfig,
      })
    )
  })

  it("should handle link modules between entities from different services specifying link relationships", () => {
    const productSchema = `
      type Product { 
        id: ID! 
        title: String!
      }
    `

    const orderSchema = `
      type Order { 
        id: ID!
        code: String!
      }
    `

    const orderItemSchema = `
      type OrderItem {
        id: ID!
        quantity: Int!
        product_id: ID!
        order_id: ID!
      }
    `

    const productModuleJoinerConfig = {
      serviceName: "ProductService",
      schema: productSchema,
      alias: [
        {
          name: "product",
          entity: "Product",
        },
      ],
      linkableKeys: {
        product_id: "Product",
      },
    }

    const orderModuleJoinerConfig = {
      serviceName: "OrderService",
      schema: orderSchema,
      alias: [
        {
          name: "order",
          entity: "Order",
        },
      ],
      linkableKeys: {
        order_id: "Order",
      },
    }

    const orderItemLinkModuleJoinerConfig = {
      serviceName: "OrderItemService",
      isLink: true,
      schema: orderItemSchema,
      alias: [
        {
          name: "order_item",
          entity: "OrderItem",
        },
      ],
      relationships: [
        {
          serviceName: "ProductService",
          foreignKey: "product_id",
        },
        {
          serviceName: "OrderService",
          foreignKey: "order_id",
        },
      ],
      extends: [
        {
          serviceName: "OrderService",
          relationship: {
            serviceName: "OrderItemService",
            primaryKey: "order_id",
          },
        },
        {
          serviceName: "ProductService",
          relationship: {
            serviceName: "OrderItemService",
            primaryKey: "product_id",
          },
        },
      ],
    }

    ;(MedusaModule.getAllJoinerConfigs as jest.Mock).mockReturnValue([
      productModuleJoinerConfig,
      orderModuleJoinerConfig,
      orderItemLinkModuleJoinerConfig,
    ])

    const indexSchema = `
      type Product @Listeners(values: ["product.created"]) { 
        id: ID! 
        title: String!
        order_items: [OrderItem!]
      }

      type Order @Listeners(values: ["order.created"]) {
        id: ID!
        code: String!
        product_items: [OrderItem!]
      }

      type OrderItem @Listeners(values: ["order_item.created"]) {
        id: ID!
        quantity: Int!
        product_id: ID!
        product: Product!
        order_id: ID!
        order: Order!
      }
    `

    const { objectRepresentation, entitiesMap } =
      buildSchemaObjectRepresentation(indexSchema)

    // Verify entitiesMap structure
    expect(entitiesMap).toEqual(
      expect.objectContaining({
        Product: expect.objectContaining({
          name: "Product",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            title: expect.objectContaining({
              name: "title",
            }),
            order_items: expect.objectContaining({
              name: "order_items",
            }),
          },
        }),
        Order: expect.objectContaining({
          name: "Order",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            code: expect.objectContaining({
              name: "code",
            }),
            product_items: expect.objectContaining({
              name: "product_items",
            }),
          },
        }),
        OrderItem: expect.objectContaining({
          name: "OrderItem",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            quantity: expect.objectContaining({
              name: "quantity",
            }),
            product: expect.objectContaining({
              name: "product",
            }),
            order: expect.objectContaining({
              name: "order",
            }),
            product_id: expect.objectContaining({
              name: "product_id",
            }),
            order_id: expect.objectContaining({
              name: "order_id",
            }),
          },
        }),
      })
    )

    // Verify that all entities exist in the objectRepresentation
    expect(objectRepresentation["Product"]).toBeDefined()
    expect(objectRepresentation["Product"].entity).toBe("Product")
    expect(objectRepresentation["Product"].parents).toEqual([
      {
        ref: expect.objectContaining({
          entity: "OrderItem",
        }),
        targetProp: "product",
        inverseSideProp: "order_items",
        isList: false,
      },
    ])
    expect(objectRepresentation["Product"].listeners).toEqual([
      "product.created",
    ])
    expect(objectRepresentation["Product"].alias).toBe("product")
    expect(objectRepresentation["Product"].moduleConfig).toBe(
      productModuleJoinerConfig
    )
    expect(objectRepresentation["Product"].fields).toEqual([
      "id",
      "title",
      "order_items.id",
    ])

    expect(objectRepresentation["Order"]).toBeDefined()
    expect(objectRepresentation["Order"].entity).toBe("Order")
    expect(objectRepresentation["Order"].parents).toEqual([
      {
        ref: expect.objectContaining({
          entity: "OrderItem",
        }),
        targetProp: "order",
        inverseSideProp: "product_items",
        isList: false,
      },
    ])
    expect(objectRepresentation["Order"].listeners).toEqual(["order.created"])
    expect(objectRepresentation["Order"].alias).toBe("order")
    expect(objectRepresentation["Order"].moduleConfig).toBe(
      orderModuleJoinerConfig
    )
    expect(objectRepresentation["Order"].fields).toEqual([
      "id",
      "code",
      "product_items.id",
    ])

    expect(objectRepresentation["OrderItem"]).toBeDefined()
    expect(objectRepresentation["OrderItem"].entity).toBe("OrderItem")
    expect(objectRepresentation["OrderItem"].parents).toEqual(
      expect.arrayContaining([
        {
          ref: expect.objectContaining({
            entity: "Order",
          }),
          targetProp: "product_items",
          inverseSideProp: "order",
          isList: true,
        },
        {
          ref: expect.objectContaining({
            entity: "Product",
          }),
          targetProp: "order_items",
          inverseSideProp: "product",
          isList: true,
        },
      ])
    )
    expect(objectRepresentation["OrderItem"].listeners).toEqual([
      "order_item.created",
    ])
    expect(objectRepresentation["OrderItem"].alias).toBe("order_item")
    expect(objectRepresentation["OrderItem"].moduleConfig).toBe(
      orderItemLinkModuleJoinerConfig
    )
    expect(objectRepresentation["OrderItem"].fields).toEqual([
      "id",
      "quantity",
      "product_id",
      "order_id",
      "product.id",
      "order.id",
    ])

    // Check that links between services are properly set up
    expect(objectRepresentation._serviceNameModuleConfigMap).toEqual(
      expect.objectContaining({
        ProductService: productModuleJoinerConfig,
        OrderService: orderModuleJoinerConfig,
        OrderItemService: orderItemLinkModuleJoinerConfig,
      })
    )
  })

  it("should handle link modules between entities from different services without specifying link relationships", () => {
    const productSchema = `
      type Product { 
        id: ID! 
        title: String!
        variants: [ProductVariant!]
      }

      type ProductVariant {
        id: ID!
        title: String!
        product_id: ID!
        product: Product!
      }
    `

    const priceSchema = `
      type PriceSet {
        id: ID!
        prices: [Price!]
      }

      type Price { 
        id: ID!
        amount: Float!
        currency_code: String!
        price_set_id: ID!
        price_set: PriceSet!
      }
    `

    const productModuleJoinerConfig = {
      serviceName: "ProductService",
      schema: productSchema,
      alias: [
        {
          name: "product",
          entity: "Product",
        },
        {
          name: "product_variant",
          entity: "ProductVariant",
        },
      ],
      linkableKeys: {
        product_id: "Product",
        variant_id: "ProductVariant",
      },
    }

    const priceModuleJoinerConfig = {
      serviceName: "PriceService",
      schema: priceSchema,
      alias: [
        {
          name: "price_set",
          entity: "PriceSet",
        },
        {
          name: "price",
          entity: "Price",
        },
      ],
      linkableKeys: {
        price_set_id: "PriceSet",
      },
    }

    const productVariantPriceSetLinkModuleJoinerConfig = {
      serviceName: "ProductVariantPriceSetService",
      isLink: true,
      schema: `
       type ProductVariantPriceSetLink {
        id: ID!
        product_variant_id: ID!
        price_set_id: ID!
        product_variant: ProductVariant!
        price_set: [PriceSet!]
       }

       extend type ProductVariant {
        product_variant_price_set_link: ProductVariantPriceSetLink!
       }

       extend type PriceSet {
        product_variant_price_set_link: ProductVariantPriceSetLink!
       }
      `,
      alias: [
        {
          name: "product_variant_price_set_link",
          entity: "ProductVariantPriceSetLink",
        },
      ],
      relationships: [
        {
          serviceName: "ProductService",
          foreignKey: "product_variant_id",
          entity: "ProductVariant",
        },
        {
          serviceName: "PriceService",
          foreignKey: "price_set_id",
          entity: "PriceSet",
        },
      ],
      extends: [
        {
          serviceName: "ProductService",
          relationship: {
            fieldAlias: {
              prices: "product_variant_price_set_link.price_set.prices",
              isList: true,
            },
            serviceName: "ProductVariantPriceSetService",
            primaryKey: "product_variant_id",
            isList: true,
          },
        },
        {
          serviceName: "PriceService",
          relationship: {
            fieldAlias: {
              product_variant: "product_variant_price_set_link.product_variant",
            },
            serviceName: "ProductVariantPriceSetService",
            primaryKey: "price_set_id",
          },
        },
      ],
    }

    ;(MedusaModule.getAllJoinerConfigs as jest.Mock).mockReturnValue([
      productModuleJoinerConfig,
      priceModuleJoinerConfig,
      productVariantPriceSetLinkModuleJoinerConfig,
    ])

    const indexSchema = `
      type Product @Listeners(values: ["product.created"]) {
        id: ID
        title: String

        variants: [ProductVariant]
      }

      type ProductVariant @Listeners(values: ["product_variant.created"]) {
        id: ID
        product_id: String
        title: String

        prices: [Price]
      }
      
      type Price @Listeners(values: ["price.created"]) {
        id: ID
        amount: Float
        currency_code: String
      }
    `

    const { objectRepresentation, entitiesMap } =
      buildSchemaObjectRepresentation(indexSchema)

    // Verify entitiesMap structure
    expect(entitiesMap).toEqual(
      expect.objectContaining({
        Product: expect.objectContaining({
          name: "Product",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            title: expect.objectContaining({
              name: "title",
            }),
            variants: expect.objectContaining({
              name: "variants",
            }),
          },
        }),
        ProductVariant: expect.objectContaining({
          name: "ProductVariant",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            product_id: expect.objectContaining({
              name: "product_id",
            }),
            title: expect.objectContaining({
              name: "title",
            }),
            prices: expect.objectContaining({
              name: "prices",
            }),
          },
        }),
        Price: expect.objectContaining({
          name: "Price",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            amount: expect.objectContaining({
              name: "amount",
            }),
            currency_code: expect.objectContaining({
              name: "currency_code",
            }),
          },
        }),
      })
    )

    // Verify that all entities exist in the objectRepresentation
    expect(objectRepresentation["Product"]).toBeDefined()
    expect(objectRepresentation["Product"].entity).toBe("Product")
    expect(objectRepresentation["Product"].parents).toEqual([])
    expect(objectRepresentation["Product"].listeners).toEqual([
      "product.created",
    ])
    expect(objectRepresentation["Product"].alias).toBe("product")
    expect(objectRepresentation["Product"].moduleConfig).toBe(
      productModuleJoinerConfig
    )
    expect(objectRepresentation["Product"].fields).toEqual(["id", "title"])

    expect(objectRepresentation["ProductVariant"]).toBeDefined()
    expect(objectRepresentation["ProductVariant"].entity).toBe("ProductVariant")
    expect(objectRepresentation["ProductVariant"].parents).toEqual([
      {
        ref: objectRepresentation["Product"],
        targetProp: "variants",
        inverseSideProp: "product",
        isList: true,
      },
    ])
    expect(objectRepresentation["ProductVariant"].listeners).toEqual([
      "product_variant.created",
    ])
    expect(objectRepresentation["ProductVariant"].alias).toBe("product_variant")
    expect(objectRepresentation["ProductVariant"].moduleConfig).toBe(
      productModuleJoinerConfig
    )
    expect(objectRepresentation["ProductVariant"].fields).toEqual([
      "id",
      "product_id",
      "title",
      "product.id",
    ])

    expect(objectRepresentation["ProductVariantPriceSetLink"]).toBeDefined()
    expect(objectRepresentation["ProductVariantPriceSetLink"].entity).toBe(
      "ProductVariantPriceSetLink"
    )
    expect(objectRepresentation["ProductVariantPriceSetLink"].parents).toEqual([
      {
        ref: objectRepresentation["ProductVariant"],
        inverseSideProp: "product_variant",
        targetProp: "product_variant_price_set_link",
        isList: false,
        isInverse: false,
      },
    ])
    expect(objectRepresentation["ProductVariantPriceSetLink"].fields).toEqual([
      "id",
      "product_variant_id",
      "price_set_id",
    ])

    expect(objectRepresentation["PriceSet"]).toBeDefined()
    expect(objectRepresentation["PriceSet"].entity).toBe("PriceSet")
    expect(objectRepresentation["PriceSet"].listeners).toEqual([
      "price-service.price-set.created",
      "price-service.price-set.updated",
      "price-service.price-set.deleted",
      "price-service.price-set.restored",
    ])
    expect(objectRepresentation["PriceSet"].parents).toEqual([
      {
        ref: objectRepresentation["ProductVariantPriceSetLink"],
        targetProp: "price_set",
        inverseSideProp: "product_variant_price_set_link",
        isList: true,
      },
    ])
    expect(objectRepresentation["PriceSet"].fields).toEqual(["id"])
    expect(objectRepresentation["PriceSet"].moduleConfig).toBe(
      priceModuleJoinerConfig
    )

    expect(objectRepresentation["Price"]).toBeDefined()
    expect(objectRepresentation["Price"].entity).toBe("Price")
    expect(objectRepresentation["Price"].parents).toEqual([
      {
        inSchemaRef: objectRepresentation["ProductVariant"],
        ref: objectRepresentation["PriceSet"],
        targetProp: "prices",
        inverseSideProp: "price_set",
        isList: true,
      },
    ])
    expect(objectRepresentation["Price"].fields).toEqual([
      "id",
      "amount",
      "currency_code",
      "price_set.id",
    ])
    expect(objectRepresentation["Price"].moduleConfig).toBe(
      priceModuleJoinerConfig
    )

    // Check that links between services are properly set up
    expect(objectRepresentation._serviceNameModuleConfigMap).toEqual(
      expect.objectContaining({
        ProductService: productModuleJoinerConfig,
        PriceService: priceModuleJoinerConfig,
        ProductVariantPriceSetService:
          productVariantPriceSetLinkModuleJoinerConfig,
      })
    )
  })

  it("should handle link modules between entities from different services without specifying link relationships and multiple field aliasees for the same entity type with cyclic relationships", () => {
    const productSchema = `
      type Product { 
        id: ID! 
        title: String!
        variants: [ProductVariant!]
      }

      type ProductVariant {
        id: ID!
        title: String!
        product_id: ID!
        product: Product!
      }
    `

    const priceSchema = `
      type Price { 
        id: ID!
        amount: Float!
        currency_code: String!
      }
    `

    const productModuleJoinerConfig = {
      serviceName: "ProductService",
      schema: productSchema,
      alias: [
        {
          name: "product",
          entity: "Product",
        },
        {
          name: "product_variant",
          entity: "ProductVariant",
        },
      ],
      linkableKeys: {
        product_id: "Product",
        variant_id: "ProductVariant",
      },
    }

    const priceModuleJoinerConfig = {
      serviceName: "PriceService",
      schema: priceSchema,
      alias: [
        {
          name: "price",
          entity: "Price",
        },
      ],
      linkableKeys: {
        price_id: "Price",
      },
    }

    const productPriceLinkModuleJoinerConfig = {
      serviceName: "ProductPriceService",
      isLink: true,
      schema: `
       type ProductPriceLink {
        id: ID!
        product_id: ID!
        price_id: ID!
        product: Product!
        price: Price!
       }

       extend type Product {
        product_price_link: ProductPriceLink!
       }

       extend type Price {
        product_price_link: ProductPriceLink!
       }
      `,
      alias: [
        {
          name: "product_price_link",
          entity: "ProductPriceLink",
        },
      ],
      relationships: [
        {
          serviceName: "ProductService",
          foreignKey: "product_id",
          entity: "Product",
        },
        {
          serviceName: "PriceService",
          foreignKey: "price_id",
          entity: "Price",
        },
      ],
      extends: [
        {
          serviceName: "ProductService",
          relationship: {
            fieldAlias: {
              prices: "product_price_link.price",
              isList: true,
            },
            serviceName: "ProductPriceService",
            primaryKey: "product_id",
            isList: true,
          },
        },
        {
          serviceName: "PriceService",
          relationship: {
            fieldAlias: {
              product: "product_price_link.product",
            },
            serviceName: "ProductPriceService",
            primaryKey: "price_id",
          },
        },
      ],
    }

    const productVariantPriceLinkModuleJoinerConfig = {
      serviceName: "ProductVariantPriceService",
      isLink: true,
      schema: `
       type ProductVariantPriceLink {
        id: ID!
        product_variant_id: ID!
        price_id: ID!
        product_variant: ProductVariant!
        price: Price!
       }

       extend type ProductVariant {
        product_variant_price_link: ProductVariantPriceLink!
       }

       extend type Price {
        product_variant_price_link: ProductVariantPriceLink!
       }
      `,
      alias: [
        {
          name: "product_variant_price_link",
          entity: "ProductVariantPriceLink",
        },
      ],
      relationships: [
        {
          serviceName: "ProductService",
          foreignKey: "variant_id",
          entity: "ProductVariant",
        },
        {
          serviceName: "PriceService",
          foreignKey: "price_id",
          entity: "Price",
        },
      ],
      extends: [
        {
          serviceName: "ProductService",
          relationship: {
            fieldAlias: {
              product_variant: "product_variant_price_link.product_variant",
            },
            serviceName: "ProductVariantPriceService",
            primaryKey: "variant_id",
            isList: true,
          },
        },
        {
          serviceName: "PriceService",
          relationship: {
            fieldAlias: {
              price: "product_variant_price_link.price",
            },
            serviceName: "ProductVariantPriceService",
            primaryKey: "price_id",
          },
        },
      ],
    }

    ;(MedusaModule.getAllJoinerConfigs as jest.Mock).mockReturnValue([
      productModuleJoinerConfig,
      priceModuleJoinerConfig,
      productPriceLinkModuleJoinerConfig,
      productVariantPriceLinkModuleJoinerConfig,
    ])

    const indexSchema = `
      type Product @Listeners(values: ["product.created"]) {
        id: ID
        title: String

        prices: [Price]
      }

      type ProductVariant @Listeners(values: ["product_variant.created"]) {
        id: ID
        title: String

        prices: [Price]
      }
      
      type Price @Listeners(values: ["price.created"]) {
        id: ID
        amount: Float
        currency_code: String
        product_variant: ProductVariant
        product: Product
      }
    `

    const { objectRepresentation, entitiesMap } =
      buildSchemaObjectRepresentation(indexSchema)

    // Verify entitiesMap structure
    expect(entitiesMap).toEqual(
      expect.objectContaining({
        Product: expect.objectContaining({
          name: "Product",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            title: expect.objectContaining({
              name: "title",
            }),
            prices: expect.objectContaining({
              name: "prices",
            }),
          },
        }),
        ProductVariant: expect.objectContaining({
          name: "ProductVariant",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            title: expect.objectContaining({
              name: "title",
            }),
            prices: expect.objectContaining({
              name: "prices",
            }),
          },
        }),
        Price: expect.objectContaining({
          name: "Price",
          _fields: {
            id: expect.objectContaining({
              name: "id",
            }),
            amount: expect.objectContaining({
              name: "amount",
            }),
            currency_code: expect.objectContaining({
              name: "currency_code",
            }),
            product_variant: expect.objectContaining({
              name: "product_variant",
            }),
            product: expect.objectContaining({
              name: "product",
            }),
          },
        }),
      })
    )

    // Verify that all entities exist in the objectRepresentation
    expect(objectRepresentation["Product"]).toBeDefined()
    expect(objectRepresentation["Product"].entity).toBe("Product")
    expect(objectRepresentation["Product"].parents).toEqual([
      expect.objectContaining({
        inSchemaRef: expect.objectContaining({
          entity: "Price",
        }),
        ref: expect.objectContaining({
          entity: "ProductPriceLink",
        }),
        targetProp: "product",
        inverseSideProp: "product_price_link",
        isList: false,
      }),
    ])
    expect(objectRepresentation["Product"].listeners).toEqual([
      "product.created",
    ])
    expect(objectRepresentation["Product"].alias).toBe("product")
    expect(objectRepresentation["Product"].moduleConfig).toBe(
      productModuleJoinerConfig
    )
    expect(objectRepresentation["Product"].fields).toEqual(["id", "title"])

    expect(objectRepresentation["ProductVariant"]).toBeDefined()
    expect(objectRepresentation["ProductVariant"].entity).toBe("ProductVariant")
    expect(objectRepresentation["ProductVariant"].parents).toEqual([
      expect.objectContaining({
        inSchemaRef: expect.objectContaining({
          entity: "Price",
        }),
        ref: expect.objectContaining({
          entity: "ProductVariantPriceLink",
        }),
        targetProp: "product_variant",
        inverseSideProp: "product_variant_price_link",
        isList: false,
      }),
    ])
    expect(objectRepresentation["ProductVariant"].listeners).toEqual([
      "product_variant.created",
    ])
    expect(objectRepresentation["ProductVariant"].alias).toBe("product_variant")
    expect(objectRepresentation["ProductVariant"].moduleConfig).toBe(
      productModuleJoinerConfig
    )
    expect(objectRepresentation["ProductVariant"].fields).toEqual([
      "id",
      "title",
    ])

    expect(objectRepresentation["ProductVariantPriceLink"]).toBeDefined()
    expect(objectRepresentation["ProductVariantPriceLink"].entity).toBe(
      "ProductVariantPriceLink"
    )

    expect(objectRepresentation["ProductVariantPriceLink"].parents).toEqual([
      expect.objectContaining({
        ref: expect.objectContaining({
          entity: "Price",
        }),
        targetProp: "product_variant_price_link",
        inverseSideProp: "price",
        isList: false,
        isInverse: true,
      }),
      expect.objectContaining({
        ref: expect.objectContaining({
          entity: "ProductVariant",
        }),
        targetProp: "product_variant_price_link",
        inverseSideProp: "product_variant",
        isList: false,
        isInverse: false,
      }),
    ])
    expect(objectRepresentation["ProductVariantPriceLink"].fields).toEqual([
      "id",
      "variant_id",
      "price_id",
    ])

    expect(objectRepresentation["ProductPriceLink"]).toBeDefined()
    expect(objectRepresentation["ProductPriceLink"].entity).toBe(
      "ProductPriceLink"
    )

    expect(objectRepresentation["ProductPriceLink"].parents).toEqual([
      expect.objectContaining({
        ref: expect.objectContaining({
          entity: "Product",
        }),
        inverseSideProp: "product",
        targetProp: "product_price_link",
        isList: false,
        isInverse: false,
      }),
      expect.objectContaining({
        ref: expect.objectContaining({
          entity: "Price",
        }),
        inverseSideProp: "price",
        targetProp: "product_price_link",
        isList: false,
        isInverse: true,
      }),
    ])
    expect(objectRepresentation["ProductPriceLink"].fields).toEqual([
      "id",
      "product_id",
      "price_id",
    ])

    expect(objectRepresentation["Price"]).toBeDefined()
    expect(objectRepresentation["Price"].entity).toBe("Price")
    expect(objectRepresentation["Price"].parents).toEqual([
      expect.objectContaining({
        inSchemaRef: expect.objectContaining({
          entity: "Product",
        }),
        ref: expect.objectContaining({
          entity: "ProductPriceLink",
        }),
        targetProp: "prices",
        inverseSideProp: "product_price_link",
        isList: false,
      }),
      expect.objectContaining({
        inSchemaRef: expect.objectContaining({
          entity: "ProductVariant",
        }),
        ref: expect.objectContaining({
          entity: "ProductVariantPriceLink",
        }),
        targetProp: "prices",
        inverseSideProp: "product_variant_price_link",
        isList: false,
      }),
    ])
    expect(objectRepresentation["Price"].fields).toEqual([
      "id",
      "amount",
      "currency_code",
    ])
    expect(objectRepresentation["Price"].moduleConfig).toBe(
      priceModuleJoinerConfig
    )

    // Check that links between services are properly set up
    expect(objectRepresentation._serviceNameModuleConfigMap).toEqual(
      expect.objectContaining({
        ProductService: productModuleJoinerConfig,
        PriceService: priceModuleJoinerConfig,
        ProductPriceService: productPriceLinkModuleJoinerConfig,
        ProductVariantPriceService: productVariantPriceLinkModuleJoinerConfig,
      })
    )
  })

  it("should set inSchemaRef for two entities (Alpha and Beta) when both are linked to Product", () => {
    const productSchema = `
      type Product {
        id: ID!
        title: String!
      }
    `

    const customSchema = `
      type Alpha {
        id: ID!
        product_id: ID!
        product: Product!
      }

      type Beta {
        id: ID!
        product_id: ID!
        product: Product!
      }
    `

    const productModuleJoinerConfig = {
      serviceName: "ProductService",
      schema: productSchema,
      alias: [
        {
          name: "product",
          entity: "Product",
        },
      ],
      linkableKeys: {
        product_id: "Product",
      },
    }

    const customModuleJoinerConfig = {
      serviceName: "CustomService",
      schema: customSchema,
      alias: [
        {
          name: "alpha",
          entity: "Alpha",
        },
        {
          name: "beta",
          entity: "Beta",
        },
      ],
      linkableKeys: {
        alpha_id: "Alpha",
        beta_id: "Beta",
      },
    }

    const alphaProductLinkModuleJoinerConfig = {
      serviceName: "AlphaProductLinkService",
      isLink: true,
      schema: `
       type AlphaProductLink {
        id: ID!
        alpha_id: ID!
        product_id: ID!
        alpha: Alpha!
        product: Product!
       }

       extend type Alpha {
        alpha_product_link: AlphaProductLink!
       }

       extend type Product {
        alpha_product_link: AlphaProductLink!
       }
      `,
      alias: [
        {
          name: "alpha_product_link",
          entity: "AlphaProductLink",
        },
      ],
      relationships: [
        {
          serviceName: "CustomService",
          foreignKey: "alpha_id",
          entity: "Alpha",
        },
        {
          serviceName: "ProductService",
          foreignKey: "product_id",
          entity: "Product",
        },
      ],
      extends: [
        {
          serviceName: "CustomService",
          relationship: {
            fieldAlias: {
              product: "alpha_product_link.product",
            },
            serviceName: "AlphaProductLinkService",
            primaryKey: "alpha_id",
          },
        },
        {
          serviceName: "ProductService",
          relationship: {
            fieldAlias: {
              alphas: "alpha_product_link.alpha",
              isList: true,
            },
            serviceName: "AlphaProductLinkService",
            primaryKey: "product_id",
            isList: true,
          },
        },
      ],
    }

    const betaProductLinkModuleJoinerConfig = {
      serviceName: "BetaProductLinkService",
      isLink: true,
      schema: `
       type BetaProductLink {
        id: ID!
        beta_id: ID!
        product_id: ID!
        beta: Beta!
        product: Product!
       }

       extend type Beta {
        beta_product_link: BetaProductLink!
       }

       extend type Product {
        beta_product_link: BetaProductLink!
       }
      `,
      alias: [
        {
          name: "beta_product_link",
          entity: "BetaProductLink",
        },
      ],
      relationships: [
        {
          serviceName: "CustomService",
          foreignKey: "beta_id",
          entity: "Beta",
        },
        {
          serviceName: "ProductService",
          foreignKey: "product_id",
          entity: "Product",
        },
      ],
      extends: [
        {
          serviceName: "CustomService",
          relationship: {
            fieldAlias: {
              product: "beta_product_link.product",
            },
            serviceName: "BetaProductLinkService",
            primaryKey: "beta_id",
          },
        },
        {
          serviceName: "ProductService",
          relationship: {
            fieldAlias: {
              betas: "beta_product_link.beta",
              isList: true,
            },
            serviceName: "BetaProductLinkService",
            primaryKey: "product_id",
            isList: true,
          },
        },
      ],
    }

    ;(MedusaModule.getAllJoinerConfigs as jest.Mock).mockReturnValue([
      productModuleJoinerConfig,
      customModuleJoinerConfig,
      alphaProductLinkModuleJoinerConfig,
      betaProductLinkModuleJoinerConfig,
    ])

    const indexSchema = `
      type Product @Listeners(values: ["product.created"]) {
        id: ID
        title: String
        alphas: [Alpha]
        betas: [Beta]
      }

      type Alpha @Listeners(values: ["custom.alpha.created"]) {
        id: ID
        product: Product
      }

      type Beta @Listeners(values: ["custom.beta.created"]) {
        id: ID
        product: Product
      }
    `

    const { objectRepresentation } =
      buildSchemaObjectRepresentation(indexSchema)

    const alphaParentWithSchemaRef = objectRepresentation["Alpha"].parents.find(
      (parent) => parent.inSchemaRef?.entity === "Product"
    )
    const betaParentWithSchemaRef = objectRepresentation["Beta"].parents.find(
      (parent) => parent.inSchemaRef?.entity === "Product"
    )

    expect(alphaParentWithSchemaRef).toBeDefined()
    expect(alphaParentWithSchemaRef).toEqual(
      expect.objectContaining({
        inSchemaRef: objectRepresentation["Product"],
      })
    )

    expect(betaParentWithSchemaRef).toBeDefined()
    expect(betaParentWithSchemaRef).toEqual(
      expect.objectContaining({
        inSchemaRef: objectRepresentation["Product"],
      })
    )
  })

  it("should throw an error when an entity with listeners doesn't have a corresponding module", () => {
    const indexSchema = `
      type Product @Listeners(values: ["product.created"]) { 
        id: ID! 
        title: String!
      }
    `

    // Return empty array for getAllJoinerConfigs so there's no module for the Product entity
    ;(MedusaModule.getAllJoinerConfigs as jest.Mock).mockReturnValue([])

    // The function should throw an error because the entity has listeners but no module
    expect(() => {
      buildSchemaObjectRepresentation(indexSchema)
    }).toThrow(
      /unable to retrieve the module that corresponds to the entity Product/
    )
  })
})
