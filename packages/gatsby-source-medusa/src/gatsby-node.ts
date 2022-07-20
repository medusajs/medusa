import {
  CreateResolversArgs,
  GatsbyCache,
  Node,
  PluginOptionsSchemaArgs,
  Reporter,
  SourceNodesArgs,
  Store,
} from "gatsby"
import {
  createRemoteFileNode,
  CreateRemoteFileNodeArgs,
} from "gatsby-source-filesystem"
import { makeSourceFromOperation } from "./make-source-from-operation"
import { createOperations } from "./operations"

export function pluginOptionsSchema({ Joi }: PluginOptionsSchemaArgs): any {
  return Joi.object({
    storeUrl: Joi.string().required(),
    apiKey: Joi.string().optional(),
  })
}

async function sourceAllNodes(
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

const medusaNodeTypes = [
  "MedusaRegions",
  "MedusaProducts",
  "MedusaOrders",
  "MedusaCollections",
]

async function sourceUpdatedNodes(
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

export async function onPostBuild({ cache }: { cache: any }): Promise<void> {
  await cache.set("timestamp", Date.now())
}

export async function sourceNodes(
  gatsbyApi: SourceNodesArgs,
  pluginOptions: MedusaPluginOptions
): Promise<void> {
  const { cache } = gatsbyApi
  const lastBuildTime = await cache.get("timestamp")

  if (lastBuildTime !== undefined) {
    await sourceUpdatedNodes(gatsbyApi, pluginOptions, lastBuildTime)
  } else {
    gatsbyApi.reporter.info(`Cache is cold, running a clean build.`)
    await sourceAllNodes(gatsbyApi, pluginOptions)
  }

  gatsbyApi.reporter.info(`Finished sourcing nodes`)
}

export function createResolvers({ createResolvers }: CreateResolversArgs): any {
  const resolvers = {
    MedusaProducts: {
      images: {
        type: ["MedusaImages"],
        resolve: async (
          source: any,
          _args: any,
          context: any,
          _info: any
        ): Promise<any> => {
          const { entries } = await context.nodeModel.findAll({
            query: {
              filter: { parent: { id: { eq: source.id } } },
            },
            type: "MedusaImages",
          })
          return entries
        },
      },
    },
  }
  createResolvers(resolvers)
}

export async function createSchemaCustomization({
  actions: { createTypes },
}: {
  actions: { createTypes: any }
  schema: any
}): Promise<void> {
  createTypes(`
    type MedusaProducts implements Node {
      thumbnail: File @link(from: "fields.localThumbnail")
    }

    type MedusaImages implements Node {
      image: File @link(from: "fields.localImage")
    }
  `)
}

export async function onCreateNode({
  actions: { createNode, createNodeField },
  cache,
  createNodeId,
  node,
  store,
  reporter,
}: {
  actions: { createNode: any; createNodeField: any }
  cache: GatsbyCache
  createNodeId: any
  node: Node
  store: Store
  reporter: Reporter
}): Promise<void> {
  if (node.internal.type === `MedusaProducts`) {
    if (node.thumbnail !== null) {
      const thumbnailNode: Node | null = await createRemoteFileNode({
        url: `${node.thumbnail}`,
        parentNodeId: node.id,
        createNode,
        createNodeId,
        cache,
        store,
        reporter,
      } as CreateRemoteFileNodeArgs)

      if (thumbnailNode) {
        createNodeField({
          node,
          name: `localThumbnail`,
          value: thumbnailNode.id,
        })
      }
    }
  }

  if (node.internal.type === `MedusaImages`) {
    const imageNode: Node | null = await createRemoteFileNode({
      url: `${node.url}`,
      parentNodeId: node.id,
      createNode,
      createNodeId,
      cache,
      store,
      reporter,
    } as CreateRemoteFileNodeArgs)

    if (imageNode) {
      createNodeField({
        node,
        name: `localImage`,
        value: imageNode.id,
      })
    }
  }
}
