import { MedusaError } from "@medusajs/framework/utils";
import { createStep } from "@medusajs/framework/workflows-sdk";

/**
 * Input to validate that a required entity is present.
 */
export interface ValidatePresenceOfStepInput {
  /**
   * The entity to check for presence.
   */
  entity: any
  /**
   * The human-readable name of the entity type, used in error messages.
   */
  entityName: string
  /**
   * The identifier of the entity (e.g. its ID), used in error messages.
   */
  identifier: string
}

/**
 * This step validates that an entity is present. It throws a NOT_FOUND error if
 * the entity is falsy.
 *
 * @example
 * const data = validatePresenceOfStep({
 *   entity: customer,
 *   entityName: "Customer",
 *   identifier: "cust_123",
 * })
 */
export const validatePresenceOfStep = createStep(
  "validate-presence-of",
  async function ({
    entity,
    entityName,
    identifier,
  }: ValidatePresenceOfStepInput) {
    if (!entity) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `${entityName} ${identifier} not found`
      );
    }
  }
);
