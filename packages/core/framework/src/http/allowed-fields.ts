export class AllowedFields extends Array<string> {
  // temporary
  nonExpandableFields = ["customers"]

  #fields: string[] = []
  #override: string[] = []

  #shouldOverride = false

  get shouldOverride(): boolean {
    return this.#shouldOverride
  }

  extends(fields: string[]) {
    this.#fields.push(...fields)
  }

  override(fields: string[]) {
    this.#shouldOverride = true
    this.#override.push(...fields)
  }

  getAllowed() {
    return this.#shouldOverride ? this.#override : this.#fields
  }
}
