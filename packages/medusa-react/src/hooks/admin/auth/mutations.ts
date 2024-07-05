import { AdminAuthRes, AdminPostAuthReq } from "@medusajs/medusa"
import { Response } from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"
import { adminAuthKeys } from "./queries"

/**
 * This hook is used to log a User in using their credentials. If the user is authenticated successfully, 
 * the cookie is automatically attached to subsequent requests sent with other hooks.
 * 
 * @example
 * import React from "react"
 * import { useAdminLogin } from "medusa-react"
 *
 * const Login = () => {
 *   const adminLogin = useAdminLogin()
 *   // ...
 *
 *   const handleLogin = () => {
 *     adminLogin.mutate({
 *       email: "user@example.com",
 *       password: "supersecret",
 *     }, {
 *       onSuccess: ({ user }) => {
 *         console.log(user)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Login
 * 
 * @customNamespace Hooks.Admin.Auth
 * @category Mutations
 */
export const useAdminLogin = (
  options?: UseMutationOptions<Response<AdminAuthRes>, Error, AdminPostAuthReq>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    (payload: AdminPostAuthReq) => client.admin.auth.createSession(payload),
    buildOptions(queryClient, adminAuthKeys.details(), options)
  )
}

/**
 * This hook is used to Log out the user and remove their authentication session. This will only work if you're using Cookie session for authentication. If the API token is still passed in the header,
 * the user is still authorized to perform admin functionalities in other API Routes.
 * 
 * This hook requires {@link Hooks.Admin.Auth.useAdminLogin | user authentication}.
 * 
 * @example
 * import React from "react"
 * import { useAdminDeleteSession } from "medusa-react"
 * 
 * const Logout = () => {
 *   const adminLogout = useAdminDeleteSession()
 *   // ...
 * 
 *   const handleLogout = () => {
 *     adminLogout.mutate(undefined, {
 *       onSuccess: () => {
 *         // user logged out.
 *       }
 *     })
 *   }
 * 
 *   // ...
 * }
 * 
 * export default Logout
 * 
 * @customNamespace Hooks.Admin.Auth
 * @category Mutations
 */
export const useAdminDeleteSession = (
  options?: UseMutationOptions<Response<void>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation(
    () => client.admin.auth.deleteSession(),
    buildOptions(queryClient, adminAuthKeys.details(), options)
  )
}
