import ts from "typescript"
import {
  DOCBLOCK_START,
  DOCBLOCK_END_LINE,
  DOCBLOCK_DOUBLE_LINES,
  DOCBLOCK_NEW_LINE,
  SUMMARY_PLACEHOLDER,
} from "../../constants.js"
import getSymbol from "../../utils/get-symbol.js"
import KnowledgeBaseFactory, {
  RetrieveOptions,
} from "../helpers/knowledge-base-factory.js"
import {
  getCustomNamespaceTag,
  shouldHaveCustomNamespace,
} from "../../utils/medusa-react-utils.js"
import GeneratorEventManager from "../helpers/generator-event-manager.js"
import { CommonCliOptions } from "../../types/index.js"
import AiGenerator from "../helpers/ai-generator.js"
import { camelToWords, capitalize } from "utils"
import { normalizeName } from "../../utils/str-formatting.js"

export type GeneratorOptions = {
  checker: ts.TypeChecker
  kinds?: ts.SyntaxKind[]
  generatorEventManager: GeneratorEventManager
  additionalOptions: Pick<CommonCliOptions, "generateExamples">
}

export type GetDocBlockOptions = {
  addEnd?: boolean
  summaryPrefix?: string
  aiGenerator?: AiGenerator
}

type CommonDocsOptions = {
  addDefaultSummary?: boolean
  prefixWithLineBreaks?: boolean
}

