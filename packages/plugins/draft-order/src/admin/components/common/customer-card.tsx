import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Avatar, IconButton, Skeleton, Text } from "@medusajs/ui"
import { useCustomer } from "@medusajs/dashboard/hooks"

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
    <div className="bg-ui-bg-component shadow-elevation-card-rest flex items-center gap-4 rounded-lg px-3 py-2">
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
      <Skeleton className="h-7 w-7 rounded-full" />
      <div className="flex flex-col gap-y-1">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
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
    <div className="flex flex-1 items-center gap-4">
      <Avatar size="small" fallback={fallback} className="h-6 w-6" />
      <div className="flex flex-1 flex-col overflow-hidden">
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
