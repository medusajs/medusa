import { SourceNodesArgs } from "gatsby"
import { makeSourceFromOperation } from "./make-source-from-operation"
import { createOperations } from "./operations"

const medusaNodeTypes = [
  "MedusaRegions",
  "MedusaProducts",
  "MedusaOrders",
  "MedusaCollections",
]

export async function sourceAllNodes(
  gatsbyApi: SourceNodesArgs,
  pluginOptions: MedusaPluginOptions
): Promise<void> {
  const {
    createProductsOperation,
    createRegionsOperation,
    createOrdersOperation,
    createCollectionsOperation,
  } = createOperations(pluginOptions)

  const operations = [
    createProductsOperation,
    createRegionsOperation,
    createCollectionsOperation,
  ]

  // if auth token is provided then source orders
  if (pluginOptions.apiKey) {
    operations.push(createOrdersOperation)
  }

  const sourceFromOperation = makeSourceFromOperation(gatsbyApi)

  for (const op of operations) {
    await sourceFromOperation(op)
  }
}

export async function sourceUpdatedNodes(
  gatsbyApi: SourceNodesArgs,
  pluginOptions: MedusaPluginOptions,
  lastBuildTime: string
): Promise<void> {
  const {
    incrementalProductsOperation,
    incrementalRegionsOperation,
    incrementalOrdersOperation,
    incrementalCollectionsOperation,
  } = createOperations(pluginOptions)

  for (const nodeType of medusaNodeTypes) {
    gatsbyApi
      .getNodesByType(nodeType)
      .forEach((node) => gatsbyApi.actions.touchNode(node))
  }

  const operations = [
    incrementalProductsOperation(lastBuildTime),
    incrementalRegionsOperation(lastBuildTime),
    incrementalCollectionsOperation(lastBuildTime),
  ]

  if (pluginOptions.apiKey) {
    operations.push(incrementalOrdersOperation(lastBuildTime))
  }

  const sourceFromOperation = makeSourceFromOperation(gatsbyApi)

  for (const op of operations) {
    await sourceFromOperation(op)
  }
}
