import ts from "typescript"

type GetDocBlockOptions = {
  addEnd?: boolean
}

interface KindDocGenerator {
  getAllowedKinds(): ts.SyntaxKind[]

  isAllowed(node: ts.Node): boolean

  getDocBlock(node: ts.Node, options?: GetDocBlockOptions): string
}

export default KindDocGenerator
