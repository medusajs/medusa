import { Config, Settings } from "meilisearch";

export interface MeilisearchPluginOptions {
    /**
     * Meilisearch client configuration
     */
    config: Config
    /**
     * Index settings
     */
    settings?: {
      [key:string]: {
        indexSettings: Settings,
        /**
        * Primary key for the index. Used to enforce unique documents in an index. See more in Meilisearch' https://docs.meilisearch.com/learn/core_concepts/primary_key.html.
        */
        primaryKey?: string
        /**
        * Document transformer. Used to transform documents before they are added to the index.
        */
       transformer?: (document: any) => any
      }
    }
  }