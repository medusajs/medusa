import type { INoteModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const deleteNoteStepId = "delete-note"
/**
 * This step soft deletes a note.
 *
 * The compensation function restores the note by its ID if the step
 * had already run.
 */
export const deleteNoteStep = createStep(
  deleteNoteStepId,
  async (id: string, { container }) => {
    const service = container.resolve<INoteModuleService>(Modules.NOTE)

    await service.softDeleteNotes(id)
    return new StepResponse(void 0, id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }

    const service = container.resolve<INoteModuleService>(Modules.NOTE)

    await service.restoreNotes(id)
  }
)
