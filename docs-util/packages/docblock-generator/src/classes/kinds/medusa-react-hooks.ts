import ts from "typescript"
import FunctionKindGenerator, {
  FunctionNode,
  FunctionOrVariableNode,
} from "./function.js"
import {
  DOCBLOCK_NEW_LINE,
  DOCBLOCK_END_LINE,
  DOCBLOCK_START,
  DOCBLOCK_DOUBLE_LINES,
} from "../../constants.js"
import nodeHasComments from "../../utils/node-has-comments.js"
import {
  CUSTOM_NAMESPACE_TAG,
  getCustomNamespaceTag,
} from "../../utils/medusa-react-utils.js"

class MedusaReactHooksKindGenerator extends FunctionKindGenerator {
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
    const nodeType = this.getReturnType(node)

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

    let str = `${DOCBLOCK_START}This hook ${this.getFunctionSummary(node)}`

    // add example
    str += this.getFunctionExample()

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

    // add common docs
    str += this.getCommonDocs(node, {
      prefixWithLineBreaks: true,
    })

    // add namespace in case it's not added
    if (!str.includes(CUSTOM_NAMESPACE_TAG)) {
      str += `${DOCBLOCK_DOUBLE_LINES}${getCustomNamespaceTag(actualNode)}`
    }

    // add the category
    str += `${DOCBLOCK_NEW_LINE}@category ${
      this.isMutation(actualNode) ? "Mutations" : "Queries"
    }`

    return `${str}${DOCBLOCK_END_LINE}`
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

export default MedusaReactHooksKindGenerator
