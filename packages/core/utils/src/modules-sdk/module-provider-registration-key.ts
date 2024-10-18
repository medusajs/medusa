export const moduleProviderRegistrationKeyPrefix = "__providers__"

/**
 * Return the key used to register a module provider in the container
 * @param {string} moduleKey
 * @return {string}
 */
export function getProviderRegistrationKey({
  providerId,
  providerIdentifier,
}: {
  providerId?: string
  providerIdentifier?: string
}): string {
  const registrationIdentifier = `${
    providerIdentifier ? providerIdentifier : ""
  }${providerId ? `${providerIdentifier ? "_" : ""}${providerId}` : ""}`
  return moduleProviderRegistrationKeyPrefix + registrationIdentifier
}
