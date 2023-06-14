import { Link, Route, RouteExtension } from "../types/extensions"

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

  getNestedRoutes(path: string) {
    const segments = path.split("/").filter((s) => !!s)
    const routes = this.routes

    function getNode(segments: string[]) {
      let currentNode: RouteNode | null = routes

      for (const segment of segments) {
        if (currentNode && currentNode[segment]) {
          currentNode = currentNode[segment] as RouteNode
        } else {
          currentNode = null
          break
        }
      }

      return currentNode
    }

    const lastKnownNode = getNode(segments)

    if (!lastKnownNode) {
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[RouteRegistry]: The provided path ${path} does not exist in the registry.`
        )
      }
      return []
    }

    const nestedRoutes: Route[] = []

    function getChildren(node: RouteNode, parent: string = "") {
      const possiblePaths = Object.entries(node).filter(
        ([key, _value]) => key !== "__route"
      )

      for (const [key, value] of possiblePaths) {
        const currentPath = `${parent}/${key}`

        if (value && "__route" in value) {
          const page = (value.__route as Route).Page
          const origin = (value.__route as Route).origin

          nestedRoutes.push({
            origin,
            path: currentPath,
            Page: page,
          })
        }

        if (value && typeof value === "object") {
          getChildren(value as RouteNode, currentPath)
        }
      }
    }

    getChildren(lastKnownNode)

    return nestedRoutes
  }

  getLinks(): Link[] {
    return this.links
  }
}

export default RouteRegistry
