import { PencilSquare, Trash } from "@medusajs/icons"
import { ReturnReason } from "@medusajs/medusa"
import { Badge, Container, Text, usePrompt } from "@medusajs/ui"
import { useAdminDeleteReturnReason, useAdminReturnReasons } from "medusa-react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { NoRecords } from "../../../../../components/common/empty-table-content"
import { Skeleton } from "../../../../../components/common/skeleton"

export const ReturnReasonOverview = () => {
  const { return_reasons, isLoading, isError, error } = useAdminReturnReasons()

  if (isLoading) {
    return (
      <Container className="divide-y p-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <ItemSkeleton key={i} />
        ))}
      </Container>
    )
  }

  if (!return_reasons || !return_reasons.length) {
    return (
      <Container className="p-0">
        <NoRecords />
      </Container>
    )
  }

  if (isError) {
    throw error
  }

  return (
    <Container className="divide-y p-0">
      {return_reasons.map((reason) => (
        <Item key={reason.id} reason={reason} />
      ))}
    </Container>
  )
}

const Item = ({ reason }: { reason: ReturnReason }) => {
  const { t } = useTranslation()
  const prompt = usePrompt()

  const { mutateAsync } = useAdminDeleteReturnReason(reason.id)

  const handleDelete = async () => {
    const res = await prompt({
      title: t("general.areYouSure"),
      description: t("returnReasons.deleteReasonWarning", {
        label: reason.label,
      }),
      confirmText: t("actions.delete"),
      cancelText: t("actions.cancel"),
    })

    if (!res) {
      return
    }

    await mutateAsync()
  }

  return (
    <div className="grid grid-cols-2 items-start px-6 py-4">
      <Badge size="2xsmall" className="w-fit">
        {reason.value}
      </Badge>
      <div className="grid grid-cols-[1fr_28px] items-start gap-x-3">
        <div>
          <Text size="small" leading="compact" weight="plus">
            {reason.label}
          </Text>
          <Text size="small" className="text-ui-fg-subtle text-pretty">
            {reason.description}
          </Text>
        </div>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: `${reason.id}/edit`,
                  icon: <PencilSquare />,
                },
              ],
            },
            {
              actions: [
                {
                  label: t("actions.delete"),
                  onClick: handleDelete,
                  icon: <Trash />,
                },
              ],
            },
          ]}
        />
      </div>
    </div>
  )
}

const ItemSkeleton = () => {
  return (
    <div className="grid grid-cols-2 items-start px-6 py-4">
      <Skeleton className="h-5 w-[90px]" />
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="mt-2 w-3/4" />
        </div>
        <Skeleton className="h-7 w-7" />
      </div>
    </div>
  )
}
