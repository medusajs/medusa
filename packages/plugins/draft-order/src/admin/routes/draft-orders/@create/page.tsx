import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import {
  Button,
  Divider,
  Heading,
  Hint,
  Input,
  Label,
  Switch,
  toast,
} from "@medusajs/ui"
import { Fragment, useCallback, useMemo } from "react"
import { Control, useForm, UseFormSetValue, useWatch } from "react-hook-form"
import { z } from "zod"
import { AddressCard } from "../../../components/common/address-card"
import { ConditionalTooltip } from "../../../components/common/conditional-tooltip"
import { CustomerCard } from "../../../components/common/customer-card"
import { Form } from "../../../components/common/form"
import { KeyboundForm } from "../../../components/common/keybound-form"
import { Combobox } from "../../../components/inputs/combobox"
import { CountrySelect } from "../../../components/inputs/country-select"
import { RouteFocusModal, useRouteModal } from "../../../components/modals"
import { useCreateDraftOrder } from "../../../hooks/api/draft-orders"
import { useComboboxData } from "../../../hooks/common/use-combobox-data"
import { sdk } from "../../../lib/queries/sdk"
import { addressSchema } from "../../../lib/schemas/address"
import { getFormattedAddress } from "../../../lib/utils/address-utils"
import { useCustomer } from "../../../hooks/api/customers"

const Create = () => {
  return (
    <RouteFocusModal>
      <CreateForm />
    </RouteFocusModal>
  )
}

const CreateForm = () => {
  const { handleSuccess } = useRouteModal()

  const regions = useComboboxData({
    queryFn: async (params) => {
      return await sdk.admin.region.list(params)
    },
    queryKey: ["regions"],
    getOptions: (data) => {
      return data.regions.map((region) => ({
        label: region.name,
        value: region.id,
      }))
    },
  })

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
  })

  const formValues = useMemo(
    () => ({
      region_id:
        regions.count === 1 && regions.options?.[0]
          ? regions.options?.[0].value
          : "",
      sales_channel_id:
        salesChannels.count === 1 && salesChannels.options?.[0]
          ? salesChannels.options?.[0].value
          : "",
      customer_id: "",
      email: "",
      shipping_address_id: "",
      shipping_address: initialAddress,
      billing_address_id: "",
      billing_address: null,
      same_as_shipping: true,
    }),
    [regions.count, regions.options, salesChannels.count, salesChannels.options]
  )

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: formValues,
    values: formValues,
    resetOptions: { keepDirtyValues: true },
    resolver: zodResolver(schema),
  })

  const { mutateAsync } = useCreateDraftOrder()

  const onSubmit = form.handleSubmit(
    async (data) => {
      const billingAddress = data.same_as_shipping
        ? data.shipping_address
        : data.billing_address

      await mutateAsync(
        {
          region_id: data.region_id,
          sales_channel_id: data.sales_channel_id,
          customer_id: data.customer_id || undefined,
          email: !data.customer_id ? data.email : undefined,
          shipping_address: data.shipping_address,
          billing_address: billingAddress!,
        },
        {
          onSuccess: (response) => {
            handleSuccess(`/draft-orders/${response.draft_order.id}`)
          },
          onError: (error) => {
            toast.error(error.message)
          },
        }
      )
    },
    (error) => {
      toast.error(JSON.stringify(error, null, 2))
    }
  )

  if (regions.isError) {
    throw regions.error
  }

  if (salesChannels.isError) {
    throw salesChannels.error
  }

  return (
    <RouteFocusModal.Form form={form}>
      <KeyboundForm
        className="flex h-full flex-col overflow-hidden"
        onSubmit={onSubmit}
      >
        <RouteFocusModal.Header />
        <RouteFocusModal.Body className="flex flex-1 flex-col overflow-hidden">
          <div className="flex flex-1 flex-col items-center overflow-y-auto">
            <div className="flex w-full max-w-[720px] flex-col gap-y-6 px-2 py-16">
              <div>
                <RouteFocusModal.Title asChild>
                  <Heading>Create Draft Order</Heading>
                </RouteFocusModal.Title>
                <RouteFocusModal.Description asChild>
                  <span className="sr-only">Create a new draft order</span>
                </RouteFocusModal.Description>
              </div>
              <Divider variant="dashed" />
              <div>
                <Form.Field
                  control={form.control}
                  name="region_id"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <div className="grid grid-cols-2 gap-x-3">
                          <div>
                            <Form.Label>Region</Form.Label>
                            <Form.Hint>Choose region</Form.Hint>
                          </div>
                          <div>
                            <Form.Control>
                              <Combobox
                                options={regions.options}
                                fetchNextPage={regions.fetchNextPage}
                                isFetchingNextPage={regions.isFetchingNextPage}
                                searchValue={regions.searchValue}
                                onSearchValueChange={
                                  regions.onSearchValueChange
                                }
                                placeholder="Select region"
                                {...field}
                                autoComplete="off"
                              />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </div>
                        </div>
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <Divider variant="dashed" />
              <div>
                <Form.Field
                  control={form.control}
                  name="sales_channel_id"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <div className="grid grid-cols-2 gap-x-3">
                          <div>
                            <Form.Label>Sales Channel</Form.Label>
                            <Form.Hint>Choose sales channel</Form.Hint>
                          </div>
                          <div>
                            <Form.Control>
                              <Combobox
                                options={salesChannels.options}
                                fetchNextPage={salesChannels.fetchNextPage}
                                isFetchingNextPage={
                                  salesChannels.isFetchingNextPage
                                }
                                searchValue={salesChannels.searchValue}
                                onSearchValueChange={
                                  salesChannels.onSearchValueChange
                                }
                                placeholder="Select sales channel"
                                {...field}
                              />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </div>
                        </div>
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <Divider variant="dashed" />
              <CustomerField control={form.control} setValue={form.setValue} />
              <Divider variant="dashed" />
              <EmailField control={form.control} />
              <Divider variant="dashed" />
              <AddressField
                type="shipping_address"
                control={form.control}
                setValue={form.setValue}
              />
              <Divider variant="dashed" />
              <AddressField
                type="billing_address"
                control={form.control}
                setValue={form.setValue}
              />
            </div>
          </div>
        </RouteFocusModal.Body>
        <RouteFocusModal.Footer>
          <div className="flex justify-end gap-x-2">
            <RouteFocusModal.Close asChild>
              <Button variant="secondary" size="small">
                Cancel
              </Button>
            </RouteFocusModal.Close>
            <Button size="small">Save</Button>
          </div>
        </RouteFocusModal.Footer>
      </KeyboundForm>
    </RouteFocusModal.Form>
  )
}

