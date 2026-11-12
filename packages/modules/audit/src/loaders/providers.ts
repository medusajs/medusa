import { asFunction, asValue } from "@medusajs/framework/awilix"
import { moduleProviderLoader } from "@medusajs/framework/modules-sdk"
import { LoaderOptions, MedusaContainer } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import {
  AuditDefaultProviderRegistrationName,
  AuditModuleOptions,
  AuditProviderRegistrationPrefix,
  MEDUSA_CLOUD_AUDIT_PROVIDER_ID,
} from "@types"
import { MedusaAuditService } from "../providers"
import { AuditProviderService } from "../services/audit-provider"

function register(
  container: MedusaContainer,
  ids: string[],
  klass: any,
  id: string | undefined,
  options: Record<string, unknown> = {}
) {
  if (!id) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `The audit provider "${klass.identifier}" has no "id"`
    )
  }

  if (ids.includes(id)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `The audit provider id "${id}" is registered twice. ${
        id === MEDUSA_CLOUD_AUDIT_PROVIDER_ID
          ? `"${MEDUSA_CLOUD_AUDIT_PROVIDER_ID}" is reserved for Medusa Cloud audit storage.`
          : "Give each provider its own id."
      }`
    )
  }

  // Instantiated here rather than aliased to the module loader's own provider
  // registration, which is constructed with the module options instead of the
  // provider's.
  container.register({
    [AuditProviderRegistrationPrefix + id]: asFunction(
      (cradle) => new klass(cradle, options)
    ).singleton(),
  })

  ids.push(id)
}

export default async ({
  container,
  options,
}: LoaderOptions<AuditModuleOptions>): Promise<void> => {
  const ids: string[] = []
  const cloud = options?.cloud

  if (cloud?.endpoint) {
    register(
      container,
      ids,
      MedusaAuditService,
      MEDUSA_CLOUD_AUDIT_PROVIDER_ID,
      cloud
    )
    // Constructed now so that missing credentials fail the boot.
    container.resolve(
      AuditProviderRegistrationPrefix + MEDUSA_CLOUD_AUDIT_PROVIDER_ID
    )
  }

  await moduleProviderLoader({
    container,
    providers: options?.providers ?? [],
    registerServiceFn: async (klass, container, { id, options }) =>
      register(container, ids, klass, id, options),
  })

  const defaultProvider = resolveDefaultProvider(
    ids,
    options ?? {},
    !!cloud?.endpoint
  )

  container.register({
    [AuditDefaultProviderRegistrationName]: asValue(defaultProvider),
    auditProviderService: asFunction(
      (cradle) => new AuditProviderService(cradle)
    ).singleton(),
  })
}

function resolveDefaultProvider(
  ids: string[],
  options: AuditModuleOptions,
  hasCloud: boolean
): string | undefined {
  if (options.default_provider) {
    if (!ids.includes(options.default_provider)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `The audit "default_provider" "${
          options.default_provider
        }" is not registered. Registered providers: ${
          ids.join(", ") || "(none)"
        }`
      )
    }
    return options.default_provider
  }

  if (hasCloud) {
    return MEDUSA_CLOUD_AUDIT_PROVIDER_ID
  }

  if (ids.length === 1) {
    return ids[0]
  }

  if (ids.length > 1) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Several audit providers are registered (${ids.join(
        ", "
      )}), so "default_provider" must be set`
    )
  }

  if (options.enabled !== false) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      'The Audit Module needs a provider to store audit logs, such as "@medusajs/medusa/audit-postgres", or the "cloud" option. Set "enabled: false" to turn auditing off instead.'
    )
  }

  return undefined
}
