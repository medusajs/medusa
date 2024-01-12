import ts from "typescript"

export default function nodeHasComments(node: ts.Node): boolean {
  return (
    ts.getLeadingCommentRanges(
      node.getSourceFile().getFullText(),
      node.getFullStart()
    ) !== undefined
  )
}
