export class RestrictedFields {
  /**
   * Fields that are restricted from being selected in the response.
   * Those fields can be allowed if specified in the allowed configuration of the query config of an end point.
   *
   * @type {string[]}
   * @private
   */
  #restrictedFields: Set<string> = new Set()

  list() {
    return Array.from(this.#restrictedFields)
  }

  add(fields: string[]) {
    fields.map((field) => this.#restrictedFields.add(field))
  }
}
