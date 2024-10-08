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
import { RELATION_NAMES, getDmlProperties, isDmlEntity } from "utils"

type Relations = Map<
  string,
  {
    target: string
    left: MermaidRelationType
    right?: MermaidRelationType
    name: string
  }[]
>

type PluginOptions = Pick<
  TypeDocOptionMap,
  "generateModelsDiagram" | "diagramAddToFile"
>

const ALLOWED_RELATION_NAMES = RELATION_NAMES.filter(
  (name) => name !== "BelongsTo"
)

type MermaidRelationType =
  | "one-to-one"
  | "one-to-many"
  | "many-to-one"
  | "many-to-many"

export class MermaidDiagramDMLGenerator {
  private app: Application
  private options?: PluginOptions
  private mainFileReflection?: Reflection

  constructor(app: Application) {
    this.app = app
    this.app.options.addDeclaration({
      name: "generateDMLsDiagram",
      help: "Whether to generate a Mermaid.js class diagram for data models in the reference.",
      type: ParameterType.Boolean,
      defaultValue: false,
    })
    this.app.options.addDeclaration({
      name: "diagramDMLAddToFile",
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
      generateModelsDiagram: this.app.options.getValue("generateDMLsDiagram"),
      diagramAddToFile: this.app.options.getValue("diagramDMLAddToFile"),
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
      ? path.resolve("..", "..", "..", "..", options.diagramAddToFile)
      : options.diagramAddToFile

    const mainFileSource = context.program.getSourceFile(mainFilePath)
    if (!mainFileSource) {
      return
    }
    const mainFileSymbol = context.checker.getSymbolAtLocation(mainFileSource)
    if (!mainFileSymbol) {
      return
    }

    this.mainFileReflection =
      context.project.getReflectionFromSymbol(mainFileSymbol)
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
      ReflectionKind.Variable
    )) {
      if (
        !(reflection instanceof DeclarationReflection) ||
        !isDmlEntity(reflection)
      ) {
        return
      }

      const reflectionProperties = getDmlProperties(
        reflection.type as ReferenceType
      )

      // find relations of that reflection
      reflectionProperties.forEach((property) => {
        if (
          property.type?.type !== "reference" ||
          !ALLOWED_RELATION_NAMES.includes(property.type.name) ||
          property.type.typeArguments?.length !== 1 ||
          property.type.typeArguments[0].type !== "reference"
        ) {
          return
        }

        const targetReflection = property.type.typeArguments[0].reflection

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

        const relationType = this.getMermaidRelation(property.type.name)

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
          name: property.name,
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

  getMermaidRelation(relation: string): MermaidRelationType | undefined {
    switch (relation) {
      case "HasOne":
        return "one-to-one"
      case "HasMany":
        return "one-to-many"
      case "ManyToMany":
        return "many-to-many"
    }
  }

  getReverseRelationType(
    relationType: MermaidRelationType
  ): MermaidRelationType {
    return relationType.split("-").reverse().join("-") as MermaidRelationType
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
    relationType: MermaidRelationType,
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
