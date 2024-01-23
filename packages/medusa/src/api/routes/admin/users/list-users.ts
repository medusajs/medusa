import { Type } from "class-transformer"
import { IsOptional, IsString, ValidateNested } from "class-validator"
import UserService from "../../../../services/user"
import {
  DateComparisonOperator,
  extendedFindParamsMixin,
} from "../../../../types/common"
import { IsType } from "../../../../utils"

/**
 * @oas [get] /admin/users
 * operationId: "GetUsers"
 * summary: "List Users"
 * description: "Retrieve all admin users."
 * x-authenticated: true
 * x-codegen:
 *   method: list
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.list()
 *       .then(({ users }) => {
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
export default async (req, res) => {
  const userService: UserService = req.scope.resolve("userService")
  const users = await userService.list({})

  res.status(200).json({ users })
}

export class AdminGetUsersParams extends extendedFindParamsMixin({
  limit: 20,
  offset: 0,
}) {
  /**
   * IDs to filter inventory items by.
   */
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  /**
   * Search terms to search inventory items' sku, title, and description.
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
}
