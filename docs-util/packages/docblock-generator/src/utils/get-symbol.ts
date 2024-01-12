import ts from "typescript"

export default function getSymbol(
  node: ts.Node,
  checker: ts.TypeChecker
): ts.Symbol | undefined {
  if (
    ts.isVariableStatement(node) &&
    node.declarationList.declarations.length
  ) {
    return getSymbol(node.declarationList.declarations[0], checker)
  }

  return "symbol" in node && node.symbol
    ? (node.symbol as ts.Symbol)
    : undefined
}
