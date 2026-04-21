import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { createWorkflow } from "@medusajs/framework/workflows-sdk";
import { deleteGiftCardsStep } from "../steps/delete-gift-cards";

/**
 * The data to delete a gift card.
 */
export interface DeleteGiftCardWorkflowInput {
  /**
   * The ID of the gift card to delete.
   */
  id: string
}

/**
 * This workflow deletes a gift card by its ID.
 *
 * You can use this workflow within your own customizations or custom workflows,
 * allowing you to wrap custom logic around gift card deletion.
 *
 * @example
 * await deleteGiftCardWorkflow(container)
 *   .run({
 *     input: {
 *       id: "gc_123",
 *     },
 *   })
 *
 * @summary
 *
 * Delete a gift card.
 */
export const deleteGiftCardWorkflow = createWorkflow(
  "delete-gift-card",
  function (input: DeleteGiftCardWorkflowInput) {
    useQueryGraphStep({
      entity: "gift_card",
      filters: { id: input.id },
      fields: ["id", "status"],
      options: { throwIfKeyNotFound: true },
    }).config({ name: "get-gift-card-query" });

    deleteGiftCardsStep({ id: [input.id] });
  }
);
