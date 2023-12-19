import {
  Application,
  Comment,
  CommentDisplayPart,
  CommentTag,
  Context,
  Converter,
  DeclarationReflection,
  ParameterType,
  ReflectionCategory,
  ReflectionKind,
} from "typedoc"

type PluginOptions = {
  generateNamespaces: boolean
  parentNamespace: string
  namePrefix: string
}

export class GenerateNamespacePlugin {
  private options?: PluginOptions
  private app: Application
  private parentNamespace?: DeclarationReflection
  private currentNamespaceHeirarchy: DeclarationReflection[]
  private currentContext?: Context
  private scannedComments = false

  constructor(app: Application) {
    this.app = app
    this.currentNamespaceHeirarchy = []
    this.declareOptions()

    this.app.converter.on(
      Converter.EVENT_CREATE_DECLARATION,
      this.handleCreateDeclarationEvent.bind(this)
    )
    this.app.converter.on(
      Converter.EVENT_CREATE_DECLARATION,
      this.scanComments.bind(this)
    )
  }

  declareOptions() {
    this.app.options.addDeclaration({
      name: "generateNamespaces",
      type: ParameterType.Boolean,
      defaultValue: false,
      help: "Whether to enable conversion of categories to namespaces.",
    })
    this.app.options.addDeclaration({
      name: "parentNamespace",
      type: ParameterType.String,
      defaultValue: "",
      help: "Optionally specify a parent namespace to place all generated namespaces in.",
    })
    this.app.options.addDeclaration({
      name: "namePrefix",
      type: ParameterType.String,
      defaultValue: "",
      help: "Optionally specify a name prefix for all namespaces.",
    })
  }

  readOptions() {
    if (this.options) {
      return
    }

    this.options = {
      generateNamespaces: this.app.options.getValue("generateNamespaces"),
      parentNamespace: this.app.options.getValue("parentNamespace"),
      namePrefix: this.app.options.getValue("namePrefix"),
    }
  }

  loadNamespace(namespaceName: string): DeclarationReflection {
    const formattedName = this.formatName(namespaceName)
    return this.currentContext?.project
      .getReflectionsByKind(ReflectionKind.Namespace)
      .find((m) => m.name === formattedName) as DeclarationReflection
  }

  createNamespace(namespaceName: string): DeclarationReflection | undefined {
    if (!this.currentContext) {
      return
    }
    const formattedName = this.formatName(namespaceName)
    const namespace = this.currentContext?.createDeclarationReflection(
      ReflectionKind.Namespace,
      void 0,
      void 0,
      formattedName
    )

    namespace.children = []

    return namespace
  }

  formatName(namespaceName: string): string {
    return `${this.options?.namePrefix}${namespaceName}`
  }

  generateNamespaceFromTag({
    tag,
    reflection,
    summary,
  }: {
    tag: CommentTag
    reflection?: DeclarationReflection
    summary?: CommentDisplayPart[]
  }) {
    const categoryHeirarchy = tag.content[0].text.split(".")
    categoryHeirarchy.forEach((cat) => {
      // check whether a namespace exists with the category name.
      let namespace = this.loadNamespace(cat)

      if (!namespace) {
        // add a namespace for this category
        namespace = this.createNamespace(cat) || namespace

        if (this.currentNamespaceHeirarchy.length) {
          namespace.comment = new Comment()
          namespace.comment.modifierTags.add("@namespaceMember")
          if (summary) {
            namespace.comment.summary = summary
          }
        }
      }
      this.currentContext =
        this.currentContext?.withScope(namespace) || this.currentContext

      this.currentNamespaceHeirarchy.push(namespace)
      if (reflection) {
        namespace.children?.push(reflection)
      }
    })
  }

  /**
   * create categories in the last namespace if the
   * reflection has a category
   */
  attachCategories(reflection: DeclarationReflection) {
    if (!this.currentNamespaceHeirarchy.length) {
      return
    }

    const parentNamespace =
      this.currentNamespaceHeirarchy[this.currentNamespaceHeirarchy.length - 1]
    reflection.comment?.blockTags
      .filter((tag) => tag.tag === "@category")
      .forEach((tag) => {
        const categoryName = tag.content[0].text
        if (!parentNamespace.categories) {
          parentNamespace.categories = []
        }
        let category = parentNamespace.categories.find(
          (category) => category.title === categoryName
        )
        if (!category) {
          category = new ReflectionCategory(categoryName)
          parentNamespace.categories.push(category)
        }
        category.children.push(reflection)
      })
  }

  handleCreateDeclarationEvent(
    context: Context,
    reflection: DeclarationReflection
  ) {
    this.readOptions()
    if (this.options?.parentNamespace && !this.parentNamespace) {
      this.parentNamespace =
        this.loadNamespace(this.options.parentNamespace) ||
        this.createNamespace(this.options.parentNamespace)
    }
    this.currentNamespaceHeirarchy = []
    if (this.parentNamespace) {
      this.currentNamespaceHeirarchy.push(this.parentNamespace)
    }
    this.currentContext = context
    reflection.comment?.blockTags
      .filter((tag) => tag.tag === "@namespaceAsCategory")
      .forEach((tag) =>
        this.generateNamespaceFromTag({
          tag,
          reflection,
        })
      )

    reflection.comment?.removeTags("@namespaceAsCategory")
    this.attachCategories(reflection)
    this.currentContext = undefined
  }

  /**
   * Scan all source files for `@namespaceAsCategory` tag to generate namespaces
   * This is mainly helpful to pull summaries of the namespaces.
   */
  scanComments(context: Context) {
    if (this.scannedComments) {
      return
    }
    this.currentContext = context
    const fileNames = context.program.getRootFileNames()

    fileNames.forEach((fileName) => {
      const sourceFile = context.program.getSourceFile(fileName)
      if (!sourceFile) {
        return
      }

      const comments = context.getFileComment(sourceFile)
      comments?.blockTags
        .filter((tag) => tag.tag === "@namespaceAsCategory")
        .forEach((tag) =>
          this.generateNamespaceFromTag({ tag, summary: comments.summary })
        )
    })

    this.currentContext = undefined
    this.scannedComments = true
  }

  // for debugging
  printCurrentHeirarchy() {
    return this.currentNamespaceHeirarchy.map((heirarchy) => heirarchy.name)
  }
}
