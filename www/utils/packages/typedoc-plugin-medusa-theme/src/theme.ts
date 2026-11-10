import * as path from "path"
import {
  ContainerReflection,
  DeclarationReflection,
  PageDefinition,
  PageEvent,
  ProjectReflection,
  Reflection,
  ReflectionKind,
  Renderer,
  RendererEvent,
  Theme,
} from "typedoc"
import { getReflectionUrl, setReflectionRoute } from "utils"
import {
  indexTemplate,
  reflectionMemberTemplate,
  reflectionTemplate,
  registerHelpers,
  registerPartials,
} from "./render-utils.js"
import { formatContents } from "./utils.js"

import type {
  AllowedProjectDocumentsOption,
  FormattingOptionType,
  FormattingOptionsType,
  ParameterStyle,
} from "types"
import { Mapping, MedusaPageKind } from "./types.js"
import { getAlias } from "./utils/reflection-template-strings.js"

export class MarkdownTheme extends Theme {
  allPropertyReflectionsHaveOwnDocument!: string[]
  allowedProjectDocuments: AllowedProjectDocumentsOption
  entryDocument: string
  entryPoints!: string[]
  filenameSeparator!: string
  hideBreadcrumbs!: boolean
  hideInPageTOC!: boolean
  hidePageTitle!: boolean
  hideMembersSymbol!: boolean
  indexTitle!: string
  namedAnchors!: boolean
  readme!: string
  out!: string
  publicPath!: string
  preserveAnchorCasing!: boolean
  objectLiteralTypeDeclarationStyle: ParameterStyle
  formattingOptions: FormattingOptionsType
  mdxOutput: boolean
  outputNamespace: boolean
  outputModules: boolean

  project?: ProjectReflection
  reflection?: DeclarationReflection
  location!: string
  anchorMap: Record<string, string[]> = {}
  currentTitleLevel = 1

  static URL_PREFIX = /^(http|ftp)s?:\/\//

  static MAX_LEVEL = 3

  constructor(renderer: Renderer) {
    super(renderer)

    this.allPropertyReflectionsHaveOwnDocument = this.getOption(
      "allPropertyReflectionsHaveOwnDocument"
    ) as string[]
    this.allowedProjectDocuments = this.getOption(
      "allowedProjectDocuments"
    ) as AllowedProjectDocumentsOption
    this.entryDocument = this.getOption("entryDocument") as string
    this.entryPoints = this.getOption("entryPoints") as string[]
    this.filenameSeparator = this.getOption("filenameSeparator") as string
    this.hideBreadcrumbs = this.getOption("hideBreadcrumbs") as boolean
    this.hideInPageTOC = this.getOption("hideInPageTOC") as boolean
    this.hidePageTitle = this.getOption("hidePageTitle") as boolean
    this.hideMembersSymbol = this.getOption("hideMembersSymbol") as boolean
    this.indexTitle = this.getOption("indexTitle") as string
    this.namedAnchors = this.getOption("namedAnchors") as boolean
    this.readme = this.getOption("readme") as string
    this.out = this.getOption("out") as string
    this.publicPath = this.getOption("publicPath") as string
    this.preserveAnchorCasing = this.getOption(
      "preserveAnchorCasing"
    ) as boolean
    this.objectLiteralTypeDeclarationStyle = this.getOption(
      "objectLiteralTypeDeclarationStyle"
    ) as ParameterStyle
    this.formattingOptions = this.getOption(
      "formatting"
    ) as FormattingOptionsType
    this.mdxOutput = this.getOption("mdxOutput") as boolean
    this.outputNamespace = this.getOption("outputNamespace") as boolean
    this.outputModules = this.getOption("outputModules") as boolean
    MarkdownTheme.MAX_LEVEL = this.getOption("maxLevel") as number

    registerPartials()
    registerHelpers(this)

    renderer.on(RendererEvent.BEGIN, this.onBeginRenderer.bind(this))
    renderer.on(PageEvent.BEGIN, this.onBeginPage.bind(this))
  }

  render(page: PageEvent): string {
    return formatContents(this.renderPage(page))
  }

  renderPage(page: PageEvent): string {
    const pageEvent = page as PageEvent<ContainerReflection>
    switch (page.pageKind as MedusaPageKind) {
      case "member":
        return this.getReflectionMemberTemplate()(pageEvent)
      case "index":
        return this.getIndexTemplate()(pageEvent)
      default:
        return this.getReflectionTemplate()(pageEvent)
    }
  }

  getOption(key: string) {
    return this.application.options.getValue(key)
  }

