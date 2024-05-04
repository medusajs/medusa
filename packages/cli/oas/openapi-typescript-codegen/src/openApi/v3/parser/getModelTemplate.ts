import type { Type } from "../../../client/interfaces/Type"

/**
 * If our model has a template type, then we want to generalize that!
 * In that case we should return "<T>" as our template type.
 * @param modelClass The parsed model class type.
 * @returns The model template type (<T> or empty).
 */
export const getModelTemplate = (modelClass: Type): string => {
  return modelClass.template ? "<T>" : ""
}
