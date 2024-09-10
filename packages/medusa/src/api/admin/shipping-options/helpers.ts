import {
  BatchMethodResponse,
  MedusaContainer,
  ShippingOptionRuleDTO,
} from "@medusajs/types"
import { ContainerRegistrationKeys, promiseAll } from "@medusajs/utils"

export const refetchShippingOption = async (
  shippingOptionId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    data: [shippingOption],
  } = await query.graph({
    entryPoint: "shipping_option",
    variables: {
      filters: { id: shippingOptionId },
    },
    fields: fields,
  })

  return shippingOption
}

export const refetchBatchRules = async (
  batchResult: BatchMethodResponse<ShippingOptionRuleDTO>,
  scope: MedusaContainer,
  fields: string[]
) => {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY)
  let created = Promise.resolve<{ data: ShippingOptionRuleDTO[] }>({ data: [] })
  let updated = Promise.resolve<{ data: ShippingOptionRuleDTO[] }>({ data: [] })

  if (batchResult.created.length) {
    created = query.graph({
      entryPoint: "shipping_option_rule",
      variables: {
        filters: { id: batchResult.created.map((p) => p.id) },
      },
      fields: fields,
    })
  }

  if (batchResult.updated.length) {
    updated = query.graph({
      entryPoint: "shipping_option_rule",
      variables: {
        filters: { id: batchResult.updated.map((p) => p.id) },
      },
      fields: fields,
    })
  }

  const [{ data: createdRes }, { data: updatedRes }] = await promiseAll([
    created,
    updated,
  ])

  return {
    created: createdRes,
    updated: updatedRes,
    deleted: {
      ids: batchResult.deleted,
      object: "shipping_option_rule",
      deleted: true,
    },
  }
}
