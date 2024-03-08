import { OperatorMap } from "@medusajs/types"
import { Type } from "class-transformer"
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import { FindParams, extendedFindParamsMixin } from "../../../types/common"
import { OperatorMapValidator } from "../../../types/validators/operator-map"
import { ApiKeyType } from "@medusajs/utils"

export class AdminGetApiKeysApiKeyParams extends FindParams {}
/**
 * Parameters used to filter and configure the pagination of the retrieved api keys.
 */
export class AdminGetApiKeysParams extends extendedFindParamsMixin({
  limit: 50,
  offset: 0,
}) {
  /**
   * Search parameter for api keys.
   */
  @IsString({ each: true })
  @IsOptional()
  id?: string | string[]

  /**
   * Filter by title
   */
  @IsString({ each: true })
  @IsOptional()
  title?: string | string[]

  /**
   * Filter by token
   */
  @IsString({ each: true })
  @IsOptional()
  token?: string | string[]

  /**
   * Filter by type
   */
  @IsEnum(ApiKeyType, { each: true })
  @IsOptional()
  type?: ApiKeyType

  // Additional filters from BaseFilterable
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetApiKeysParams)
  $and?: AdminGetApiKeysParams[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AdminGetApiKeysParams)
  $or?: AdminGetApiKeysParams[]
}

export class AdminPostApiKeysReq {
  @IsString()
  title: string

  @IsEnum(ApiKeyType, {})
  type: ApiKeyType
}

export class AdminPostApiKeysApiKeyReq {
  @IsString()
  title: string
}

export class AdminRevokeApiKeysApiKeyReq {
  @IsOptional()
  @IsNumber()
  revoke_in?: number
}

export class AdminDeleteApiKeysApiKeyReq {}
