import { MedusaError } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  StepResponse,
  when,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { deleteAuthIdentityStep, setAuthAppMetadataStep } from "../../auth"
import { useQueryGraphStep } from "../../common"
import { deleteCustomersWorkflow } from "./delete-customers"

/**
 * The input for the {@link removeCustomerAccountWorkflow}.
 */
export type RemoveCustomerAccountWorkflowInput = {
  /**
   * The ID of the customer to remove.
   */
  customerId: string
}

interface GetCustomerAuthIdentityStepInput {
  authIdentities: {
    id: string
    app_metadata?: Record<string, unknown>
    provider_identities?: { entity_id: string }[]
  }[]
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
 * [Delete Customer Admin API Route](https://docs.medusajs.com/api/admin/customers/delete-a-customer).
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
    const { data: customer } = useQueryGraphStep({
      entity: "customer",
      fields: ["id", "has_account"],
      filters: {
        id: input.customerId,
      },
      options: {
        isList: false,
      },
    }).config({ name: "get-customer" })

    deleteCustomersWorkflow.runAsStep({
      input: {
        ids: [input.customerId],
      },
    })

    const authIdentity = when({ customer }, ({ customer }) => {
      return !!customer?.has_account
    }).then(() => {
      const { data: authIdentities } = useQueryGraphStep({
        entity: "auth_identity",
        fields: ["id", "app_metadata", "provider_identities.entity_id"],
        filters: {
          app_metadata: {
            customer_id: input.customerId,
          },
        },
      }).config({ name: "get-auth-identities" })

      return getCustomerAuthIdentityStep({ authIdentities })
    })

    const shouldKeepAuthIdentity = transform(
      { authIdentity },
      ({ authIdentity }) => {
        if (!authIdentity) {
          return undefined
        }

        // Only keep the auth identity if it has other actor types associated with it
        return Object.entries(authIdentity.app_metadata ?? {})
          .filter(([key, _]) => key !== "customer_id")
          .some(([_, value]) => value !== null)
      }
    )

    when({ shouldKeepAuthIdentity }, ({ shouldKeepAuthIdentity }) => {
      return shouldKeepAuthIdentity === true
    }).then(() => {
      // we don't remove a matching entity_id provider_entity, since it could be used by the remaining
      // actor types.
      setAuthAppMetadataStep({
        authIdentityId: authIdentity!.id,
        actorType: "customer",
        value: null,
      })
    })

    when({ shouldKeepAuthIdentity }, ({ shouldKeepAuthIdentity }) => {
      return shouldKeepAuthIdentity === false
    }).then(() => {
      deleteAuthIdentityStep({
        id: authIdentity!.id,
      })
    })

    return new WorkflowResponse(input.customerId)
  }
)
