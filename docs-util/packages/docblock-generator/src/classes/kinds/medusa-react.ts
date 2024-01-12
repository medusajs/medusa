import ts from "typescript"
import FunctionKind, {
  FunctionNode,
  FunctionOrVariableNode,
} from "./function.js"
import { DOCBLOCK_NEW_LINE, DOCBLOCK_END_LINE } from "../../constants.js"
import path from "path"
import getMonorepoRoot from "../../utils/get-monorepo-root.js"
import nodeHasComments from "../../utils/node-has-comments.js"

class MedusaReactKind extends FunctionKind {
  isAllowed(node: ts.Node): node is FunctionOrVariableNode {
    if (!super.isAllowed(node)) {
      return false
    }

    const actualNode = ts.isVariableStatement(node)
      ? this.extractFunctionNode(node)
      : node

    return (
      actualNode !== undefined &&
      (this.isMutation(actualNode) || this.isQuery(actualNode))
    )
  }

  isMutation(node: FunctionNode): boolean {
    const nodeType = node.type
      ? this.checker.getTypeFromTypeNode(node.type)
      : this.checker.getTypeAtLocation(node)

    const callSignatures = nodeType.getCallSignatures()

    return (
      callSignatures.length > 0 &&
      this.checker
        .typeToString(this.checker.getReturnTypeOfSignature(callSignatures[0]))
        .startsWith("UseMutationResult")
    )
  }

  isQuery(node: FunctionNode): boolean {
    return node.parameters.some(
      (parameter) =>
        parameter.type?.getText().startsWith("UseQueryOptionsWrapper")
    )
  }

  getDocBlock(node: FunctionNode & ts.VariableDeclaration): string {
    if (!this.isAllowed(node)) {
      return super.getDocBlock(node)
    }

    const actualNode = ts.isVariableStatement(node)
      ? this.extractFunctionNode(node)
      : node

    if (!actualNode) {
      return super.getDocBlock(node)
    }

    let str = `${this.getDocBlockStart(
      actualNode
    )}This hook {summary}${DOCBLOCK_NEW_LINE}`

    // add example
    str += `${DOCBLOCK_NEW_LINE}${DOCBLOCK_NEW_LINE}@example${DOCBLOCK_NEW_LINE}{example-code}`

    // TODO add the namespace
    str += `${DOCBLOCK_NEW_LINE}${DOCBLOCK_NEW_LINE}@customNamespace ${this.getNamespacePath(
      actualNode
    )}`

    // add the category
    str += `${DOCBLOCK_NEW_LINE}@category ${
      this.isMutation(actualNode) ? "Mutations" : "Queries"
    }`

    // loop over parameters that aren't query/mutation parameters
    // and add docblock to them
    this.getActualParameters(actualNode).forEach((parameter) => {
      ts.addSyntheticLeadingComment(
        parameter,
        ts.SyntaxKind.MultiLineCommentTrivia,
        super.getDocBlock(parameter),
        true
      )
    })

    return `${str}${DOCBLOCK_END_LINE}`
  }

  getNamespacePath(node: FunctionNode): string {
    const packagePathPrefix = `${path.resolve(
      getMonorepoRoot(),
      "packages/medusa-react/src"
    )}/`

    const hookPath = path
      .dirname(node.getSourceFile().fileName)
      .replace(packagePathPrefix, "")

    return hookPath
      .split("/")
      .map((pathItem) =>
        pathItem
          .split("-")
          .map(
            (item) =>
              `${item.charAt(0).toUpperCase()}${
                item.length > 1 ? item.substring(1) : ""
              }`
          )
          .join(" ")
      )
      .join(".")
  }

  getActualParameters(node: FunctionNode): ts.ParameterDeclaration[] {
    return node.parameters.filter((parameter) => {
      const parameterTypeStr = parameter.type?.getText()
      return (
        !parameterTypeStr?.startsWith("UseQueryOptionsWrapper") &&
        !parameterTypeStr?.startsWith("UseMutationOptions") &&
        !nodeHasComments(parameter)
      )
    })
  }
}

export default MedusaReactKind
