import ts from "typescript"

/**
 * Retrieves the symbol of a node.
 *
 * @param {ts.Node} node - The node to retrieve its symbol.
 * @param {ts.TypeChecker} checker - The type checker of the TypeScript program the symbol is in.
 * @returns {ts.Symbol | undefined} The symbol if found.
 */
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
