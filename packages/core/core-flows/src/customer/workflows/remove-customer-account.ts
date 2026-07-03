import { MedusaError } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  StepResponse,
  when,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth"
import { useRemoteQueryStep } from "../../common"
import { deleteCustomersWorkflow } from "./delete-customers"

export type RemoveCustomerAccountWorkflowInput = {
  customerId: string
}

interface GetCustomerAuthIdentityStepInput {
  authIdentities: { id: string }[]
}

/**
 * This step returns the customer's auth identity from a queried list. It throws
 * an error if no auth identity is found.
 */
export const getCustomerAuthIdentityStep = createStep(
  "get-customer-auth-identity",
  async ({ authIdentities }: GetCustomerAuthIdentityStepInput) => {
    const authIdentity = authIdentities[0]

    if (!authIdentity) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Auth identity not found"
      )
    }

    return new StepResponse(authIdentity)
  }
)

export const removeCustomerAccountWorkflowId = "remove-customer-account"
/**
 * This workflow deletes a customer and remove its association to its auth identity. It's used by the
 * [Delete Customer Admin API Route](https://docs.medusajs.com/api/admin#customers_deletecustomersid).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete customer accounts within your custom flows.
 * 
 * :::note
 * 
 * This workflow uses the {@link deleteCustomersWorkflow} which has a hook that allows you to perform 
 * custom actions after the customers are deleted.
 * 
 * :::
 * 
 * @example
 * const { result } = await removeCustomerAccountWorkflow(container)
 * .run({
 *   input: {
 *     customerId: "cus_123"
 *   }
 * })
 * 
 * @summary
 * 
 * Delete a customer account and its auth identity association.
 */
export const removeCustomerAccountWorkflow = createWorkflow(
  removeCustomerAccountWorkflowId,
  (
    input: WorkflowData<RemoveCustomerAccountWorkflowInput>
  ): WorkflowResponse<string> => {
    const customers = useRemoteQueryStep({
      entry_point: "customer",
      fields: ["id", "has_account"],
      variables: {
        id: input.customerId,
      },
    }).config({ name: "get-customer" })

    deleteCustomersWorkflow.runAsStep({
      input: {
        ids: [input.customerId],
      },
    })

    when({ customers }, ({ customers }) => {
      return !!customers[0]?.has_account
    }).then(() => {
      const authIdentities = useRemoteQueryStep({
        entry_point: "auth_identity",
        fields: ["id"],
        variables: {
          filters: {
            app_metadata: {
              customer_id: input.customerId,
            },
          },
        },
      })

      const authIdentity = getCustomerAuthIdentityStep({ authIdentities })

      setAuthAppMetadataStep({
        authIdentityId: authIdentity.id,
        actorType: "customer",
        value: null,
      })
    })

    return new WorkflowResponse(input.customerId)
  }
)
