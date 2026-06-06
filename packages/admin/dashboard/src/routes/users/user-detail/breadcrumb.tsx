import { HttpTypes } from "@zjedene-medusa/types"
import { UIMatch } from "react-router-dom"
import { useUser } from "../../../hooks/api/users"

type UserDetailBreadcrumbProps = UIMatch<HttpTypes.AdminUserResponse>

export const UserDetailBreadcrumb = (props: UserDetailBreadcrumbProps) => {
  const { id } = props.params || {}

  const { user } = useUser(id!, undefined, {
    initialData: props.data,
    enabled: Boolean(id),
  })

  if (!user) {
    return null
  }

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ")

  const display = name || user.email

  return <span>{display}</span>
}
