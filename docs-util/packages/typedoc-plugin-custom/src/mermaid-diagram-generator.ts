import path from "path"
import {
  Application,
  Comment,
  Context,
  Converter,
  DeclarationReflection,
  ParameterType,
  ReferenceType,
  Reflection,
  ReflectionKind,
  TypeDocOptionMap,
} from "typedoc"
import ts from "typescript"

type RelationType =
  | "one-to-one"
  | "one-to-many"
  | "many-to-one"
  | "many-to-many"

type Relations = Map<
  string,
  {
    target: string
    left: RelationType
    right?: RelationType
    name: string
  }[]
>

type PluginOptions = Pick<
  TypeDocOptionMap,
  "generateModelsDiagram" | "diagramAddToFile"
>

export class MermaidDiagramGenerator {
  private app: Application
  private options?: PluginOptions
  private mainFileReflection?: Reflection

  constructor(app: Application) {
    this.app = app
    this.app.options.addDeclaration({
      name: "generateModelsDiagram",
      help: "Whether to generate a Mermaid.js class diagram for data models in the reference.",
      type: ParameterType.Boolean,
      defaultValue: false,
    })
    this.app.options.addDeclaration({
      name: "diagramAddToFile",
      help: "The file to add the mermaid diagram to. The diagram is added as a package comment.",
      type: ParameterType.String,
    })
    app.converter.on(
      Converter.EVENT_CREATE_DECLARATION,
      this.setMainFile.bind(this)
    )
    app.converter.on(
      Converter.EVENT_RESOLVE_BEGIN,
      this.findRelations.bind(this)
    )
  }

  getPluginOptions(): PluginOptions {
    if (this.options) {
      return this.options
    }

    this.options = {
      generateModelsDiagram: this.app.options.getValue("generateModelsDiagram"),
      diagramAddToFile: this.app.options.getValue("diagramAddToFile"),
    }

    return this.options
  }

  setMainFile(context: Context) {
    const options = this.getPluginOptions()
    if (
      this.mainFileReflection ||
      !options.generateModelsDiagram ||
      !options.diagramAddToFile
    ) {
      return
    }

    const mainFilePath = options.diagramAddToFile.startsWith("packages")
      ? path.resolve("..", "..", "..", options.diagramAddToFile)
      : options.diagramAddToFile

    const mainFileSource = context.program.getSourceFile(mainFilePath)
    if (!mainFileSource) {
      // console.error(
      //   `Couldn't fine the main source file ${options.diagramAddToFile}`
      // )
      return
    }
    const mainFileSymbol = context.checker.getSymbolAtLocation(mainFileSource)
    if (!mainFileSymbol) {
      // console.error(`Couldn't fine the main file's symbol`)
      return
    }

    this.mainFileReflection =
      context.project.getReflectionFromSymbol(mainFileSymbol)

    if (!this.mainFileReflection) {
      // console.error(`Couldn't fine the main file's reflection`)
    }
  }

