import { SourceNodesArgs } from "gatsby";
export declare function sourceAllNodes(gatsbyApi: SourceNodesArgs, pluginOptions: MedusaPluginOptions): Promise<void>;
export declare function sourceUpdatedNodes(gatsbyApi: SourceNodesArgs, pluginOptions: MedusaPluginOptions, lastBuildTime: string): Promise<void>;
