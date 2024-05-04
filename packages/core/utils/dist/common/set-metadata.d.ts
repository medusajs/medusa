/**
 * Dedicated method to set metadata.
 * @param obj - the entity to apply metadata to.
 * @param metadata - the metadata to set
 * @return resolves to the updated result.
 */
export declare function setMetadata(obj: {
    metadata: Record<string, unknown> | null;
}, metadata: Record<string, unknown>): Record<string, unknown>;
