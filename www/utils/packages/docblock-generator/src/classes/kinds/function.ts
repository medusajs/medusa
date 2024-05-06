import ts from "typescript"
import DefaultKindGenerator, { GetDocBlockOptions } from "./default.js"
import {
  DOCBLOCK_NEW_LINE,
  DOCBLOCK_END_LINE,
  DOCBLOCK_START,
  DOCBLOCK_DOUBLE_LINES,
} from "../../constants.js"
import getSymbol from "../../utils/get-symbol.js"
import AiGenerator from "../helpers/ai-generator.js"
import path from "path"

export type FunctionNode =
  | ts.MethodDeclaration
  | ts.MethodSignature
  | ts.FunctionDeclaration
  | ts.ArrowFunction

export type VariableNode = ts.VariableDeclaration | ts.VariableStatement

export type FunctionOrVariableNode = FunctionNode | ts.VariableStatement

/**
 * Docblock generator for functions.
 */
// eslint-disable-next-line max-len
class FunctionKindGenerator extends DefaultKindGenerator<FunctionOrVariableNode> {
  protected methodKinds: ts.SyntaxKind[] = [
    ts.SyntaxKind.MethodDeclaration,
    ts.SyntaxKind.MethodSignature,
  ]
  protected functionKinds: ts.SyntaxKind[] = [ts.SyntaxKind.FunctionDeclaration]
  protected allowedKinds: ts.SyntaxKind[] = [
    ...this.methodKinds,
    ...this.functionKinds,
  ]
  public name = "function"
  static EXAMPLE_PLACEHOLDER = `{example-code}`
  protected aiParameterExceptions = ["sharedContext"]

  /**
   * Checks whether a node is considered a function node. A node is considered a function node if:
   *
   * 1. It is a method declaration (typically in classes), a method signature (typically in interfaces), or a function declaration.
   * 2. An arrow function. However, for better docblock placement and formatting, we detect the variable statement surrounding the arrow function
   * rather than the arrow function itself.
   *
   * @param {ts.Node} node - The node to check.
   * @returns {boolean} Whether the node is a function node and can be handled by this generator.
   */
  isAllowed(node: ts.Node): node is FunctionOrVariableNode {
    if (!super.isAllowed(node)) {
      return ts.isVariableStatement(node) && this.isFunctionVariable(node)
    }

    return true
  }

  /**
   * Checks whether a node is a variable statement/declaration with underlying node function
   * using the {@link extractFunctionNode} method.
   *
   * @param {ts.Node} node - The node to check.
   * @returns {boolean} Whether the node is a variable statement/declaration with underlying node function.
   */
  isFunctionVariable(node: ts.Node): node is VariableNode {
    if (ts.isVariableStatement(node)) {
      return node.declarationList.declarations.some((declaration) => {
        return this.isFunctionVariable(declaration)
      })
    } else if (ts.isVariableDeclaration(node)) {
      return this.extractFunctionNode(node) !== undefined
    }

    return false
  }

  /**
   * Retrieves the underlying function/method/arrow function of a variable statement or declaration.
   *
   * @param {ts.Node} node - The variable statement/declaration to retrieve the function/method from.
   * @returns The function/method if found.
   */
  extractFunctionNode(node: VariableNode): FunctionNode | undefined {
    if (ts.isVariableStatement(node)) {
      const variableDeclaration = node.declarationList.declarations.find(
        (declaration) => ts.isVariableDeclaration(declaration)
      )

      return variableDeclaration
        ? this.extractFunctionNode(variableDeclaration)
        : undefined
    } else if (
      node.initializer &&
      (this.isAllowed(node.initializer) || ts.isArrowFunction(node.initializer))
    ) {
      return node.initializer
    }
  }

  /**
   * Check whether a node refers to a method.
   *
   * @param {FunctionNode} node - The node to check.
   * @returns {boolean} Whether the node is a method.
   */
  isMethod(
    node: FunctionNode
  ): node is ts.MethodDeclaration | ts.MethodSignature {
    return this.methodKinds.includes(node.kind)
  }

