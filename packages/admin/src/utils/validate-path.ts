export const validatePath = (path?: string) => {
  if (!path) {
    return
  }

  if (path.startsWith("/")) {
    throw new Error(`Path cannot start with a slash.`)
  }

  if (path.endsWith("/")) {
    throw new Error(`Path cannot end with a slash.`)
  }

  if (path === "admin" || path === "store") {
    throw new Error(
      `Path cannot be one of the reserved paths: "admin", "store".`
    )
  }
}
