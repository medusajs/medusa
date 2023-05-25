import { Link, PageExtension, Route } from "./types"

class PageRegistry {
  links: Link[] = []
  routes: Route[] = []

  public registerPage(origin: string, page: PageExtension) {
    const { path, title } = page.config
    this.links.push({ path, title })
    this.routes.push({ origin, path, Page: page.Component })
  }

  public getLinks() {
    return this.links
  }

  public getRoutes() {
    return this.routes
  }
}

export default PageRegistry
