import { createRuleTester } from "../../../test-utils"
import { rule } from "../rule"

const ruleTester = createRuleTester()

ruleTester.run("no-deprecated-remote-query-config", rule, {
  valid: [
    // Already using queryConfig.
    {
      code: `
        import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
        export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
          const { fields } = req.queryConfig
        }
      `,
    },
    // Unrelated property on a typed req.
    {
      code: `
        import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
        export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
          const id = req.params.id
        }
      `,
    },
    // remoteQueryConfig on something that isn't a typed Medusa request.
    {
      code: `
        const obj = { remoteQueryConfig: {} }
        const cfg = obj.remoteQueryConfig
      `,
    },
    // req-named param in a non-handler function with no type annotation.
    {
      code: `
        function helper(req) {
          return req.remoteQueryConfig
        }
      `,
    },
    // Non-exported handler-named function.
    {
      code: `
        const GET = async (req, res) => {
          return req.remoteQueryConfig
        }
      `,
    },
    // Computed access.
    {
      code: `
        import { MedusaRequest } from "@medusajs/framework/http"
        export const GET = async (req: MedusaRequest, res: unknown) => {
          return req["remoteQueryConfig"]
        }
      `,
    },
    // Import from unrelated source — the local "MedusaRequest" is not tracked.
    {
      code: `
        import { MedusaRequest } from "some-other-pkg"
        function handler(req: MedusaRequest) {
          return req.remoteQueryConfig
        }
      `,
    },
  ],
  invalid: [
    // Typed param via direct import.
    {
      code: `
        import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
        export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
          const { fields } = req.remoteQueryConfig
        }
      `,
      errors: [{ messageId: "deprecatedRemoteQueryConfig" }],
      output: `
        import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
        export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
          const { fields } = req.queryConfig
        }
      `,
    },
    // AuthenticatedMedusaRequest.
    {
      code: `
        import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
        export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
          return req.remoteQueryConfig
        }
      `,
      errors: [{ messageId: "deprecatedRemoteQueryConfig" }],
      output: `
        import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
        export const POST = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
          return req.queryConfig
        }
      `,
    },
    // Aliased import.
    {
      code: `
        import { MedusaRequest as MReq } from "@medusajs/framework/http"
        function handler(req: MReq) {
          return req.remoteQueryConfig
        }
      `,
      errors: [{ messageId: "deprecatedRemoteQueryConfig" }],
      output: `
        import { MedusaRequest as MReq } from "@medusajs/framework/http"
        function handler(req: MReq) {
          return req.queryConfig
        }
      `,
    },
    // Untyped param named `req` inside an exported handler.
    {
      code: `
        export const GET = async (req, res) => {
          return req.remoteQueryConfig
        }
      `,
      errors: [{ messageId: "deprecatedRemoteQueryConfig" }],
      output: `
        export const GET = async (req, res) => {
          return req.queryConfig
        }
      `,
    },
    // Function declaration handler.
    {
      code: `
        export async function DELETE(req, res) {
          const cfg = req.remoteQueryConfig
        }
      `,
      errors: [{ messageId: "deprecatedRemoteQueryConfig" }],
      output: `
        export async function DELETE(req, res) {
          const cfg = req.queryConfig
        }
      `,
    },
    // Multiple accesses.
    {
      code: `
        import { MedusaRequest } from "@medusajs/framework/http"
        export const PATCH = async (req: MedusaRequest, res) => {
          const a = req.remoteQueryConfig
          const b = req.remoteQueryConfig.fields
        }
      `,
      errors: [
        { messageId: "deprecatedRemoteQueryConfig" },
        { messageId: "deprecatedRemoteQueryConfig" },
      ],
      output: `
        import { MedusaRequest } from "@medusajs/framework/http"
        export const PATCH = async (req: MedusaRequest, res) => {
          const a = req.queryConfig
          const b = req.queryConfig.fields
        }
      `,
    },
    // Renamed param with type annotation.
    {
      code: `
        import { MedusaRequest } from "@medusajs/framework/http"
        function helper(request: MedusaRequest) {
          return request.remoteQueryConfig
        }
      `,
      errors: [{ messageId: "deprecatedRemoteQueryConfig" }],
      output: `
        import { MedusaRequest } from "@medusajs/framework/http"
        function helper(request: MedusaRequest) {
          return request.queryConfig
        }
      `,
    },
    // HttpTypes-qualified annotation.
    {
      code: `
        import { HttpTypes } from "@medusajs/framework/types"
        export const GET = async (req: HttpTypes.MedusaRequest, res) => {
          return req.remoteQueryConfig
        }
      `,
      errors: [{ messageId: "deprecatedRemoteQueryConfig" }],
      output: `
        import { HttpTypes } from "@medusajs/framework/types"
        export const GET = async (req: HttpTypes.MedusaRequest, res) => {
          return req.queryConfig
        }
      `,
    },
  ],
})
