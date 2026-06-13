import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const ruleTester = new RuleTester()

ruleTester.run("no-service-mutations-in-api-route", rule, {
  valid: [
    // Read-only method on a resolved module service — fine.
    {
      code: `
        export const GET = async (req, res) => {
          const productModule = req.scope.resolve(Modules.PRODUCT)
          const product = await productModule.retrieveProduct(req.params.id)
          res.json({ product })
        }
      `,
      filename: "src/api/admin/products/[id]/route.ts",
    },
    // Workflow invocation — fine.
    {
      code: `
        export const POST = async (req, res) => {
          await createProductWorkflow(req.scope).run({ input: req.body })
          res.status(200).json({})
        }
      `,
      filename: "src/api/admin/products/route.ts",
    },
    // Query service resolved via ContainerRegistrationKeys — not a module service.
    {
      code: `
        export const GET = async (req, res) => {
          const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
          const data = await query.graph({ entity: "product", fields: ["id"] })
          res.json(data)
        }
      `,
      filename: "src/api/store/products/route.ts",
    },
    // Mutation outside of an HTTP handler export — out of scope.
    {
      code: `
        const helper = async (scope) => {
          const productModule = scope.resolve(Modules.PRODUCT)
          await productModule.createProducts({})
        }
      `,
      filename: "src/api/admin/products/route.ts",
    },
    // Verb that doesn't match the mutation pattern (`createdAt`-style).
    {
      code: `
        export const GET = async (req, res) => {
          const productModule = req.scope.resolve(Modules.PRODUCT)
          const x = productModule.created
          res.json({ x })
        }
      `,
      filename: "src/api/admin/products/route.ts",
    },
    // Not under api/ — rule bails.
    {
      code: `
        export const POST = async (req, res) => {
          const productModule = req.scope.resolve(Modules.PRODUCT)
          await productModule.createProducts({})
        }
      `,
      filename: "src/workflows/products/route.ts",
    },
    // Under api/ but wrong basename — rule bails.
    {
      code: `
        export const POST = async (req, res) => {
          const productModule = req.scope.resolve(Modules.PRODUCT)
          await productModule.createProducts({})
        }
      `,
      filename: "src/api/admin/products/handlers.ts",
    },
    // allowedMutations option suppresses the call.
    {
      code: `
        export const POST = async (req, res) => {
          const productModule = req.scope.resolve(Modules.PRODUCT)
          await productModule.createProducts({})
          res.status(200).json({})
        }
      `,
      filename: "src/api/admin/products/route.ts",
      options: [{ allowedMutations: ["createProducts"] }],
    },
    // Synthetic filename — rule bails.
    {
      code: `
        export const POST = async (req, res) => {
          const productModule = req.scope.resolve(Modules.PRODUCT)
          await productModule.createProducts({})
        }
      `,
      filename: "<input>",
    },
  ],
  invalid: [
    // Canonical violation: `Modules.PRODUCT` + `createProducts`.
    {
      code: `
        export const POST = async (req, res) => {
          const productModule = req.scope.resolve(Modules.PRODUCT)
          await productModule.createProducts(req.body)
          res.status(200).json({})
        }
      `,
      filename: "src/api/admin/products/route.ts",
      errors: [
        {
          messageId: "noMutation",
          data: { service: "productModule", method: "createProducts" },
        },
      ],
    },
    // Module-key string literal also tracked.
    {
      code: `
        export const DELETE = async (req, res) => {
          const orderModule = req.scope.resolve("order")
          await orderModule.deleteOrders([req.params.id])
          res.status(200).json({})
        }
      `,
      filename: "src/api/admin/orders/[id]/route.ts",
      errors: [
        {
          messageId: "noMutation",
          data: { service: "orderModule", method: "deleteOrders" },
        },
      ],
    },
    // Multiple mutation verbs across the prefix list.
    {
      code: `
        export const POST = async (req, res) => {
          const customerModule = req.scope.resolve(Modules.CUSTOMER)
          await customerModule.updateCustomers(req.body)
          await customerModule.softDeleteCustomers([req.body.id])
          await customerModule.restoreCustomers([req.body.id])
          res.status(200).json({})
        }
      `,
      filename: "src/api/admin/customers/route.ts",
      errors: [
        {
          messageId: "noMutation",
          data: { service: "customerModule", method: "updateCustomers" },
        },
        {
          messageId: "noMutation",
          data: { service: "customerModule", method: "softDeleteCustomers" },
        },
        {
          messageId: "noMutation",
          data: { service: "customerModule", method: "restoreCustomers" },
        },
      ],
    },
    // Snake-cased mutation method (suffix starts with `_`).
    {
      code: `
        export const POST = async (req, res) => {
          const cartModule = req.scope.resolve(Modules.CART)
          await cartModule.create_line_items(req.body)
          res.status(200).json({})
        }
      `,
      filename: "src/api/store/carts/route.ts",
      errors: [
        {
          messageId: "noMutation",
          data: { service: "cartModule", method: "create_line_items" },
        },
      ],
    },
    // container.resolve(...) alias works too.
    {
      code: `
        export const POST = async (req, res) => {
          const container = req.scope
          const productModule = container.resolve(Modules.PRODUCT)
          await productModule.createProducts(req.body)
          res.status(200).json({})
        }
      `,
      filename: "src/api/admin/products/route.ts",
      errors: [
        {
          messageId: "noMutation",
          data: { service: "productModule", method: "createProducts" },
        },
      ],
    },
    // Function-declaration handler (not arrow).
    {
      code: `
        export async function POST(req, res) {
          const productModule = req.scope.resolve(Modules.PRODUCT)
          await productModule.upsertProducts(req.body)
          res.status(200).json({})
        }
      `,
      filename: "src/api/admin/products/route.ts",
      errors: [
        {
          messageId: "noMutation",
          data: { service: "productModule", method: "upsertProducts" },
        },
      ],
    },
    // additionalMutationPrefixes option extends the verb list.
    {
      code: `
        export const POST = async (req, res) => {
          const productModule = req.scope.resolve(Modules.PRODUCT)
          await productModule.publishProducts(req.body)
          res.status(200).json({})
        }
      `,
      filename: "src/api/admin/products/route.ts",
      options: [{ additionalMutationPrefixes: ["publish"] }],
      errors: [
        {
          messageId: "noMutation",
          data: { service: "productModule", method: "publishProducts" },
        },
      ],
    },
    // Custom service resolved by string key — also flagged (not just module keys).
    {
      code: `
        export const POST = async (req, res) => {
          const helloService = req.scope.resolve("helloService")
          await helloService.createGreeting(req.body)
          res.json({})
        }
      `,
      filename: "src/api/store/hello/route.ts",
      errors: [
        {
          messageId: "noMutation",
          data: { service: "helloService", method: "createGreeting" },
        },
      ],
    },
    // Nested api/ path without src/.
    {
      code: `
        export const POST = async (req, res) => {
          const productModule = req.scope.resolve(Modules.PRODUCT)
          await productModule.createProducts(req.body)
          res.status(200).json({})
        }
      `,
      filename: "api/admin/products/route.ts",
      errors: [
        {
          messageId: "noMutation",
          data: { service: "productModule", method: "createProducts" },
        },
      ],
    },
  ],
})
