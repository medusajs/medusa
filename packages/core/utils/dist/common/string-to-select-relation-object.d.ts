/**
 * Convert a string fields array to a specific object such as { select, relation }
 * @param fields
 *
 * @example
 * const fields = [
 *   "id",
 *   "created_at",
 *   "updated_at",
 *   "deleted_at",
 *   "url",
 *   "metadata",
 *   "tags.id",
 *   "tags.created_at",
 *   "tags.updated_at",
 *   "tags.deleted_at",
 *   "tags.value",
 *   "options.id",
 *   "options.created_at",
 *   "options.updated_at",
 *   "options.deleted_at",
 *   "options.title",
 *   "options.product_id",
 *   "options.metadata",
 *   "options.values.id",
 *   "options.values.created_at",
 *   "options.values.updated_at",
 *   "options.values.deleted_at",
 *   "options.values.value",
 *   "options.values.option_id",
 *   "options.values.variant_id",
 *   "options.values.metadata",
 * ]
 *
 * const remoteQueryObject = stringToSelectRelationObject(fields)
 *
 * console.log(remoteQueryObject)
 * // {
 * //   select: [
 * //     "id",
 * //     "created_at",
 * //     "updated_at",
 * //     "deleted_at",
 * //     "url",
 * //     "metadata",
 * //     "tags.id",
 * //     "tags.created_at",
 * //     "tags.updated_at",
 * //     "tags.deleted_at",
 * //     "tags.value",
 * //     "options.id",
 * //     "options.created_at",
 * //     "options.updated_at",
 * //     "options.deleted_at",
 * //     "options.title",
 * //     "options.product_id",
 * //     "options.metadata",
 * //     "options.values.id",
 * //     "options.values.created_at",
 * //     "options.values.updated_at",
 * //     "options.values.deleted_at",
 * //     "options.values.value",
 * //     "options.values.option_id",
 * //     "options.values.variant_id",
 * //     "options.values.metadata",
 * //   ],
 * //   relations: ["tags", "options", "options.values"],
 * // }
 */
export declare function stringToSelectRelationObject(fields: string[]): {
    select: string[];
    relations: string[];
};
