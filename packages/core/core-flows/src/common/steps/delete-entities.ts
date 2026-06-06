import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export interface DeleteEntitiesStepType {
  /**
   * The regitration name of the module that contains the method to be invoked.
   */
  moduleRegistrationName: string
  /**
   * The method to be invoked.
   */
  invokeMethod: string
  /**
   * The method to be invoked in case of compensation (when an error occurs).
   */
  compensateMethod: string
  /**
   * A string to pass to the compensate method.
   * For example, an ID of the entity to be deleted.
   */
  entityIdentifier?: string
  /**
   * The data to pass to the invoke method.
   * For example, an array of IDs to delete.
   */
  data: any[]
}

export const deleteEntitiesStepId = "delete-entities-step"
/**
 * This step deletes one or more entities using methods in a module's service.
 * 
 * @example
 * deleteEntitiesStep({
 *   moduleRegistrationName: Modules.CART,
 *   invokeMethod: "softDeleteCreditLines",
 *   compensateMethod: "restoreCreditLines",
 *   data: input.id,
 * })
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
