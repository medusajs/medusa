import ts from "typescript"
import KindDocGenerator from "../../interface/KindDocGenerator.js"
import {
  DOCBLOCK_NEW_LINE,
  DOCBLOCK_START,
  DOCKBLOCK_END_LINE,
} from "../../constants.js"
import getSymbol from "../../utils/get-symbol.js"

class DefaultKind implements KindDocGenerator {
  static DEFAULT_ALLOWED_NODE_KINDS = [
    ts.SyntaxKind.ClassDeclaration,
    ts.SyntaxKind.EnumDeclaration,
    ts.SyntaxKind.EnumMember,
    ts.SyntaxKind.MethodDeclaration,
    ts.SyntaxKind.MethodSignature,
    ts.SyntaxKind.ModuleDeclaration,
    ts.SyntaxKind.FunctionDeclaration,
    ts.SyntaxKind.ArrowFunction,
    ts.SyntaxKind.PropertyDeclaration,
    ts.SyntaxKind.InterfaceDeclaration,
    ts.SyntaxKind.TypeAliasDeclaration,
    ts.SyntaxKind.PropertySignature,
  ]
  protected allowedKinds: ts.SyntaxKind[]
  protected checker: ts.TypeChecker

  constructor({
    checker,
    kinds,
  }: {
    checker: ts.TypeChecker
    kinds?: ts.SyntaxKind[]
  }) {
    this.allowedKinds = kinds || DefaultKind.DEFAULT_ALLOWED_NODE_KINDS
    this.checker = checker
  }

  getAllowedKinds(): ts.SyntaxKind[] {
    return this.allowedKinds
  }

  isAllowed(node: ts.Node): boolean {
    return this.allowedKinds.includes(node.kind)
  }

  getDocBlockStart(node: ts.Node): string {
    const commonTags = this.getCommonDocs(node)

    return `${DOCBLOCK_START}${
      commonTags.length
        ? `${commonTags}${DOCBLOCK_NEW_LINE}${DOCBLOCK_NEW_LINE}`
        : ``
    }`
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getDocBlock(node: ts.Node): string {
    let str = this.getDocBlockStart(node)

    switch (node.kind) {
      case ts.SyntaxKind.EnumDeclaration:
        str += `@enum${DOCBLOCK_NEW_LINE}${DOCBLOCK_NEW_LINE}{summary}`
        break
      case ts.SyntaxKind.TypeAliasDeclaration:
        str += `@interface${DOCBLOCK_NEW_LINE}${DOCBLOCK_NEW_LINE}{summary}`
        break
      default:
        str += `{summary}`
    }

    return `${str}${DOCKBLOCK_END_LINE}`
  }

  getSymbolTypeDocBlock(symbolType: ts.Type): string {
    if (symbolType.aliasSymbol) {
      return this.getSymbolDocBlock(symbolType.aliasSymbol)
    }

    const typeArguments = this.checker.getTypeArguments(
      symbolType as ts.TypeReference
    )

    if (typeArguments.length) {
      // take only the first type argument to account
      const typeArgumentDoc = this.getSymbolTypeDocBlock(typeArguments[0])

      // do some formatting if the encapsulating type is an array
      if (!typeArgumentDoc.length || !this.checker.isArrayType(symbolType)) {
        return typeArgumentDoc
      }
      return `The list of ${typeArgumentDoc
        .charAt(0)
        .toLowerCase()}${typeArgumentDoc.substring(1)}`
    }

    return symbolType.symbol ? this.getSymbolDocBlock(symbolType.symbol) : ""
  }

  getSymbolDocBlock(symbol: ts.Symbol): string {
    const commentDisplayParts = symbol.getDocumentationComment(this.checker)
    if (!commentDisplayParts.length) {
      // try to get description from the first JSDoc comment
      const jsdocComments = symbol.getJsDocTags(this.checker)

      if (jsdocComments.length) {
        jsdocComments
          .find((tag) => (tag.text?.length || 0) > 0)
          ?.text!.forEach((tagText) => {
            commentDisplayParts.push(tagText)
          })
      }
    }
    return ts.displayPartsToString(commentDisplayParts)
  }

  getCommonDocs(node: ts.Node): string {
    const tags = new Set<string>()

    const symbol = getSymbol(node, this.checker)

    // check for private or protected modifiers
    symbol?.declarations?.some((declaration) => {
      if (!("modifiers" in declaration) || !declaration.modifiers) {
        return false
      }

      const hasPrivateOrProtected = (
        declaration.modifiers as ts.NodeArray<ts.Modifier>
      ).find((modifier) => {
        modifier.kind === ts.SyntaxKind.PrivateKeyword ||
          modifier.kind === ts.SyntaxKind.ProtectedKeyword
      })

      if (!hasPrivateOrProtected) {
        return false
      }

      tags.add("@ignore")
      return true
    })

    if (symbol?.getName().startsWith("_")) {
      tags.add("@ignore")
    }

    let str = ""
    tags.forEach((tag) => {
      if (str.length > 0) {
        str += `${DOCBLOCK_NEW_LINE}${DOCBLOCK_NEW_LINE}`
      }
      str += `${tag}`
    })
    return str
  }
}

export default DefaultKind
