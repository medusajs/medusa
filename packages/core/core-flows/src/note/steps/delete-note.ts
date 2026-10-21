import type { INoteModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const deleteNoteStepId = "delete-note"
/**
 * This step deletes a note.
 *
 * Notes have no soft-delete column, so a deleted note cannot be restored.
 * This step therefore has no compensation function.
 */
export const deleteNoteStep = createStep(
  deleteNoteStepId,
  async (id: string, { container }) => {
    const service = container.resolve<INoteModuleService>(Modules.NOTE)

    await service.deleteNotes(id)
    return new StepResponse(void 0, id)
  }
)
