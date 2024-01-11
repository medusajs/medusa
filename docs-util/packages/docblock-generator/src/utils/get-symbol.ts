import ts from "typescript"

export default function getSymbol(
  node: ts.Node,
  checker: ts.TypeChecker
): ts.Symbol | undefined {
  return checker.getSymbolAtLocation(
    "name" in node ? (node.name as ts.Node) : node
  )
}
