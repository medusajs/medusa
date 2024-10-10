import { Modules } from "../../modules-sdk"
import { defineConfig } from "../define-config"

describe("defineConfig", function () {
  it("should merge empty config with the defaults", function () {
    expect(defineConfig()).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "http://localhost:9000",
          "outDir": ".medusa/admin",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "ApiKey": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "Auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "Cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "Cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "Currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "Customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "EventBus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "File": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "Fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "Inventory": {
            "resolve": "@medusajs/medusa/inventory-next",
          },
          "Notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "Order": {
            "resolve": "@medusajs/medusa/order",
          },
          "Payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "Pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "Product": {
            "resolve": "@medusajs/medusa/product",
          },
          "Promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "Region": {
            "resolve": "@medusajs/medusa/region",
          },
          "SalesChannel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "StockLocation": {
            "resolve": "@medusajs/medusa/stock-location-next",
          },
          "Store": {
            "resolve": "@medusajs/medusa/store",
          },
          "Tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "User": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "Workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "storeCors": "http://localhost:8000",
          },
        },
      }
    `)
  })

  it("should merge custom modules", function () {
    expect(
      defineConfig({
        modules: {
          GithubModuleService: {
            resolve: "./modules/github",
          },
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "http://localhost:9000",
          "outDir": ".medusa/admin",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "ApiKey": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "Auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "Cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "Cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "Currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "Customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "EventBus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "File": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "Fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "GithubModuleService": {
            "resolve": "./modules/github",
          },
          "Inventory": {
            "resolve": "@medusajs/medusa/inventory-next",
          },
          "Notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "Order": {
            "resolve": "@medusajs/medusa/order",
          },
          "Payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "Pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "Product": {
            "resolve": "@medusajs/medusa/product",
          },
          "Promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "Region": {
            "resolve": "@medusajs/medusa/region",
          },
          "SalesChannel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "StockLocation": {
            "resolve": "@medusajs/medusa/stock-location-next",
          },
          "Store": {
            "resolve": "@medusajs/medusa/store",
          },
          "Tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "User": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "Workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "storeCors": "http://localhost:8000",
          },
        },
      }
    `)
  })

  it("should merge custom modules when an array is provided", function () {
    expect(
      defineConfig({
        modules: [
          {
            resolve: require.resolve("../__fixtures__/define-config/github"),
            options: {
              apiKey: "test",
            },
          },
        ],
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "http://localhost:9000",
          "outDir": ".medusa/admin",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "ApiKey": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "Auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "Cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "Cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "Currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "Customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "EventBus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "File": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "Fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "GithubModuleService": {
            "options": {
              "apiKey": "test",
            },
            "resolve": "${require.resolve(
              "../__fixtures__/define-config/github"
            )}",
          },
          "Inventory": {
            "resolve": "@medusajs/medusa/inventory-next",
          },
          "Notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "Order": {
            "resolve": "@medusajs/medusa/order",
          },
          "Payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "Pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "Product": {
            "resolve": "@medusajs/medusa/product",
          },
          "Promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "Region": {
            "resolve": "@medusajs/medusa/region",
          },
          "SalesChannel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "StockLocation": {
            "resolve": "@medusajs/medusa/stock-location-next",
          },
          "Store": {
            "resolve": "@medusajs/medusa/store",
          },
          "Tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "User": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "Workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "storeCors": "http://localhost:8000",
          },
        },
      }
    `)
  })

  it("should merge custom modules when an array is provided with a key to override the module registration name", function () {
    expect(
      defineConfig({
        modules: [
          {
            key: "GithubModuleServiceOverride",
            resolve: require.resolve("../__fixtures__/define-config/github"),
            options: {
              apiKey: "test",
            },
          },
        ],
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "http://localhost:9000",
          "outDir": ".medusa/admin",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "ApiKey": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "Auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "Cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "Cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "Currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "Customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "EventBus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "File": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "Fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "GithubModuleServiceOverride": {
            "options": {
              "apiKey": "test",
            },
            "resolve": "${require.resolve(
              "../__fixtures__/define-config/github"
            )}",
          },
          "Inventory": {
            "resolve": "@medusajs/medusa/inventory-next",
          },
          "Notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "Order": {
            "resolve": "@medusajs/medusa/order",
          },
          "Payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "Pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "Product": {
            "resolve": "@medusajs/medusa/product",
          },
          "Promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "Region": {
            "resolve": "@medusajs/medusa/region",
          },
          "SalesChannel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "StockLocation": {
            "resolve": "@medusajs/medusa/stock-location-next",
          },
          "Store": {
            "resolve": "@medusajs/medusa/store",
          },
          "Tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "User": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "Workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "storeCors": "http://localhost:8000",
          },
        },
      }
    `)
  })

  it("should merge custom project.http config", function () {
    expect(
      defineConfig({
        projectConfig: {
          http: {
            adminCors: "http://localhost:3000",
          } as any,
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "http://localhost:9000",
          "outDir": ".medusa/admin",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "ApiKey": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "Auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "Cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "Cart": {
            "resolve": "@medusajs/medusa/cart",
          },
          "Currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "Customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "EventBus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "File": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "Fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "Inventory": {
            "resolve": "@medusajs/medusa/inventory-next",
          },
          "Notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "Order": {
            "resolve": "@medusajs/medusa/order",
          },
          "Payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "Pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "Product": {
            "resolve": "@medusajs/medusa/product",
          },
          "Promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "Region": {
            "resolve": "@medusajs/medusa/region",
          },
          "SalesChannel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "StockLocation": {
            "resolve": "@medusajs/medusa/stock-location-next",
          },
          "Store": {
            "resolve": "@medusajs/medusa/store",
          },
          "Tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "User": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "Workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "storeCors": "http://localhost:8000",
          },
        },
      }
    `)
  })

  it("should not include disabled modules", function () {
    expect(
      defineConfig({
        projectConfig: {
          http: {
            adminCors: "http://localhost:3000",
          } as any,
        },
        modules: {
          [Modules.CART]: false,
        },
      })
    ).toMatchInlineSnapshot(`
      {
        "admin": {
          "backendUrl": "http://localhost:9000",
          "outDir": ".medusa/admin",
          "path": "/app",
        },
        "featureFlags": {},
        "modules": {
          "ApiKey": {
            "resolve": "@medusajs/medusa/api-key",
          },
          "Auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/medusa/auth",
          },
          "Cache": {
            "resolve": "@medusajs/medusa/cache-inmemory",
          },
          "Currency": {
            "resolve": "@medusajs/medusa/currency",
          },
          "Customer": {
            "resolve": "@medusajs/medusa/customer",
          },
          "EventBus": {
            "resolve": "@medusajs/medusa/event-bus-local",
          },
          "File": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/medusa/file",
          },
          "Fulfillment": {
            "options": {
              "providers": [
                {
                  "id": "manual",
                  "resolve": "@medusajs/fulfillment-manual",
                },
              ],
            },
            "resolve": "@medusajs/medusa/fulfillment",
          },
          "Inventory": {
            "resolve": "@medusajs/medusa/inventory-next",
          },
          "Notification": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "options": {
                    "channels": [
                      "feed",
                    ],
                    "name": "Local Notification Provider",
                  },
                  "resolve": "@medusajs/notification-local",
                },
              ],
            },
            "resolve": "@medusajs/medusa/notification",
          },
          "Order": {
            "resolve": "@medusajs/medusa/order",
          },
          "Payment": {
            "resolve": "@medusajs/medusa/payment",
          },
          "Pricing": {
            "resolve": "@medusajs/medusa/pricing",
          },
          "Product": {
            "resolve": "@medusajs/medusa/product",
          },
          "Promotion": {
            "resolve": "@medusajs/medusa/promotion",
          },
          "Region": {
            "resolve": "@medusajs/medusa/region",
          },
          "SalesChannel": {
            "resolve": "@medusajs/medusa/sales-channel",
          },
          "StockLocation": {
            "resolve": "@medusajs/medusa/stock-location-next",
          },
          "Store": {
            "resolve": "@medusajs/medusa/store",
          },
          "Tax": {
            "resolve": "@medusajs/medusa/tax",
          },
          "User": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/medusa/user",
          },
          "Workflows": {
            "resolve": "@medusajs/medusa/workflow-engine-inmemory",
          },
        },
        "plugins": [],
        "projectConfig": {
          "databaseUrl": "postgres://localhost/medusa-starter-default",
          "http": {
            "adminCors": "http://localhost:3000",
            "authCors": "http://localhost:7000,http://localhost:7001,http://localhost:5173",
            "cookieSecret": "supersecret",
            "jwtSecret": "supersecret",
            "storeCors": "http://localhost:8000",
          },
        },
      }
    `)
  })
})
