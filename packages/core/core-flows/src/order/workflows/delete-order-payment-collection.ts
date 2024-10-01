import { PaymentCollectionDTO } from "@medusajs/framework/types"
import {
  MedusaError,
  Modules,
  PaymentCollectionStatus,
} from "@medusajs/framework/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { removeRemoteLinkStep, useRemoteQueryStep } from "../../common"

/**
 * This step validates that the order doesn't have an active payment collection.
 */
export const throwUnlessStatusIsNotPaid = createStep(
  "validate-payment-collection",
  ({ paymentCollection }: { paymentCollection: PaymentCollectionDTO }) => {
    if (paymentCollection.status !== PaymentCollectionStatus.NOT_PAID) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        `Can only delete payment collections where status is not_paid`
      )
    }
  }
)

export const deleteOrderPaymentCollectionsId =
  "delete-order-payment-collectionworkflow"
/**
 * This workflow deletes one or more invites.
 */
export const deleteOrderPaymentCollections = createWorkflow(
  deleteOrderPaymentCollectionsId,
  (input: WorkflowData<{ id: string }>): WorkflowData<void> => {
    const paymentCollection = useRemoteQueryStep({
      entry_point: "payment_collection",
      fields: ["id", "status"],
      variables: { id: input.id },
      throw_if_key_not_found: true,
      list: false,
    }).config({ name: "payment-collection-query" })

    throwUnlessStatusIsNotPaid({ paymentCollection })

    removeRemoteLinkStep({
      [Modules.PAYMENT]: { payment_collection_id: input.id },
    })
  }
)
