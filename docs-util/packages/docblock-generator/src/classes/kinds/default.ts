import ts from "typescript"
import {
  DOCBLOCK_START,
  DOCBLOCK_END_LINE,
  DOCBLOCK_DOUBLE_LINES,
} from "../../constants.js"
import getSymbol from "../../utils/get-symbol.js"
import KnowledgeBaseFactory from "../knowledge-base-factory.js"
import {
  getCustomNamespaceTag,
  shouldHaveNamespace,
} from "../../utils/medusa-react-utils.js"

export type GeneratorOptions = {
  checker: ts.TypeChecker
  kinds?: ts.SyntaxKind[]
}

export type GetDocBlockOptions = {
  addEnd?: boolean
  summaryPrefix?: string
}

type CommonDocsOptions = {
  addDefaultSummary?: boolean
  prefixWithLineBreaks?: boolean
}

class DefaultKindGenerator<T extends ts.Node = ts.Node> {
  static DEFAULT_ALLOWED_NODE_KINDS = [
    ts.SyntaxKind.SourceFile,
    ts.SyntaxKind.ClassDeclaration,
    ts.SyntaxKind.EnumDeclaration,
    ts.SyntaxKind.EnumMember,
    ts.SyntaxKind.ModuleDeclaration,
    ts.SyntaxKind.PropertyDeclaration,
    ts.SyntaxKind.InterfaceDeclaration,
    ts.SyntaxKind.TypeAliasDeclaration,
    ts.SyntaxKind.PropertySignature,
  ]
  protected allowedKinds: ts.SyntaxKind[]
  protected checker: ts.TypeChecker
  protected defaultSummary = "{summary}"
  protected knowledgeBaseFactory: KnowledgeBaseFactory

  constructor({ checker, kinds }: GeneratorOptions) {
    this.allowedKinds = kinds || DefaultKindGenerator.DEFAULT_ALLOWED_NODE_KINDS
    this.checker = checker
    this.knowledgeBaseFactory = new KnowledgeBaseFactory()
  }

  getAllowedKinds(): ts.SyntaxKind[] {
    return this.allowedKinds
  }

