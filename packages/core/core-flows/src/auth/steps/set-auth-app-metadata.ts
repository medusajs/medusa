import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IAuthModuleService } from "@medusajs/types"
import { isDefined } from "@medusajs/utils"

type StepInput = {
  authUserId: string
  key: string
  value: string
}

export const setAuthAppMetadataStepId = "set-auth-app-metadata"
export const setAuthAppMetadataStep = createStep(
  setAuthAppMetadataStepId,
  async (data: StepInput, { container }) => {
    const service = container.resolve<IAuthModuleService>(
      ModuleRegistrationName.AUTH
    )

    const authUser = await service.retrieve(data.authUserId)

    const appMetadata = authUser.app_metadata || {}
    if (isDefined(appMetadata[data.key])) {
      throw new Error(`Key ${data.key} already exists in app metadata`)
    }

    appMetadata[data.key] = data.value

    await service.update({
      id: authUser.id,
      app_metadata: appMetadata,
    })

    return new StepResponse(authUser, { id: authUser.id, key: data.key })
  },
  async (idAndKey, { container }) => {
    if (!idAndKey) {
      return
    }

    const { id, key } = idAndKey

    const service = container.resolve<IAuthModuleService>(
      ModuleRegistrationName.AUTH
    )

    const authUser = await service.retrieve(id)

    const appMetadata = authUser.app_metadata || {}
    if (isDefined(appMetadata[key])) {
      delete appMetadata[key]
    }

    await service.update({
      id: authUser.id,
      app_metadata: appMetadata,
    })
  }
)
