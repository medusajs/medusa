import {
  AdminDeleteUserRes,
  AdminResetPasswordRequest,
  AdminResetPasswordTokenRequest,
  AdminUserRes,
} from "@medusajs/medusa"
import {
  AdminCreateUserPayload,
  AdminUpdateUserPayload,
  Response,
} from "@medusajs/medusa-js"
import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query"
import { adminUserKeys } from "./queries"
import { useMedusa } from "../../../contexts/medusa"
import { buildOptions } from "../../utils/buildOptions"

/**
 * This hook creates an admin user. The user has the same privileges as all admin users, and will be able to
 * authenticate and perform admin functionalities right after creation.
 *
 * @example
 * import React from "react"
 * import { useAdminCreateUser } from "medusa-react"
 *
 * const CreateUser = () => {
 *   const createUser = useAdminCreateUser()
 *   // ...
 *
 *   const handleCreateUser = () => {
 *     createUser.mutate({
 *       email: "user@example.com",
 *       password: "supersecret",
 *     }, {
 *       onSuccess: ({ user }) => {
 *         console.log(user.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default CreateUser
 *
 * @customNamespace Hooks.Admin.Users
 * @category Mutations
 */
export const useAdminCreateUser = (
  options?: UseMutationOptions<
    Response<AdminUserRes>,
    Error,
    AdminCreateUserPayload
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminCreateUserPayload) =>
      client.admin.users.create(payload),
    ...buildOptions(queryClient, adminUserKeys.lists(), options),
  })
}

/**
 * This hook updates an admin user's details.
 *
 * @example
 * import React from "react"
 * import { useAdminUpdateUser } from "medusa-react"
 *
 * type Props = {
 *   userId: string
 * }
 *
 * const User = ({ userId }: Props) => {
 *   const updateUser = useAdminUpdateUser(userId)
 *   // ...
 *
 *   const handleUpdateUser = (
 *     firstName: string
 *   ) => {
 *     updateUser.mutate({
 *       first_name: firstName,
 *     }, {
 *       onSuccess: ({ user }) => {
 *         console.log(user.first_name)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default User
 *
 * @customNamespace Hooks.Admin.Users
 * @category Mutations
 */
export const useAdminUpdateUser = (
  /**
   * The user's ID.
   */
  id: string,
  options?: UseMutationOptions<
    Response<AdminUserRes>,
    Error,
    AdminUpdateUserPayload
  >
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminUpdateUserPayload) =>
      client.admin.users.update(id, payload),
    ...buildOptions(
      queryClient,
      [adminUserKeys.lists(), adminUserKeys.detail(id)],
      options
    ),
  })
}

/**
 * This hook deletes a user. Once deleted, the user will not be able to authenticate or perform admin functionalities.
 *
 * @example
 * import React from "react"
 * import { useAdminDeleteUser } from "medusa-react"
 *
 * type Props = {
 *   userId: string
 * }
 *
 * const User = ({ userId }: Props) => {
 *   const deleteUser = useAdminDeleteUser(userId)
 *   // ...
 *
 *   const handleDeleteUser = () => {
 *     deleteUser.mutate(void 0, {
 *       onSuccess: ({ id, object, deleted }) => {
 *         console.log(id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default User
 *
 * @customNamespace Hooks.Admin.Users
 * @category Mutations
 */
export const useAdminDeleteUser = (
  /**
   * The user's ID.
   */
  id: string,
  options?: UseMutationOptions<Response<AdminDeleteUserRes>, Error, void>
) => {
  const { client } = useMedusa()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.admin.users.delete(id),
    ...buildOptions(
      queryClient,
      [adminUserKeys.detail(id), adminUserKeys.lists()],
      options
    ),
  })
}

/**
 * This hook resets the password of an admin user using their reset password token. You must generate a reset password token first
 * for the user using the {@link useAdminSendResetPasswordToken} hook, then use that token to reset the password in this hook.
 *
 * @example
 * import React from "react"
 * import { useAdminResetPassword } from "medusa-react"
 *
 * const ResetPassword = () => {
 *   const resetPassword = useAdminResetPassword()
 *   // ...
 *
 *   const handleResetPassword = (
 *     token: string,
 *     password: string
 *   ) => {
 *     resetPassword.mutate({
 *       token,
 *       password,
 *     }, {
 *       onSuccess: ({ user }) => {
 *         console.log(user.id)
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default ResetPassword
 *
 * @customNamespace Hooks.Admin.Users
 * @category Mutations
 */
export const useAdminResetPassword = (
  options?: UseMutationOptions<
    Response<AdminUserRes>,
    Error,
    AdminResetPasswordRequest
  >
) => {
  const { client } = useMedusa()
  return useMutation({
    mutationFn: (payload: AdminResetPasswordRequest) =>
      client.admin.users.resetPassword(payload),
    ...options,
  })
}

/**
 * This hook generates a password token for an admin user with a given email. This also triggers the `user.password_reset` event. So, if you have a Notification Service installed
 * that can handle this event, a notification, such as an email, will be sent to the user. The token is triggered as part of the `user.password_reset` event's payload.
 * That token must be used later to reset the password using the {@link useAdminResetPassword} hook.
 *
 * @example
 * import React from "react"
 * import { useAdminSendResetPasswordToken } from "medusa-react"
 *
 * const Login = () => {
 *   const requestPasswordReset = useAdminSendResetPasswordToken()
 *   // ...
 *
 *   const handleResetPassword = (
 *     email: string
 *   ) => {
 *     requestPasswordReset.mutate({
 *       email
 *     }, {
 *       onSuccess: () => {
 *         // successful
 *       }
 *     })
 *   }
 *
 *   // ...
 * }
 *
 * export default Login
 *
 * @customNamespace Hooks.Admin.Users
 * @category Mutations
 */
export const useAdminSendResetPasswordToken = (
  options?: UseMutationOptions<
    Response<void>,
    Error,
    AdminResetPasswordTokenRequest
  >
) => {
  const { client } = useMedusa()
  return useMutation({
    mutationFn: (payload: AdminResetPasswordTokenRequest) =>
      client.admin.users.sendResetPasswordToken(payload),
    ...options,
  })
}
