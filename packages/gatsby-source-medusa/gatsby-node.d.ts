import { CreateResolversArgs, GatsbyCache, Node, PluginOptionsSchemaArgs, Reporter, SourceNodesArgs, Store } from "gatsby";
export declare function pluginOptionsSchema({ Joi }: PluginOptionsSchemaArgs): any;
export declare function onPostBuild({ cache }: {
    cache: any;
}): Promise<void>;
export declare function sourceNodes(gatsbyApi: SourceNodesArgs, pluginOptions: MedusaPluginOptions): Promise<void>;
export declare function createResolvers({ createResolvers }: CreateResolversArgs): any;
export declare function createSchemaCustomization({ actions: { createTypes }, }: {
    actions: {
        createTypes: any;
    };
    schema: any;
}): Promise<void>;
export declare function onCreateNode({ actions: { createNode, createNodeField }, cache, createNodeId, node, store, reporter, }: {
    actions: {
        createNode: any;
        createNodeField: any;
    };
    cache: GatsbyCache;
    createNodeId: any;
    node: Node;
    store: Store;
    reporter: Reporter;
}): Promise<void>;
