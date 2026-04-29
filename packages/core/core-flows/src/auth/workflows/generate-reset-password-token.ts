import type { ProjectConfigOptions } from "@medusajs/framework/types"
import {
  AuthWorkflowEvents,
  generateJwtToken,
  MedusaError,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep, useRemoteQueryStep } from "../../common"

/**
 * This workflow generates a reset password token for a user. It's used by the
 * [Generate Reset Password Token for Admin](https://docs.medusajs.com/api/admin#auth_postactor_typeauth_providerresetpassword)
 * and [Generate Reset Password Token for Customer](https://docs.medusajs.com/api/store#auth_postactor_typeauth_providerresetpassword)
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
 */
export const generateResetPasswordTokenWorkflow = createWorkflow(
  "generate-reset-password-token",
  (input: {
    entityId: string
    actorType: string
    provider: string
    secret: ProjectConfigOptions["http"]["jwtSecret"]
    jwtOptions?: ProjectConfigOptions["http"]["jwtOptions"]
    metadata?: Record<string, unknown>
  }) => {
    const providerIdentities = useRemoteQueryStep({
      entry_point: "provider_identity",
      fields: ["auth_identity_id", "provider_metadata"],
      variables: {
        filters: {
          entity_id: input.entityId,
          provider: input.provider,
        },
      },
    })

    const token = transform(
      { input, providerIdentities },
      ({ input, providerIdentities }) => {
        const providerIdentity = providerIdentities?.[0]

        if (!providerIdentity) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Provider identity with entity_id ${input.entityId} and provider ${input.provider} not found`
          )
        }

        const token = generateJwtToken(
          {
            entity_id: input.entityId,
            provider: input.provider,
            actor_type: input.actorType,
          },
          {
            secret: input.secret,
            expiresIn: "15m",
            jwtOptions: input.jwtOptions,
          }
        )

        return token
      }
    )

    emitEventStep({
      eventName: AuthWorkflowEvents.PASSWORD_RESET,
      data: {
        entity_id: input.entityId,
        actor_type: input.actorType,
        token,
        metadata: input.metadata ?? {},
      },
    })

    return new WorkflowResponse(token)
  }
)
