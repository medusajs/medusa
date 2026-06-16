import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("route-dynamic-folder-syntax", rule, {
  valid: [
    // Static API route — no brackets.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/store/products/route.ts",
    },
    // Valid `[id]` dynamic segment.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/admin/products/[id]/route.ts",
    },
    // Multiple valid dynamic segments.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/admin/products/[id]/variants/[variant_id]/route.ts",
    },
    // Underscore-leading param name is allowed.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/store/things/[_id]/route.ts",
    },
    // Valid admin UI route with dynamic segment.
    {
      code: `export default function Page() { return null }`,
      filename: "src/admin/routes/products/[id]/page.tsx",
    },
    // File outside api/ and admin/routes/ — rule is a no-op.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/workflows/[bad]/file.ts",
    },
    // Synthetic filename — rule bails out.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "<input>",
    },
    // Nested api/ (no leading src/) with valid dynamic folder.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "api/admin/orders/[id]/route.ts",
    },
  ],
  invalid: [
    // Optional-catch-all `[[id]]`.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/admin/products/[[id]]/route.ts",
      errors: [
        { messageId: "invalidDynamicFolder", data: { segment: "[[id]]" } },
      ],
    },
    // Rest/catch-all `[...slug]`.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/store/docs/[...slug]/route.ts",
      errors: [
        { messageId: "invalidDynamicFolder", data: { segment: "[...slug]" } },
      ],
    },
    // Param name starting with a digit.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/store/things/[1id]/route.ts",
      errors: [
        { messageId: "invalidDynamicFolder", data: { segment: "[1id]" } },
      ],
    },
    // Empty brackets.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/store/things/[]/route.ts",
      errors: [
        { messageId: "invalidDynamicFolder", data: { segment: "[]" } },
      ],
    },
    // Multiple invalid segments — one error per segment.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/admin/things/[[id]]/sub/[...rest]/route.ts",
      errors: [
        { messageId: "invalidDynamicFolder", data: { segment: "[[id]]" } },
        { messageId: "invalidDynamicFolder", data: { segment: "[...rest]" } },
      ],
    },
    // Admin UI route with invalid dynamic folder.
    {
      code: `export default function Page() { return null }`,
      filename: "src/admin/routes/products/[[id]]/page.tsx",
      errors: [
        { messageId: "invalidDynamicFolder", data: { segment: "[[id]]" } },
      ],
    },
    // Hyphen in param name — not allowed by the identifier regex.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/store/things/[my-id]/route.ts",
      errors: [
        { messageId: "invalidDynamicFolder", data: { segment: "[my-id]" } },
      ],
    },
    // Leading dynamic segment immediately under store/ — route must have a static prefix.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/store/[param]/route.ts",
      errors: [
        { messageId: "leadingDynamicFolder", data: { segment: "[param]" } },
      ],
    },
    // Leading dynamic segment immediately under admin/.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/admin/[id]/route.ts",
      errors: [
        { messageId: "leadingDynamicFolder", data: { segment: "[id]" } },
      ],
    },
    // Leading dynamic segment immediately under auth/.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/auth/[provider]/route.ts",
      errors: [
        { messageId: "leadingDynamicFolder", data: { segment: "[provider]" } },
      ],
    },
    // Leading dynamic segment directly under src/api/ (no group prefix).
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/[foo]/route.ts",
      errors: [
        { messageId: "leadingDynamicFolder", data: { segment: "[foo]" } },
      ],
    },
    // Leading dynamic segment in admin UI route.
    {
      code: `export default function Page() { return null }`,
      filename: "src/admin/routes/[id]/page.tsx",
      errors: [
        { messageId: "leadingDynamicFolder", data: { segment: "[id]" } },
      ],
    },
    // Leading dynamic + a deeper invalid segment — both reported.
    {
      code: `export const GET = (req, res) => {}`,
      filename: "src/api/store/[id]/sub/[...rest]/route.ts",
      errors: [
        { messageId: "leadingDynamicFolder", data: { segment: "[id]" } },
        { messageId: "invalidDynamicFolder", data: { segment: "[...rest]" } },
      ],
    },
  ],
})
