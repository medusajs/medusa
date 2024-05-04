import type { Model } from "../client/interfaces/Model"
import { sort } from "./sort"

export const getModelNames = (models: Model[]): string[] => {
  return models.map((model) => model.name).sort(sort)
}
