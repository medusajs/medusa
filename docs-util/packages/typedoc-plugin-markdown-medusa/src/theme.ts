import * as path from "path"
import {
  ContainerReflection,
  DeclarationReflection,
  PageEvent,
  ProjectReflection,
  Reflection,
  ReflectionGroup,
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
import {
  FormattingOptionType,
  FormattingOptionsType,
  Mapping,
  ObjectLiteralDeclarationStyle,
} from "./types"

export class MarkdownTheme extends Theme {
  allReflectionsHaveOwnDocument!: boolean
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
  objectLiteralTypeDeclarationStyle: ObjectLiteralDeclarationStyle
  formattingOptions: FormattingOptionsType
  mdxOutput: boolean
  outputNamespace: boolean
  outputModules: boolean

  project?: ProjectReflection
  reflection?: DeclarationReflection
  location!: string
  anchorMap: Record<string, string[]> = {}

  static URL_PREFIX = /^(http|ftp)s?:\/\//

  static MAX_LEVEL = 3

  constructor(renderer: Renderer) {
    super(renderer)

    // prettier-ignore
    this.allReflectionsHaveOwnDocument = this.getOption("allReflectionsHaveOwnDocument") as boolean
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
    ) as ObjectLiteralDeclarationStyle
    this.formattingOptions = this.getOption(
      "formatting"
    ) as FormattingOptionsType
    this.mdxOutput = this.getOption("mdxOutput") as boolean
    this.outputNamespace = this.getOption("outputNamespace") as boolean
    this.outputModules = this.getOption("outputModules") as boolean
    MarkdownTheme.MAX_LEVEL = this.getOption("maxLevel") as number

    this.listenTo(this.owner, {
      [RendererEvent.BEGIN]: this.onBeginRenderer,
      [PageEvent.BEGIN]: this.onBeginPage,
    })

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

  buildUrls(
    reflection: DeclarationReflection,
    urls: UrlMapping[]
  ): UrlMapping[] {
    const mapping = this.getMappings(
      reflection.parent?.isProject() ? "" : reflection.parent?.getAlias()
    ).find((mapping) => reflection.kindOf(mapping.kind))
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
      this.getUrl(reflection) +
      (this.mdxOutput ? ".mdx" : ".md")
    )
  }

  getUrl(reflection: Reflection, relative?: Reflection): string {
    let url = reflection.getAlias()

    if (
      reflection.parent &&
      reflection.parent !== relative &&
      !(reflection.parent instanceof ProjectReflection)
    ) {
      url =
        this.getUrl(reflection.parent, relative) + this.filenameSeparator + url
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

  getMappings(directoryPrefix?: string): Mapping[] {
    return [
      {
        kind: [ReflectionKind.Module],
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "modules"),
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Namespace],
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "modules"),
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Enum],
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "enums"),
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Class],
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "classes"),
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.Interface],
        isLeaf: false,
        directory: path.join(directoryPrefix || "", "interfaces"),
        template: this.getReflectionTemplate(),
      },
      {
        kind: [ReflectionKind.TypeAlias],
        isLeaf: true,
        directory: path.join(directoryPrefix || "", "types"),
        template: this.getReflectionMemberTemplate(),
      },
      ...(this.allReflectionsHaveOwnDocument
        ? [
            {
              kind: [ReflectionKind.Variable],
              isLeaf: true,
              directory: path.join(directoryPrefix || "", "variables"),
              template: this.getReflectionMemberTemplate(),
            },
            {
              kind: [ReflectionKind.Function],
              isLeaf: true,
              directory: path.join(directoryPrefix || "", "functions"),
              template: this.getReflectionMemberTemplate(),
            },
            {
              kind: [ReflectionKind.Method],
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
    this.location = page.url
    this.reflection =
      page.model instanceof DeclarationReflection ? page.model : undefined
    const options = this.getFormattingOptionsForLocation()
    if (this.reflection && this.reflection.groups) {
      // filter out unwanted groups
      const tempGroups: ReflectionGroup[] = []
      this.reflection.groups.forEach((reflectionGroup) => {
        if (
          !options.reflectionGroups ||
          !(reflectionGroup.title in options.reflectionGroups) ||
          options.reflectionGroups[reflectionGroup.title]
        ) {
          tempGroups.push(reflectionGroup)
        }
      })

      this.reflection.groups = tempGroups
    }
  }

  get globalsFile() {
    return `modules.${this.mdxOutput ? "mdx" : "md"}`
  }

  getFormattingOptionsForLocation(): FormattingOptionType {
    if (!this.location) {
      return {}
    }

    const applicableOptions: FormattingOptionType[] = []

    Object.keys(this.formattingOptions).forEach((key) => {
      if (key === "*" || new RegExp(key).test(this.location)) {
        applicableOptions.push(this.formattingOptions[key])
      }
    })

    return Object.assign({}, ...applicableOptions)
  }
}
