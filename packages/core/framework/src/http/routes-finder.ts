import { pathToRegexp } from "path-to-regexp"
import type { MiddlewareVerb, RouteVerb } from "./types"
import { toExpressPath } from "./utils/to-express-path"

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
      matchRegex: pathToRegexp(toExpressPath(route.matcher)).regexp,
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
