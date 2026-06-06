import { XMark } from "@zjedene-medusa/icons"
import { HttpTypes } from "@zjedene-medusa/types"
import { Avatar, IconButton, Skeleton, Text } from "@zjedene-medusa/ui"
import { useCustomer } from "../../hooks/api/customers"

interface CustomerCardProps {
  customerId: string
  onRemove?: () => void | Promise<void>
}

export const CustomerCard = ({ customerId, onRemove }: CustomerCardProps) => {
  const { customer, isPending, isError, error } = useCustomer(customerId)

  if (isError) {
    throw error
  }

  const isReady = !isPending && !!customer

  return (
    <div className="px-3 py-2 rounded-lg bg-ui-bg-component shadow-elevation-card-rest flex items-center gap-4">
      {!isReady ? <LoadingState /> : <CustomerInfo customer={customer} />}
      {onRemove && (
        <IconButton
          className="shrink-0"
          variant="transparent"
          size="small"
          onClick={onRemove}
          type="button"
        >
          <XMark />
        </IconButton>
      )}
    </div>
  )
}

const LoadingState = () => {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="w-7 h-7 rounded-full" />
      <div className="flex flex-col gap-y-1">
        <Skeleton className="w-20 h-5" />
        <Skeleton className="w-16 h-5" />
      </div>
    </div>
  )
}

const CustomerInfo = ({ customer }: { customer: HttpTypes.AdminCustomer }) => {
  const name = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(" ")
  const fallback = name ? name[0] : customer.email[0]

  return (
    <div className="flex items-center gap-4 flex-1">
      <Avatar size="small" fallback={fallback} className="w-6 h-6" />
      <div className="flex flex-col flex-1 overflow-hidden">
        {name && (
          <Text
            leading="compact"
            size="small"
            weight="plus"
            className="truncate"
          >
            {name}
          </Text>
        )}
        <Text
          leading="compact"
          size="small"
          className="text-ui-fg-subtle truncate"
        >
          {customer.email}
        </Text>
      </div>
    </div>
  )
}
