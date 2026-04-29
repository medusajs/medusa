import { pathToRegexp } from "path-to-regexp"
import type { MiddlewareVerb, RouteVerb } from "./types"
import { isString } from "@medusajs/utils"

export class RoutesFinder<
  T extends
    | { matcher: string; methods: MiddlewareVerb | MiddlewareVerb[] }
    | { matcher: string; method: RouteVerb }
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
        if ("methods" in route) {
          return route.methods.includes(method) && route.matchRegex.test(url)
        }
        return route.method === method && route.matchRegex.test(url)
      }) ?? null

    this.#existingMatches.set(key, result)
    return result
  }
}
