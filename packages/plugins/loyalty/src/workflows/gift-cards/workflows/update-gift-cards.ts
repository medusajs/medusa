import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { ModuleGiftCard, ModuleUpdateGiftCard } from "../../../types";
import { updateGiftCardsStep } from "../steps/update-gift-cards";

/*
  A workflow that updates gift cards.
*/
export const updateGiftCardsWorkflow = createWorkflow(
  "update-gift-cards-workflow",
  function (input: ModuleUpdateGiftCard[]): WorkflowResponse<ModuleGiftCard[]> {
    return new WorkflowResponse(updateGiftCardsStep(input));
  }
);
