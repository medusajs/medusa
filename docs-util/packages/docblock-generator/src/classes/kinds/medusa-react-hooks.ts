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
import {
  CUSTOM_NAMESPACE_TAG,
  getCustomNamespaceTag,
} from "../../utils/medusa-react-utils.js"

/**
 * Docblock generate for medusa-react hooks. Since hooks are essentially functions,
 * it extends the {@link FunctionKindGenerator} class.
 */
class MedusaReactHooksKindGenerator extends FunctionKindGenerator {
  public name = "medusa-react"
  /**
   * Checks whether the generator can retrieve the docblock of the specified node. It uses the parent generator
   * to check that the node is a function, then checks if the function is a mutation using the {@link isMutation} method,
   * or a query using the {@link isQuery} method.
   *
   * @param {ts.Node} node - The node to check.
   * @returns {boolean} Whether this generator can be used on this node.
   */
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

  /**
   * Checks whether a function node is a mutation.
   *
   * @param {FunctionNode} node - The function node to check.
   * @returns {boolean} Whether the node is a mutation.
   */
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

  /**
   * Checks whether a function node is a query.
   *
   * @param {FunctionNode} node - The function node to check.
   * @returns {boolean} Whether the node is a query.
   */
  isQuery(node: FunctionNode): boolean {
    return node.parameters.some(
      (parameter) =>
        parameter.type?.getText().startsWith("UseQueryOptionsWrapper")
    )
  }

  /**
   * Retrieves the docblock of the medusa-react hook or mutation.
   *
   * @param {FunctionNode & ts.VariableDeclaration} node - The node to retrieve its docblock.
   * @returns {string} The node's docblock.
   */
  async getDocBlock(
    node: FunctionNode & ts.VariableDeclaration
  ): Promise<string> {
    // TODO use the AiGenerator to generate summary + examples
    if (!this.isAllowed(node)) {
      return await super.getDocBlock(node)
    }

    const actualNode = ts.isVariableStatement(node)
      ? this.extractFunctionNode(node)
      : node

    if (!actualNode) {
      return await super.getDocBlock(node)
    }
    const isMutation = this.isMutation(actualNode)

    let str = `${DOCBLOCK_START}This hook ${this.getFunctionSummary({
      node,
    })}`

    // add example
    str += this.getFunctionPlaceholderExample()

    // loop over parameters that aren't query/mutation parameters
    // and add docblock to them
    await Promise.all(
      this.getActualParameters(actualNode).map(async (parameter) => {
        ts.addSyntheticLeadingComment(
          parameter,
          ts.SyntaxKind.MultiLineCommentTrivia,
          await super.getDocBlock(parameter),
          true
        )
      })
    )

    // check if mutation parameter is an intrinsic type and, if so, add the `@typeParamDefinition`
    // tag to the hook
    if (isMutation) {
      const typeArg = this.getMutationRequestTypeArg(actualNode)
      if (typeArg) {
        str += `${DOCBLOCK_DOUBLE_LINES}@typeParamDefinition ${this.checker.typeToString(
          typeArg
        )} - {summary}`
      }
    }

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
      isMutation ? "Mutations" : "Queries"
    }`

    return `${str}${DOCBLOCK_END_LINE}`
  }

  /**
   * Retrieves the parameters of a function node that aren't query/mutation options.
   *
   * @param {FunctionNode} node - The function node to retrieve its parameters.
   * @returns {ts.ParameterDeclaration[]} - The function's actual parameters.
   */
  getActualParameters(node: FunctionNode): ts.ParameterDeclaration[] {
    return node.parameters.filter((parameter) => {
      const parameterTypeStr = parameter.type?.getText()
      return (
        !parameterTypeStr?.startsWith("UseQueryOptionsWrapper") &&
        !parameterTypeStr?.startsWith("UseMutationOptions") &&
        !this.nodeHasComments(parameter)
      )
    })
  }

  /**
   * Retreives a mutation's intrinsic request type, if available, which is specified as the third type argument of `UseMutationOptions`.
   *
   * @param {FunctionNode} node - The function node to retrieve its request type.
   * @returns {ts.Type | undefined} The mutation's request type, if available.
   */
  getMutationRequestTypeArg(node: FunctionNode): ts.Type | undefined {
    const parameter = node.parameters.find(
      (parameter) => parameter.type?.getText().startsWith("UseMutationOptions")
    )

    if (!parameter) {
      return
    }

    const parameterType = this.checker.getTypeFromTypeNode(parameter.type!)
    const typeArgs =
      parameterType.aliasTypeArguments ||
      ("resolvedTypeArguments" in parameterType
        ? (parameterType.resolvedTypeArguments as ts.Type[])
        : [])
    if (
      !typeArgs ||
      typeArgs.length < 3 ||
      !("intrinsicName" in typeArgs[2]) ||
      ["void", "unknown"].includes(typeArgs[2].intrinsicName as string)
    ) {
      return
    }

    // find request in third type argument
    return typeArgs[2]
  }
}

export default MedusaReactHooksKindGenerator
