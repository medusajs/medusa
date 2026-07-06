import { FindParams, SelectParams } from "../../common"

export interface AdminPropertyLabelParams extends SelectParams {}

export interface AdminPropertyLabelListParams extends FindParams {
  entity?: string | undefined
  property?: string | undefined
  q?: string | undefined
}
