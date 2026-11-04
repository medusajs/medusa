import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * @ignore
 */
export const validateAssignmentReferencesStepId =
  "validate-assignment-references-step"

/**
 * This step validates that every reference is a grantee entity configured for
 * some actor type. An assignment to any other reference would never apply.
 */
export const validateAssignmentReferencesStep = createStep(
  validateAssignmentReferencesStepId,
  async (references: string[], { container }) => {
    if (!references.length || !MedusaModule.isInstalled(Modules.RBAC)) {
      return new StepResponse(undefined)
    }

    const rbacService = container.resolve(Modules.RBAC)
    const grantees = new Set(await rbacService.listGranteeEntities())
    const invalid = references.filter((reference) => !grantees.has(reference))

    if (invalid.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The following references can't hold role assignments: ${invalid.join(
          ", "
        )}. Valid references are: ${[...grantees].join(", ")}`
      )
    }

    return new StepResponse(undefined)
  }
)
