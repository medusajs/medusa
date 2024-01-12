import ts from "typescript"
import DefaultKind from "./default.js"
import { DOCBLOCK_NEW_LINE, DOCBLOCK_END_LINE } from "../../constants.js"
import getSymbol from "../../utils/get-symbol.js"
import { GetDocBlockOptions } from "../../interface/KindDocGenerator.js"

export type FunctionNode =
  | ts.MethodDeclaration
  | ts.MethodSignature
  | ts.FunctionDeclaration
  | ts.ArrowFunction

type VariableNode = ts.VariableDeclaration | ts.VariableStatement

export type FunctionOrVariableNode = FunctionNode | ts.VariableStatement

class FunctionKind extends DefaultKind<FunctionOrVariableNode> {
  protected methodKinds: ts.SyntaxKind[] = [
    ts.SyntaxKind.MethodDeclaration,
    ts.SyntaxKind.MethodSignature,
  ]
  protected functionKinds: ts.SyntaxKind[] = [ts.SyntaxKind.FunctionDeclaration]
  protected allowedKinds: ts.SyntaxKind[] = [
    ...this.methodKinds,
    ...this.functionKinds,
  ]

  isAllowed(node: ts.Node): node is FunctionOrVariableNode {
    if (!super.isAllowed(node)) {
      return ts.isVariableStatement(node) && this.isFunctionVariable(node)
    }

    return true
  }

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

  isMethod(
    node: FunctionNode
  ): node is ts.MethodDeclaration | ts.MethodSignature {
    return this.methodKinds.includes(node.kind)
  }

  hasReturnData(typeStr: string): boolean {
    return (
      typeStr !== "void" &&
      typeStr !== "never" &&
      typeStr !== "Promise<void>" &&
      typeStr !== "Promise<never>"
    )
  }

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

    let str = this.getDocBlockStart(actualNode)

    // add summary
    str += `${
      options.summaryPrefix ||
      (this.isMethod(actualNode) ? `This method` : `This function`)
    } {summary}${DOCBLOCK_NEW_LINE}`

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
      )}} ${symbol.getName()} - ${this.getSymbolTypeDocBlock(symbolType)}`
    })

    // add returns
    const nodeType = actualNode.type
      ? this.checker.getTypeFromTypeNode(actualNode.type)
      : this.checker.getTypeAtLocation(actualNode)
    const returnTypeStr = this.checker.typeToString(nodeType)

    str += `${DOCBLOCK_NEW_LINE}@returns {${returnTypeStr}} ${
      !this.hasReturnData(returnTypeStr)
        ? `Resolves when {return summary}`
        : this.getSymbolTypeDocBlock(nodeType)
    }`

    // add example
    str += `${DOCBLOCK_NEW_LINE}${DOCBLOCK_NEW_LINE}@example${DOCBLOCK_NEW_LINE}{example-code}`

    if (options.addEnd) {
      str += DOCBLOCK_END_LINE
    }

    return str
  }
}

export default FunctionKind
