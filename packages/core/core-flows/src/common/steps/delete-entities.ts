import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface DeleteEntitiesStepType {
  moduleRegistrationName: string
  invokeMethod: string
  compensateMethod: string
  entityIdentifier?: string
  data: any[]
}

export const deleteEntitiesStepId = "delete-entities-step"
/**
 * This step deletes one or more entities.
 */
export const deleteEntitiesStep = createStep(
  deleteEntitiesStepId,
  async (input: DeleteEntitiesStepType, { container }) => {
    const {
      moduleRegistrationName,
      invokeMethod,
      compensateMethod,
      data = [],
    } = input

    const module = container.resolve<any>(moduleRegistrationName)
    data.length ? await module[invokeMethod](data) : []

    return new StepResponse(void 0, {
      entityIdentifiers: input.data,
      moduleRegistrationName,
      compensateMethod,
    })
  },
  async (compensateInput, { container }) => {
    const {
      entityIdentifiers = [],
      moduleRegistrationName,
      compensateMethod,
    } = compensateInput!

    if (!entityIdentifiers?.length) {
      return
    }

    const module = container.resolve<any>(moduleRegistrationName)

    await module[compensateMethod](entityIdentifiers)
  }
)
