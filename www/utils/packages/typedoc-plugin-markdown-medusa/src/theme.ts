import * as path from "path"
import {
  ContainerReflection,
  DeclarationReflection,
  PageEvent,
  ProjectReflection,
  Reflection,
  ReflectionKind,
  RenderTemplate,
  Renderer,
  RendererEvent,
  Theme,
  UrlMapping,
} from "typedoc"
import {
  indexTemplate,
  reflectionMemberTemplate,
  reflectionTemplate,
  registerHelpers,
  registerPartials,
} from "./render-utils"
import { formatContents } from "./utils"

import type {
  FormattingOptionType,
  FormattingOptionsType,
  ParameterStyle,
} from "types"
import { Mapping } from "./types"

export class MarkdownTheme extends Theme {
  allReflectionsHaveOwnDocument!: string[]
  allReflectionsHaveOwnDocumentInNamespace: string[]
  entryDocument: string
  entryPoints!: string[]
  filenameSeparator!: string
  hideBreadcrumbs!: boolean
  hideInPageTOC!: boolean
  hidePageTitle!: boolean
  hideMembersSymbol!: boolean
  includes!: string
  indexTitle!: string
  mediaDirectory!: string
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

    // prettier-ignore
    this.allReflectionsHaveOwnDocument = this.getOption("allReflectionsHaveOwnDocument") as string[]
    this.allReflectionsHaveOwnDocumentInNamespace = this.getOption(
      "allReflectionsHaveOwnDocumentInNamespace"
    ) as string[]
    this.entryDocument = this.getOption("entryDocument") as string
    this.entryPoints = this.getOption("entryPoints") as string[]
    this.filenameSeparator = this.getOption("filenameSeparator") as string
    this.hideBreadcrumbs = this.getOption("hideBreadcrumbs") as boolean
    this.hideInPageTOC = this.getOption("hideInPageTOC") as boolean
    this.hidePageTitle = this.getOption("hidePageTitle") as boolean
    this.hideMembersSymbol = this.getOption("hideMembersSymbol") as boolean
    this.includes = this.getOption("includes") as string
    this.indexTitle = this.getOption("indexTitle") as string
    this.mediaDirectory = this.getOption("media") as string
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
  }

  render(
    page: PageEvent<Reflection>,
    template: RenderTemplate<PageEvent<Reflection>>
  ): string {
    return formatContents(template(page) as string)
  }

  getOption(key: string) {
    return this.application.options.getValue(key)
  }

  getUrls(project: ProjectReflection) {
    const urls: UrlMapping[] = []
    const noReadmeFile = this.readme.endsWith("none")
    if (noReadmeFile) {
      project.url = this.entryDocument
      urls.push(
        new UrlMapping(
          this.entryDocument,
          project,
          this.getReflectionTemplate()
        )
      )
    } else {
      project.url = this.globalsFile
      urls.push(
        new UrlMapping(this.globalsFile, project, this.getReflectionTemplate())
      )
      urls.push(
        new UrlMapping(this.entryDocument, project, this.getIndexTemplate())
      )
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
      reflection.getAlias()
    )
  }

  buildUrls(
    reflection: DeclarationReflection,
    urls: UrlMapping[]
  ): UrlMapping[] {
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
      if (!reflection.url || !MarkdownTheme.URL_PREFIX.test(reflection.url)) {
        const url = this.toUrl(mapping, reflection)
        urls.push(new UrlMapping(url, reflection, mapping.template))
        reflection.url = url
        reflection.hasOwnDocument = true
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
    let url = reflection.getAlias()

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
    if (
      container.url &&
      (!reflection.url || !MarkdownTheme.URL_PREFIX.test(reflection.url))
    ) {
      const reflectionId = this.preserveAnchorCasing
        ? reflection.name
        : reflection.name.toLowerCase()

      if (isSymbol) {
        this.anchorMap[container.url]
          ? this.anchorMap[container.url].push(reflectionId)
          : (this.anchorMap[container.url] = [reflectionId])
      }

      const count = this.anchorMap[container.url]?.filter(
        (id) => id === reflectionId
      )?.length

      const anchor = this.toAnchorRef(
        reflectionId + (count > 1 ? "-" + (count - 1).toString() : "")
      )

      reflection.url = container.url + "#" + anchor
      reflection.anchor = anchor
      reflection.hasOwnDocument = false
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
    if (MarkdownTheme.URL_PREFIX.test(absolute)) {
      return absolute
    } else {
      const relative = path.relative(
        path.dirname(this.location),
        path.dirname(absolute)
      )
      return path.join(relative, path.basename(absolute)).replace(/\\/g, "/")
    }
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

  getAllReflectionsHaveOwnDocument(reflection: DeclarationReflection): boolean {
    const moduleParents = this.getParentsOfKind(
      reflection,
      ReflectionKind.Module
    )
    const namespaceParents = this.getParentsOfKind(
      reflection,
      ReflectionKind.Namespace
    )

    return (
      moduleParents.some((parent) =>
        this.allReflectionsHaveOwnDocument.includes(parent.name)
      ) ||
      namespaceParents.some((parent) =>
        this.allReflectionsHaveOwnDocumentInNamespace.includes(parent.name)
      )
    )
  }

  getFileNameSeparator(pathPrefix: string): string {
    const formattingOptions = this.getFormattingOptions(pathPrefix)
    return formattingOptions.fileNameSeparator || this.filenameSeparator
  }

  getMappings(
    reflection: DeclarationReflection,
    directoryPrefix?: string
  ): Mapping[] {
    return [
      {
        kind: [ReflectionKind.Module],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "modules"),
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Namespace],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: false,
        directory: path.join(directoryPrefix || ""),
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Enum],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "enums"),
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Class],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "classes"),
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Interface],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "interfaces"),
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.TypeAlias],
        modifiers: {
          has: [],
          not: [],
        },
        isLeaf: true,
        directory: path.join(directoryPrefix || "", "types"),
        template: this.getReflectionMemberTemplate(),
      },
      ...(this.getAllReflectionsHaveOwnDocument(reflection)
        ? [
            {
              kind: [ReflectionKind.Variable],
              modifiers: {
                has: [],
                not: [],
              },
              isLeaf: true,
              directory: path.join(directoryPrefix || "", "variables"),
              template: this.getReflectionMemberTemplate(),
            },
            {
              kind: [ReflectionKind.Function],
              modifiers: {
                has: [],
                not: [],
              },
              isLeaf: true,
              directory: path.join(directoryPrefix || "", "functions"),
              template: this.getReflectionMemberTemplate(),
            },
            {
              kind: [ReflectionKind.Method],
              modifiers: {
                has: [],
                not: [],
              },
              isLeaf: true,
              directory: path.join(directoryPrefix || "", "methods"),
              template: this.getReflectionMemberTemplate(),
            },
          ]
        : []),
    ]
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
