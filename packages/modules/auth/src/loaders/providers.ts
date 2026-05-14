import { asFunction, asValue, Lifetime } from "@medusajs/framework/awilix"
import { moduleProviderLoader } from "@medusajs/framework/modules-sdk"
import { LoaderOptions, ModulesSdkTypes } from "@medusajs/framework/types"
import {
  AuthIdentifiersRegistrationName,
  AuthModuleOptions,
  AuthProviderRegistrationPrefix,
} from "@types"
import { MedusaCloudAuthService } from "../providers/medusa-cloud-auth"

const validateCloudOptions = (options: AuthModuleOptions["cloud"]) => {
  const {
    oauth_authorize_endpoint,
    oauth_token_endpoint,
    environment_handle,
    sandbox_handle,
    api_key,
    callback_url,
  } = options ?? {}

  if (!environment_handle && !sandbox_handle) {
    return false
  }

  if (
    !oauth_authorize_endpoint ||
    !oauth_token_endpoint ||
    !api_key ||
    !callback_url
  ) {
    return false
  }

  return true
}

const registrationFn = async (klass, container, pluginOptions) => {
  container.register({
    [AuthProviderRegistrationPrefix + pluginOptions.id]: asFunction(
      (cradle) => new klass(cradle, pluginOptions.options ?? {}),
      {
        lifetime: klass.LIFE_TIME || Lifetime.SINGLETON,
      }
    ),
  })

  container.registerAdd(
    AuthIdentifiersRegistrationName,
    asValue(pluginOptions.id)
  )
}

export default async ({
  container,
  options,
}: LoaderOptions<
  (
    | ModulesSdkTypes.ModuleServiceInitializeOptions
    | ModulesSdkTypes.ModuleServiceInitializeCustomDataLayerOptions
  ) &
    AuthModuleOptions
>): Promise<void> => {
  if (validateCloudOptions(options?.cloud) && !options?.cloud?.disabled) {
    await registrationFn(MedusaCloudAuthService, container, {
      options: options?.cloud,
      id: "cloud",
    })
  }

  await moduleProviderLoader({
    container,
    providers: options?.providers || [],
    registerServiceFn: registrationFn,
  })
}
