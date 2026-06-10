import type { Linter } from "eslint"
import { buildRecommended } from "./recommended"

export function buildStrict(plugin: unknown): Linter.Config[] {
  return [...buildRecommended(plugin)]
}
