import ts from "typescript"
import DefaultKind from "./default.js"
import { DOCBLOCK_NEW_LINE, DOCKBLOCK_END_LINE } from "../../constants.js"
import getSymbol from "../../utils/get-symbol.js"

type NodeType =
  | ts.MethodDeclaration
  | ts.MethodSignature
  | ts.FunctionDeclaration
  | ts.ArrowFunction

class FunctionKind extends DefaultKind {
  protected methodKinds: ts.SyntaxKind[] = [
    ts.SyntaxKind.MethodDeclaration,
    ts.SyntaxKind.MethodSignature,
  ]
  protected functionKinds: ts.SyntaxKind[] = [
    ts.SyntaxKind.FunctionDeclaration,
    ts.SyntaxKind.ArrowFunction,
  ]
  protected allowedKinds: ts.SyntaxKind[] = [
    ...this.methodKinds,
    ...this.functionKinds,
  ]

  isMethod(node: ts.Node): node is ts.MethodDeclaration | ts.MethodSignature {
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

  getDocBlock(node: NodeType): string {
    if (!this.isAllowed(node)) {
      return super.getDocBlock(node)
    }

    let str = this.getDocBlockStart(node)

    // add summary
    str += `${
      this.isMethod(node) ? `This method ` : `This function`
    }{summary}${DOCBLOCK_NEW_LINE}`

    // add params
    node.forEachChild((childNode) => {
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
    const nodeType = node.type
      ? this.checker.getTypeFromTypeNode(node.type)
      : this.checker.getTypeAtLocation(node)
    const returnTypeStr = this.checker.typeToString(nodeType)

    str += `${DOCBLOCK_NEW_LINE}@returns {${returnTypeStr}} ${
      !this.hasReturnData(returnTypeStr)
        ? `Resolves when {return summary}`
        : this.getSymbolTypeDocBlock(nodeType)
    }`

    return `${str}${DOCKBLOCK_END_LINE}`
  }
}

export default FunctionKind
