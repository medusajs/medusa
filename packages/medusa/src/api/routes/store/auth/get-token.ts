import jwt from "jsonwebtoken"
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import AuthService from "../../../../services/auth"
import { validator } from "../../../../utils/validator"
import { StorePostAuthReq } from "./create-session"

/**
 * @oas [post] /store/auth/token
 * operationId: "PostToken"
 * summary: "Customer Login (JWT)"
 * x-authenticated: false
 * description: "After a successful login, a JWT token is returned, which can be used to send authenticated requests."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostAuthReq"
 * x-codegen:
 *   method: getToken
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.auth.getToken({
 *         email: 'user@example.com',
 *         password: 'supersecret'
 *       })
 *       .then(({ access_token }) => {
 *         console.log(access_token);
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X POST '{backend_url}/store/auth/token' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "email": "user@example.com",
 *         "password": "supersecret"
 *       }'
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          $ref: "#/components/schemas/StoreBearerAuthRes"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/incorrect_credentials"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const {
    projectConfig: { jwt_secret },
  } = req.scope.resolve("configModule")
  if (!jwt_secret) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Please configure jwt_secret in your environment"
    )
  }
  const validated = await validator(StorePostAuthReq, req.body)

  const authService: AuthService = req.scope.resolve("authService")
  const manager: EntityManager = req.scope.resolve("manager")
  const result = await manager.transaction(async (transactionManager) => {
    return await authService
      .withTransaction(transactionManager)
      .authenticateCustomer(validated.email, validated.password)
  })

  if (result.success && result.customer) {
    // Create jwt token to send back
    const token = jwt.sign(
      { customer_id: result.customer.id, domain: "store" },
      jwt_secret,
      {
        expiresIn: "30d",
      }
    )

    res.json({ access_token: token })
  } else {
    res.sendStatus(401)
  }
}
