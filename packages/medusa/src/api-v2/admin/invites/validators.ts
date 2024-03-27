import { Type } from "class-transformer"
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator"
import {
  DateComparisonOperator,
  FindParams,
  extendedFindParamsMixin,
} from "../../../types/common"
import { IsType } from "../../../utils"

export class AdminGetInvitesInviteParams extends FindParams {}

export class AdminGetInvitesParams extends extendedFindParamsMixin({
  limit: 50,
  offset: 0,
}) {
  /**
   * IDs to filter invites by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsString()
  @IsOptional()
  order?: string

  /**
   * Date filters to apply on the invites' `update_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  /**
   * Date filters to apply on the customer invites' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the invites' `deleted_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator

  /**
   * Filter to apply on the invites' `email` field.
   */
  @IsOptional()
  @IsString()
  email?: string

  /**
   * Comma-separated fields that should be included in the returned invites.
   */
  @IsOptional()
  @IsString()
  fields?: string
}

export class AdminCreateInviteRequest {
  @IsEmail()
  email: string
}

/**
 * @schema AdminPostInvitesInviteAcceptReq
 * type: object
 * description: "The details of the invite to be accepted."
 * required:
 *   - token
 *   - user
 * properties:
 *   token:
 *     description: "The token of the invite to accept. This is a unique token generated when the invite was created or resent."
 *     type: string
 *   user:
 *     description: "The details of the user to create."
 *     type: object
 *     required:
 *       - first_name
 *       - last_name
 *       - password
 *     properties:
 *       first_name:
 *         type: string
 *         description: the first name of the User
 *       last_name:
 *         type: string
 *         description: the last name of the User
 *       password:
 *         description: The password for the User
 *         type: string
 *         format: password
 */
export class AdminPostInvitesInviteAcceptReq {
  /**
   * The invite's first name.
   * If email is not passed, we default to using the email of the invite.
   */
  @IsString()
  @IsOptional()
  email: string
  /**
   * The invite's first name.
   */
  @IsString()
  @IsOptional()
  first_name: string

  /**
   * The invite's last name.
   */
  @IsString()
  @IsOptional()
  last_name: string
}

export class AdminPostInvitesInviteAcceptParams {
  @IsString()
  @IsNotEmpty()
  token: string

  @IsOptional()
  expand = undefined
}
