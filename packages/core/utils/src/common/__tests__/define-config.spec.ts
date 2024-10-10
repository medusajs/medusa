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
          "ApiKey": true,
          "Auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/auth",
          },
          "Cache": true,
          "Cart": true,
          "Currency": true,
          "Customer": true,
          "EventBus": true,
          "File": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/file",
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
            "resolve": "@medusajs/fulfillment",
          },
          "Inventory": true,
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
            "resolve": "@medusajs/notification",
          },
          "Order": true,
          "Payment": true,
          "Pricing": true,
          "Product": true,
          "Promotion": true,
          "Region": true,
          "SalesChannel": true,
          "StockLocation": true,
          "Store": true,
          "Tax": true,
          "User": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/user",
          },
          "Workflows": true,
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
          "ApiKey": true,
          "Auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/auth",
          },
          "Cache": true,
          "Cart": true,
          "Currency": true,
          "Customer": true,
          "EventBus": true,
          "File": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/file",
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
            "resolve": "@medusajs/fulfillment",
          },
          "GithubModuleService": {
            "resolve": "./modules/github",
          },
          "Inventory": true,
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
            "resolve": "@medusajs/notification",
          },
          "Order": true,
          "Payment": true,
          "Pricing": true,
          "Product": true,
          "Promotion": true,
          "Region": true,
          "SalesChannel": true,
          "StockLocation": true,
          "Store": true,
          "Tax": true,
          "User": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/user",
          },
          "Workflows": true,
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
          "ApiKey": true,
          "Auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/auth",
          },
          "Cache": true,
          "Cart": true,
          "Currency": true,
          "Customer": true,
          "EventBus": true,
          "File": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/file",
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
            "resolve": "@medusajs/fulfillment",
          },
          "Inventory": true,
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
            "resolve": "@medusajs/notification",
          },
          "Order": true,
          "Payment": true,
          "Pricing": true,
          "Product": true,
          "Promotion": true,
          "Region": true,
          "SalesChannel": true,
          "StockLocation": true,
          "Store": true,
          "Tax": true,
          "User": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/user",
          },
          "Workflows": true,
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
          "ApiKey": true,
          "Auth": {
            "options": {
              "providers": [
                {
                  "id": "emailpass",
                  "resolve": "@medusajs/auth-emailpass",
                },
              ],
            },
            "resolve": "@medusajs/auth",
          },
          "Cache": true,
          "Currency": true,
          "Customer": true,
          "EventBus": true,
          "File": {
            "options": {
              "providers": [
                {
                  "id": "local",
                  "resolve": "@medusajs/file-local-next",
                },
              ],
            },
            "resolve": "@medusajs/file",
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
            "resolve": "@medusajs/fulfillment",
          },
          "Inventory": true,
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
            "resolve": "@medusajs/notification",
          },
          "Order": true,
          "Payment": true,
          "Pricing": true,
          "Product": true,
          "Promotion": true,
          "Region": true,
          "SalesChannel": true,
          "StockLocation": true,
          "Store": true,
          "Tax": true,
          "User": {
            "options": {
              "jwt_secret": "supersecret",
            },
            "resolve": "@medusajs/user",
          },
          "Workflows": true,
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
