import * as fs from "fs"
import * as os from "os"
import * as path from "path"
import { RuleTester } from "@typescript-eslint/rule-tester"
import { rule } from "../rule"

RuleTester.afterAll = afterAll
RuleTester.describe = describe
RuleTester.it = it
RuleTester.itOnly = it.only

const tmpRoots: string[] = []

afterAll(() => {
  for (const dir of tmpRoots) {
    try {
      fs.rmSync(dir, { recursive: true, force: true })
    } catch {
      // ignore
    }
  }
})

type ApiFile = { rel: string; content: string }

function makeApi(files: ApiFile[]): {
  apiDir: string
  resolve: (rel: string) => string
} {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "medusa-eslint-validated-"))
  tmpRoots.push(root)
  const apiDir = path.join(root, "src", "api")
  fs.mkdirSync(apiDir, { recursive: true })
  for (const f of files) {
    const abs = path.join(apiDir, f.rel)
    fs.mkdirSync(path.dirname(abs), { recursive: true })
    fs.writeFileSync(abs, f.content, "utf8")
  }
  return {
    apiDir,
    resolve: (rel: string) => path.join(apiDir, rel),
  }
}

const MIDDLEWARES_BODY_POST = `
import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { z } from "zod"

const schema = z.object({ name: z.string() })

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/customers",
      method: "POST",
      middlewares: [validateAndTransformBody(schema)],
    },
  ],
})
`

const MIDDLEWARES_BODY_ON_GET = `
import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { z } from "zod"

const schema = z.object({})

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/customers",
      method: "GET",
      middlewares: [validateAndTransformBody(schema)],
    },
  ],
})
`

const MIDDLEWARES_QUERY_GET = `
import {
  defineMiddlewares,
  validateAndTransformQuery,
} from "@medusajs/framework/http"
import { z } from "zod"

const schema = z.object({ q: z.string() })

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/customers",
      method: "GET",
      middlewares: [validateAndTransformQuery(schema, {})],
    },
  ],
})
`

const MIDDLEWARES_NO_METHOD = `
import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { z } from "zod"

const schema = z.object({})

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/customers",
      middlewares: [validateAndTransformBody(schema)],
    },
  ],
})
`

const MIDDLEWARES_PARAM = `
import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { z } from "zod"

const schema = z.object({})

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/customers/:id",
      method: "POST",
      middlewares: [validateAndTransformBody(schema)],
    },
  ],
})
`

const MIDDLEWARES_WILDCARD = `
import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { z } from "zod"

const schema = z.object({})

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/*",
      method: "POST",
      middlewares: [validateAndTransformBody(schema)],
    },
  ],
})
`

const MIDDLEWARES_METHODS_ARRAY = `
import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { z } from "zod"

const schema = z.object({})

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/customers",
      methods: ["POST", "PUT"],
      middlewares: [validateAndTransformBody(schema)],
    },
  ],
})
`

const MIDDLEWARES_DIFFERENT_ROUTE = `
import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http"
import { z } from "zod"

const schema = z.object({})

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/orders",
      method: "POST",
      middlewares: [validateAndTransformBody(schema)],
    },
  ],
})
`

const fixBodyPost = makeApi([
  { rel: "middlewares.ts", content: MIDDLEWARES_BODY_POST },
])
const fixBodyOnGet = makeApi([
  { rel: "middlewares.ts", content: MIDDLEWARES_BODY_ON_GET },
])
const fixQueryGet = makeApi([
  { rel: "middlewares.ts", content: MIDDLEWARES_QUERY_GET },
])
const fixNoMethod = makeApi([
  { rel: "middlewares.ts", content: MIDDLEWARES_NO_METHOD },
])
const fixParam = makeApi([
  { rel: "middlewares.ts", content: MIDDLEWARES_PARAM },
])
const fixWildcard = makeApi([
  { rel: "middlewares.ts", content: MIDDLEWARES_WILDCARD },
])
const fixMethodsArray = makeApi([
  { rel: "middlewares.ts", content: MIDDLEWARES_METHODS_ARRAY },
])
const fixDifferent = makeApi([
  { rel: "middlewares.ts", content: MIDDLEWARES_DIFFERENT_ROUTE },
])
const fixNoMiddlewares = makeApi([])

const ruleTester = new RuleTester()

