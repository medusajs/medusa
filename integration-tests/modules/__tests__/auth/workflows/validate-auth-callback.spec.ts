import {
  validateAuthCallbackWorkflow,
  validateAuthCallbackWorkflowId,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IAuthModuleService, IWorkflowEngineService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

jest.setTimeout(100000)

const providerTokens = {
  access_token: "gho_access",
  refresh_token: "ghr_refresh",
  access_token_expires_at: "2030-01-01T00:00:00.000Z",
  refresh_token_expires_at: "2030-06-01T00:00:00.000Z",
}

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("validateAuthCallbackWorkflow", () => {
      let container
      let authModule: IAuthModuleService
      const hookCalls: any[] = []

      beforeAll(() => {
        container = getContainer()
        authModule = container.resolve(Modules.AUTH)
        validateAuthCallbackWorkflow.hooks.authCallbackValidated((input) => {
          hookCalls.push(input)
        })
      })

      afterEach(() => {
        hookCalls.length = 0
        jest.restoreAllMocks()
      })

      const run = () =>
        validateAuthCallbackWorkflow(container).run({
          input: {
            actor_type: "customer",
            auth_provider: "github",
            auth_data: { query: { code: "123", state: "456" } },
          },
        })

      it("passes the provider's tokens to the hook and leaves them out of the result", async () => {
        const authIdentity = { id: "authid_1" } as any
        jest
          .spyOn(authModule, "validateCallback")
          .mockResolvedValue({ success: true, authIdentity, providerTokens })

        const { result } = await run()

        expect(result).toEqual({ success: true, authIdentity })
        expect(JSON.stringify(result)).not.toContain(
          providerTokens.access_token
        )
        expect(hookCalls).toEqual([
          {
            actor_type: "customer",
            auth_provider: "github",
            auth_identity: authIdentity,
            mfa_required: false,
            provider_tokens: providerTokens,
          },
        ])
      })

      it("tells the hook when an MFA challenge is still needed", async () => {
        jest.spyOn(authModule, "validateCallback").mockResolvedValue({
          success: true,
          authIdentity: { id: "authid_1" } as any,
          mfaChallenge: { id: "mfa_1" } as any,
          providerTokens,
        })

        await run()

        expect(hookCalls).toEqual([
          expect.objectContaining({
            mfa_required: true,
            provider_tokens: providerTokens,
          }),
        ])
      })

      it("doesn't run the hook when the callback fails", async () => {
        jest
          .spyOn(authModule, "validateCallback")
          .mockResolvedValue({ success: false, error: "No code provided" })

        const { result } = await run()

        expect(result).toEqual({ success: false, error: "No code provided" })
        expect(hookCalls).toEqual([])
      })

      it("isn't stored, so the tokens aren't kept in workflow executions", async () => {
        jest.spyOn(authModule, "validateCallback").mockResolvedValue({
          success: true,
          authIdentity: { id: "authid_1" } as any,
          providerTokens,
        })

        await run()

        const workflowEngine = container.resolve(
          Modules.WORKFLOW_ENGINE
        ) as IWorkflowEngineService
        expect(
          await workflowEngine.listWorkflowExecutions({
            workflow_id: validateAuthCallbackWorkflowId,
          })
        ).toEqual([])
      })
    })
  },
})
