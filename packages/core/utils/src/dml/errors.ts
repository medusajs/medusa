export class DuplicateIdPropertyError extends Error {
  constructor(modelName: string) {
    super(`The model ${modelName} can only have one usage of the id() property`)
  }
}
