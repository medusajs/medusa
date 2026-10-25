import { Button, FocusModal, Heading, Text, toast } from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Combobox } from "../../../../../../components/inputs/combobox"
import {
  orderTagsQueryKeys,
  useBulkTagOrders,
} from "../../../../../../hooks/api/order-tags"
import { useComboboxData } from "../../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../../lib/client"

export type BulkTagOrdersAction = {
  mode: "add" | "remove"
  orderIds: string[]
}

type BulkTagOrdersModalProps = {
  action: BulkTagOrdersAction
  onClose: () => void
}

/**
 * Local-state modal for the order list's "Add tags"/"Remove tags" command
 * bar actions. The command's `action` callback captures the selected order
 * ids and opens this in "add" or "remove" mode - the actual mutation only
 * happens once the user picks a tag here and confirms.
 */
export const BulkTagOrdersModal = ({
  action,
  onClose,
}: BulkTagOrdersModalProps) => {
  const { t } = useTranslation()
  const [tagId, setTagId] = useState<string | undefined>(undefined)

  const tagOptions = useComboboxData({
    queryKey: orderTagsQueryKeys.lists(),
    queryFn: (params) => sdk.admin.orderTags.list(params),
    getOptions: (data) =>
      data.order_tags.map((tag) => ({
        label: tag.value,
        value: tag.id,
      })),
  })

  const { mutateAsync, isPending } = useBulkTagOrders({
    onSuccess: () => {
      toast.success(
        action.mode === "add"
          ? t("orders.tags.bulkAddSuccess")
          : t("orders.tags.bulkRemoveSuccess")
      )
      onClose()
    },
    onError: (e) => {
      toast.error(e.message)
    },
  })

  const handleConfirm = async () => {
    if (!tagId) {
      return
    }

    await mutateAsync({
      order_ids: action.orderIds,
      ...(action.mode === "add" ? { add: [tagId] } : { remove: [tagId] }),
    })
  }

  return (
    <FocusModal open onOpenChange={(open) => !open && onClose()}>
      <FocusModal.Content>
        <FocusModal.Header />
        <FocusModal.Body className="flex flex-1 justify-center overflow-auto px-6 py-16">
          <div className="flex w-full max-w-[560px] flex-col gap-y-8">
            <div className="flex flex-col gap-y-1">
              <Heading>
                {action.mode === "add"
                  ? t("orders.tags.addModalHeader")
                  : t("orders.tags.removeModalHeader")}
              </Heading>
              <Text size="small" className="text-ui-fg-subtle">
                {action.mode === "add"
                  ? t("orders.tags.addModalDescription")
                  : t("orders.tags.removeModalDescription")}
              </Text>
            </div>
            <Combobox
              value={tagId}
              onChange={setTagId}
              options={tagOptions.options}
              searchValue={tagOptions.searchValue}
              onSearchValueChange={tagOptions.onSearchValueChange}
              fetchNextPage={tagOptions.fetchNextPage}
              isFetchingNextPage={tagOptions.isFetchingNextPage}
              placeholder={t("orders.tags.placeholder")}
            />
          </div>
        </FocusModal.Body>
        <FocusModal.Footer>
          <div className="flex items-center justify-end gap-2">
            <Button size="small" variant="secondary" onClick={onClose}>
              {t("actions.cancel")}
            </Button>
            <Button
              size="small"
              onClick={handleConfirm}
              isLoading={isPending}
              disabled={!tagId}
            >
              {t("actions.apply")}
            </Button>
          </div>
        </FocusModal.Footer>
      </FocusModal.Content>
    </FocusModal>
  )
}
