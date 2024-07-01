import {
  Application,
  Comment,
  CommentDisplayPart,
  CommentTag,
  Context,
  Converter,
  DeclarationReflection,
  ParameterType,
  Reflection,
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
      Converter.EVENT_RESOLVE,
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
      .find(
        (m) =>
          m.name === formattedName &&
          (!this.currentNamespaceHeirarchy.length ||
            m.parent?.id ===
              this.currentNamespaceHeirarchy[
                this.currentNamespaceHeirarchy.length - 1
              ].id)
      ) as DeclarationReflection
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
    summary,
  }: {
    tag: CommentTag
    reflection?: DeclarationReflection
    summary?: CommentDisplayPart[]
  }) {
    const categoryHeirarchy = tag.content[0].text.split(".")
    categoryHeirarchy.forEach((cat, index) => {
      // check whether a namespace exists with the category name.
      let namespace = this.loadNamespace(cat)

      if (!namespace) {
        // add a namespace for this category
        namespace = this.createNamespace(cat) || namespace

        namespace.comment = new Comment()
        if (this.currentNamespaceHeirarchy.length) {
          namespace.comment.modifierTags.add("@namespaceMember")
        }
        if (summary && index === categoryHeirarchy.length - 1) {
          namespace.comment.summary = summary
        }
      }
      this.currentContext =
        this.currentContext?.withScope(namespace) || this.currentContext

      this.currentNamespaceHeirarchy.push(namespace)
    })
  }

  /**
   * create categories in the last namespace if the
   * reflection has a category
   */
  attachCategories(
    reflection: DeclarationReflection,
    comments: Comment | undefined
  ) {
    if (!this.currentNamespaceHeirarchy.length) {
      return
    }

    const parentNamespace =
      this.currentNamespaceHeirarchy[this.currentNamespaceHeirarchy.length - 1]
    comments?.blockTags
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

  handleCreateDeclarationEvent(context: Context, reflection: Reflection) {
    if (!(reflection instanceof DeclarationReflection)) {
      return
    }
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
    const comments = this.getReflectionComments(reflection)
    comments?.blockTags
      .filter((tag) => tag.tag === "@customNamespace")
      .forEach((tag) => {
        this.generateNamespaceFromTag({
          tag,
        })
        if (
          reflection.parent instanceof DeclarationReflection ||
          reflection.parent?.isProject()
        ) {
          reflection.parent.children = reflection.parent.children?.filter(
            (child) => child.id !== reflection.id
          )
        }
        this.currentContext?.addChild(reflection)
      })

    comments?.removeTags("@customNamespace")
    this.attachCategories(reflection, comments)
    this.currentContext = undefined
    this.currentNamespaceHeirarchy = []
  }

  /**
   * Scan all source files for `@customNamespace` tag to generate namespaces
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
        .filter((tag) => tag.tag === "@customNamespace")
        .forEach((tag) => {
          this.generateNamespaceFromTag({ tag, summary: comments.summary })
          if (this.currentNamespaceHeirarchy.length) {
            // add comments of the file to the last created namespace
            this.currentNamespaceHeirarchy[
              this.currentNamespaceHeirarchy.length - 1
            ].comment = comments

            this.currentNamespaceHeirarchy[
              this.currentNamespaceHeirarchy.length - 1
            ].comment!.blockTags = this.currentNamespaceHeirarchy[
              this.currentNamespaceHeirarchy.length - 1
            ].comment!.blockTags.filter((tag) => tag.tag !== "@customNamespace")
          }
          // reset values
          this.currentNamespaceHeirarchy = []
          this.currentContext = context
        })
    })

    this.scannedComments = true
  }

  getReflectionComments(
    reflection: DeclarationReflection
  ): Comment | undefined {
    if (reflection.comment) {
      return reflection.comment
    }

    // try to retrieve comment from signature
    if (!reflection.signatures?.length) {
      return
    }
    return reflection.signatures.find((signature) => signature.comment)?.comment
  }

  // for debugging
  printCurrentHeirarchy() {
    return this.currentNamespaceHeirarchy.map((heirarchy) => heirarchy.name)
  }
}