  getUrls(project: ProjectReflection) {
    const urls: PageDefinition[] = []
    const noReadmeFile = this.readme.endsWith("none")
    if (noReadmeFile) {
      setReflectionRoute(project, {
        url: this.entryDocument,
        hasOwnDocument: true,
      })
      urls.push({
        url: this.entryDocument,
        kind: "reflection",
        model: project,
      })
    } else {
      setReflectionRoute(project, {
        url: this.globalsFile,
        hasOwnDocument: true,
      })
      urls.push({ url: this.globalsFile, kind: "reflection", model: project })
      urls.push({ url: this.entryDocument, kind: "index", model: project })
    }
    project.children?.forEach((child: Reflection) => {
      if (child instanceof DeclarationReflection) {
        this.buildUrls(child as DeclarationReflection, urls)
      }
    })
    return urls
  }

  getAliasPath(reflection: Reflection): string {
    return path.join(
      reflection.parent && !reflection.parent.isProject()
        ? this.getAliasPath(reflection.parent)
        : "",
      getAlias(reflection)
    )
  }

  buildUrls(
    reflection: DeclarationReflection,
    urls: PageDefinition[]
  ): PageDefinition[] {
    const mapping = this.getMappings(
      reflection,
      reflection.parent?.isProject() || !reflection.parent
        ? ""
        : this.getAliasPath(reflection.parent)
    ).find(
      (mapping) =>
        reflection.kindOf(mapping.kind) &&
        mapping.modifiers.has.every(
          (modifier) => reflection.comment?.hasModifier(modifier) || false
        ) &&
        mapping.modifiers.not.every((modifier) => {
          return reflection.comment
            ? !reflection.comment.hasModifier(modifier)
            : true
        })
    )
    if (mapping) {
      const reflectionUrl = getReflectionUrl(reflection)
      if (!reflectionUrl || !MarkdownTheme.URL_PREFIX.test(reflectionUrl)) {
        const url = this.toUrl(mapping, reflection)
        urls.push({ url, kind: mapping.pageKind, model: reflection })
        setReflectionRoute(reflection, { url, hasOwnDocument: true })
      }

      for (const child of reflection.children || []) {
        if (mapping.isLeaf) {
          this.applyAnchorUrl(child, reflection)
        } else {
          this.buildUrls(child, urls)
        }
      }
    } else if (reflection.parent) {
      this.applyAnchorUrl(reflection, reflection.parent, true)
    }
    return urls
  }

  toUrl(mapping: Mapping, reflection: DeclarationReflection) {
    return (
      mapping.directory +
      "/" +
      this.getUrl({
        reflection,
        directory: mapping.directory,
      }) +
      `/page.${this.mdxOutput ? "mdx" : "md"}`
    )
  }

  getUrl({
    reflection,
    directory,
    relative,
  }: {
    reflection: Reflection
    directory: string
    relative?: Reflection
  }): string {
    let url = getAlias(reflection)

    if (
      reflection.parent &&
      reflection.parent !== relative &&
      !(reflection.parent instanceof ProjectReflection)
    ) {
      const urlPrefix = this.getUrl({
        reflection: reflection.parent,
        directory,
        relative,
      })
      const fileNameSeparator = this.getFileNameSeparator(
        `${directory}/${urlPrefix}`
      )
      url = urlPrefix + fileNameSeparator + url
    }

    return url.replace(/^_/, "")
  }

  applyAnchorUrl(
    reflection: Reflection,
    container: Reflection,
    isSymbol = false
  ) {
    const containerUrl = getReflectionUrl(container)
    const reflectionUrl = getReflectionUrl(reflection)
    if (
      containerUrl &&
      (!reflectionUrl || !MarkdownTheme.URL_PREFIX.test(reflectionUrl))
    ) {
      const reflectionId = this.preserveAnchorCasing
        ? reflection.name
        : reflection.name.toLowerCase()

      if (isSymbol) {
        this.anchorMap[containerUrl]
          ? this.anchorMap[containerUrl].push(reflectionId)
          : (this.anchorMap[containerUrl] = [reflectionId])
      }

      const count = this.anchorMap[containerUrl]?.filter(
        (id) => id === reflectionId
      )?.length

      const anchor = this.toAnchorRef(
        reflectionId + (count > 1 ? "-" + (count - 1).toString() : "")
      )

      setReflectionRoute(reflection, {
        url: containerUrl + "#" + anchor,
        anchor,
        hasOwnDocument: false,
      })
    }
    reflection.traverse((child) => {
      if (child instanceof DeclarationReflection) {
        this.applyAnchorUrl(child, container)
      }
    })
  }

  toAnchorRef(reflectionId: string) {
    return reflectionId
  }

