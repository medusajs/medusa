import React from "react"
import Avatar from "../../atoms/avatar"

type CustomerAvatarItemProps = {
  color?: string
  customer: {
    first_name?: string
    last_name?: string
    email: string
  }
}

const CustomerAvatarItem: React.FC<CustomerAvatarItemProps> = ({
  color = "bg-grey-80",
  customer,
}: CustomerAvatarItemProps) => {
  const identifier =
    customer.first_name || customer.last_name
      ? `${customer.first_name} ${customer.last_name}`
      : customer.email
      ? customer.email
      : "-"

  return (
    <div className="flex w-full items-center py-1.5">
      <div className="h-[24px] w-[24px]">
        <Avatar user={customer} color={color} />
      </div>
      <span className="w-40 truncate ps-2.5">{identifier}</span>
    </div>
  )
}

export default CustomerAvatarItem
