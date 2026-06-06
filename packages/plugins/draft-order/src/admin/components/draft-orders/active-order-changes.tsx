import { ExclamationCircleSolid } from "@zjedene-medusa/icons"
import { Button, Container, Divider, Heading, Text, toast } from "@zjedene-medusa/ui"
import { useLocation } from "react-router-dom"
import { useDraftOrderCancelEdit } from "../../hooks/api/draft-orders"
import { useOrderPreview } from "../../hooks/api/orders"

const DETAILS_PAGE_REGEX = /\/draft-orders\/[a-zA-Z0-9_-]+\/?$/
interface ActiveOrderChangeProps {
  orderId: string
}

export const ActiveOrderChange = ({ orderId }: ActiveOrderChangeProps) => {
  const { order: preview } = useOrderPreview(orderId)
  const location = useLocation()

  const isPending = preview?.order_change?.status === "pending"
  const isDetailsPage = DETAILS_PAGE_REGEX.test(location.pathname)

  const { mutateAsync, isPending: isMutating } =
    useDraftOrderCancelEdit(orderId)

  if (!isPending || !isDetailsPage) {
    return null
  }

  const onCancel = async () => {
    await mutateAsync(undefined, {
      onError: (e) => {
        toast.error(e.message)
      },
      onSuccess: () => {
        toast.success("Edit cancelled")
      },
    })
  }

  const actions = preview.order_change.actions
  const noActions = !actions || actions.length === 0

  return (
    <div
      className="border-b border-x px-3 py-3 -mx-4 -mt-3"
      style={{
        background:
          "repeating-linear-gradient(-45deg, rgb(212, 212, 216, 0.15), rgb(212, 212, 216,.15) 10px, transparent 10px, transparent 20px)",
      }}
    >
      <Container className="p-0 overflow-hidden">
        <div className="px-6 py-4 flex items-center gap-x-2">
          <ExclamationCircleSolid className="text-ui-fg-interactive" />
          <Heading>Edit pending</Heading>
        </div>
        <Divider variant="dashed" />
        <div className="px-6 py-4">
          <Text className="text-pretty">
            {noActions
              ? "There is a pending edit on this draft order with no changes. Click below to cancel it, or open one of the menus to start making changes."
              : "There is a pending edit on this draft order with changes. Click below to cancel it, or continue to complete the edit."}
          </Text>
        </div>
        <Divider variant="dashed" />
        <div className="bg-ui-bg-component px-6 py-4 justify-end items-center flex gap-x-2">
          {!noActions && (
            <Button
              size="small"
              variant="secondary"
              isLoading={isMutating}
              onClick={onCancel}
            >
              Continue
            </Button>
          )}
          <Button
            size="small"
            variant="secondary"
            isLoading={isMutating}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </Container>
    </div>
  )
}
