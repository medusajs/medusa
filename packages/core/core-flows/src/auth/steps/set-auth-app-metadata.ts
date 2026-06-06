import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"

import type { IAuthModuleService } from "@zjedene-medusa/framework/types"
import { isDefined, Modules } from "@zjedene-medusa/framework/utils"

export type SetAuthAppMetadataStepInput = {
  authIdentityId: string
  actorType: string
  value: string | null // null means delete the key
}

export const setAuthAppMetadataStepId = "set-auth-app-metadata"
/**
 * This step sets the `app_metadata` property of an auth identity. This is useful to
 * associate a user (whether it's an admin user or customer) with an auth identity
 * that allows them to authenticate into Medusa.
 *
 * You can learn more about auth identites in
 * [this documentation](https://docs.medusajs.com/resources/commerce-modules/auth/auth-identity-and-actor-types).
 *
 * To use this for a custom actor type, check out [this guide](https://docs.medusajs.com/resources/commerce-modules/auth/create-actor-type)
 * that explains how to create a custom `manager` actor type and manage its users.
 *
 * @example
 * To associate an auth identity with an actor type (user, customer, or other actor types):
 *
 * ```ts
 * const data = setAuthAppMetadataStep({
 *   authIdentityId: "au_1234",
 *   actorType: "user", // or `customer`, or custom type
 *   value: "user_123"
 * })
 * ```
 *
 * To remove the association with an actor type, such as when deleting the user:
 *
 * ```ts
 * const data = setAuthAppMetadataStep({
 *   authIdentityId: "au_1234",
 *   actorType: "user", // or `customer`, or custom type
 *   value: null
 * })
 * ```
 */
export const setAuthAppMetadataStep = createStep(
  setAuthAppMetadataStepId,
  async (data: SetAuthAppMetadataStepInput, { container }) => {
    const service = container.resolve<IAuthModuleService>(Modules.AUTH)

    const key = `${data.actorType}_id`
    const authIdentity = await service.retrieveAuthIdentity(data.authIdentityId)

    const appMetadata = authIdentity.app_metadata || {}

    // If the value is null, we are deleting the association with an actor
    if (isDefined(appMetadata[key]) && data.value !== null) {
      throw new Error(`Key ${key} already exists in app metadata`)
    }

    const oldValue = appMetadata[key]
    appMetadata[key] = data.value

    await service.updateAuthIdentities({
      id: authIdentity.id,
      app_metadata: appMetadata,
    })

    return new StepResponse(authIdentity, {
      id: authIdentity.id,
      key: key,
      value: data.value,
      oldValue,
    })
  },
  async (idAndKeyAndValue, { container }) => {
    if (!idAndKeyAndValue) {
      return
    }

    const { id, key, oldValue, value } = idAndKeyAndValue

    const service = container.resolve<IAuthModuleService>(Modules.AUTH)

    const authIdentity = await service.retrieveAuthIdentity(id)

    const appMetadata = authIdentity.app_metadata || {}

    // If the value is null, we WERE deleting the association with an actor, so we need to restore it
    if (value === null) {
      appMetadata[key] = oldValue
    } else {
      delete appMetadata[key]
    }

    await service.updateAuthIdentities({
      id: authIdentity.id,
      app_metadata: appMetadata,
    })
  }
)
