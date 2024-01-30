import ts, { SyntaxKind } from "typescript"
import FunctionKindGenerator, {
  FunctionOrVariableNode,
  VariableNode,
} from "./function.js"
import { GetDocBlockOptions } from "./default.js"
import { basename } from "path"
import { capitalize } from "../../utils/str-formatting.js"

class OasGenerator extends FunctionKindGenerator {
  protected allowedKinds: SyntaxKind[] = [ts.SyntaxKind.FunctionDeclaration]

  isAllowed(node: ts.Node): node is FunctionOrVariableNode {
    const isFunction =
      this.allowedKinds.includes(node.kind) ||
      (ts.isVariableStatement(node) && this.isFunctionVariable(node))

    if (!isFunction) {
      return false
    }

    // function should have 2 parameters, first parameter of type `MedusaRequest`
    // and the second of type `MedusaResponse`
    const functionNode = ts.isFunctionDeclaration(node)
      ? node
      : this.extractFunctionNode(node as VariableNode)

    if (!functionNode) {
      return false
    }

    return (
      (functionNode.parameters.length === 2 &&
        functionNode.parameters[0].type
          ?.getText()
          .startsWith("MedusaRequest") &&
        functionNode.parameters[1].type
          ?.getText()
          .startsWith("MedusaResponse")) ||
      false
    )
  }

  getDocBlock(
    node: ts.Node | FunctionOrVariableNode,
    options?: GetDocBlockOptions
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

    const filePath = actualNode.getSourceFile().fileName
    const oasPath = (
      filePath.includes("/api-v2/")
        ? filePath.substring(filePath.indexOf("/api-v2/"))
        : filePath.substring(filePath.indexOf("/api/"))
    )
      .replace(/^\/api(-v2)?\//, "")
      .replace(`/${basename(filePath)}`, "")

    const oasPrefix = `@oas [${actualNode.name?.getText()}] ${oasPath}`

    const oas = {
      operationId: `${actualNode.name?.getText()}${oasPath
        .split("/")
        .slice(1)
        .map((item) =>
          item
            .split("-")
            .map((subitem) => capitalize(subitem))
            .join("")
        )
        .join("")}`,
      summary: this.defaultSummary, // TODO figure out if we can infer summary
    }
  }
}

export default OasGenerator
