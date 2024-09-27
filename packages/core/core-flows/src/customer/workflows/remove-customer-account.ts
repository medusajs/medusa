import { MedusaError } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { setAuthAppMetadataStep } from "../../auth"
import { useRemoteQueryStep } from "../../common"
import { deleteCustomersWorkflow } from "./delete-customers"

export type RemoveCustomerAccountWorkflowInput = {
  customerId: string
}
export const removeCustomerAccountWorkflowId = "remove-customer-account"
/**
 * This workflow deletes a user and remove the association in the auth identity.
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

      const authIdentity = transform(
        { authIdentities },
        ({ authIdentities }) => {
          const authIdentity = authIdentities[0]

          if (!authIdentity) {
            throw new MedusaError(
              MedusaError.Types.NOT_FOUND,
              "Auth identity not found"
            )
          }

          return authIdentity
        }
      )

      setAuthAppMetadataStep({
        authIdentityId: authIdentity.id,
        actorType: "customer",
        value: null,
      })
    })

    return new WorkflowResponse(input.customerId)
  }
)
