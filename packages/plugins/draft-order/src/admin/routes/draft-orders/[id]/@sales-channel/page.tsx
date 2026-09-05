import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, toast } from "@medusajs/ui"
import { Control, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { z } from "zod"

import { Form } from "../../../../components/common/form"
import { KeyboundForm } from "../../../../components/common/keybound-form"
import { Combobox } from "../../../../components/inputs/combobox"
import { RouteDrawer, useRouteModal } from "../../../../components/modals"
import {
  useDraftOrder,
  useUpdateDraftOrder,
} from "../../../../hooks/api/draft-orders"
import { useComboboxData } from "../../../../hooks/common/use-combobox-data"
import { sdk } from "../../../../lib/queries/sdk"

const SalesChannel = () => {
  const { t } = useTranslation()
  const { id } = useParams()

  const { draft_order, isPending, isError, error } = useDraftOrder(
    id!,
    {
      fields: "+sales_channel_id",
    },
    {
      enabled: !!id,
    }
  )

  if (isError) {
    throw error
  }

  const ISrEADY = !!draft_order && !isPending

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("salesChannels.editSalesChannel")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description asChild>
          <span className="sr-only">
            {t("draftOrders.salesChannel.editHint")}
          </span>
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {ISrEADY && <SalesChannelForm order={draft_order} />}
    </RouteDrawer>
  )
}

interface SalesChannelFormProps {
  order: HttpTypes.AdminOrder
}

const SalesChannelForm = ({ order }: SalesChannelFormProps) => {
  const { t } = useTranslation()
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      sales_channel_id: order.sales_channel_id || "",
    },
    resolver: zodResolver(schema),
  })

  const { mutateAsync, isPending } = useUpdateDraftOrder(order.id)
  const { handleSuccess } = useRouteModal()

  const onSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        sales_channel_id: data.sales_channel_id,
      },
      {
        onSuccess: () => {
          toast.success(
            t("orders.activity.events.update_order.sales_channel_id")
          )
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={onSubmit}
      >
        <RouteDrawer.Body className="flex flex-col gap-y-6 overflow-y-auto">
          <SalesChannelField control={form.control} order={order} />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex justify-end gap-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}

interface SalesChannelFieldProps {
  order: HttpTypes.AdminOrder
  control: Control<z.infer<typeof schema>>
}

const SalesChannelField = ({ control, order }: SalesChannelFieldProps) => {
  const { t } = useTranslation()
  const salesChannels = useComboboxData({
    queryFn: async (params) => {
      return await sdk.admin.salesChannel.list(params)
    },
    queryKey: ["sales-channels"],
    getOptions: (data) => {
      return data.sales_channels.map((salesChannel) => ({
        label: salesChannel.name,
        value: salesChannel.id,
      }))
    },
    defaultValue: order.sales_channel_id || undefined,
  })

  return (
    <Form.Field
      control={control}
      name="sales_channel_id"
      render={({ field }) => {
        return (
          <Form.Item>
            <Form.Label>{t("fields.salesChannel")}</Form.Label>
            <Form.Control>
              <Combobox
                options={salesChannels.options}
                fetchNextPage={salesChannels.fetchNextPage}
                isFetchingNextPage={salesChannels.isFetchingNextPage}
                searchValue={salesChannels.searchValue}
                onSearchValueChange={salesChannels.onSearchValueChange}
                placeholder={t("draftOrders.placeholders.selectSalesChannel")}
                {...field}
              />
            </Form.Control>
            <Form.ErrorMessage />
          </Form.Item>
        )
      }}
    />
  )
}

const schema = z.object({
  sales_channel_id: z.string().min(1),
})

export default SalesChannel
