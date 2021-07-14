export const deref = (path, spec) => {
  let cleanDets = spec
  for (const part of path) {
    if (part === "#") continue
    cleanDets = cleanDets[part]
  }

  return cleanDets
}
