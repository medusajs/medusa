import type { MiddlewareVerb, RouteVerb } from "./types"
import { toExpressPath } from "./utils/to-express-path"

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

    this.#routes.push({
      ...route,
      matchRegex: loadPathToRegexp().pathToRegexp(toExpressPath(route.matcher))
        .regexp,
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

    this.#existingMatches.set(key, result)
    return result
  }
}
