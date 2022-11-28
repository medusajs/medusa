export const validatedPath = (path?: string) => {
  if (path && path.startsWith("/")) {
    throw new Error("Path must not start with a slash")
  }

  return path
}