  isAllowed(node: ts.Node): node is T {
    return this.allowedKinds.includes(node.kind)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDocBlock(
    node: T | ts.Node,
    options: GetDocBlockOptions = { addEnd: true }
  ): string {
    let str = DOCBLOCK_START
    const summary = this.getNodeSummary(node)

    switch (node.kind) {
      case ts.SyntaxKind.EnumDeclaration:
        str += `@enum${DOCBLOCK_DOUBLE_LINES}${summary}`
        break
      case ts.SyntaxKind.TypeAliasDeclaration:
        str += `@interface${DOCBLOCK_DOUBLE_LINES}${summary}`
        break
      default:
        str += summary
    }

    str += this.getCommonDocs(node, {
      prefixWithLineBreaks: true,
    })

    return `${str}${options.addEnd ? DOCBLOCK_END_LINE : ""}`
  }

  getNodeSummary(node: T | ts.Node): string {
    const nodeType =
      "type" in node && node.type && ts.isTypeNode(node.type as ts.Node)
        ? this.checker.getTypeFromTypeNode(node.type as ts.TypeNode)
        : this.checker.getTypeAtLocation(node)

    return this.getSymbolTypeDocBlock(nodeType)
  }

  getSymbolTypeDocBlock(symbolType: ts.Type): string {
    if (symbolType.aliasSymbol) {
      return this.getSymbolDocBlock(symbolType.aliasSymbol)
    }

    const typeArguments = this.checker.getTypeArguments(
      symbolType as ts.TypeReference
    )

    if (typeArguments.length) {
      // take only the first type argument to account
      const typeArgumentDoc = this.getSymbolTypeDocBlock(typeArguments[0])

      if (typeArgumentDoc === this.defaultSummary) {
        const tryKnowledgeSummary = this.knowledgeBaseFactory.tryToGetSummary(
          this.checker.typeToString(symbolType)
        )

        if (tryKnowledgeSummary) {
          return tryKnowledgeSummary
        }
      }

      // do some formatting if the encapsulating type is an array
      if (!this.checker.isArrayType(symbolType)) {
        return typeArgumentDoc
      }

      return `The list of ${typeArgumentDoc
        .charAt(0)
        .toLowerCase()}${typeArgumentDoc.substring(1)}`
    }

    return symbolType.symbol
      ? this.getSymbolDocBlock(symbolType.symbol)
      : this.knowledgeBaseFactory.tryToGetSummary(
          this.checker.typeToString(symbolType)
        ) || this.defaultSummary
  }

  getSymbolDocBlock(symbol: ts.Symbol): string {
    const commentDisplayParts = symbol.getDocumentationComment(this.checker)
    if (!commentDisplayParts.length) {
      // try to get description from the first JSDoc comment
      const jsdocComments = symbol.getJsDocTags(this.checker)

      if (jsdocComments.length) {
        jsdocComments
          .find((tag) => (tag.text?.length || 0) > 0)
          ?.text!.forEach((tagText) => {
            commentDisplayParts.push(tagText)
          })
      }
    }

    if (!commentDisplayParts.length) {
      return (
        this.knowledgeBaseFactory.tryToGetSummary(
          this.checker.typeToString(this.checker.getTypeOfSymbol(symbol))
        ) ||
        this.knowledgeBaseFactory.tryToGetSummary(symbol.name) ||
        this.defaultSummary
      )
    }

    return ts.displayPartsToString(commentDisplayParts)
  }

  getDecoratorDocs(symbol: ts.Symbol): string {
    let str = ""

    symbol.declarations?.forEach((declaration) => {
      const modifiers =
        "modifiers" in declaration && declaration.modifiers
          ? (declaration.modifiers as ts.NodeArray<ts.Modifier>)
          : []

      modifiers.forEach((modifier) => {
        if (!ts.isDecorator(modifier)) {
          return
        }

        // check for decorator text
        ;(modifier as ts.Decorator).forEachChild((childNode) => {
          if (ts.isCallExpression(childNode)) {
            const childNodeExpression = (childNode as ts.CallExpression)
              .expression
            if (ts.isIdentifier(childNodeExpression)) {
              switch (childNodeExpression.escapedText) {
                case "FeatureFlagEntity":
                  // add the `@featureFlag` tag.
                  str += `${DOCBLOCK_DOUBLE_LINES}@featureFlag [flag_name]`
                  break
                case "BeforeInsert":
                case "BeforeLoad":
                case "AfterLoad":
                  // add `@apiIgnore` tag
                  str += `${DOCBLOCK_DOUBLE_LINES}@apiIgnore`
              }
            }
          }
        })
      })
    })

    return str
  }

  getCommonDocs(
    node: T | ts.Node,
    options: CommonDocsOptions = { addDefaultSummary: false }
  ): string {
    const tags = new Set<string>()

    const symbol = getSymbol(node, this.checker)

    if (!symbol) {
      return ""
    }

    if (ts.isSourceFile(node)) {
      // comments for source files must start with this tag
      tags.add(`@packageDocumentation`)
    }

    if (options.addDefaultSummary) {
      tags.add(this.defaultSummary)
    }

    // check for private or protected modifiers
    symbol.declarations?.some((declaration) => {
      if (!("modifiers" in declaration) || !declaration.modifiers) {
        return false
      }

      const hasPrivateOrProtected = (
        declaration.modifiers as ts.NodeArray<ts.Modifier>
      ).find((modifier) => {
        modifier.kind === ts.SyntaxKind.PrivateKeyword ||
          modifier.kind === ts.SyntaxKind.ProtectedKeyword
      })

      if (!hasPrivateOrProtected) {
        return false
      }

      tags.add("@ignore")
      return true
    })

    // if a symbol's name starts with `_` then we
    // should add the `@ignore` tag
    if (symbol.getName().startsWith("_")) {
      tags.add("@ignore")
    }

    // check if any docs can be added for the symbol's
    // decorators
    this.getDecoratorDocs(symbol)
      .split(`${DOCBLOCK_DOUBLE_LINES}`)
      .filter((docItem) => docItem.length > 0)
      .forEach((docItem) => tags.add(docItem))

    // add `@expandable` tag if the resource is
    if (ts.isPropertyDeclaration(node)) {
      const symbolType = this.checker.getTypeOfSymbol(symbol)
      if (
        symbolType.symbol?.declarations?.length &&
        ts.isClassDeclaration(symbolType.symbol?.declarations[0]) &&
        this.isEntity({
          heritageClauses: (
            symbolType.symbol?.declarations[0] as ts.ClassDeclaration
          ).heritageClauses,
          node: symbolType.symbol?.declarations[0],
        })
      ) {
        tags.add(`@expandable`)
      }
    }

    // check if custom namespace should be added
    if (shouldHaveNamespace(node)) {
      tags.add(getCustomNamespaceTag(node))
    }

    let str = ""
    tags.forEach((tag) => {
      if (str.length > 0) {
        str += `${DOCBLOCK_DOUBLE_LINES}`
      }
      str += `${tag}`
    })

    if (str.length && options.prefixWithLineBreaks) {
      str = `${DOCBLOCK_DOUBLE_LINES}${str}`
    }

    return str
  }

  isEntity({
    heritageClauses,
    node,
  }: {
    heritageClauses?: ts.NodeArray<ts.HeritageClause>
    node?: ts.Node
  }): boolean {
    return (
      heritageClauses?.some((heritageClause) => {
        return heritageClause.types.some((heritageClauseType) => {
          const symbolType = this.checker.getTypeAtLocation(
            heritageClauseType.expression
          )

          if (
            this.checker
              .typeToString(symbolType, node, undefined)
              .includes("BaseEntity")
          ) {
            return true
          }

          if (
            symbolType.symbol.valueDeclaration &&
            "heritageClauses" in symbolType.symbol.valueDeclaration
          ) {
            return this.isEntity({
              heritageClauses: symbolType.symbol.valueDeclaration
                .heritageClauses as ts.NodeArray<ts.HeritageClause>,
              node,
            })
          }

          return false
        })
      }) || false
    )
  }
}

export default DefaultKindGenerator
