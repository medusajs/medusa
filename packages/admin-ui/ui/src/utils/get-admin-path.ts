/**
 * returns the full admin path using the window object
 * @returns {string} - admin path
 */
export function getFullAdminPath() {
  if (window) {
    const origin = window.location.origin // returns base url with trailing slash

    const adminPath = process.env.ADMIN_PATH ? `${process.env.ADMIN_PATH}/` : ""

    let fullPath = `${origin}${adminPath}`

    // safeguard against double slashes, which happens in case path is set to `/`
    if (fullPath.endsWith("//")) {
      fullPath = adminPath.slice(0, -1)
    }

    return fullPath
  }

  return ""
}
