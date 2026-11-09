import type { MiddlewareVerb, RouteVerb } from "./types"
import { isString } from "@medusajs/utils"

type PathToRegexp = typeof import("path-to-regexp", {
  with: { "resolution-mode": "import" },
})

let pathToRegexpModule: PathToRegexp | undefined

/**
 * Loads the ESM-only path-to-regexp with `import()`. Jest run with
 * `--experimental-vm-modules` rejects `require()` of ESM, so call this
 * before creating a {@link RoutesFinder}.
 */
export async function preloadPathToRegexp(): Promise<void> {
  pathToRegexpModule ??= await import("path-to-regexp")
}

function loadPathToRegexp(): PathToRegexp {
  pathToRegexpModule ??= require("path-to-regexp") as PathToRegexp
  return pathToRegexpModule
}

/**
 * Upper bound on cached lookups. The cache key is the full request URL, so
 * every distinct URL - each id under a parametric route, each unmatched path -
 * adds an entry, and without a bound the map grows for the life of the process.
 */
const MAX_CACHED_MATCHES = 1000

export class RoutesFinder<
  T extends
    | { matcher: string | RegExp; methods: MiddlewareVerb | MiddlewareVerb[] }
    | { matcher: string | RegExp; method: RouteVerb },
> {
  /**
   * Cache of existing matches to avoid regex tests on every
   * single HTTP request
   */
  #existingMatches: Map<
    string,
    | (T & {
        matchRegex: RegExp
      })
    | null
  > = new Map()

  /**
   * Collection of registered routes
   */
  #routes: (T & {
    matchRegex: RegExp
  })[] = []

  constructor(routes?: T[]) {
    if (routes) {
      routes.forEach((route) => this.add(route))
    }
  }

  /**
   * Register route for lookup
   */
  add(route: T) {
    /**
     * A regular expression matcher is used directly for matching, since
     * path-to-regexp only compiles string paths.
     */
    if (route.matcher instanceof RegExp) {
      this.#routes.push({
        ...route,
        matchRegex: route.matcher,
      })
      return
    }

    // Doing a replacement for backwards compatibility with the old path-to-regexp with express 4
    let normalizedPath = route.matcher
    if (isString(route.matcher)) {
      // Replace /* with {*splat} (wildcard matches zero or more path segments)
      normalizedPath = normalizedPath.replace(/\/\*/g, "{*splat}")
      // Replace /path* (no slash before asterisk) with /path{*splat}
      normalizedPath = normalizedPath.replace(/(\w)\*/g, "$1{*splat}")
    }
    this.#routes.push({
      ...route,
      matchRegex: loadPathToRegexp().pathToRegexp(normalizedPath).regexp,
    })
  }

  /**
   * Get the matching route for a given HTTP method and URL
   */
  find(url: string, method: MiddlewareVerb) {
    const key = `${method}:${url}`
    if (this.#existingMatches.has(key)) {
      return this.#existingMatches.get(key)
    }

    const result =
      this.#routes.find((route) => {
        if ("methods" in route) {
          return route.methods.includes(method) && route.matchRegex.test(url)
        }
        return route.method === method && route.matchRegex.test(url)
      }) ?? null

    if (this.#existingMatches.size >= MAX_CACHED_MATCHES) {
      // A Map iterates in insertion order, so the first key is the oldest.
      this.#existingMatches.delete(this.#existingMatches.keys().next().value!)
    }
    this.#existingMatches.set(key, result)
    return result
  }
}
