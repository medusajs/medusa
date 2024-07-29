import ts from "typescript"
import DefaultKindGenerator, { GetDocBlockOptions } from "./default.js"
import { DOCBLOCK_END_LINE, DOCBLOCK_START } from "../../constants.js"
import { camelToWords } from "utils"
import { normalizeName } from "../../utils/str-formatting.js"

/**
 * A class that generates doc blocks for properties in a DTO interface/type.
 */
class DTOPropertyGenerator extends DefaultKindGenerator<ts.PropertySignature> {
  protected allowedKinds: ts.SyntaxKind[] = [ts.SyntaxKind.PropertySignature]
  public name = "dto-property"

  /**
   * Check that the generator can handle generating for the node.
   *
   * @param {ts.Node} node - The node to check.
   * @returns {boolean} Whether the generator can handle generating for the node.
   */
  isAllowed(node: ts.Node): node is ts.PropertySignature {
    if (!super.isAllowed(node)) {
      return false
    }

    return (
      this.getParentName((node as ts.PropertySignature).parent).endsWith(
        "DTO"
      ) || false
    )
  }

  async getDocBlock(
    node: ts.PropertyDeclaration | ts.Node,
    options?: GetDocBlockOptions
  ): Promise<string> {
    if (!this.isAllowed(node)) {
      return await super.getDocBlock(node, options)
    }

    let str = DOCBLOCK_START
    const rawParentName = this.getParentName(node.parent)
    const parentName = this.formatInterfaceName(rawParentName)
    // check if the property's type is interface/type/class
    const propertyType = this.checker.getTypeAtLocation(node)
    const isPropertyClassOrInterface = propertyType.isClassOrInterface()

    // try first to retrieve the summary from the knowledge base if it exists.
    const summary = this.knowledgeBaseFactory.tryToGetObjectPropertySummary({
      retrieveOptions: {
        str: node.name.getText(),
        kind: node.kind,
        templateOptions: {
          rawParentName,
          parentName,
        },
      },
      propertyDetails: {
        isClassOrInterface: isPropertyClassOrInterface,
        isBoolean:
          "intrinsicName" in propertyType &&
          propertyType.intrinsicName === "boolean",
        classOrInterfaceName: isPropertyClassOrInterface
          ? this.formatInterfaceName(this.checker.typeToString(propertyType))
          : undefined,
      },
    })

    str += summary

    return `${str}${DOCBLOCK_END_LINE}`
  }

  /**
   * Format the name of the interface/type.
   *
   * @param {string} name - The name to format.
   * @returns {string} The formatted name.
   */
  formatInterfaceName(name: string): string {
    return camelToWords(normalizeName(name))
  }

  /**
   * Get the name of the parent interface/type.
   *
   * @param {ts.InterfaceDeclaration | ts.TypeLiteralNode} parent - The parent node.
   * @returns {string} The name of the parent.
   */
  getParentName(parent: ts.InterfaceDeclaration | ts.TypeLiteralNode): string {
    if (ts.isInterfaceDeclaration(parent)) {
      return parent.name.getText()
    }

    return this.checker.typeToString(this.checker.getTypeFromTypeNode(parent))
  }
}

export default DTOPropertyGenerator
