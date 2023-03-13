import React from "react"
import Avatar from "../../../atoms/avatar"

type ByLineProps = {
  user?: { first_name: string; last_name: string; email: string }
}

export const ByLine: React.FC<ByLineProps> = ({ user }) => {
  if (!user) {
    return null
  }

  const { first_name, last_name, email } = user

  const by =
    !first_name && !last_name ? email : `${first_name || ""} ${last_name || ""}`

  return (
    <div className="inter-small-regular text-grey-50 flex items-center">
      By
      <span className="w-base h-base mx-xsmall">
        <Avatar user={user} font="inter-xsmall-semibold" />
      </span>
      {by}
    </div>
  )
}
