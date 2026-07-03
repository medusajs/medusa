import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("route-params-must-be-defined", rule, {
  valid: [
    // Direct param access matches `[id]` folder.
    {
      code: `export const GET = (req, res) => { const x = req.params.id }`,
      filename: "src/api/admin/products/[id]/route.ts",
    },
    // Computed string-literal access matches.
    {
      code: `export const GET = (req, res) => { const x = req.params["id"] }`,
      filename: "src/api/admin/products/[id]/route.ts",
    },
    // Destructuring matches.
    {
      code: `export const GET = (req, res) => { const { id } = req.params }`,
      filename: "src/api/admin/products/[id]/route.ts",
    },
    // Nested params (`variant_id` is also a folder).
    {
      code: `export const GET = (req, res) => { const a = req.params.id; const b = req.params.variant_id }`,
      filename: "src/api/admin/products/[id]/variants/[variant_id]/route.ts",
    },
    // Destructure-with-rename uses the original key name, which matches.
    {
      code: `export const GET = (req, res) => { const { id: pid } = req.params }`,
      filename: "src/api/admin/products/[id]/route.ts",
    },
    // Not a route file — rule is a no-op.
    {
      code: `export const helper = (req) => req.params.nope`,
      filename: "src/api/admin/products/[id]/helpers.ts",
    },
    // File outside api/ — rule is a no-op.
    {
      code: `export const GET = (req, res) => { const x = req.params.nope }`,
      filename: "src/workflows/foo.ts",
    },
    // Synthetic filename — rule bails out.
    {
      code: `export const GET = (req, res) => { const x = req.params.nope }`,
      filename: "<input>",
    },
    // Computed access with non-string-literal key — can't statically verify, skip.
    {
      code: `export const GET = (req, res) => { const k = "id"; const x = req.params[k] }`,
      filename: "src/api/admin/products/[id]/route.ts",
    },
    // `req.params` without further chain is fine.
    {
      code: `export const GET = (req, res) => { const p = req.params }`,
      filename: "src/api/admin/products/[id]/route.ts",
    },
    // Different identifier (not `req`) — not our concern.
    {
      code: `export const GET = (req, res) => { const other = {}; const x = other.params.nope }`,
      filename: "src/api/admin/products/[id]/route.ts",
    },
  ],
  invalid: [
    // Direct access on a static route — no params available at all.
    {
      code: `export const GET = (req, res) => { const x = req.params.id }`,
      filename: "src/api/admin/products/route.ts",
      errors: [
        {
          messageId: "unknownRouteParam",
          data: { name: "id", available: "(none)" },
        },
      ],
    },
    // Direct access — wrong param name.
    {
      code: `export const GET = (req, res) => { const x = req.params.foo }`,
      filename: "src/api/admin/products/[id]/route.ts",
      errors: [
        {
          messageId: "unknownRouteParam",
          data: { name: "foo", available: "`id`" },
        },
      ],
    },
    // Computed string-literal — wrong name.
    {
      code: `export const GET = (req, res) => { const x = req.params["foo"] }`,
      filename: "src/api/admin/products/[id]/route.ts",
      errors: [
        {
          messageId: "unknownRouteParam",
          data: { name: "foo", available: "`id`" },
        },
      ],
    },
    // Destructuring — wrong key.
    {
      code: `export const GET = (req, res) => { const { foo } = req.params }`,
      filename: "src/api/admin/products/[id]/route.ts",
      errors: [
        {
          messageId: "unknownRouteParam",
          data: { name: "foo", available: "`id`" },
        },
      ],
    },
    // Destructuring — mix of valid and invalid keys.
    {
      code: `export const GET = (req, res) => { const { id, foo } = req.params }`,
      filename: "src/api/admin/products/[id]/route.ts",
      errors: [
        {
          messageId: "unknownRouteParam",
          data: { name: "foo", available: "`id`" },
        },
      ],
    },
    // Multiple invalid accesses.
    {
      code: `export const GET = (req, res) => { const a = req.params.foo; const b = req.params.bar }`,
      filename: "src/api/admin/products/[id]/route.ts",
      errors: [
        {
          messageId: "unknownRouteParam",
          data: { name: "foo", available: "`id`" },
        },
        {
          messageId: "unknownRouteParam",
          data: { name: "bar", available: "`id`" },
        },
      ],
    },
    // Nested route — `id` is valid but `nope` isn't.
    {
      code: `export const GET = (req, res) => { const a = req.params.id; const b = req.params.nope }`,
      filename: "src/api/admin/products/[id]/variants/[variant_id]/route.ts",
      errors: [
        {
          messageId: "unknownRouteParam",
          data: { name: "nope", available: "`id`, `variant_id`" },
        },
      ],
    },
    // route.js variant.
    {
      code: `export const GET = (req, res) => { const x = req.params.foo }`,
      filename: "src/api/admin/products/[id]/route.js",
      errors: [
        {
          messageId: "unknownRouteParam",
          data: { name: "foo", available: "`id`" },
        },
      ],
    },
    // Nested api/ (no leading src/).
    {
      code: `export const GET = (req, res) => { const x = req.params.foo }`,
      filename: "api/admin/orders/[id]/route.ts",
      errors: [
        {
          messageId: "unknownRouteParam",
          data: { name: "foo", available: "`id`" },
        },
      ],
    },
  ],
})