/**
 * Class used to generate docblocks for basic kinds. It can be
 * extended for kinds requiring more elaborate TSDocs.
 */
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
  public name = "default"
  protected allowedKinds: ts.SyntaxKind[]
  protected checker: ts.TypeChecker
  protected knowledgeBaseFactory: KnowledgeBaseFactory
  protected generatorEventManager: GeneratorEventManager
  protected options: Pick<CommonCliOptions, "generateExamples">

  constructor({
    checker,
    kinds,
    generatorEventManager,
    additionalOptions,
  }: GeneratorOptions) {
    this.allowedKinds = kinds || DefaultKindGenerator.DEFAULT_ALLOWED_NODE_KINDS
    this.checker = checker
    this.knowledgeBaseFactory = new KnowledgeBaseFactory()
    this.generatorEventManager = generatorEventManager
    this.options = additionalOptions
  }

  /**
   * @returns the kinds that are handled by this generator.
   */
  getAllowedKinds(): ts.SyntaxKind[] {
    return this.allowedKinds
  }

  /**
   * Check whether this generator can be used for a node based on the node's kind.
   *
   * @param {ts.Node} node - The node to check for.
   * @returns {boolean} Whether this generator can be used with the specified node.
   */
  isAllowed(node: ts.Node): node is T {
    return this.allowedKinds.includes(node.kind)
  }

  /**
   * Retrieve the doc block for the passed node.
   *
   * @param {T | ts.Node} node - The node to retrieve the docblock for.
   * @param {GetDocBlockOptions} options - Options useful for children classes of this class to specify the formatting of the docblock.
   * @returns {string} The node's docblock.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getDocBlock(
    node: T | ts.Node,
    options: GetDocBlockOptions = { addEnd: true }
  ): Promise<string> {
    let str = DOCBLOCK_START
    const summary = this.getNodeSummary({ node })

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

  /**
   * Retrieves the summary comment of a node. It gives precedense to the node's symbol if it's provided/retrieved and if it's available using the {@link getSymbolDocBlock}.
   * Otherwise, it retrieves the comments of the type using the {@link getTypeDocBlock}
   * @returns {string} The summary comment.
   */
  getNodeSummary({
    node,
    symbol,
    nodeType,
    knowledgeBaseOptions: overrideOptions,
  }: {
    /**
     * The node to retrieve the summary comment for.
     */
    node: T | ts.Node
    /**
     * Optionally provide the node's symbol. If not provided, the
     * method will try to retrieve it.
     */
    symbol?: ts.Symbol
    /**
     * Optionally provide the node's type. If not provided, the method
     * will try to retrieve it.
     */
    nodeType?: ts.Type
    /**
     * Override any of the default knowledge base options
     * inferred using the {@link getKnowledgeBaseOptions} method
     */
    knowledgeBaseOptions?: Partial<RetrieveOptions>
  }): string {
    const syntheticComments = ts.getSyntheticLeadingComments(node)
    if (syntheticComments?.length) {
      return syntheticComments.map((comment) => comment.text).join(" ")
    }
    const knowledgeBaseOptions = {
      ...this.getKnowledgeBaseOptions(node),
      ...overrideOptions,
    }
    if (!nodeType) {
      nodeType =
        "type" in node && node.type && ts.isTypeNode(node.type as ts.Node)
          ? this.checker.getTypeFromTypeNode(node.type as ts.TypeNode)
          : symbol
            ? this.checker.getTypeOfSymbolAtLocation(symbol, node)
            : this.checker.getTypeAtLocation(node)
    }

    if (!symbol) {
      symbol = getSymbol(node, this.checker)
    }

    let summary = ""

    if (symbol) {
      summary = this.getSymbolDocBlock(symbol, knowledgeBaseOptions)
    }

    if (!summary.length) {
      summary = this.getTypeDocBlock(nodeType, knowledgeBaseOptions)
    }

    return summary.length > 0 ? summary : SUMMARY_PLACEHOLDER
  }

  /**
   * Retrieves the summary comment of a type. It tries to retrieve from the alias symbol, type arguments, or {@link KnowledgeBaseFactory}.
   * If no summary comments are found, the {@link defaultSummary} is used.
   *
   * @param {ts.Type} nodeType - The type of a node.
   * @returns {string} The summary comment.
   */
  protected getTypeDocBlock(
    nodeType: ts.Type,
    knowledgeBaseOptions?: Partial<RetrieveOptions>
  ): string {
    if (nodeType.aliasSymbol || nodeType.symbol) {
      const symbolDoc = this.getSymbolDocBlock(
        nodeType.aliasSymbol || nodeType.symbol
      )

      if (symbolDoc.length) {
        return symbolDoc
      }
    }

    const typeArguments = this.checker.getTypeArguments(
      nodeType as ts.TypeReference
    )

    if (typeArguments.length) {
      // take only the first type argument to account
      const typeArgumentDoc = this.getTypeDocBlock(typeArguments[0])

      if (!typeArgumentDoc.length) {
        const tryKnowledgeSummary = this.knowledgeBaseFactory.tryToGetSummary({
          ...knowledgeBaseOptions,
          str: this.checker.typeToString(nodeType),
        })

        if (tryKnowledgeSummary?.length) {
          return tryKnowledgeSummary
        }
      }

      if (!this.checker.isArrayType(nodeType)) {
        return typeArgumentDoc
      }

      // do some formatting if the encapsulating type is an array
      return `The list of ${capitalize(typeArgumentDoc) || SUMMARY_PLACEHOLDER}`
    }

    return (
      this.knowledgeBaseFactory.tryToGetSummary({
        ...knowledgeBaseOptions,
        str: this.checker.typeToString(nodeType),
      }) || ""
    )
  }

  /**
   * Retrieves the docblock of a symbol. It tries to retrieve it using the symbol's `getDocumentationComment` and `getJsDocTags`
   * methods. If both methods don't return any comments, it tries to get the comments from the {@link KnowledgeBaseFactory}.
   *
   * @param {ts.Symbol} symbol - The symbol to retrieve its docblock.
   * @returns {string} The symbol's docblock.
   */
  protected getSymbolDocBlock(
    symbol: ts.Symbol,
    knowledgeBaseOptions?: Partial<RetrieveOptions>
  ): string {
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
        this.knowledgeBaseFactory.tryToGetSummary({
          ...knowledgeBaseOptions,
          str: this.checker.typeToString(this.checker.getTypeOfSymbol(symbol)),
        }) ||
        this.knowledgeBaseFactory.tryToGetSummary({
          ...knowledgeBaseOptions,
          str: symbol.name,
        }) ||
        ""
      )
    }

    return ts
      .displayPartsToString(commentDisplayParts)
      .replaceAll("\n", DOCBLOCK_NEW_LINE)
  }

  /**
   * Retrieves docblocks based on decorators used on a symbol.
   *
   * @param {ts.Symbol} symbol - The symbol to retrieve its decorators docblock.
   * @returns {string} The symbol's decorators docblock.
   */
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

  /**
   * Retrieve docblocks that are common to all nodes, despite their kind.
   *
   * @param {T | ts.Node} node - The node to retrieve its common doc blocks.
   * @param {CommonDocsOptions} options - Formatting options.
   * @returns {string} The common docblocks.
   */
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
      tags.add(SUMMARY_PLACEHOLDER)
    }

    // check for private or protected modifiers
    // and if found, add the `@ignore` tag.
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
    if (shouldHaveCustomNamespace(node)) {
      tags.add(getCustomNamespaceTag(node))
    }

    // check for default value
    const defaultValue = this.getDefaultValue(node)
    if (defaultValue?.length) {
      tags.add(`@defaultValue ${defaultValue}`)
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

  /**
   * Check if a node is a Medusa entity.
   * @returns {boolean} Whether the node is a Medusa entity.
   */
  isEntity({
    /**
     * The inherit/extend keywords of the node.
     */
    heritageClauses,
    /**
     * Optionally provide the node to accurately retrieve its type name.
     */
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
            symbolType.symbol?.valueDeclaration &&
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

  /**
   * Get knowledge base options for a specified node.
   *
   * @param node - The node to retrieve its knowledge base options.
   * @returns The knowledge base options.
   */
  getKnowledgeBaseOptions(node: ts.Node): Partial<RetrieveOptions> {
    const rawParentName =
      "name" in node.parent &&
      node.parent.name &&
      ts.isIdentifier(node.parent.name as ts.Node)
        ? (node.parent.name as ts.Identifier).getText()
        : undefined
    return {
      kind: node.kind,
      templateOptions: {
        rawParentName,
        parentName: rawParentName
          ? camelToWords(normalizeName(rawParentName))
          : undefined,
      },
    }
  }

  /**
   * Get the default value of a node.
   *
   * @param node - The node to get its default value.
   * @returns The default value, if any.
   */
  getDefaultValue(node: ts.Node): string | undefined {
    if (
      "initializer" in node &&
      node.initializer &&
      ts.isExpression(node.initializer as ts.Node)
    ) {
      const initializer = node.initializer as ts.Expression

      // retrieve default value only if the value is numeric, string, or boolean
      const defaultValue =
        ts.isNumericLiteral(initializer) || ts.isStringLiteral(initializer)
          ? initializer.getText()
          : initializer.kind === ts.SyntaxKind.FalseKeyword
            ? "false"
            : initializer.kind === ts.SyntaxKind.TrueKeyword
              ? "true"
              : ""

      if (defaultValue.length) {
        return defaultValue
      }
    }
  }

  /**
   * Checks whether a node can be documented.
   *
   * @param {ts.Node} node - The node to check for.
   * @returns {boolean} Whether the node can be documented.
   */
  canDocumentNode(node: ts.Node): boolean {
    // check if node already has docblock
    return !this.nodeHasComments(node)
  }

  /**
   * Get the comments range of a node.
   * @param node - The node to get its comment range.
   * @returns The comment range of the node if available.
   */
  getNodeCommentsRange(node: ts.Node): ts.CommentRange[] | undefined {
    return ts.getLeadingCommentRanges(
      node.getSourceFile().getFullText(),
      node.getFullStart()
    )
  }

  /**
   * Get a node's comment from its range.
   *
   * @param node - The node to get its comment range.
   * @returns The comment if available.
   */
  getNodeCommentsFromRange(node: ts.Node): string | undefined {
    const commentRange = this.getNodeCommentsRange(node)

    if (!commentRange?.length) {
      return
    }

    return node
      .getSourceFile()
      .getFullText()
      .slice(commentRange[0].pos, commentRange[0].end)
  }

  /**
   * Check whether a node has comments.
   *
   * @param node - The node to check.
   * @returns Whether the node has comments.
   */
  nodeHasComments(node: ts.Node): boolean {
    return this.getNodeCommentsFromRange(node) !== undefined
  }
}

export default DefaultKindGenerator
