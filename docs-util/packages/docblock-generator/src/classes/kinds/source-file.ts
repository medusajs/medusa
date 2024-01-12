import ts from "typescript"
import DefaultKindGenerator, { GetDocBlockOptions } from "./default.js"
import { DOCBLOCK_END_LINE, DOCBLOCK_START } from "../../constants.js"
import { shouldHaveNamespace } from "../../utils/medusa-react-utils.js"

class SourceFileKindGenerator extends DefaultKindGenerator<ts.SourceFile> {
  protected allowedKinds: ts.SyntaxKind[] = [ts.SyntaxKind.SourceFile]

  getDocBlock(
    node: ts.SourceFile | ts.Node,
    options?: GetDocBlockOptions
  ): string {
    if (!this.isAllowed(node)) {
      return super.getDocBlock(node, options)
    }

    if (shouldHaveNamespace(node)) {
      return `${DOCBLOCK_START}${this.getCommonDocs(node, {
        addDefaultSummary: true,
      })}${DOCBLOCK_END_LINE}`
    }

    return ""
  }
}

export default SourceFileKindGenerator
