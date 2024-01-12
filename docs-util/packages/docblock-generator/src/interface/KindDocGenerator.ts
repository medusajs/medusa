import ts from "typescript"

export type GetDocBlockOptions = {
  addEnd?: boolean
  summaryPrefix?: string
}

interface KindDocGenerator<T extends ts.Node = ts.Node> {
  getAllowedKinds(): ts.SyntaxKind[]

  isAllowed(node: T): boolean

  getDocBlock(node: T, options?: GetDocBlockOptions): string
}

export default KindDocGenerator
