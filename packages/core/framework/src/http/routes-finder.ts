import { pathToRegexp } from "path-to-regexp"
import type { MiddlewareVerb, RouteVerb } from "./types"
import { isString } from "@medusajs/utils"

export class RoutesFinder<
  T extends
    | { matcher: string | RegExp; methods: MiddlewareVerb | MiddlewareVerb[] }
    | { matcher: string | RegExp; method: RouteVerb }
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
        /**
         * Matched on a copy rather than the caller's instance. `test()` writes
         * to `lastIndex` on a global or sticky expression, and the matcher is
         * owned by whoever registered the route — they may still be using it.
         * `find()` resets `lastIndex` before every test, which would otherwise
         * interfere with their own iteration over the same object.
         */
        matchRegex: new RegExp(route.matcher.source, route.matcher.flags),
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
      matchRegex: pathToRegexp(normalizedPath).regexp,
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
        /**
         * `test()` advances `lastIndex` when the expression carries the global
         * or sticky flag, so the answer depends on whichever URL was tested
         * before this one. Reset it so every lookup is evaluated the way the
         * first one was.
         *
         * This matters more here than it looks: matchers live for the lifetime
         * of the process, and the result below is memoised in
         * `#existingMatches`. A single stale `lastIndex` therefore does not
         * merely produce one wrong answer — it caches it, so a middleware stays
         * silently skipped for that URL until the server restarts.
         */
        route.matchRegex.lastIndex = 0

        if ("methods" in route) {
          return route.methods.includes(method) && route.matchRegex.test(url)
        }
        return route.method === method && route.matchRegex.test(url)
      }) ?? null

    this.#existingMatches.set(key, result)
    return result
  }
}