interface EmailFieldProps {
  control: Control<z.infer<typeof schema>>
}

const EmailField = ({ control }: EmailFieldProps) => {
  const customerId = useWatch({ control, name: "customer_id" })

  return (
    <Form.Field
      control={control}
      name="email"
      render={({ field }) => {
        return (
          <Form.Item>
            <div className="grid grid-cols-2 gap-x-3">
              <div>
                <Form.Label>Email</Form.Label>
                <Form.Hint>Input a email to associate with the order</Form.Hint>
              </div>
              <ConditionalTooltip
                content="You cannot change the email when a customer is selected"
                showTooltip={!!customerId}
              >
                <div>
                  <Form.Control>
                    <Input
                      {...field}
                      placeholder="john@doe.com"
                      disabled={field.disabled || !!customerId}
                    />
                  </Form.Control>
                  <Form.ErrorMessage />
                </div>
              </ConditionalTooltip>
            </div>
          </Form.Item>
        )
      }}
    />
  )
}
interface CustomerFieldProps {
  control: Control<z.infer<typeof schema>>
  setValue: UseFormSetValue<z.infer<typeof schema>>
}

const CustomerField = ({ control, setValue }: CustomerFieldProps) => {
  const email = useWatch({ control, name: "email" })
  const customerId = useWatch({ control, name: "customer_id" })

  const customers = useComboboxData({
    queryFn: async (params) => {
      return await sdk.admin.customer.list(params)
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

  const onPropagateEmail = useCallback(
    (value?: string) => {
      const label = customers.options.find(
        (option) => option.value === value
      )?.label

      const customerEmail = label?.match(/\((.*@.*)\)$/)?.[1] || label

      setValue("email", customerEmail || "", {
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    [email, setValue, customers.options]
  )

  if (customers.isError) {
    throw customers.error
  }

  return (
    <Form.Field
      control={control}
      name="customer_id"
      render={({ field: { onChange, ...field } }) => {
        const onRemove = () => {
          onChange("")
          // If the customer is removed, we need to clear the shipping address id
          setValue("shipping_address_id", "")
        }

        return (
          <Form.Item>
            <div className="grid grid-cols-2 gap-x-3">
              <div>
                <Form.Label optional>Customer</Form.Label>
                <Form.Hint>Choose an existing customer</Form.Hint>
              </div>
              <Form.Control>
                {customerId ? (
                  <CustomerCard customerId={customerId} onRemove={onRemove} />
                ) : (
                  <Combobox
                    options={customers.options}
                    fetchNextPage={customers.fetchNextPage}
                    isFetchingNextPage={customers.isFetchingNextPage}
                    searchValue={customers.searchValue}
                    onSearchValueChange={customers.onSearchValueChange}
                    placeholder="Select customer"
                    onChange={(value) => {
                      onPropagateEmail(value)
                      onChange(value)
                    }}
                    {...field}
                  />
                )}
              </Form.Control>
            </div>
          </Form.Item>
        )
      }}
    />
  )
}

interface AddressFieldProps {
  type: "shipping_address" | "billing_address"
  control: Control<z.infer<typeof schema>>
  setValue: UseFormSetValue<z.infer<typeof schema>>
}

const AddressField = ({ type, control, setValue }: AddressFieldProps) => {
  const customerId = useWatch({ control, name: "customer_id" })
  const addressId = useWatch({ control, name: `${type}_id` })
  const sameAsShipping = useWatch({ control, name: "same_as_shipping" })

  const { customer } = useCustomer(
    customerId!,
    {},
    {
      enabled: !!customerId,
    }
  )

  const addresses = useComboboxData({
    queryFn: async (params) => {
      const response = await sdk.client.fetch(
        "/admin/customers/" + customerId + "/addresses",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          query: params,
          credentials: "include",
        }
      )

      return response as HttpTypes.AdminCustomerAddressListResponse
    },
    queryKey: [type, customerId],
    getOptions: (data) => {
      return data.addresses.map((address) => {
        const formattedAddress = getFormattedAddress(address).join(",\n")

        return {
          label: formattedAddress,
          value: address.id,
        }
      })
    },
    enabled: !!customerId,
  })

  const onSelectAddress = async (addressId?: string) => {
    if (!addressId || !customerId) {
      return
    }

    const response = (await sdk.client.fetch(
      "/admin/customers/" + customerId + "/addresses/" + addressId,
      {
        method: "GET",
        credentials: "include",
      }
    )) as HttpTypes.AdminCustomerAddressResponse

    const address = response.address

    setValue(type, {
      ...address,
      first_name: address.first_name || customer?.first_name,
      last_name: address.last_name || customer?.last_name,
    } as z.infer<typeof addressSchema>)
  }

  const showFields = type === "billing_address" ? !sameAsShipping : true

  return (
    <div className="grid grid-cols-2 gap-x-3">
      <div className="flex flex-col gap-y-1">
        <Label size="small" weight="plus">
          {type === "shipping_address" ? "Shipping address" : "Billing address"}
        </Label>
        <Hint>
          Address used for{" "}
          {type === "shipping_address" ? "shipping" : "billing"}
        </Hint>
      </div>
      <div className="flex flex-col gap-y-3">
        {type === "billing_address" && (
          <Form.Field
            control={control}
            name="same_as_shipping"
            render={({ field: { value, onChange, ...field } }) => {
              const onCheckedChange = (checked: boolean) => {
                if (!checked) {
                  setValue("billing_address", initialAddress)
                } else {
                  setValue("billing_address_id", "")
                  setValue("billing_address", null)
                }

                onChange(checked)
              }

              return (
                <Form.Item>
                  <div className="grid grid-cols-[28px_1fr] items-start gap-3">
                    <Form.Control>
                      <Switch
                        size="small"
                        {...field}
                        checked={value}
                        onCheckedChange={onCheckedChange}
                      />
                    </Form.Control>
                    <div className="flex flex-col">
                      <Form.Label>Same as shipping address</Form.Label>
                      <Form.Hint>
                        Use the same address for billing and shipping
                      </Form.Hint>
                    </div>
                  </div>
                </Form.Item>
              )
            }}
          />
        )}
        {showFields && (
          <div className="flex flex-col gap-y-3">
            {customerId && (
              <div className="flex flex-col gap-y-3">
                <Form.Field
                  control={control}
                  name={`${type}_id`}
                  render={({ field: { onChange, ...field } }) => {
                    const onRemove = () => {
                      onChange("")
                    }

                    return (
                      <Form.Item>
                        {addressId ? (
                          <AddressCard
                            customerId={customerId}
                            addressId={addressId}
                            tag={
                              type === "shipping_address"
                                ? "shipping"
                                : "billing"
                            }
                            onRemove={onRemove}
                          />
                        ) : (
                          <Fragment>
                            <Form.Label optional variant="subtle">
                              Saved addresses
                            </Form.Label>
                            <Form.Hint>
                              Choose one of the customers saved addresses.
                            </Form.Hint>
                            <Form.Control>
                              <Combobox
                                options={addresses.options}
                                fetchNextPage={addresses.fetchNextPage}
                                isFetchingNextPage={
                                  addresses.isFetchingNextPage
                                }
                                searchValue={addresses.searchValue}
                                onSearchValueChange={
                                  addresses.onSearchValueChange
                                }
                                placeholder={
                                  type === "shipping_address"
                                    ? "Select shipping address"
                                    : "Select billing address"
                                }
                                onChange={(value) => {
                                  onSelectAddress(value)
                                  onChange(value)
                                }}
                                {...field}
                              />
                            </Form.Control>
                            <Form.ErrorMessage />
                          </Fragment>
                        )}
                      </Form.Item>
                    )
                  }}
                />
                <Divider variant="dashed" />
              </div>
            )}
            {!addressId && (
              <div className="flex flex-col gap-y-3">
                <Form.Field
                  control={control}
                  name={`${type}.country_code`}
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label variant="subtle">Country</Form.Label>
                      <Form.Control>
                        <CountrySelect {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Form.Field
                    control={control}
                    name={`${type}.first_name`}
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label variant="subtle">First name</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />
                  <Form.Field
                    control={control}
                    name={`${type}.last_name`}
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label variant="subtle">Last name</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />
                </div>
                <Form.Field
                  control={control}
                  name={`${type}.company`}
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label optional variant="subtle">
                        Company
                      </Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={control}
                  name={`${type}.address_1`}
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label variant="subtle">Address</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={control}
                  name={`${type}.address_2`}
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label optional variant="subtle">
                        Apartment, suite, etc.
                      </Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Form.Field
                    control={control}
                    name={`${type}.postal_code`}
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label variant="subtle">Postal code</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />
                  <Form.Field
                    control={control}
                    name={`${type}.city`}
                    render={({ field }) => (
                      <Form.Item>
                        <Form.Label variant="subtle">City</Form.Label>
                        <Form.Control>
                          <Input {...field} />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )}
                  />
                </div>
                <Form.Field
                  control={control}
                  name={`${type}.province`}
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label optional variant="subtle">
                        Province / State
                      </Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={control}
                  name={`${type}.phone`}
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label optional variant="subtle">
                        Phone
                      </Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const initialAddress = {
  country_code: "",
  first_name: "",
  last_name: "",
  address_1: "",
  address_2: "",
  city: "",
  province: "",
  postal_code: "",
  phone: "",
  company: "",
}

const schema = z
  .object({
    region_id: z.string().min(1),
    sales_channel_id: z.string().min(1),
    customer_id: z.string().optional(),
    email: z.string().email().optional(),
    shipping_address_id: z.string().optional(),
    shipping_address: addressSchema,
    billing_address_id: z.string().optional(),
    billing_address: addressSchema.nullable(),
    same_as_shipping: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (!data.customer_id && !data.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either a customer or email must be provided",
        path: ["customer_id", "email"],
      })
    }

    if (!data.shipping_address && !data.shipping_address_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Shipping address is required",
        path: ["shipping_address"],
      })
    }

    if (data.same_as_shipping === false) {
      if (!data.billing_address && !data.billing_address_id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Billing address is required",
          path: ["billing_address"],
        })
      }
    }
  })

export default Create
