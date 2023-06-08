import { Link, Route, RouteExtension } from "../../../src/client/types"
import { validatePath } from "../../../src/client/utils"

type RouteNode = {
  [pathSegment: string]: RouteNode | Route
}

class RouteRegistry {
  private routes: RouteNode
  private links: Link[]

  constructor() {
    this.routes = {}
    this.links = []
  }

  register(origin: string, { Component, config }: RouteExtension) {
    const { path, link } = config

    const result = validatePath(path, origin)

    if (!result.valid) {
      throw new Error(result.error)
    }

    const pathSegments = path.split("/").filter(Boolean)
    let currentNode = this.routes
    let finalSegment = ""

    for (const segment of pathSegments) {
      if (!currentNode[segment]) {
        currentNode[segment] = {}
      }
      currentNode = currentNode[segment] as RouteNode
      finalSegment = segment
    }

    currentNode.__route = {
      origin,
      path: `/${finalSegment}`,
      Page: Component,
    }

    if (link) {
      this.links.push({
        path,
        label: link.label,
        icon: link.icon,
      })
    }
  }

  getTopLevelRoutes(): Route[] {
    return Object.values(this.routes)
      .filter((node) => "__route" in node)
      .map((node) => (node as RouteNode).__route as Route)
  }

  getNestedRoutes(path: string): Route[] {
    const pathSegments = path.split("/").filter(Boolean)
    let currentNode = this.routes

    for (const segment of pathSegments) {
      if (!currentNode[segment]) {
        return []
      }
      currentNode = currentNode[segment] as RouteNode
    }

    return Object.values(currentNode)
      .filter((node) => "__route" in node)
      .map((node) => (node as RouteNode).__route as Route)
  }

  getLinks(): Link[] {
    return this.links
  }
}

export default RouteRegistry
