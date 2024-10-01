import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export interface CreateEntitiesStepType {
  moduleRegistrationName: string
  invokeMethod: string
  compensateMethod: string
  entityIdentifier?: string
  data: any[]
}

export const createEntitiesStepId = "create-entities-step"
/**
 * This step creates entities for any given module or resource
 */
export const createEntitiesStep = createStep(
  createEntitiesStepId,
  async (input: CreateEntitiesStepType, { container }) => {
    const {
      moduleRegistrationName,
      invokeMethod,
      compensateMethod,
      entityIdentifier = "id",
      data = [],
    } = input

    const module = container.resolve<any>(moduleRegistrationName)
    const created: any[] = data.length ? await module[invokeMethod](data) : []

    return new StepResponse(created, {
      entityIdentifiers: created.map((c) => c[entityIdentifier]),
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
