import {
  FulfillmentWorkflow,
  IFulfillmentModuleService,
  ShippingOptionDTO,
  UpsertShippingOptionDTO,
} from "@zjedene-medusa/framework/types"
import { arrayDifference, getSelectsAndRelationsFromObjectArray, Modules, } from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to create or update shipping options.
 */
export type UpsertShippingOptionsStepInput = Omit<
  | FulfillmentWorkflow.CreateShippingOptionsWorkflowInput
  | FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput,
  "prices"
>[]

export const upsertShippingOptionsStepId = "create-shipping-options-step"
/**
 * This step creates or updates shipping options.
 */
export const upsertShippingOptionsStep = createStep(
  upsertShippingOptionsStepId,
  async (input: UpsertShippingOptionsStepInput, { container }) => {
    if (!input?.length) {
      return new StepResponse([], {})
    }

    const fulfillmentService = container.resolve<IFulfillmentModuleService>(
      Modules.FULFILLMENT
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
        input.map(inputItem => {
          const upsertShippingOption = inputItem as UpsertShippingOptionDTO
          if (inputItem.type_id) {
            upsertShippingOption.type = inputItem.type_id
          }
          return upsertShippingOption;
        })
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
      Modules.FULFILLMENT
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
