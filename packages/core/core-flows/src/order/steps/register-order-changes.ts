import {
  IOrderModuleService,
  RegisterOrderChangeDTO,
} from "@zjedene-medusa/framework/types"
import { ModuleRegistrationName } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The input of the register order changes step.
 */
export type RegisterOrderChangeStepInput = RegisterOrderChangeDTO[]

export const registerOrderChangeStepId = "register-order-change"

/**
 * This step registers an order changes.
 */
export const registerOrderChangesStep = createStep(
  registerOrderChangeStepId,
  async (data: RegisterOrderChangeStepInput, { container }) => {
    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    const orderChanges = await service.registerOrderChange(data)

    return new StepResponse(
      void 0,
      orderChanges.map((c) => c.id)
    )
  },
  async (orderChangeIds, { container }) => {
    if (!orderChangeIds?.length) {
      return
    }

    const service = container.resolve<IOrderModuleService>(
      ModuleRegistrationName.ORDER
    )

    await service.deleteOrderChanges(orderChangeIds)
  }
)
