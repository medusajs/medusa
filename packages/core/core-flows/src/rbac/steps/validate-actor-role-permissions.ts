import { MedusaError } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import {
  canActorGrantRoles,
  CanActorGrantRolesInput,
} from "../utils/can-actor-grant-roles"

/**
 * @since 2.22.4
 */
export type ValidateActorRolePermissionsStepInput = Omit<
  CanActorGrantRolesInput,
  "container"
>

/**
 * @since 2.22.4
 */
export const validateActorRolePermissionsStepId =
  "validate-actor-role-permissions"

/**
 * Validates that the actor can grant every role being assigned or unassigned,
 * as decided by `canActorGrantRoles`: an actor can only assign roles whose
 * policies they themselves have, within the scope the assignment targets.
 * @since 2.22.4
 */
export const validateActorRolePermissionsStep = createStep(
  validateActorRolePermissionsStepId,
  async (data: ValidateActorRolePermissionsStepInput, { container }) => {
    const verdicts = await canActorGrantRoles({ container, ...data })

    if (verdicts.includes(false)) {
      throw new MedusaError(
        MedusaError.Types.FORBIDDEN,
        "You do not have permission to assign these roles"
      )
    }

    return new StepResponse(void 0)
  }
)
