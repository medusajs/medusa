import { SourceNodesArgs } from "gatsby"
import { processNode } from "./process-node"

export function makeSourceFromOperation(gatsbyApi: SourceNodesArgs) {
  return async function sourceFromOperation(
    op: IMedusaOperation
  ): Promise<void> {
    const { reporter, actions } = gatsbyApi

    reporter.info(`Initiating operation query ${op.name}`)
    const nodes = await op.execute()

    nodes.map((rawNode) => {
      const nodeArr = processNode(
        rawNode,
        op.name,
        gatsbyApi.createContentDigest
      )

      nodeArr.forEach((node) => {
        actions.createNode(node)
      })
    })
  }
}
