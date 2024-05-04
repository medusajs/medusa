/**
 * Transform a remote query object to a string array containing the chain of fields and relations
 *
 * @param fields
 * @param parent
 *
 * @example
 *
 * const remoteQueryObject = {
 *   fields: [
 *     "id",
 *     "title",
 *   ],
 *   images: {
 *     fields: ["id", "created_at", "updated_at", "deleted_at", "url", "metadata"],
 *   },
 * }
 *
 * const fields = remoteQueryObjectToString(remoteQueryObject)
 *
 * console.log(fields)
 * // ["id", "title", "images.id", "images.created_at", "images.updated_at", "images.deleted_at", "images.url", "images.metadata"]
 */
export declare function remoteQueryObjectToString(fields: object, parent?: string): string[];
