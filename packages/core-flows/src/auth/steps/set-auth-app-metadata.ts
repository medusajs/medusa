import { StepResponse, createStep } from "@medusajs/workflows-sdk"
import { IAuthModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { isDefined } from "@medusajs/utils"

type StepInput = {
  authUserId: string
  key: string
  value: string
}

export const setAuthAppMetadata = "set-auth-app-metadata"
export const setAuthAppMetadataStep = createStep(
  setAuthAppMetadata,
  async (data: StepInput, { container }) => {
    const service = container.resolve<IAuthModuleService>(
      ModuleRegistrationName.AUTH
    )

    const authUser = await service.retrieveAuthUser(data.authUserId)

    const appMetadata = authUser.app_metadata || {}
    if (isDefined(appMetadata[data.key])) {
      throw new Error(`Key ${data.key} already exists in app metadata`)
    }

    appMetadata[data.key] = data.value

    await service.updateAuthUser({
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

    const authUser = await service.retrieveAuthUser(id)

    const appMetadata = authUser.app_metadata || {}
    if (isDefined(appMetadata[key])) {
      delete appMetadata[key]
    }

    await service.updateAuthUser({
      id: authUser.id,
      app_metadata: appMetadata,
    })
  }
)
