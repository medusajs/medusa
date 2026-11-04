import * as path from "path"
import {
  Application,
  PageDefinition,
  ProjectReflection,
  Reflection,
  Router,
  Slugger,
} from "typedoc"
import {
  clearReflectionRoutes,
  getReflectionAnchor,
  getReflectionUrl,
  getRoutedReflections,
  reflectionHasOwnDocument,
} from "utils"
import { MarkdownTheme } from "./theme.js"

export class MedusaRouter implements Router {
  private sluggers = new Map<string, Slugger>()

  constructor(readonly application: Application) {}

  buildPages(project: ProjectReflection): PageDefinition[] {
    clearReflectionRoutes()
    this.sluggers.clear()

    return (this.application.renderer.theme as MarkdownTheme).getUrls(project)
  }

  hasUrl(target: Reflection): boolean {
    return getReflectionUrl(target) !== undefined
  }

  getLinkTargets(): Reflection[] {
    return getRoutedReflections()
  }

  getAnchor(target: Reflection): string | undefined {
    return getReflectionAnchor(target)
  }

  hasOwnDocument(target: Reflection): boolean {
    return reflectionHasOwnDocument(target)
  }

  relativeUrl(from: Reflection, to: Reflection): string {
    const fromUrl = getReflectionUrl(from) || ""
    const toUrl = getReflectionUrl(to) || ""
    const relative = path.posix.relative(
      path.posix.dirname(fromUrl),
      path.posix.dirname(toUrl)
    )

    return path.posix.join(relative, path.posix.basename(toUrl))
  }

  baseRelativeUrl(from: Reflection, target: string): string {
    const fromUrl = getReflectionUrl(from) || ""
    return path.posix.relative(path.posix.dirname(fromUrl), target) || "."
  }

  getFullUrl(target: Reflection): string {
    return getReflectionUrl(target) || ""
  }

  getSlugger(target: Reflection): Slugger {
    const page = (getReflectionUrl(target) || "").split("#")[0]
    let slugger = this.sluggers.get(page)
    if (!slugger) {
      slugger = new Slugger(
        this.application.options.getValue("sluggerConfiguration")
      )
      this.sluggers.set(page, slugger)
    }

    return slugger
  }
}
