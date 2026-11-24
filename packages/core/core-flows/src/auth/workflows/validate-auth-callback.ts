import type {
  AuthenticationResponse,
  AuthIdentityDTO,
} from "@medusajs/framework/types"
import {
  createHook,
  createWorkflow,
  Hook,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  validateAuthCallbackStep,
  ValidateAuthCallbackStepInput,
} from "../steps"

/**
 * The data to validate a third-party provider's authentication callback.
 */
export type ValidateAuthCallbackWorkflowInput =
  ValidateAuthCallbackStepInput & {
    /**
     * The type of actor logging in, such as `user` or `customer`.
     */
    actor_type: string
  }

/**
 * The input of the `authCallbackValidated` hook.
 */
export type AuthCallbackValidatedHookInput = {
  /**
   * The type of actor logging in, such as `user` or `customer`.
   */
  actor_type: string
  /**
   * The ID of the auth provider, such as `github`.
   */
  auth_provider: string
  /**
   * The auth identity that logged in.
   */
  auth_identity: AuthIdentityDTO
  /**
   * Whether the login still needs an MFA challenge to be completed.
   */
  mfa_required: boolean
  /**
   * What the provider received from the third party, as returned, keyed by the
   * call that returned it. For example, GitHub sets `token` and `user`, and
   * Google, Medusa Cloud and OIDC providers set `token` and `claims`. See each
   * provider's documentation for its keys.
   *
   * It's secret: it can hold access, refresh and ID tokens. Don't log it, and
   * don't pass it to a stored workflow, which would keep it in its execution.
   */
  provider_data?: Record<string, unknown>
}

/**
 * The `authCallbackValidated` hook of {@link validateAuthCallbackWorkflow}.
 */
type AuthCallbackValidatedHook = Hook<
  "authCallbackValidated",
  AuthCallbackValidatedHookInput,
  unknown
>

/**
 * The ID of the validate auth callback workflow.
 *
 * @since 2.23.1
 */
export const validateAuthCallbackWorkflowId = "validate-auth-callback"

/**
 * This workflow validates a third-party provider's authentication callback,
 * such as GitHub's or Google's. It's used by the
 * `/auth/{actor_type}/{auth_provider}/callback` API route.
 *
 * The workflow isn't stored, so what the provider received (its tokens) isn't
 * kept in workflow executions. Its result never includes it.
 *
 * @example
 * const { result } = await validateAuthCallbackWorkflow(container).run({
 *   input: {
 *     actor_type: "customer",
 *     auth_provider: "github",
 *     auth_data: {
 *       query: { code: "123", state: "456" },
 *     },
 *   },
 * })
 *
 * @summary
 *
 * Validate a third-party provider's authentication callback.
 *
 * @property hooks.authCallbackValidated - This hook is executed after the
 * provider validated the callback, before a token is issued. The login can
 * still be refused afterwards, for example when the auth identity isn't
 * associated with an actor of the type. You can consume this hook to keep what
 * the provider received, such as GitHub's tokens, in your own storage.
 *
 * ```ts
 * import { validateAuthCallbackWorkflow } from "@medusajs/medusa/core-flows"
 *
 * validateAuthCallbackWorkflow.hooks.authCallbackValidated(
 *   async ({ auth_identity, auth_provider, provider_data }, { container }) => {
 *     // keep provider_data.token, encrypted, in your own storage
 *   }
 * )
 * ```
 *
 * An error thrown in the hook fails the login. `provider_data` is secret: don't
 * log it, and don't pass it to a stored workflow.
 *
 * @since 2.23.1
 */
export const validateAuthCallbackWorkflow = createWorkflow(
  validateAuthCallbackWorkflowId,
  (
    input: WorkflowData<ValidateAuthCallbackWorkflowInput>
  ): WorkflowResponse<
    Omit<AuthenticationResponse, "providerData">,
    [AuthCallbackValidatedHook]
  > => {
    const result = validateAuthCallbackStep({
      auth_provider: input.auth_provider,
      auth_data: input.auth_data,
    })

    const hookInput = transform({ input, result }, ({ input, result }) => ({
      actor_type: input.actor_type,
      auth_provider: input.auth_provider,
      auth_identity: result.authIdentity!,
      mfa_required: !!result.mfaChallenge,
      provider_data: result.providerData,
    }))

    let authCallbackValidated!: AuthCallbackValidatedHook
    when(
      "auth-callback-validated",
      { result },
      ({ result }) => result.success && !!result.authIdentity
    ).then(() => {
      authCallbackValidated = createHook("authCallbackValidated", hookInput)
    })

    const response = transform({ result }, ({ result }) => {
      const { providerData, ...rest } = result
      return rest
    })

    return new WorkflowResponse(response, {
      hooks: [authCallbackValidated],
    })
  }
)
