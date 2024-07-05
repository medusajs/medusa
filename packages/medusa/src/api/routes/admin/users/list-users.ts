import { Type } from "class-transformer"
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator"
import { Request, Response } from "express"
import UserService from "../../../../services/user"
import {
  DateComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"
import { UserRole } from "../../../../types/user"
import { IsType } from "../../../../utils"

/**
 * @oas [get] /admin/users
 * operationId: "GetUsers"
 * summary: "List Users"
 * description: "Retrieves a list of users. The users can be filtered by fields such as `q` or `email`. The users can also be sorted or paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) email {string} Filter by email.
 *   - (query) first_name {string} Filter by first name.
 *   - (query) last_name {string} Filter by last name.
 *   - (query) q {string} Term used to search users' first name, last name, and email.
 *   - (query) order {string} A user field to sort-order the retrieved users by.
 *   - in: query
 *     name: id
 *     style: form
 *     explode: false
 *     description: Filter by user IDs.
 *     schema:
 *       oneOf:
 *         - type: string
 *           description: ID of the user.
 *         - type: array
 *           items:
 *             type: string
 *             description: ID of a user.
 *   - in: query
 *     name: created_at
 *     description: Filter by a creation date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Filter by an update date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: deleted_at
 *     description: Filter by a deletion date range.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - (query) offset=0 {integer} The number of users to skip when retrieving the users.
 *   - (query) limit=20 {integer} Limit the number of users returned.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned users.
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetUsersParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.list()
 *       .then(({ users, limit, offset, count }) => {
 *         console.log(users.length);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminUsers } from "medusa-react"
 *
 *       const Users = () => {
 *         const { users, isLoading } = useAdminUsers()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {users && !users.length && <span>No Users</span>}
 *             {users && users.length > 0 && (
 *               <ul>
 *                 {users.map((user) => (
 *                   <li key={user.id}>{user.email}</li>
 *                 ))}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default Users
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/users' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Users
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminUsersListRes"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
export default async (req: Request, res: Response) => {
  const userService: UserService = req.scope.resolve("userService")

  const listConfig = req.listConfig
  const filterableFields = req.filterableFields

  const [users, count] = await userService.listAndCount(
    filterableFields,
    listConfig
  )

  res
    .status(200)
    .json({ users, count, offset: listConfig.skip, limit: listConfig.take })
}

/**
 * Parameters used to filter and configure the pagination of the retrieved users.
 */
export class AdminGetUsersParams extends extendedFindParamsMixin({
  limit: 50,
  offset: 0,
}) {
  /**
   * IDs to filter users by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * Search terms to search users' first name, last name, and email.
   */
  @IsOptional()
  @IsString()
  q?: string

  /**
   * The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
   */
  @IsString()
  @IsOptional()
  order?: string

  /**
   * Date filters to apply on the users' `update_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  /**
   * Date filters to apply on the customer users' `created_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  /**
   * Date filters to apply on the users' `deleted_at` date.
   */
  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator

  /**
   * Filter to apply on the users' `email` field.
   */
  @IsOptional()
  @IsString()
  email?: string

  /**
   * Filter to apply on the users' `first_name` field.
   */
  @IsOptional()
  @IsString()
  first_name?: string

  /**
   * Filter to apply on the users' `last_name` field.
   */
  @IsOptional()
  @IsString()
  last_name?: string

  /**
   * Filter to apply on the users' `role` field.
   */
  @IsOptional()
  @IsEnum(UserRole, { each: true })
  role?: UserRole

  /**
   * Comma-separated fields that should be included in the returned users.
   */
  @IsOptional()
  @IsString()
  fields?: string
}