ruleTester.run("use-validated-body-or-query", rule, {
  valid: [
    // No middlewares.ts in api root → no-op.
    {
      code: `export const POST = async (req, res) => { res.json(req.body) }`,
      filename: fixNoMiddlewares.resolve("admin/customers/route.ts"),
    },
    // middlewares.ts exists but validation targets a different route.
    {
      code: `export const POST = async (req, res) => { res.json(req.body) }`,
      filename: fixDifferent.resolve("admin/customers/route.ts"),
    },
    // Body validation applied but handler already uses validatedBody.
    {
      code: `export const POST = async (req, res) => { res.json(req.validatedBody) }`,
      filename: fixBodyPost.resolve("admin/customers/route.ts"),
    },
    // Body validation applied to POST — GET handler's req.body is NOT flagged
    // (GET is not in the middleware's method list).
    {
      code: `export const GET = async (req, res) => { res.json(req.body) }`,
      filename: fixBodyPost.resolve("admin/customers/route.ts"),
    },
    // Body validation applied — req.query in same handler is fine (only body is validated).
    {
      code: `export const POST = async (req, res) => { res.json(req.query) }`,
      filename: fixBodyPost.resolve("admin/customers/route.ts"),
    },
    // Query validation applied — req.body in same file is fine (only query is validated).
    {
      code: `export const POST = async (req, res) => { res.json(req.body) }`,
      filename: fixQueryGet.resolve("admin/customers/route.ts"),
    },
    // File outside api/ → no-op.
    {
      code: `export const POST = async (req, res) => { res.json(req.body) }`,
      filename: "/tmp/some/other/file.ts",
    },
    // Synthetic filename → no-op.
    {
      code: `export const POST = async (req, res) => { res.json(req.body) }`,
      filename: "<input>",
    },
    // Not a route.ts → no-op.
    {
      code: `export const POST = async (req, res) => { res.json(req.body) }`,
      filename: fixBodyPost.resolve("admin/customers/helpers.ts"),
    },
    // Destructured req param — current implementation bails (no false positives).
    {
      code: `export const POST = async ({ body }, res) => { res.json(body) }`,
      filename: fixBodyPost.resolve("admin/customers/route.ts"),
    },
  ],
  invalid: [
    // POST handler uses req.body when body validation is applied.
    {
      code: `export const POST = async (req, res) => { res.json(req.body) }`,
      filename: fixBodyPost.resolve("admin/customers/route.ts"),
      errors: [{ messageId: "useValidatedBody" }],
      output: `export const POST = async (req, res) => { res.json(req.validatedBody) }`,
    },
    // GET handler uses req.query when query validation is applied.
    {
      code: `export const GET = async (req, res) => { res.json(req.query) }`,
      filename: fixQueryGet.resolve("admin/customers/route.ts"),
      errors: [{ messageId: "useValidatedQuery" }],
      output: `export const GET = async (req, res) => { res.json(req.validatedQuery) }`,
    },
    // Body validation can be applied to GET — GET handler's req.body must use
    // validatedBody, regardless that GET typically doesn't have a body.
    {
      code: `export const GET = async (req, res) => { res.json(req.body) }`,
      filename: fixBodyOnGet.resolve("admin/customers/route.ts"),
      errors: [{ messageId: "useValidatedBody" }],
      output: `export const GET = async (req, res) => { res.json(req.validatedBody) }`,
    },
    // Function declaration form.
    {
      code: `export async function POST(req, res) { res.json(req.body) }`,
      filename: fixBodyPost.resolve("admin/customers/route.ts"),
      errors: [{ messageId: "useValidatedBody" }],
      output: `export async function POST(req, res) { res.json(req.validatedBody) }`,
    },
    // Aliased req parameter name.
    {
      code: `export const POST = async (request, res) => { res.json(request.body) }`,
      filename: fixBodyPost.resolve("admin/customers/route.ts"),
      errors: [{ messageId: "useValidatedBody" }],
      output: `export const POST = async (request, res) => { res.json(request.validatedBody) }`,
    },
    // No method specified on the middleware entry — still flagged.
    {
      code: `export const PUT = async (req, res) => { res.json(req.body) }`,
      filename: fixNoMethod.resolve("admin/customers/route.ts"),
      errors: [{ messageId: "useValidatedBody" }],
      output: `export const PUT = async (req, res) => { res.json(req.validatedBody) }`,
    },
    // Matcher uses :id — route file is in [id] folder.
    {
      code: `export const POST = async (req, res) => { res.json(req.body) }`,
      filename: fixParam.resolve("admin/customers/[id]/route.ts"),
      errors: [{ messageId: "useValidatedBody" }],
      output: `export const POST = async (req, res) => { res.json(req.validatedBody) }`,
    },
    // Wildcard matcher.
    {
      code: `export const POST = async (req, res) => { res.json(req.body) }`,
      filename: fixWildcard.resolve("admin/customers/route.ts"),
      errors: [{ messageId: "useValidatedBody" }],
      output: `export const POST = async (req, res) => { res.json(req.validatedBody) }`,
    },
    // methods: ["POST", "PUT"] — body validation applies to the matcher; both handlers flagged.
    {
      code: `
        export const POST = async (req, res) => { res.json(req.body) }
        export const PUT = async (req, res) => { res.json(req.body) }
      `,
      filename: fixMethodsArray.resolve("admin/customers/route.ts"),
      errors: [
        { messageId: "useValidatedBody" },
        { messageId: "useValidatedBody" },
      ],
      output: `
        export const POST = async (req, res) => { res.json(req.validatedBody) }
        export const PUT = async (req, res) => { res.json(req.validatedBody) }
      `,
    },
    // methods: ["POST", "PUT"] — DELETE is NOT covered, so DELETE handler is left alone.
    {
      code: `
        export const POST = async (req, res) => { res.json(req.body) }
        export const DELETE = async (req, res) => { res.json(req.body) }
      `,
      filename: fixMethodsArray.resolve("admin/customers/route.ts"),
      errors: [{ messageId: "useValidatedBody" }],
      output: `
        export const POST = async (req, res) => { res.json(req.validatedBody) }
        export const DELETE = async (req, res) => { res.json(req.body) }
      `,
    },
    // Multiple uses of req.body within a single handler.
    {
      code: `export const POST = async (req, res) => { const a = req.body; const b = req.body; res.json({ a, b }) }`,
      filename: fixBodyPost.resolve("admin/customers/route.ts"),
      errors: [
        { messageId: "useValidatedBody" },
        { messageId: "useValidatedBody" },
      ],
      output: `export const POST = async (req, res) => { const a = req.validatedBody; const b = req.validatedBody; res.json({ a, b }) }`,
    },
  ],
})
