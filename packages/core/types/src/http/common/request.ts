export interface SelectParams {
  /**
   * Select fields to include in the results.
   *
   * - By default, using this field will cause all other fields to be excluded.
   * - To include a field without excluding others, prefix the field with a `+`, e.g., `"+products"`.
   * - To expand a nested relation, prefix the field with a `*`, e.g., `"*products"`.
   * - To only include specific fields in a nested relation, target the nested fields by separating them with a `.`, e.g., `"products.title"`.
   */
  fields?: string
}

export interface FindParams extends SelectParams {
  /**
   * The number of records to return.
   */
  limit?: number
  /**
   * The number of records to skip before returning results.
   */
  offset?: number
  /**
   * A field to order the results by. The default order is ascending.
   * To order the results in descending order, prefix the field with a `-`, e.g., `"-title"`.
   */
  order?: string
}
