import {
  BatchMethodResponse,
  MedusaContainer,
  ShippingOptionRuleDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  promiseAll,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export const refetchShippingOption = async (
  shippingOptionId: string,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "shipping_option",
    variables: {
      filters: { id: shippingOptionId },
    },
    fields: fields,
  })

  const shippingOptions = await remoteQuery(queryObject)
  return shippingOptions[0]
}

export const refetchBatchRules = async (
  batchResult: BatchMethodResponse<ShippingOptionRuleDTO>,
  scope: MedusaContainer,
  fields: string[]
) => {
  const remoteQuery = scope.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  let created = Promise.resolve<ShippingOptionRuleDTO[]>([])
  let updated = Promise.resolve<ShippingOptionRuleDTO[]>([])

  if (batchResult.created.length) {
    const createdQuery = remoteQueryObjectFromString({
      entryPoint: "shipping_option_rule",
      variables: {
        filters: { id: batchResult.created.map((p) => p.id) },
      },
      fields: fields,
    })

    created = remoteQuery(createdQuery)
  }

  if (batchResult.updated.length) {
    const updatedQuery = remoteQueryObjectFromString({
      entryPoint: "shipping_option_rule",
      variables: {
        filters: { id: batchResult.updated.map((p) => p.id) },
      },
      fields: fields,
    })

    updated = remoteQuery(updatedQuery)
  }

  const [createdRes, updatedRes] = await promiseAll([created, updated])
  return {
    created: createdRes,
    updated: updatedRes,
    deleted: batchResult.deleted,
  }
}
