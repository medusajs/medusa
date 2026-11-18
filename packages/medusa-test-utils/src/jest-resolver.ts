type ResolverOptions = {
  conditions?: ReadonlyArray<string>
  defaultResolver: (request: string, options: ResolverOptions) => string
}

/**
 * Jest resolver that falls back to the `import` export condition when a
 * package can't be resolved with Jest's CommonJS conditions. Jest compiles
 * `import()` to `require()`, so packages whose `exports` only declare `import`
 * (e.g. `connect-redis`) are otherwise not found.
 */
function resolver(request: string, options: ResolverOptions): string {
  try {
    return options.defaultResolver(request, options)
  } catch (error) {
    try {
      return options.defaultResolver(request, {
        ...options,
        conditions: [...(options.conditions ?? []), "import"],
      })
    } catch {
      throw error
    }
  }
}

export = resolver
