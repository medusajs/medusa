import { MedusaError } from "@medusajs/framework/utils";
import { createStep } from "@medusajs/framework/workflows-sdk";

export const validatePresenceOfStep = createStep(
  "validate-presence-of",
  async function ({
    entity,
    entityName,
    identifier,
  }: {
    entity: any;
    entityName: string;
    identifier: string;
  }) {
    if (!entity) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `${entityName} ${identifier} not found`
      );
    }
  }
);
