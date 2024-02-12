import { IsNumber, IsOptional, IsString } from "class-validator"

import { Type } from "class-transformer"
import { Request, Response } from "express"
import customerController from "../../../../controllers/customers"
import { AdminListCustomerSelector } from "../../../../types/customers"

/**
 * @oas [get] /admin/customers
 * operationId: "GetCustomers"
 * summary: "List Customers"
 * description: "Retrieve a list of Customers. The customers can be filtered by fields such as `q` or `groups`. The customers can also be paginated."
 * x-authenticated: true
 * parameters:
 *   - (query) limit=50 {integer} The number of customers to return.
 *   - (query) offset=0 {integer} The number of customers to skip when retrieving the customers.
 *   - (query) expand {string} Comma-separated relations that should be expanded in the returned customers.
 *   - (query) fields {string} Comma-separated fields that should be included in the returned customers.
 *   - (query) q {string} term to search customers' email, first_name, and last_name fields.
 *   - (query) has_account {boolean} Filter customers by whether they have an account.
 *   - (query) order {string} A field to sort-order the retrieved customers by.
 *   - in: query
 *     name: groups
 *     style: form
 *     explode: false
 *     description: Filter by customer group IDs.
 *     schema:
 *       type: array
 *       items:
 *         type: string
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
 * x-codegen:
 *   method: list
 *   queryParams: AdminGetCustomersParams
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.customers.list()
 *       .then(({ customers, limit, offset, count }) => {
 *         console.log(customers.length);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminCustomers } from "medusa-react"
 *
 *       const Customers = () => {
 *         const { customers, isLoading } = useAdminCustomers()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {customers && !customers.length && (
 *               <span>No customers</span>
 *             )}
 *             {customers && customers.length > 0 && (
 *               <ul>
 *                 {customers.map((customer) => (
 *                   <li key={customer.id}>{customer.first_name}</li>
 *                 ))}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default Customers
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/customers' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Customers
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCustomersListRes"
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
  const result = await customerController.listAndCount(
    req.scope,
    req.query,
    req.body
  )

  res.json(result)
}

/**
 * Parameters used to filter and configure the pagination of the retrieved customers.
 */
export class AdminGetCustomersParams extends AdminListCustomerSelector {
  /**
   * {@inheritDoc FindPaginationParams.limit}
   * @defaultValue 50
   */
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 50

  /**
   * {@inheritDoc FindPaginationParams.offset}
   * @defaultValue 0
   */
  @IsOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0

  /**
   * {@inheritDoc FindParams.expand}
   */
  @IsString()
  @IsOptional()
  expand?: string

  /**
   * {@inheritDoc FindParams.fields}
   */
  @IsString()
  @IsOptional()
  fields?: string
}