  /**
   * Checks whether a type, typically the type of a function's signature, has return data.
   *
   * @param {string} typeStr - The type's string representation.
   * @returns {boolean} Whether the type has return data.
   */
  hasReturnData(typeStr: string): boolean {
    return (
      typeStr !== "void" &&
      typeStr !== "never" &&
      typeStr !== "Promise<void>" &&
      typeStr !== "Promise<never>"
    )
  }

  /**
   * Retrieves the return type of a function.
   *
   * @param {FunctionNode} node - The function's node.
   * @returns {ts.Type} The function's return type.
   */
  getReturnType(node: FunctionNode): ts.Type {
    return node.type
      ? this.checker.getTypeFromTypeNode(node.type)
      : this.checker.getTypeAtLocation(node)
  }

  /**
   * Retrieves the summary comment of a function.
   *
   * @param {FunctionNode} node - The function's options.
   * @returns {string} The function's summary comment.
   */
  getFunctionSummary({
    node,
    symbol,
    parentSymbol,
    returnType,
  }: {
    /**
     * The node's function.
     */
    node: FunctionNode
    /**
     * The node's symbol. If provided, the method will try to retrieve the summary from the {@link KnowledgeBaseFactory}.
     */
    symbol?: ts.Symbol
    /**
     * The node's parent symbol. This is useful to pass along the parent name to the knowledge base.
     */
    parentSymbol?: ts.Symbol
    /**
     * The node's return type. Useful for the {@link KnowledgeBaseFactory}
     */
    returnType?: string
  }): string {
    return symbol
      ? this.knowledgeBaseFactory.tryToGetFunctionSummary({
          symbol: symbol,
          kind: node.kind,
          templateOptions: {
            rawParentName: parentSymbol?.getName(),
            pluralIndicatorStr: returnType,
          },
        }) || this.getNodeSummary({ node, symbol })
      : this.getNodeSummary({ node, symbol })
  }

  /**
   * Retrieve the function's example comment.
   *
   * @param {ts.Symbol} symbol - The function's symbol. If provided, the method will try to retrieve the example from the {@link KnowledgeBaseFactory}.
   * @returns {string} The function's example comment.
   */
  getFunctionPlaceholderExample(): string {
    return this.formatExample(FunctionKindGenerator.EXAMPLE_PLACEHOLDER)
  }

  /**
   * Retrieves a function's example using the AiGenerator
   *
   * @param node - The function's node.
   * @param aiGenerator - An instance of the AiGenerator
   * @returns the example code
   */
  async getFunctionExampleAi(
    node: FunctionOrVariableNode,
    aiGenerator: AiGenerator,
    withTag = true
  ): Promise<string> {
    const actualNode = ts.isVariableStatement(node)
      ? this.extractFunctionNode(node)
      : node

    if (!actualNode) {
      return ""
    }

    const symbol = getSymbol(node, this.checker)

    const example = await aiGenerator.generateExample({
      className: this.isMethod(actualNode)
        ? getSymbol(node.parent, this.checker)?.name
        : undefined,
      functionName: symbol?.name || "",
      signature: node.getText(),
      fileName: path.basename(node.getSourceFile().fileName),
    })

    return this.formatExample(
      example.length
        ? `${example}${DOCBLOCK_NEW_LINE}`
        : FunctionKindGenerator.EXAMPLE_PLACEHOLDER,
      withTag
    )
  }

  formatExample(example: string, withTag = true): string {
    return `${
      withTag ? `${DOCBLOCK_DOUBLE_LINES}@example${DOCBLOCK_NEW_LINE}` : ""
    }${example}`
  }

