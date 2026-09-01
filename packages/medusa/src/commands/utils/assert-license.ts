import { ConfigModule, Logger } from "@medusajs/framework/types"
import {
  assertLicensed,
  isString,
  LicenseFeature,
  Modules,
} from "@medusajs/framework/utils"

type ModuleConfig = Exclude<ConfigModule["modules"], undefined>[string]

function isEnabled(moduleConfig: ModuleConfig | undefined): boolean {
  if (!moduleConfig) {
    return false
  }

  if (typeof moduleConfig === "boolean") {
    return moduleConfig
  }

  return !("disable" in moduleConfig && moduleConfig.disable)
}

/**
 * The license gated features the project's module configuration enables.
 */
export function getConfiguredLicensedFeatures(
  modules: ConfigModule["modules"] = {}
): LicenseFeature[] {
  const features: LicenseFeature[] = []

  if (isEnabled(modules[Modules.RBAC])) {
    features.push(LicenseFeature.RBAC)
  }

  const authModule = modules[Modules.AUTH]

  if (isEnabled(authModule) && typeof authModule === "object") {
    const providers = authModule.options?.providers

    const hasOidcProvider =
      Array.isArray(providers) &&
      providers.some(
        (provider: { resolve?: unknown }) =>
          isString(provider.resolve) && provider.resolve.includes("auth-oidc")
      )

    if (hasOidcProvider) {
      features.push(LicenseFeature.AUTH_OIDC)
    }
  }

  return features
}

/**
 * Fails the build when a configured license gated feature is not covered by
 * the license key in the environment, so a misconfiguration surfaces in the
 * deploy pipeline instead of at boot.
 */
export function assertConfiguredLicenses(
  configModule: ConfigModule,
  logger: Logger
): void {
  for (const feature of getConfiguredLicensedFeatures(configModule.modules)) {
    try {
      assertLicensed(feature)
    } catch (error) {
      logger.error((error as Error).message)
      process.exit(1)
    }
  }
}
