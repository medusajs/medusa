export * from "./interface";
export * from "./settings";
export type IndexSettings = {
    /**
     * Settings specific to the provider. E.g. `searchableAttributes`.
     */
    indexSettings: Record<string, unknown>;
    /**
     * Primary key for the index. Used to enforce unique documents in an index. See more in Meilisearch' https://docs.meilisearch.com/learn/core_concepts/primary_key.html.
     */
    primaryKey?: string;
    /**
     * Document transformer. Used to transform documents before they are added to the index.
     */
    transformer?: (document: any) => any;
};
//# sourceMappingURL=index.d.ts.map