  /**
   * Retrieve the full docblock of a function.
   *
   * @param {FunctionOrVariableNode | ts.Node} node - The function node. If a variable statement is provided, the underlying function is retrieved.
   * If a different node type is provided, the parent generator is used to retrieve the docblock comment.
   * @param {GetDocBlockOptions} options - Formatting options.
   * @returns {string} The function's docblock.
   */
  async getDocBlock(
    node: FunctionOrVariableNode | ts.Node,
    options: GetDocBlockOptions = { addEnd: true }
  ): Promise<string> {
    if (!this.isAllowed(node)) {
      return await super.getDocBlock(node, options)
    }

    const actualNode = ts.isVariableStatement(node)
      ? this.extractFunctionNode(node)
      : node

    if (!actualNode) {
      return await super.getDocBlock(node, options)
    }

    let existingComments = this.getNodeCommentsFromRange(node)

    if (existingComments?.includes(FunctionKindGenerator.EXAMPLE_PLACEHOLDER)) {
      // just replace the existing comment and return it
      if (options.aiGenerator) {
        existingComments = existingComments.replace(
          FunctionKindGenerator.EXAMPLE_PLACEHOLDER,
          await this.getFunctionExampleAi(
            actualNode,
            options.aiGenerator,
            false
          )
        )
      }

      return existingComments.replace("/*", "").replace("*/", "")
    }

    const nodeSymbol = getSymbol(node, this.checker)
    const nodeParentSymbol = getSymbol(node.parent, this.checker)
    const nodeType = this.getReturnType(actualNode)
    const returnTypeStr = this.checker.typeToString(nodeType)
    const normalizedTypeStr = returnTypeStr.startsWith("Promise<")
      ? returnTypeStr.replace(/^Promise</, "").replace(/>$/, "")
      : returnTypeStr

    let str = DOCBLOCK_START

    // add summary
    str += `${
      options.summaryPrefix ||
      (this.isMethod(actualNode) ? `This method` : `This function`)
    } ${this.getFunctionSummary({
      node: actualNode,
      symbol: nodeSymbol,
      parentSymbol: nodeParentSymbol,
      returnType: normalizedTypeStr,
    })}${DOCBLOCK_NEW_LINE}`

    actualNode.parameters.map((parameterNode) => {
      const symbol = getSymbol(parameterNode, this.checker)
      if (!symbol) {
        return
      }

      const symbolType = this.checker.getTypeOfSymbolAtLocation(
        symbol,
        parameterNode
      )

      const parameterName = symbol.getName()
      const parameterSummary = this.getNodeSummary({
        node: parameterNode,
        symbol,
        nodeType: symbolType,
        knowledgeBaseOptions: {
          templateOptions: {
            rawParentName: nodeParentSymbol?.getName(),
            pluralIndicatorStr: this.checker.typeToString(symbolType),
          },
        },
      })

      str += `${DOCBLOCK_NEW_LINE}@param {${this.checker.typeToString(
        symbolType
      )}} ${parameterName} - ${parameterSummary}`
    })

    // add returns
    const possibleReturnSummary = !this.hasReturnData(returnTypeStr)
      ? `Resolves when ${this.defaultSummary}`
      : this.getNodeSummary({
          node: actualNode,
          nodeType,
        })

    str += `${DOCBLOCK_NEW_LINE}@returns {${returnTypeStr}} ${
      nodeSymbol
        ? this.knowledgeBaseFactory.tryToGetFunctionReturns({
            symbol: nodeSymbol,
            kind: actualNode.kind,
            templateOptions: {
              rawParentName: nodeParentSymbol?.getName(),
              pluralIndicatorStr: normalizedTypeStr,
            },
          }) || possibleReturnSummary
        : possibleReturnSummary
    }`

    // add example
    if (!options.aiGenerator) {
      str += this.getFunctionPlaceholderExample()
    } else {
      str += await this.getFunctionExampleAi(actualNode, options.aiGenerator)
    }

    // add common docs
    str += this.getCommonDocs(node, {
      prefixWithLineBreaks: true,
    })

    if (options.addEnd) {
      str += DOCBLOCK_END_LINE
    }

    return str
  }

  /**
   * Allows documenting (updating) a node if it has the example placeholder.
   *
   * @param node - The node to document.
   * @returns Whether the node can be documented.
   */
  canDocumentNode(node: ts.Node): boolean {
    const comments = this.getNodeCommentsFromRange(node)

    return (
      !comments ||
      comments?.includes(FunctionKindGenerator.EXAMPLE_PLACEHOLDER) ||
      false
    )
  }
}

export default FunctionKindGenerator
