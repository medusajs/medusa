import {
  ContainerRegistrationKeys,
  MedusaError,
  arrayDifference,
  remoteQueryObjectFromString,
} from "@medusajs/utils"

export async function validateReturnReasons(
  {
    orderId,
    inputItems,
  }: {
    orderId: string
    inputItems: (unknown & { reason_id?: string | null })[]
  },
  { container }
) {
  const reasonIds = inputItems.map((i) => i.reason_id).filter(Boolean)
  if (!reasonIds.length) {
    return
  }

  const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)

  const remoteQueryObject = remoteQueryObjectFromString({
    entryPoint: "return_reasons",
    fields: [
      "id",
      "parent_return_reason_id",
      "parent_return_reason",
      "return_reason_children.id",
    ],
    variables: { id: [inputItems.map((item) => item.reason_id)], limit: null },
  })

  const returnReasons = await remoteQuery(remoteQueryObject)

  const reasons = returnReasons.map((r) => r.id)
  const hasInvalidReasons = returnReasons
    .filter(
      // We do not allow for root reason to be applied
      (reason) => reason.return_reason_children.length > 0
    )
    .map((r) => r.id)
  const hasNonExistingReasons = arrayDifference(reasonIds, reasons)

  if (hasNonExistingReasons.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Return reason with id ${hasNonExistingReasons.join(
        ", "
      )} does not exists.`
    )
  }

  if (hasInvalidReasons.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Cannot apply return reason with id ${hasInvalidReasons.join(
        ", "
      )} to order with id ${orderId}. Return reason has nested reasons.`
    )
  }
}
