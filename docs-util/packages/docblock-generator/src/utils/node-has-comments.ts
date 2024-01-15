import ts from "typescript"

/**
 * Checks whether a node has comments.
 *
 * @param {ts.Node} node - The node to check.
 * @returns {boolean} Whether the node has comments.
 */
export default function nodeHasComments(node: ts.Node): boolean {
  return (
    ts.getLeadingCommentRanges(
      node.getSourceFile().getFullText(),
      node.getFullStart()
    ) !== undefined
  )
}
