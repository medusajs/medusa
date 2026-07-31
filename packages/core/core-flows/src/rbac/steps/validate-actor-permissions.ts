import { RbacScope } from "@medusajs/framework/types"
import {
  arrayDifference,
  ContainerRegistrationKeys,
  MedusaError,
} from "@medusajs/framework/utils"
import { createStep } from "@medusajs/framework/workflows-sdk"
import { assertActorCanGrant } from "../utils/assert-actor-can-grant"

/**
 * @ignore
 * @featureFlag rbac
 */
export type ValidateActorPermissionsStepInput = {
  actor_id: string
  actor?: string
  policy_ids?: string[]
  actions?: {
    resource: string
    operation: string
  }[]
  /**
   * Server-derived scope context the grant happens within. Omitted = the
   * actor's full scope-union policies
   */
  scope?: RbacScope
}

/**
 * @ignore
 * @featureFlag rbac
 */
export const validateActorPermissionsStepId = "validate-actor-permissions"

/**
 * Validates that an actor has access to all the policies they are trying to assign.
 * An actor can only create roles and add policies that they themselves have access to.
 * @ignore
 * @featureFlag rbac
 */
export const validateActorPermissionsStep = createStep(
  validateActorPermissionsStepId,
  async (data: ValidateActorPermissionsStepInput, { container }) => {
    const { actor_id, actor, policy_ids, actions, scope } = data

    if (!policy_ids?.length && !actions?.length) {
      return
    }

    let actionsToCheck: { resource: string; operation: string }[] = []

    if (policy_ids?.length) {
      const query = container.resolve(ContainerRegistrationKeys.QUERY)

      const { data: targetPolicies } = await query.graph({
        entity: "rbac_policy",
        fields: ["id", "resource", "operation"],
        filters: { id: policy_ids },
      })

      // An actor cannot grant a policy that doesn't exist.
      const inexistentPolicies = arrayDifference(
        policy_ids,
        targetPolicies.map((p) => p.id)
      )
      if (inexistentPolicies.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `The following policies do not exist: ${inexistentPolicies.join(
            ", "
          )}`
        )
      }

      actionsToCheck = targetPolicies.map((p) => ({
        resource: p.resource,
        operation: p.operation,
      }))
    } else if (actions?.length) {
      actionsToCheck = actions
    }

    await assertActorCanGrant({
      container,
      actor_id,
      actor,
      actions: actionsToCheck,
      errorMessage:
        "You do not have access to some of the policies you are trying to assign.",
      scope,
    })
  }
)
