import { Constructor, SearchTypes } from "@medusajs/framework/types"
import { MedusaError } from "@medusajs/framework/utils"
import { SearchProviderRegistrationPrefix } from "@types"

type InjectedDependencies = {
  [
    key: `${typeof SearchProviderRegistrationPrefix}${string}`
  ]: SearchTypes.ISearchProvider
}

/**
 * Registry over the registered providers. Multiple providers can be used, and
 * each index can select which provider to use for itself.
 */
export class SearchProviderService {
  protected readonly providers_: Map<string, SearchTypes.ISearchProvider> =
    new Map()

  constructor(container: InjectedDependencies) {
    for (const key of Object.keys(container)) {
      if (!key.startsWith(SearchProviderRegistrationPrefix)) {
        continue
      }

      const provider = container[key]
      if (!provider?.identifier) {
        continue
      }

      this.providers_.set(provider.identifier, provider)
    }
  }

  static getRegistrationIdentifier(
    providerClass: Constructor<SearchTypes.ISearchProvider>,
    optionName?: string
  ): string {
    return `${(providerClass as any).identifier}_${optionName}`
  }

  retrieve(identifier: string): SearchTypes.ISearchProvider {
    const provider = this.providers_.get(identifier)

    if (!provider) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Search provider "${identifier}" is not registered. Registered providers: ${
          [...this.providers_.keys()].join(", ") || "(none)"
        }`
      )
    }

    return provider
  }

  list(): SearchTypes.ISearchProvider[] {
    return [...this.providers_.values()]
  }

  /**
   * Used by definitions that do not name a provider. Resolves to the sole
   * registered provider, or to the module's `default_provider` option.
   */
  getDefaultIdentifier(configured?: string): string {
    if (configured) {
      // Surfaces a typo in `default_provider` at boot rather than on first query.
      this.retrieve(configured)
      return configured
    }

    const identifiers = [...this.providers_.keys()]

    if (identifiers.length === 1) {
      return identifiers[0]
    }

    if (!identifiers.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The Search Module requires at least one provider to be registered"
      )
    }

    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Several search providers are registered (${identifiers.join(
        ", "
      )}), so "default_provider" must be set, or every index definition must name its provider`
    )
  }
}
