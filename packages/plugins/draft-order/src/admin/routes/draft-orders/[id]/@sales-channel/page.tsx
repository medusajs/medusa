import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@zjedene-medusa/types"
import { Button, Heading, toast } from "@zjedene-medusa/ui"
import { Control, useForm } from "react-hook-form"
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
          <Heading>Edit Sales Channel</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description asChild>
          <span className="sr-only">
            Update which sales channel the draft order is associated with
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
          toast.success("Sales channel updated")
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
                Cancel
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isPending}>
              Save
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
            <Form.Label>Sales Channel</Form.Label>
            <Form.Control>
              <Combobox
                options={salesChannels.options}
                fetchNextPage={salesChannels.fetchNextPage}
                isFetchingNextPage={salesChannels.isFetchingNextPage}
                searchValue={salesChannels.searchValue}
                onSearchValueChange={salesChannels.onSearchValueChange}
                placeholder="Select sales channel"
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
