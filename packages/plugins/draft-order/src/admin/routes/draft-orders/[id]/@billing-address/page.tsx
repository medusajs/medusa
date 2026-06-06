import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@zjedene-medusa/types"
import { Button, Heading, Input, toast } from "@zjedene-medusa/ui"
import { useForm } from "react-hook-form"
import { useParams } from "react-router-dom"
import { z } from "zod"
import { Form } from "../../../../components/common/form"
import { KeyboundForm } from "../../../../components/common/keybound-form"
import { CountrySelect } from "../../../../components/inputs/country-select"
import { RouteDrawer, useRouteModal } from "../../../../components/modals"
import { useUpdateDraftOrder } from "../../../../hooks/api/draft-orders"
import { useOrder } from "../../../../hooks/api/orders"
import { addressSchema } from "../../../../lib/schemas/address"

const BillingAddress = () => {
  const { id } = useParams()

  const { order, isPending, isError, error } = useOrder(id!, {
    fields: "+billing_address",
  })

  if (isError) {
    throw error
  }

  const isReady = !isPending && !!order

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>Edit Billing Address</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description asChild>
          <span className="sr-only">
            Edit the billing address for the draft order
          </span>
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {isReady && <BillingAddressForm order={order} />}
    </RouteDrawer>
  )
}

interface BillingAddressFormProps {
  order: HttpTypes.AdminOrder
}

const BillingAddressForm = ({ order }: BillingAddressFormProps) => {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      first_name: order.billing_address?.first_name ?? "",
      last_name: order.billing_address?.last_name ?? "",
      company: order.billing_address?.company ?? "",
      address_1: order.billing_address?.address_1 ?? "",
      address_2: order.billing_address?.address_2 ?? "",
      city: order.billing_address?.city ?? "",
      province: order.billing_address?.province ?? "",
      country_code: order.billing_address?.country_code ?? "",
      postal_code: order.billing_address?.postal_code ?? "",
      phone: order.billing_address?.phone ?? "",
    },
    resolver: zodResolver(schema),
  })

  const { mutateAsync, isPending } = useUpdateDraftOrder(order.id)
  const { handleSuccess } = useRouteModal()

  const onSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      { billing_address: data },
      {
        onSuccess: () => {
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
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="country_code"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Country</Form.Label>
                  <Form.Control>
                    <CountrySelect {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>First name</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Last name</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
            </div>
            <Form.Field
              control={form.control}
              name="company"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label optional>Company</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="address_1"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Address</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="address_2"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label optional>Apartment, suite, etc.</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <Form.Field
                control={form.control}
                name="postal_code"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>Postal code</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="city"
                render={({ field }) => (
                  <Form.Item>
                    <Form.Label>City</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
            </div>
            <Form.Field
              control={form.control}
              name="province"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label optional>Province / State</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="phone"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label optional>Phone</Form.Label>
                  <Form.Control>
                    <Input {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )}
            />
          </div>
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

const schema = addressSchema

export default BillingAddress