  getRelativeUrl(absolute: string) {
    let url = ""
    if (MarkdownTheme.URL_PREFIX.test(absolute)) {
      url = absolute
    } else {
      const relative = path.relative(
        path.dirname(this.location),
        path.dirname(absolute)
      )
      url = path.join(relative, path.basename(absolute)).replace(/\\/g, "/")
    }

    if (url === `page.${this.mdxOutput ? "mdx" : "md"}`) {
      url = `./${url}`
    }

    return url
  }

  getReflectionTemplate() {
    return (pageEvent: PageEvent<ContainerReflection>) => {
      return reflectionTemplate(pageEvent, {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
        data: { theme: this },
      })
    }
  }

  getReflectionMemberTemplate() {
    return (pageEvent: PageEvent<ContainerReflection>) => {
      return reflectionMemberTemplate(pageEvent, {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
        data: { theme: this },
      })
    }
  }

  getIndexTemplate() {
    return (pageEvent: PageEvent<ContainerReflection>) => {
      return indexTemplate(pageEvent, {
        allowProtoMethodsByDefault: true,
        allowProtoPropertiesByDefault: true,
        data: { theme: this },
      })
    }
  }

  getParentsOfKind(
    reflection: DeclarationReflection,
    kind: ReflectionKind
  ): DeclarationReflection[] {
    const parents: DeclarationReflection[] = []
    let currentParent = reflection?.parent as DeclarationReflection | undefined
    do {
      if (currentParent?.kind === kind) {
        parents.push(currentParent)
      }
      currentParent = currentParent?.parent as DeclarationReflection | undefined
    } while (currentParent)

    return parents
  }

  getAllowedReflectionDocuments(reflection: DeclarationReflection) {
    const documents = {
      [ReflectionKind.Module]: true,
      [ReflectionKind.Namespace]: true,
      [ReflectionKind.Enum]: true,
      [ReflectionKind.Class]: true,
      [ReflectionKind.Interface]: true,
      [ReflectionKind.TypeAlias]: true,
      [ReflectionKind.Variable]: false,
      [ReflectionKind.Function]: false,
      [ReflectionKind.Method]: false,
      [ReflectionKind.Property]: false,
    }

    let options: Record<ReflectionKind, boolean> | undefined

    const moduleParents = this.getParentsOfKind(
      reflection,
      ReflectionKind.Module
    ).reverse() // projects come last, this changes the direction to give projects higher priority
    const namespaceParents = this.getParentsOfKind(
      reflection,
      ReflectionKind.Namespace
    )

    moduleParents.some((parent) => {
      if (!Object.hasOwn(this.allowedProjectDocuments, parent.name)) {
        return false
      }

      options = this.allowedProjectDocuments[parent.name]
      return true
    }) ||
      namespaceParents.some((parent) => {
        if (!Object.hasOwn(this.allowedProjectDocuments, parent.name)) {
          return false
        }

        options = this.allowedProjectDocuments[parent.name]
        return true
      })

    return {
      ...documents,
      ...(options || {}),
    }
  }

  getFileNameSeparator(pathPrefix: string): string {
    const formattingOptions = this.getFormattingOptions(pathPrefix)
    return formattingOptions.fileNameSeparator || this.filenameSeparator
  }

