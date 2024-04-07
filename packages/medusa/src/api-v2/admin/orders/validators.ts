import { IsOptional, IsString } from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"

export class AdminGetOrdersOrderParams extends FindParams {}
/**
 * Parameters used to filter and configure the pagination of the retrieved order.
 */
export class AdminGetOrdersParams extends extendedFindParamsMixin({
  limit: 15,
  offset: 0,
}) {
  /**
   * Search parameter for order.
   */
  @IsString({ each: true })
  @IsOptional()
  id?: string | string[]
}

export class AdminDeleteOrdersOrderReq {}
