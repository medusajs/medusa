import * as RadixAvatar from "@radix-ui/react-avatar"
import clsx from "clsx"
import React from "react"
import Spinner from "../spinner"

type AvatarProps = {
  user?: {
    img?: string
    first_name?: string
    last_name?: string
    email?: string
  }
  font?: string
  color?: string
  isLoading?: boolean
}

const Avatar: React.FC<AvatarProps> = ({
  user,
  font = "inter-small-semibold",
  color = "bg-grey-80",
  isLoading = false,
}) => {
  let username: string

  if (user?.first_name && user?.last_name) {
    username = user.first_name + " " + user.last_name
  } else if (user?.email) {
    username = user.email
  } else {
    username = "Medusa user"
  }

  return (
    <RadixAvatar.Root
      className={clsx(
        "rounded-circle h-full w-full select-none items-center justify-center overflow-hidden",
        color
      )}
    >
      <RadixAvatar.Image
        src={user?.img}
        alt={username}
        className="rounded-circle h-full w-full object-cover"
      />
      <RadixAvatar.Fallback
        className={clsx(
          "text-grey-0 rounded-circle flex h-full w-full items-center justify-center bg-inherit",
          font
        )}
      >
        {isLoading ? (
          <Spinner size="small" variant="primary" />
        ) : (
          username.slice(0, 1).toUpperCase()
        )}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  )
}

export default Avatar