  getMappings(
    reflection: DeclarationReflection,
    directoryPrefix?: string
  ): Mapping[] {
    const allowedDocuments = this.getAllowedReflectionDocuments(reflection)
    const mappings: Mapping[] = []

    if (allowedDocuments[ReflectionKind.Module]) {
      mappings.push({
        kind: [ReflectionKind.Module],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "modules"),
        pageKind: "reflection",
      })
    }
    if (allowedDocuments[ReflectionKind.Namespace]) {
      mappings.push({
        kind: [ReflectionKind.Namespace],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: false,
        directory: path.join(directoryPrefix || ""),
        pageKind: "reflection",
      })
    }
    if (allowedDocuments[ReflectionKind.Enum]) {
      mappings.push({
        kind: [ReflectionKind.Enum],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "enums"),
        pageKind: "reflection",
      })
    }
    if (allowedDocuments[ReflectionKind.Class]) {
      mappings.push({
        kind: [ReflectionKind.Class],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "classes"),
        pageKind: "reflection",
      })
    }
    if (allowedDocuments[ReflectionKind.Interface]) {
      mappings.push({
        kind: [ReflectionKind.Interface],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "interfaces"),
        pageKind: "reflection",
      })
    }

    if (allowedDocuments[ReflectionKind.TypeAlias]) {
      mappings.push({
        kind: [ReflectionKind.TypeAlias],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: true,
        directory: path.join(directoryPrefix || "", "types"),
        pageKind: "member",
      })
    }

    if (allowedDocuments[ReflectionKind.Variable]) {
      mappings.push({
        kind: [ReflectionKind.Variable],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: true,
        directory: path.join(directoryPrefix || "", "variables"),
        pageKind: "member",
      })
    }
    if (allowedDocuments[ReflectionKind.Function]) {
      mappings.push({
        kind: [ReflectionKind.Function],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: true,
        directory: path.join(directoryPrefix || "", "functions"),
        pageKind: "member",
      })
    }
    if (allowedDocuments[ReflectionKind.Method]) {
      mappings.push({
        kind: [ReflectionKind.Method],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: true,
        directory: path.join(directoryPrefix || "", "methods"),
        pageKind: "member",
      })
    }
    if (allowedDocuments[ReflectionKind.Property]) {
      mappings.push({
        kind: [ReflectionKind.Property],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: true,
        directory: path.join(directoryPrefix || "", "properties"),
        pageKind: "member",
      })
    }

    return mappings
  }

  /**
   * Triggered before the renderer starts rendering a project.
   *
   * @param event  An event object describing the current render operation.
   */
  protected onBeginRenderer(event: RendererEvent) {
    this.project = event.project
  }

  /**
   * Triggered before a document will be rendered.
   *
   * @param page  An event object describing the current render operation.
   */
  protected onBeginPage(page: PageEvent) {
    // reset header level counter
    this.currentTitleLevel = 1
    this.location = page.url
    this.reflection =
      page.model instanceof DeclarationReflection ? page.model : undefined

    if (
      page.model instanceof DeclarationReflection ||
      page.model instanceof ProjectReflection
    ) {
      this.removeGroups(page.model)
      this.removeCategories(page.model)
      this.sortCategories(page.model)
    }

    if (
      this.reflection instanceof DeclarationReflection &&
      this.reflection.parent instanceof ProjectReflection
    ) {
      const namespacesGroup = this.reflection.groups?.find(
        (group) => group.title === "Namespaces"
      )
      if (namespacesGroup) {
        // remove the namespaces that have the `@namespaceMember` modifier
        namespacesGroup.children = namespacesGroup.children.filter((child) => {
          return child.comment
            ? !child.comment.hasModifier("@namespaceMember")
            : true
        })
      }
    }

    if (
      this.reflection instanceof DeclarationReflection &&
      this.reflection.signatures
    ) {
      // check if any of its signature has the `@mainSignature` tag
      // and if so remove other signatures
      const mainSignatureIndex = this.reflection.signatures.findIndex(
        (signature) => signature.comment?.hasModifier("@mainSignature")
      )

      if (mainSignatureIndex !== -1) {
        const mainSignature = this.reflection.signatures[mainSignatureIndex]
        this.reflection.signatures = [mainSignature]
      }
    }
  }

  protected removeGroups(model?: DeclarationReflection | ProjectReflection) {
    if (!model?.groups) {
      return
    }

    const options = this.getFormattingOptionsForLocation()

    model.groups = model.groups.filter((reflectionGroup) => {
      return (
        !options.reflectionGroups ||
        !(reflectionGroup.title in options.reflectionGroups) ||
        options.reflectionGroups[reflectionGroup.title]
      )
    })
  }

  protected removeCategories(
    model?: DeclarationReflection | ProjectReflection
  ) {
    if (!model?.categories) {
      return
    }

    const options = this.getFormattingOptionsForLocation()

    model.categories = model.categories.filter((category) => {
      return (
        !options.reflectionCategories ||
        !(category.title in options.reflectionCategories) ||
        options.reflectionCategories[category.title]
      )
    })
  }

  protected sortCategories(model?: DeclarationReflection | ProjectReflection) {
    if (!model?.categories) {
      return
    }

    model.categories.sort((categoryA, categoryB) => {
      return categoryA.title.localeCompare(categoryB.title)
    })
  }

  get globalsFile() {
    return `modules.${this.mdxOutput ? "mdx" : "md"}`
  }

  setCurrentTitleLevel(value: number) {
    this.currentTitleLevel = value
  }

  getFormattingOptionsForLocation(): FormattingOptionType {
    if (!this.location) {
      return {}
    }

    return this.getFormattingOptions(this.location)
  }

  getFormattingOptions(location: string): FormattingOptionType {
    const applicableOptions: FormattingOptionType[] = []

    Object.keys(this.formattingOptions).forEach((key) => {
      if (key === "*" || new RegExp(key).test(location)) {
        applicableOptions.push(this.formattingOptions[key])
      }
    })

    return Object.assign({}, ...applicableOptions)
  }
}
