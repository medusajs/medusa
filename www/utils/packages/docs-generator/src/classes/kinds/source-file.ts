import ts from "typescript"
import DefaultKindGenerator, { GetDocBlockOptions } from "./default.js"
import { DOCBLOCK_END_LINE, DOCBLOCK_START } from "../../constants.js"
import { shouldHaveCustomNamespace } from "../../utils/medusa-react-utils.js"

/**
 * A generator used to retrieve doc blocks for a source file.
 */
class SourceFileKindGenerator extends DefaultKindGenerator<ts.SourceFile> {
  protected allowedKinds: ts.SyntaxKind[] = [ts.SyntaxKind.SourceFile]
  public name = "source-file"

  /**
   * Retrieve the docblock of a source file.
   *
   * @param {ts.SourceFile | ts.Node} node - The node to retrieve its docblocks.
   * @param {GetDocBlockOptions} options - The formatting options.
   * @returns {string} The node's docblock.
   */
  async getDocBlock(
    node: ts.SourceFile | ts.Node,
    options?: GetDocBlockOptions
  ): Promise<string> {
    if (!this.isAllowed(node)) {
      return await super.getDocBlock(node, options)
    }

    if (shouldHaveCustomNamespace(node)) {
      return `${DOCBLOCK_START}${this.getCommonDocs(node, {
        addDefaultSummary: true,
      })}${DOCBLOCK_END_LINE}`
    }

    return ""
  }
}

export default SourceFileKindGenerator
