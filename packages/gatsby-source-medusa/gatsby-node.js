"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onCreateNode = exports.createSchemaCustomization = exports.createResolvers = exports.sourceNodes = exports.onPostBuild = exports.pluginOptionsSchema = void 0;
const gatsby_source_filesystem_1 = require("gatsby-source-filesystem");
const source_nodes_1 = require("./source-nodes");
function pluginOptionsSchema({ Joi }) {
    return Joi.object({
        storeUrl: Joi.string().required(),
        apiKey: Joi.string().optional(),
    });
}
exports.pluginOptionsSchema = pluginOptionsSchema;
async function onPostBuild({ cache }) {
    await cache.set("timestamp", Date.now());
}
exports.onPostBuild = onPostBuild;
async function sourceNodes(gatsbyApi, pluginOptions) {
    const { cache } = gatsbyApi;
    const lastBuildTime = await cache.get("timestamp");
    if (lastBuildTime !== undefined) {
        await (0, source_nodes_1.sourceUpdatedNodes)(gatsbyApi, pluginOptions, lastBuildTime);
    }
    else {
        gatsbyApi.reporter.info(`Cache is cold, running a clean build.`);
        await (0, source_nodes_1.sourceAllNodes)(gatsbyApi, pluginOptions);
    }
    gatsbyApi.reporter.info(`Finished sourcing nodes`);
}
exports.sourceNodes = sourceNodes;
function createResolvers({ createResolvers }) {
    const resolvers = {
        MedusaProducts: {
            images: {
                type: ["MedusaImages"],
                resolve: async (source, _args, context, _info) => {
                    const { entries } = await context.nodeModel.findAll({
                        query: {
                            filter: { parent: { id: { eq: source.id } } },
                        },
                        type: "MedusaImages",
                    });
                    return entries;
                },
            },
        },
    };
    createResolvers(resolvers);
}
exports.createResolvers = createResolvers;
async function createSchemaCustomization({ actions: { createTypes }, }) {
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
  `);
}
exports.createSchemaCustomization = createSchemaCustomization;
async function onCreateNode({ actions: { createNode, createNodeField }, cache, createNodeId, node, store, reporter, }) {
    if (node.internal.type === `MedusaProducts`) {
        if (node.thumbnail !== null) {
            const thumbnailNode = await (0, gatsby_source_filesystem_1.createRemoteFileNode)({
                url: `${node.thumbnail}`,
                parentNodeId: node.id,
                createNode,
                createNodeId,
                cache,
                store,
                reporter,
            });
            if (thumbnailNode) {
                createNodeField({
                    node,
                    name: `localThumbnail`,
                    value: thumbnailNode.id,
                });
            }
        }
    }
    if (node.internal.type === `MedusaImages`) {
        const imageNode = await (0, gatsby_source_filesystem_1.createRemoteFileNode)({
            url: `${node.url}`,
            parentNodeId: node.id,
            createNode,
            createNodeId,
            cache,
            store,
            reporter,
        });
        if (imageNode) {
            createNodeField({
                node,
                name: `localImage`,
                value: imageNode.id,
            });
        }
    }
}
exports.onCreateNode = onCreateNode;
//# sourceMappingURL=gatsby-node.js.map