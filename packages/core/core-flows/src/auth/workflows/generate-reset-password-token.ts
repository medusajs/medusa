import { MedusaModule } from "@medusajs/framework/modules-sdk"
import type { ProjectConfigOptions, RbacScope } from "@medusajs/framework/types"
import {
  AuthWorkflowEvents,
  generateJwtToken,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import {
  getRoleAssignmentsStep,
  validateActorRolePermissionsStep,
} from "../../rbac/steps"
import { createPasswordResetTokenStep } from "../steps"

const RESET_PASSWORD_TOKEN_TTL_SECONDS = 15 * 60

/**
 * Ensures the target actor is known when a granting actor is provided, so the
 * granting actor's permissions can be validated against the target's roles.
 */
const validateGrantedStep = createStep(
  "validate-granted",
  async (input: { actor_id?: string; granting_actor_id?: string }) => {
    if (!!input.granting_actor_id && !input.actor_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "actor_id is required when granting_actor_id is provided"
      )
    }
  }
)

export type GenerateResetPasswordTokenWorkflowInput = {
  /**
   * The identifier of the auth identity, such as the user's email.
   */
  entityId: string
  /**
   * The actor type, such as `user` or `customer`. Also used as the role
   * assignment reference when validating the granting actor.
   */
  actorType: string
  provider: string
  secret: ProjectConfigOptions["http"]["jwtSecret"]
  jwtOptions?: ProjectConfigOptions["http"]["jwtOptions"]
  metadata?: Record<string, unknown>
  /**
   * The ID of the actor (e.g. user ID) the token is generated for. Required
   * when `granting_actor_id` is provided.
   *
   * @since 2.23.0
   */
  actor_id?: string
  /**
   * The ID of the actor generating the token on behalf of `actor_id`. When set,
   * the workflow validates that this actor holds all the policies of the
   * target's roles, so a token can't be used to take over a more privileged
   * account. Omit it for self-service resets.
   *
   * @since 2.23.0
   */
  granting_actor_id?: string
  /**
   * The granting actor's type. Defaults to `user`.
   *
   * @since 2.23.0
   */
  granting_actor?: string
  /**
   * The scope the granting actor is acting within.
   *
   * @since 2.23.0
   */
  granting_scope?: RbacScope
}

/**
 * This workflow generates a reset password token for a user. It's used by the
 * [Generate Reset Password Token for Admin](https://docs.medusajs.com/api/admin/auth/generate-reset-password-token)
 * and [Generate Reset Password Token for Customer](https://docs.medusajs.com/api/store/auth/generate-reset-password-token)
 * API Routes.
 *
 * The workflow emits the `auth.password_reset` event, which you can listen to in
 * a [subscriber](https://docs.medusajs.com/learn/fundamentals/events-and-subscribers). Follow
 * [this guide](https://docs.medusajs.com/resources/commerce-modules/auth/reset-password) to learn
 * how to handle this event.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * generate reset password tokens within your custom flows.
 *
 * @example
 * const { result } = await generateResetPasswordTokenWorkflow(container)
 * .run({
 *   input: {
 *     entityId: "example@gmail.com",
 *     actorType: "customer",
 *     provider: "emailpass",
 *     secret: "jwt_123" // jwt secret
 *   }
 * })
 *
 * @summary
 *
 * Generate a reset password token for a user or customer.
 *
 * @since 2.16.0
 */
export const generateResetPasswordTokenWorkflow = createWorkflow(
  "generate-reset-password-token",
  (input: GenerateResetPasswordTokenWorkflowInput) => {
    when({}, () => MedusaModule.isInstalled(Modules.RBAC)).then(() => {
      validateGrantedStep({
        actor_id: input.actor_id,
        granting_actor_id: input.granting_actor_id,
      })

      const targetReferenceIds = transform({ input }, ({ input }) => [
        input.actor_id!,
      ])

      const targetAssignments = getRoleAssignmentsStep({
        reference: input.actorType,
        reference_id: targetReferenceIds,
      })

      validateActorRolePermissionsStep({
        actor_id: input.granting_actor_id!,
        actor: input.granting_actor,
        granting_scope: input.granting_scope,
        assignments: transform({ targetAssignments }, ({ targetAssignments }) =>
          targetAssignments.map((assignment) => ({
            role_id: assignment.role_id,
            scope:
              assignment.scope && assignment.scope_id
                ? { type: assignment.scope, id: assignment.scope_id }
                : undefined,
          }))
        ),
      })
    })

    const resetToken = createPasswordResetTokenStep({
      entityId: input.entityId,
      provider: input.provider,
      ttlSeconds: RESET_PASSWORD_TOKEN_TTL_SECONDS,
    })

    const token = transform(
      { input, resetToken },
      ({ input, resetToken }) => {
        return generateJwtToken(
          {
            entity_id: input.entityId,
            provider: input.provider,
            actor_type: input.actorType,
            purpose: "reset",
          },
          {
            secret: input.secret,
            expiresIn: `${RESET_PASSWORD_TOKEN_TTL_SECONDS}s`,
            jwtOptions: {
              ...input.jwtOptions,
              jwtid: resetToken.jti,
            },
          }
        )
      }
    )

    const payload = transform({
      input,
      token,
    }, (data) => {
      return {
        entity_id: data.input.entityId,
        actor_type: data.input.actorType,
        token: data.token,
        metadata: data.input.metadata ?? {},
      }
    })

    emitEventStep({
      eventName: AuthWorkflowEvents.PASSWORD_RESET,
      data: payload,
    })

    return new WorkflowResponse(token)
  }
)
