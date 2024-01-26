import { isForbiddenRoute } from "../constants/forbidden-routes"
import { Link, Route, RouteExtension, RouteSegment } from "../types/extensions"

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

    if (currentNode.__route) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `Route with path ${path} already registered by ${currentNode.__route.origin}.`
        )
      }

      return
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

  getTopLevelRoutes(): (Route | RouteSegment)[] {
    const topLevelRoutes = Object.entries(this.routes)
      .filter(([key, _]) => !isForbiddenRoute(key))
      .map(([key, node]) => {
        return "__route" in node
          ? ((node as RouteNode).__route as Route)
          : ({
              path: `/${key}`,
            } as RouteSegment)
      })

    return topLevelRoutes
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
