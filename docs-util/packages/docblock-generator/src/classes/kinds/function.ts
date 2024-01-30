import ts from "typescript"
import DefaultKindGenerator, { GetDocBlockOptions } from "./default.js"
import {
  DOCBLOCK_NEW_LINE,
  DOCBLOCK_END_LINE,
  DOCBLOCK_START,
  DOCBLOCK_DOUBLE_LINES,
} from "../../constants.js"
import getSymbol from "../../utils/get-symbol.js"

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
   * @param {FunctionNode} node - The node's function.
   * @param {ts.Symbol} symbol - The node's symbol. If provided, the method will try to retrieve the summary from the {@link KnowledgeBaseFactory}.
   * @returns {string} The function's summary comment.
   */
  getFunctionSummary(node: FunctionNode, symbol?: ts.Symbol): string {
    return symbol
      ? this.knowledgeBaseFactory.tryToGetFunctionSummary({
          symbol: symbol,
          kind: node.kind,
        }) || this.getNodeSummary({ node, symbol })
      : this.getNodeSummary({ node, symbol })
  }

  /**
   * Retrieve the function's example comment.
   *
   * @param {ts.Symbol} symbol - The function's symbol. If provided, the method will try to retrieve the example from the {@link KnowledgeBaseFactory}.
   * @returns {string} The function's example comment.
   */
  getFunctionExample(symbol?: ts.Symbol): string {
    const str = `${DOCBLOCK_DOUBLE_LINES}@example${DOCBLOCK_NEW_LINE}`
    return `${str}${
      symbol
        ? this.knowledgeBaseFactory.tryToGetFunctionExamples({
            symbol: symbol,
          }) || `{example-code}`
        : `{example-code}`
    }`
  }

  /**
   * Retrieve the full docblock of a function.
   *
   * @param {FunctionOrVariableNode | ts.Node} node - The function node. If a variable statement is provided, the underlying function is retrieved.
   * If a different node type is provided, the parent generator is used to retrieve the docblock comment.
   * @param {GetDocBlockOptions} options - Formatting options.
   * @returns {string} The function's docblock.
   */
  getDocBlock(
    node: FunctionOrVariableNode | ts.Node,
    options: GetDocBlockOptions = { addEnd: true }
  ): string {
    if (!this.isAllowed(node)) {
      return super.getDocBlock(node, options)
    }

    const actualNode = ts.isVariableStatement(node)
      ? this.extractFunctionNode(node)
      : node

    if (!actualNode) {
      return super.getDocBlock(node, options)
    }

    const nodeSymbol = getSymbol(node, this.checker)

    let str = DOCBLOCK_START

    // add summary
    str += `${
      options.summaryPrefix ||
      (this.isMethod(actualNode) ? `This method` : `This function`)
    } ${this.getFunctionSummary(actualNode, nodeSymbol)}${DOCBLOCK_NEW_LINE}`

    // add params
    actualNode.forEachChild((childNode) => {
      if (!ts.isParameter(childNode)) {
        return
      }
      const symbol = getSymbol(childNode, this.checker)
      if (!symbol) {
        return
      }

      const symbolType = this.checker.getTypeOfSymbolAtLocation(
        symbol,
        childNode
      )

      str += `${DOCBLOCK_NEW_LINE}@param {${this.checker.typeToString(
        symbolType
      )}} ${symbol.getName()} - ${this.getNodeSummary({
        node: childNode,
        symbol,
        nodeType: symbolType,
      })}`
    })

    // add returns
    const nodeType = this.getReturnType(actualNode)
    const returnTypeStr = this.checker.typeToString(nodeType)
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
          }) || possibleReturnSummary
        : possibleReturnSummary
    }`

    // add example
    str += this.getFunctionExample(nodeSymbol)

    // add common docs
    str += this.getCommonDocs(node, {
      prefixWithLineBreaks: true,
    })

    if (options.addEnd) {
      str += DOCBLOCK_END_LINE
    }

    return str
  }
}

export default FunctionKindGenerator
