import { Avatar, Text } from "@medusajs/ui"
import { Link } from "react-router-dom"
import { useUser } from "../../../hooks/api/users"
import { useCustomer } from "../../../hooks/api/customers"

type UserLinkProps = {
  id: string
  first_name?: string | null
  last_name?: string | null
  email: string
  type?: "customer" | "user"
}

export const UserLink = ({
  id,
  first_name,
  last_name,
  email,
  type = "user",
}: UserLinkProps) => {
  const name = [first_name, last_name].filter(Boolean).join(" ")
  const fallback = name ? name.slice(0, 1) : email.slice(0, 1)
  const link = type === "user" ? `/settings/users/${id}` : `/customers/${id}`

  return (
    <Link
      to={link}
      className="transition-fg hover:text-ui-fg-subtle focus-visible:shadow-borders-focus flex w-fit items-center gap-x-2 rounded-md outline-none"
    >
      <Avatar size="2xsmall" fallback={fallback.toUpperCase()} />
      <Text size="small" leading="compact" weight="regular">
        {name || email}
      </Text>
    </Link>
  )
}

export const By = ({ id }: { id: string }) => {
  const isUser = id.startsWith("user_")
  const isCustomer = id.startsWith("cus_")
  if (!isUser && !isCustomer) {
    return null
  }

  const { user } = useUser(id, undefined, { enabled: isUser }) // todo: extend to support customers
  const { customer } = useCustomer(id, undefined, { enabled: isCustomer })

  const actor = isUser ? user : customer

  if (!actor) {
    return null
  }

  return <UserLink {...actor} />
}
