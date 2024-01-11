import ts from "typescript"

interface KindDocGenerator {
  getAllowedKinds(): ts.SyntaxKind[]

  isAllowed(node: ts.Node): boolean

  getDocBlock(node: ts.Node): string
}

export default KindDocGenerator
