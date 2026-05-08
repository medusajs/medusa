import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { ModuleGiftCard, ModuleUpdateGiftCard } from "../../../types";
import { updateGiftCardsStep } from "../steps/update-gift-cards";

/**
 * Data for updating one or more gift cards.
 */
export type UpdateGiftCardsWorkflowInput = ModuleUpdateGiftCard[]

/**
 * This workflow updates one or more gift cards.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around gift card updates.
 *
 * @example
 * const { result } = await updateGiftCardsWorkflow(container)
 *   .run({
 *     input: [
 *       {
 *         id: "gc_123",
 *         status: GiftCardStatus.REDEEMED,
 *         // other updatable gift card properties...
 *       },
 *     ],
 *   })
 *
 * @summary
 *
 * Update gift cards.
 */
export const updateGiftCardsWorkflow = createWorkflow(
  "update-gift-cards-workflow",
  function (input: UpdateGiftCardsWorkflowInput): WorkflowResponse<ModuleGiftCard[]> {
    return new WorkflowResponse(updateGiftCardsStep(input));
  }
);
