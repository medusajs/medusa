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
import { sourceAllNodes, sourceUpdatedNodes } from "./source-nodes"

export function pluginOptionsSchema({ Joi }: PluginOptionsSchemaArgs): any {
  return Joi.object({
    storeUrl: Joi.string().required(),
    apiKey: Joi.string().optional(),
  })
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
      id: ID!
      title: String!
      subtitle: String
      description: String
      handle: String!
      is_giftcard: Boolean!
      status: String!
      thumbnail: File @link(from: "fields.localThumbnail")
      options: [MedusaProductOptions]!
      variants: [MedusaProductVariants]!
      collection: MedusaCollections @link(from: "collection_id")
      collection_id: String
      profile_id: String!
      discountable: Boolean!
      published_at: Date!
      created_at: Date!
      updated_at: Date!
      weight: Int
      length: Int
      width: Int
    }
    type MedusaImages implements Node {
      id: ID!
      url: String!
      created_at: Date!
      updated_at: Date!
      image: File @link(from: "fields.localImage")
    }
    type MedusaCollections implements Node {
      id: ID!
      handle: String!
      title: String!
      created_at: Date!
      updated_at: Date!
    }
    type MedusaProductOptions @dontInfer {
      id: ID!
      title: String!
      product_id: String!
      values: [MedusaProductOptionValues]!
      created_at: Date!
      updated_at: Date!
    }
    type MedusaProductOptionValues @dontInfer {
      id: ID!
      value: String!
      created_at: Date!
      updated_at: Date!
      option_id: String!
      variant_id: String!
    }
    type MedusaProductVariants @dontInfer {
      id: ID!
      title: String!
      product_id: String!
      prices: [MedusaMoneyAmounts]!
      sku: String
      barcode: String
      upc: String
      variant_rank: Int
      inventory_quantity: Int!
      allow_backorder: Boolean!
      manage_inventory: Boolean!
      hs_code: String
      origin_country: String
      mid_code: String
      material: String
      weight: Int
      length: Int
      height: Int
      width: Int
      options: [MedusaProductOptionValues]!
      created_at: Date!
      updated_at: Date!
    }
    type MedusaMoneyAmounts @dontInfer {
      id: ID!
      amount: Int!
      currency_code: String!
      created_at: Date!
      updated_at: Date!
      variant_id: String!
    }
    type MedusaRegions implements Node {
      id: ID!
      name: String!
      currency_code: String!
      tax_rate: Int!
      tax_code: String
      automatic_taxes: Boolean!
      created_at: Date!
      updated_at: Date!
      countries: [MedusaCountries]!
    }
    type MedusaCountries implements Node {
      id: ID!
      name: String!
      iso_2: String!
      iso_3: String!
      num_code: Int!
      display_name: String!
      region_id: String!
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
