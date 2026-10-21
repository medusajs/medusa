import type {
  CreateNoteDTO,
  INoteModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createNoteStepId = "create-note"
/**
 * This step creates a note.
 */
export const createNoteStep = createStep(
  createNoteStepId,
  async (data: CreateNoteDTO, { container }) => {
    const service = container.resolve<INoteModuleService>(Modules.NOTE)

    const created = await service.createNotes(data)
    return new StepResponse(created, created.id)
  },
  async (createdId, { container }) => {
    if (!createdId) {
      return
    }

    const service = container.resolve<INoteModuleService>(Modules.NOTE)

    await service.deleteNotes(createdId)
  }
)