  findRelations(context: Context) {
    const options = this.getPluginOptions()
    if (
      !this.mainFileReflection ||
      !options.generateModelsDiagram ||
      !options.diagramAddToFile
    ) {
      return
    }

    const relations: Relations = new Map()

    for (const reflection of context.project.getReflectionsByKind(
      ReflectionKind.Class
    )) {
      if (!(reflection instanceof DeclarationReflection)) {
        return
      }

      // find relations of that reflection
      reflection.children?.forEach((child) => {
        let referenceType: ReferenceType | undefined
        // check that the child field references another reflection
        if (child.type?.type === "reference") {
          referenceType = child.type
        } else if (child.type?.type === "union") {
          referenceType = child.type.types.find(
            (unionType) => unionType.type === "reference"
          ) as ReferenceType
        }

        if (!referenceType) {
          return
        }

        // If type is Collection from mikro-orm, get the type argument's reflection
        // otherwise, use the reflection as-is
        const targetReflection =
          this.isMikroOrmCollection(referenceType) &&
          referenceType.typeArguments?.length &&
          referenceType.typeArguments[0].type === "reference" &&
          referenceType.typeArguments[0].reflection
            ? referenceType.typeArguments[0].reflection
            : referenceType.reflection

        if (!targetReflection) {
          return
        }

        // if entry already exists in relation, don't add anything
        const exists =
          relations
            .get(reflection.name)
            ?.some((relation) => relation.target === targetReflection.name) ||
          relations
            .get(targetReflection.name)
            ?.some((relation) => relation.target === reflection.name)

        if (exists) {
          return
        }

        // figure out relation type from decorators
        const relationType = this.getRelationFromDecorators(
          this.getReflectionDecorators(context, child)
        )
        if (!relationType) {
          return
        }

        if (!relations.has(reflection.name)) {
          relations.set(reflection.name, [])
        }
        relations.get(reflection.name)?.push({
          target: targetReflection.name,
          left: relationType,
          right: this.getReverseRelationType(relationType),
          name: child.name,
        })
      })
    }

    if (!relations.size) {
      return
    }

    this.mainFileReflection.comment = new Comment([
      {
        text: "## Relations Overview\n\n",
        kind: "text",
      },
      {
        text: this.buildMermaidDiagram(relations),
        kind: "code",
      },
    ])
  }

  isMikroOrmCollection(referenceType: ReferenceType) {
    return (
      referenceType.name === "Collection" &&
      referenceType.package?.includes("@mikro-orm")
    )
  }

  getReflectionDecorators(context: Context, reflection: Reflection): string[] {
    const symbol = context.project.getSymbolFromReflection(reflection)
    const decorators: string[] = []

    symbol?.declarations?.forEach((declaration) => {
      const modifiers =
        "modifiers" in declaration && declaration.modifiers
          ? (declaration.modifiers as ts.NodeArray<ts.Modifier>)
          : []

      modifiers.forEach((modifier) => {
        if (!ts.isDecorator(modifier)) {
          return
        }

        ;(modifier as ts.Decorator).forEachChild((childNode) => {
          if (!ts.isCallExpression(childNode)) {
            return
          }

          const childNodeExpression = (childNode as ts.CallExpression)
            .expression
          if (!ts.isIdentifier(childNodeExpression)) {
            return
          }

          decorators.push(childNodeExpression.escapedText.toString())
        })
      })
    })

    return decorators
  }

  getRelationFromDecorators(decorators: string[]): RelationType | undefined {
    switch (true) {
      case decorators.includes("OneToOne"):
        return "one-to-one"
      case decorators.includes("OneToMany"):
        return "one-to-many"
      case decorators.includes("ManyToOne"):
        return "many-to-one"
      case decorators.includes("ManyToMany"):
        return "many-to-many"
    }
  }

  getReverseRelationType(relationType: RelationType): RelationType {
    return relationType.split("-").reverse().join("-") as RelationType
  }

  buildMermaidDiagram(relations: Relations): string {
    const linePrefix = `\t`
    const lineSuffix = `\n`
    let diagram = `erDiagram${lineSuffix}`
    relations.forEach((itemRelations, itemName) => {
      itemRelations.forEach((itemRelation) => {
        diagram += `${linePrefix}${itemName} ${this.getRelationTypeSymbol(
          itemRelation.left,
          "left"
        )}--${this.getRelationTypeSymbol(itemRelation.right!, "right")} ${
          itemRelation.target
        } : ${itemRelation.name}${lineSuffix}`
      })
    })

    return "```mermaid\n" + diagram + "\n```"
  }

  getRelationTypeSymbol(
    relationType: RelationType,
    direction: "left" | "right"
  ): string {
    switch (relationType) {
      case "one-to-one":
        return "||"
      case "one-to-many":
        return direction === "left" ? "||" : "|{"
      case "many-to-many":
        return direction === "left" ? "}|" : "|{"
      case "many-to-one":
        return direction === "left" ? "}|" : "||"
    }
  }
}
