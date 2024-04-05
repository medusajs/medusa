import { RepositoryTransformOptions } from "../common"

export interface ProductCategoryTransformOptions
  extends RepositoryTransformOptions {
  includeDescendantsTree?: boolean
  includeAncestorsTree?: boolean
}
