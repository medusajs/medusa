import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

import { IAuthModuleService } from "@medusajs/framework/types"
import { isDefined, Modules } from "@medusajs/framework/utils"

export type SetAuthAppMetadataStepInput = {
  authIdentityId: string
  actorType: string
  value: string | null // null means delete the key
}

export const setAuthAppMetadataStepId = "set-auth-app-metadata"
/**
 * This step sets the `app_metadata` property of an auth identity.
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
