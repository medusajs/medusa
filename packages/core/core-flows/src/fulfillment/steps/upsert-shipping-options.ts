import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import {
  FulfillmentWorkflow,
  IFulfillmentModuleService,
  ShippingOptionDTO,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  arrayDifference,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { UpsertShippingOptionDTO } from "@medusajs/types/src"

type StepInput = Omit<
  | FulfillmentWorkflow.CreateShippingOptionsWorkflowInput
  | FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput,
  "prices"
>[]

export const upsertShippingOptionsStepId = "create-shipping-options-step"
export const upsertShippingOptionsStep = createStep(
  upsertShippingOptionsStepId,
  async (input: StepInput, { container }) => {
    if (!input?.length) {
      return new StepResponse([], {})
    }

    const fulfillmentService = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    const toUpdate: FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput[] =
      []

    ;(
      input as FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput[]
    ).forEach((inputItem) => {
      if (!!inputItem.id) {
        return toUpdate.push(inputItem)
      }
      return
    })

    let toUpdatePreviousData: ShippingOptionDTO[] = []

    if (toUpdate.length) {
      const { selects, relations } =
        getSelectsAndRelationsFromObjectArray(toUpdate)
      toUpdatePreviousData = await fulfillmentService.listShippingOptions(
        {
          id: toUpdate.map((s) => s.id),
        },
        {
          select: selects,
          relations,
        }
      )
    }

    const upsertedShippingOptions: ShippingOptionDTO[] =
      await fulfillmentService.upsertShippingOptions(
        input as UpsertShippingOptionDTO[]
      )

    const upsertedShippingOptionIds = upsertedShippingOptions.map((s) => s.id)

    const updatedIds = toUpdate.map((s) => s.id)
    return new StepResponse(upsertedShippingOptions, {
      updatedPreviousData: toUpdatePreviousData,
      createdIds: arrayDifference(
        upsertedShippingOptionIds,
        updatedIds
      ) as string[],
    })
  },
  async (shippingOptionIds: any, { container }) => {
    if (
      !shippingOptionIds?.updatedPreviousData?.length &&
      !shippingOptionIds?.createdIds?.length
    ) {
      return
    }

    const fulfillmentService = container.resolve<IFulfillmentModuleService>(
      ModuleRegistrationName.FULFILLMENT
    )

    if (shippingOptionIds.updatedPreviousData.length) {
      await fulfillmentService.upsertShippingOptions(
        shippingOptionIds.updatedPreviousData
      )
    }

    if (shippingOptionIds.createdIds.length) {
      await fulfillmentService.deleteShippingOptions(
        shippingOptionIds.createdIds
      )
    }
  }
)
