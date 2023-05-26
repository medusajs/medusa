import { Link, NestedRouteExtension, Route, RouteExtension } from "./types"

class RouteRegistry {
  links: Link[] = []
  routes: Route[] = []
  nestedRoutes: Map<string, Route[]> = new Map()

  private formatPath_(path: string) {
    if (path.startsWith("a/")) {
      path = path.substring(2)
    }

    if (path.startsWith("/a/")) {
      path = path.substring(3)
    }

    if (path.startsWith("/")) {
      path = path.substring(1)
    }

    if (path.endsWith("/")) {
      path = path.substring(0, path.length - 1)
    }

    return path
  }

  public registerRoute(origin: string, route: RouteExtension) {
    const { path, title, icon } = route.config

    const formattedPath = this.formatPath_(path)
    this.routes.push({ origin, path: formattedPath, Page: route.Component })
    this.links.push({ path: formattedPath, title, icon })
  }

  public registerNestedRoute(origin: string, route: NestedRouteExtension) {
    const { path, parent } = route.config

    const formattedPath = this.formatPath_(path)
    const formattedParent = this.formatPath_(parent)

    const routes = this.nestedRoutes.get(formattedParent) || []
    routes.push({
      origin,
      path: formattedPath,
      Page: route.Component,
    })

    this.nestedRoutes.set(formattedParent, routes)
  }

  public getLinks() {
    return this.links
  }

  public getRoutes() {
    return this.routes
  }

  public getNestedRoutes(parent: string) {
    return this.nestedRoutes.get(parent) || []
  }
}

export default RouteRegistry
