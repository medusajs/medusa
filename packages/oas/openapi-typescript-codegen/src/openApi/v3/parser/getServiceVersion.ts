/**
 * Convert the service version to 'normal' version.
 * This basically removes any "v" prefix from the version string.
 * @param version
 */
export const getServiceVersion = (version = "1.0"): string => {
  return String(version).replace(/^v/gi, "")
}
