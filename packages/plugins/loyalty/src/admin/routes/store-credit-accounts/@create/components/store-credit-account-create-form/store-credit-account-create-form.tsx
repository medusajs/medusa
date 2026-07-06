import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Text, toast } from "@medusajs/ui"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "@medusajs/framework/zod"
import { Combobox } from "../../../../../components/combobox"
import { Form } from "../../../../../components/form"
import {
  RouteFocusModal,
  useRouteModal,
} from "../../../../../components/modals"
import { customersQueryKeys } from "../../../../../hooks/api/customers"
import { useCreateStoreCreditAccount } from "../../../../../hooks/api/store-credit-accounts"
import { useComboboxData } from "../../../../../hooks/common/use-combobox-data"
import { currencies } from "../../../../../lib/currencies"
import { sdk } from "../../../../../lib/sdk"

export const formSchema = z.object({
  currency_code: z.string().min(1, "Please select a currency"),
  customer_id: z.string().optional(),
})

export const StoreCreditAccountCreateForm = () => {
  const { handleSuccess } = useRouteModal()
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      currency_code: "",
      customer_id: "",
    },
    resolver: zodResolver(formSchema),
  })

  const { mutateAsync: createStoreCreditAccount, isPending } =
    useCreateStoreCreditAccount()

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!data.customer_id) {
      delete data.customer_id
    }

    await createStoreCreditAccount(data, {
      onSuccess: (data) => {
        toast.success(`Store credit account was successfully created.`)

        handleSuccess(`../${data.store_credit_account.id}`)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  })

  // Set up currency options
  const [currencySearchValue, setCurrencySearchValue] = useState("")

  const currencyOptions = useMemo(() => {
    const options = Object.values(currencies).map((currency) => ({
      label: `${currency.code} - ${currency.name} (${currency.symbol_native})`,
      value: currency.code.toLowerCase(),
    }))

    if (!currencySearchValue) {
      return options
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(currencySearchValue.toLowerCase())
    )
  }, [currencySearchValue])

  const {
    options: customerOptions,
    fetchNextPage,
    isFetchingNextPage,
    searchValue,
    onSearchValueChange,
    isLoading,
  } = useComboboxData({
    queryKey: customersQueryKeys.list(),
    queryFn: async (params) => {
      return sdk.admin.customer.list(params)
    },
    getOptions: (data) => {
      return (
        data.customers?.map((customer) => {
          const fullName = [customer.first_name, customer.last_name]
            .filter(Boolean)
            .join(" ")
          const label = fullName
            ? `${customer.email} (${fullName})`
            : customer.email

          return {
            label,
            value: customer.id,
          }
        }) || []
      )
    },
  })

  return (
    <RouteFocusModal.Form form={form}>
      <RouteFocusModal.Header>
        <div className="-my-2 w-full border-l"></div>
      </RouteFocusModal.Header>
      <RouteFocusModal.Body className="size-full overflow-hidden">
        <div className="flex flex-col items-center p-16">
          <div className="flex w-full max-w-[720px] flex-col gap-y-8">
            <div className="flex flex-col">
              <Heading level="h1">Create Store Credit Account</Heading>

              <Text className="text-ui-fg-subtle" size="small">
                Create a new store credit account for a customer
              </Text>
            </div>

            <div className="flex gap-x-4">
              <Form.Field
                control={form.control}
                name="currency_code"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-full">
                      <Form.Label className="font-normal">Currency</Form.Label>
                      <Form.Control>
                        <Combobox
                          value={field.value}
                          onChange={field.onChange}
                          searchValue={currencySearchValue}
                          onSearchValueChange={setCurrencySearchValue}
                          options={currencyOptions}
                          placeholder="Search for a currency..."
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />

              <Form.Field
                control={form.control}
                name="customer_id"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-full">
                      <Form.Label className="font-normal">Customer</Form.Label>
                      <Form.Control>
                        <Combobox
                          value={field.value}
                          onChange={field.onChange}
                          searchValue={searchValue}
                          onSearchValueChange={onSearchValueChange}
                          options={customerOptions}
                          placeholder="Search for a customer..."
                          fetchNextPage={fetchNextPage}
                          isFetchingNextPage={isFetchingNextPage}
                          noResultsPlaceholder={
                            isLoading
                              ? "Loading customers..."
                              : "No customers found"
                          }
                        />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            </div>
          </div>
        </div>
      </RouteFocusModal.Body>

      <RouteFocusModal.Footer>
        <RouteFocusModal.Close asChild disabled={isPending}>
          <Button variant="secondary" size="small" disabled={isPending}>
            Cancel
          </Button>
        </RouteFocusModal.Close>

        <Button
          variant="primary"
          size="small"
          onClick={handleSubmit}
          disabled={isPending}
        >
          Create
        </Button>
      </RouteFocusModal.Footer>
    </RouteFocusModal.Form>
  )
}
