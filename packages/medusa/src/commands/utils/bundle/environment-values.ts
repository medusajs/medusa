/**
 * A value of the build's environment, by the name of its variable.
 */
export type EnvironmentValue = { name: string; value: string }

/**
 * The variables of the environment a build runs in that have a value.
 *
 * The collection pass evaluates the app's configuration and resource files
 * with the build's environment, so anything it copies from them (a
 * subscriber's config, a module's joiner config) can hold a value read from a
 * variable: the bundle would then carry it to wherever the bundle is stored,
 * and keep using it whatever the run-time environment says.
 */
export function environmentValues(
  env: Record<string, string | undefined> = process.env
): EnvironmentValue[] {
  const values: EnvironmentValue[] = []
  for (const [name, value] of Object.entries(env)) {
    if (value) {
      values.push({ name, value })
    }
  }
  return values
}

/**
 * The first string or object key in `data` that is exactly the value of an
 * environment variable, with where it is, or undefined.
 */
export function findEnvironmentValue(
  data: unknown,
  values: EnvironmentValue[]
): { name: string; at: string } | undefined {
  const byValue = new Map(values.map(({ name, value }) => [value, name]))
  if (!byValue.size) {
    return undefined
  }

  const walk = (
    node: unknown,
    at: string
  ): { name: string; at: string } | undefined => {
    if (typeof node === "string") {
      const name = byValue.get(node)
      return name === undefined ? undefined : { name, at }
    }
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) {
        const found = walk(node[i], `${at}[${i}]`)
        if (found) {
          return found
        }
      }
      return undefined
    }
    if (node && typeof node === "object") {
      for (const [key, child] of Object.entries(node)) {
        const name = byValue.get(key)
        if (name !== undefined) {
          return { name, at: `${at} (a key)` }
        }
        const found = walk(child, at ? `${at}.${key}` : key)
        if (found) {
          return found
        }
      }
    }
    return undefined
  }
  return walk(data, "")
}
