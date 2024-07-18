import React from "react"
import Avatar from "../../atoms/avatar"

type SidebarTeamMemberProps = {
  color?: string
  user: any
}

const SidebarTeamMember: React.FC<SidebarTeamMemberProps> = ({
  color = "bg-grey-80",
  user,
}: SidebarTeamMemberProps) => {
  const fullName =
    user.first_name || user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.email

  return (
    <div className="flex w-full items-center bg-inherit px-2.5 py-1.5">
      <div className="h-[24px] w-[24px]">
        <Avatar user={user} color={color} />
      </div>
      <span className="w-40 truncate ps-2.5">{fullName}</span>
    </div>
  )
}

export default SidebarTeamMember
