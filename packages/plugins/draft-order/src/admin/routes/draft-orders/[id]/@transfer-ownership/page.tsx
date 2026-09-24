import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Heading, Hint, Label, Select, toast } from "@medusajs/ui"
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

const TransferOwnership = () => {
  const { id } = useParams()

  const { draft_order, isPending, isError, error } = useDraftOrder(id!, {
    fields: "id,customer_id,customer.*",
  })

  if (isError) {
    throw error
  }

  const isReady = !isPending && !!draft_order

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>Transfer Ownership</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description asChild>
          <span className="sr-only">
            Transfer the ownership of this draft order to a new customer
          </span>
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {isReady && <TransferOwnershipForm order={draft_order} />}
    </RouteDrawer>
  )
}

interface TransferOwnershipFormProps {
  order: HttpTypes.AdminDraftOrder
}

const TransferOwnershipForm = ({ order }: TransferOwnershipFormProps) => {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      customer_id: order.customer_id || "",
    },
    resolver: zodResolver(schema),
  })

  const { mutateAsync, isPending } = useUpdateDraftOrder(order.id)
  const { handleSuccess } = useRouteModal()

  const name = [order.customer?.first_name, order.customer?.last_name]
    .filter(Boolean)
    .join(" ")

  const currentCustomer = order.customer
    ? {
        label: name
          ? `${name} (${order.customer.email})`
          : order.customer.email,
        value: order.customer.id,
      }
    : null

  const onSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      { customer_id: data.customer_id },
      {
        onSuccess: () => {
          toast.success("Customer updated")
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
          <div className="flex items-center justify-center bg-ui-bg-component rounded-md border">
            <Illustration />
          </div>
          {currentCustomer && (
            <div className="flex flex-col space-y-3">
              <div className="flex flex-col">
                <Label size="small" weight="plus" htmlFor="current-customer">
                  Current owner
                </Label>
                <Hint>
                  The customer that is currently associated with this draft
                  order.
                </Hint>
              </div>
              <Select disabled value={currentCustomer.value}>
                <Select.Trigger id="current-customer">
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value={currentCustomer.value}>
                    {currentCustomer.label}
                  </Select.Item>
                </Select.Content>
              </Select>
            </div>
          )}
          <CustomerField
            control={form.control}
            currentCustomerId={order.customer_id}
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
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

interface CustomerFieldProps {
  currentCustomerId: string | null
  control: Control<z.infer<typeof schema>>
}

const CustomerField = ({ control, currentCustomerId }: CustomerFieldProps) => {
  const customers = useComboboxData({
    queryFn: async (params) => {
      return await sdk.admin.customer.list({
        ...params,
        id: currentCustomerId ? { $nin: [currentCustomerId] } : undefined,
      })
    },
    queryKey: ["customers"],
    getOptions: (data) => {
      return data.customers.map((customer) => {
        const name = [customer.first_name, customer.last_name]
          .filter(Boolean)
          .join(" ")

        return {
          label: name ? `${name} (${customer.email})` : customer.email,
          value: customer.id,
        }
      })
    },
  })

  return (
    <Form.Field
      name="customer_id"
      control={control}
      render={({ field }) => (
        <Form.Item className="space-y-3">
          <div className="flex flex-col">
            <Form.Label>New customer</Form.Label>
            <Form.Hint>The customer to transfer this draft order to.</Form.Hint>
          </div>
          <Form.Control>
            <Combobox
              options={customers.options}
              fetchNextPage={customers.fetchNextPage}
              isFetchingNextPage={customers.isFetchingNextPage}
              searchValue={customers.searchValue}
              onSearchValueChange={customers.onSearchValueChange}
              placeholder="Select customer"
              {...field}
            />
          </Form.Control>
          <Form.ErrorMessage />
        </Form.Item>
      )}
    />
  )
}

const Illustration = () => {
  return (
    <svg
      width="280"
      height="180"
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.00428286"
        y="-0.742904"
        width="33.5"
        height="65.5"
        rx="6.75"
        transform="matrix(0.865865 0.500278 -0.871576 0.490261 189.756 88.438)"
        fill="#D4D4D8"
        stroke="#52525B"
        strokeWidth="1.5"
      />
      <rect
        x="0.00428286"
        y="-0.742904"
        width="33.5"
        height="65.5"
        rx="6.75"
        transform="matrix(0.865865 0.500278 -0.871576 0.490261 189.756 85.4381)"
        fill="white"
        stroke="#52525B"
        strokeWidth="1.5"
      />
      <path
        d="M180.579 107.142L179.126 107.959"
        stroke="#52525B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.88"
        d="M182.305 109.546L180.257 109.534"
        stroke="#52525B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.75"
        d="M180.551 111.93L179.108 111.096"
        stroke="#52525B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.63"
        d="M176.347 112.897L176.354 111.73"
        stroke="#52525B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.5"
        d="M172.153 111.881L173.606 111.064"
        stroke="#52525B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.38"
        d="M170.428 109.478L172.476 109.489"
        stroke="#52525B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.25"
        d="M172.181 107.094L173.624 107.928"
        stroke="#52525B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        opacity="0.13"
        d="M176.386 106.126L176.379 107.294"
        stroke="#52525B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        width="12"
        height="3"
        rx="1.5"
        transform="matrix(0.865865 0.500278 -0.871576 0.490261 196.447 92.2925)"
        fill="#D4D4D8"
      />
      <rect
        x="0.00428286"
        y="-0.742904"
        width="33.5"
        height="65.5"
        rx="6.75"
        transform="matrix(0.865865 0.500278 -0.871576 0.490261 117.023 46.4147)"
        fill="#D4D4D8"
        stroke="#52525B"
        strokeWidth="1.5"
      />
      <rect
        x="0.00428286"
        y="-0.742904"
        width="33.5"
        height="65.5"
        rx="6.75"
        transform="matrix(0.865865 0.500278 -0.871576 0.490261 117.023 43.4147)"
        fill="white"
        stroke="#52525B"
        strokeWidth="1.5"
      />
      <rect
        width="12"
        height="3"
        rx="1.5"
        transform="matrix(0.865865 0.500278 -0.871576 0.490261 123.714 50.2691)"
        fill="#D4D4D8"
      />
      <rect
        width="17"
        height="3"
        rx="1.5"
        transform="matrix(0.865865 0.500278 -0.871576 0.490261 97.5557 66.958)"
        fill="#D4D4D8"
      />
      <rect
        width="12"
        height="3"
        rx="1.5"
        transform="matrix(0.865865 0.500278 -0.871576 0.490261 93.1978 69.4093)"
        fill="#D4D4D8"
      />
      <path
        d="M92.3603 63.9563C90.9277 63.1286 88.59 63.1152 87.148 63.9263C85.7059 64.7374 85.6983 66.0702 87.1308 66.8979C88.5634 67.7256 90.9011 67.7391 92.3432 66.928C93.7852 66.1168 93.7929 64.784 92.3603 63.9563ZM88.4382 66.1625C87.7221 65.7488 87.726 65.0822 88.4468 64.6767C89.1676 64.2713 90.3369 64.278 91.0529 64.6917C91.769 65.1055 91.7652 65.7721 91.0444 66.1775C90.3236 66.583 89.1543 66.5762 88.4382 66.1625Z"
        fill="#A1A1AA"
      />
      <rect
        width="17"
        height="3"
        rx="1.5"
        transform="matrix(0.865865 0.500278 -0.871576 0.490261 109.758 60.0944)"
        fill="#A1A1AA"
      />
      <rect
        width="12"
        height="3"
        rx="1.5"
        transform="matrix(0.865865 0.500278 -0.871576 0.490261 105.4 62.5457)"
        fill="#A1A1AA"
      />
      <path
        d="M104.562 57.0927C103.13 56.265 100.792 56.2515 99.3501 57.0626C97.9081 57.8738 97.9004 59.2065 99.333 60.0343C100.766 60.862 103.103 60.8754 104.545 60.0643C105.987 59.2532 105.995 57.9204 104.562 57.0927ZM103.858 58.8972L100.815 59.1265C100.683 59.1367 100.55 59.1134 100.449 59.063C100.44 59.0585 100.432 59.0545 100.425 59.05C100.339 59.0005 100.29 58.9336 100.291 58.8637L100.294 58.1201C100.294 57.9752 100.501 57.8585 100.756 57.86C101.01 57.8615 101.217 57.98 101.216 58.1256L101.214 58.5669L103.732 58.3769C103.984 58.3578 104.217 58.4584 104.251 58.603C104.286 58.7468 104.11 58.8788 103.858 58.8977L103.858 58.8972Z"
        fill="#52525B"
      />
      <g clipPath="url(#clip0_20915_38670)">
        <path
          d="M133.106 81.8022L140.49 81.8447L140.515 77.6349"
          stroke="#A1A1AA"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g clipPath="url(#clip1_20915_38670)">
        <path
          d="M143.496 87.8055L150.881 87.8481L150.905 83.6383"
          stroke="#A1A1AA"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g clipPath="url(#clip2_20915_38670)">
        <path
          d="M153.887 93.8088L161.271 93.8514L161.295 89.6416"
          stroke="#A1A1AA"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g clipPath="url(#clip3_20915_38670)">
        <path
          d="M126.114 89.1912L118.729 89.1486L118.705 93.3584"
          stroke="#A1A1AA"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g clipPath="url(#clip4_20915_38670)">
        <path
          d="M136.504 95.1945L129.12 95.1519L129.095 99.3617"
          stroke="#A1A1AA"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g clipPath="url(#clip5_20915_38670)">
        <path
          d="M146.894 101.198L139.51 101.155L139.486 105.365"
          stroke="#A1A1AA"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_20915_38670">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="matrix(0.865865 0.500278 -0.871576 0.490261 138.36 74.6508)"
          />
        </clipPath>
        <clipPath id="clip1_20915_38670">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="matrix(0.865865 0.500278 -0.871576 0.490261 148.75 80.6541)"
          />
        </clipPath>
        <clipPath id="clip2_20915_38670">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="matrix(0.865865 0.500278 -0.871576 0.490261 159.141 86.6575)"
          />
        </clipPath>
        <clipPath id="clip3_20915_38670">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="matrix(0.865865 0.500278 -0.871576 0.490261 120.928 84.4561)"
          />
        </clipPath>
        <clipPath id="clip4_20915_38670">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="matrix(0.865865 0.500278 -0.871576 0.490261 131.318 90.4594)"
          />
        </clipPath>
        <clipPath id="clip5_20915_38670">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="matrix(0.865865 0.500278 -0.871576 0.490261 141.709 96.4627)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}

const schema = z.object({
  customer_id: z.string().min(1),
})

export default TransferOwnership
