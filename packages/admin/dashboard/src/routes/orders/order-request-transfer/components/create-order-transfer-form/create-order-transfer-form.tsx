import * as zod from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import { Button, Input, RadioGroup, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"

import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { Combobox } from "../../../../../components/inputs/combobox"
import {
  useRequestTransferOrder,
  useTransferOrderToGuest,
} from "../../../../../hooks/api"
import { sdk } from "../../../../../lib/client"
import { TransferHeader } from "./transfer-header"

type CreateOrderTransferFormProps = {
  order: HttpTypes.AdminOrder
}

const CreateOrderTransferSchema = zod
  .object({
    type: zod.enum(["registered", "guest"]),
    customer_id: zod.string().optional(),
    email: zod.string().optional(),
    current_customer_details: zod.string().min(1),
  })
  .superRefine((data, ctx) => {
    if (data.type === "registered" && !data.customer_id) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ["customer_id"],
        message: "Required",
      })
    }

    if (
      data.type === "guest" &&
      !zod.string().email().safeParse(data.email).success
    ) {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        path: ["email"],
        message: "Invalid email",
      })
    }
  })

export function CreateOrderTransferForm({
  order,
}: CreateOrderTransferFormProps) {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof CreateOrderTransferSchema>>({
    defaultValues: {
      type: "registered",
      customer_id: "",
      email: "",
      current_customer_details: order.customer?.first_name
        ? `${order.customer?.first_name} ${order.customer?.last_name} (${order.customer?.email}) `
        : order.customer?.email,
    },
    resolver: zodResolver(CreateOrderTransferSchema),
  })

  const type = form.watch("type")

  const customers = useComboboxData({
    queryKey: ["customers"],
    queryFn: (params) =>
      sdk.admin.customer.list({ ...params, has_account: true }),
    getOptions: (data) =>
      data.customers.map((item) => ({
        label: `${item.first_name || ""} ${item.last_name || ""} (${
          item.email
        })`,
        value: item.id,
      })),
  })

  const { mutateAsync: requestTransfer, isPending: isRequestPending } =
    useRequestTransferOrder(order.id)
  const { mutateAsync: transferToGuest, isPending: isGuestPending } =
    useTransferOrderToGuest(order.id)

  const isPending = isRequestPending || isGuestPending

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      if (data.type === "guest") {
        await transferToGuest({ email: data.email! })
        toast.success(
          t("orders.transfer.guestSuccess", { email: data.email })
        )
      } else {
        await requestTransfer({ customer_id: data.customer_id! })
        toast.success(
          t("orders.transfer.requestSuccess", { email: order.email })
        )
      }
      handleSuccess()
    } catch (error) {
      toast.error((error as Error).message)
    }
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex size-full flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex-1 overflow-auto">
          <div className="flex flex-col gap-y-8">
            <div className="flex justify-center">
              <TransferHeader />
            </div>

            <Form.Field
              control={form.control}
              name="type"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("orders.transfer.ownerType")}</Form.Label>
                    <Form.Control>
                      <RadioGroup
                        className="grid grid-cols-2 gap-3"
                        {...field}
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          form.clearErrors(["customer_id", "email"])
                          form.setValue("customer_id", "")
                          form.setValue("email", "")
                        }}
                      >
                        <RadioGroup.ChoiceBox
                          value="registered"
                          label={t("orders.transfer.registered")}
                          description={t(
                            "orders.transfer.registeredDescription"
                          )}
                        />
                        <RadioGroup.ChoiceBox
                          value="guest"
                          label={t("orders.transfer.guest")}
                          description={t("orders.transfer.guestDescription")}
                        />
                      </RadioGroup>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="current_customer_details"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("orders.transfer.currentOwner")}</Form.Label>
                    <span className="txt-small text-ui-fg-muted">
                      {t("orders.transfer.currentOwnerDescription")}
                    </span>

                    <Form.Control>
                      <Input type="email" {...field} disabled />
                    </Form.Control>

                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            {type === "registered" ? (
              <Form.Field
                control={form.control}
                name="customer_id"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("orders.transfer.newOwner")}</Form.Label>
                      <span className="txt-small text-ui-fg-muted">
                        {t("orders.transfer.newOwnerDescription")}
                      </span>

                      <Form.Control>
                        <Combobox
                          {...field}
                          options={customers.options}
                          searchValue={customers.searchValue}
                          onSearchValueChange={customers.onSearchValueChange}
                          fetchNextPage={customers.fetchNextPage}
                          className="bg-ui-bg-field-component hover:bg-ui-bg-field-component-hover"
                          placeholder={t("actions.select")}
                        />
                      </Form.Control>

                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            ) : (
              <Form.Field
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>
                        {t("orders.transfer.newGuestOwner")}
                      </Form.Label>
                      <span className="txt-small text-ui-fg-muted">
                        {t("orders.transfer.newGuestOwnerDescription")}
                      </span>

                      <Form.Control>
                        <Input
                          type="email"
                          {...field}
                          placeholder="customer@example.com"
                        />
                      </Form.Control>

                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
            )}
          </div>
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button variant="secondary" size="small">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>

            <Button
              isLoading={isPending}
              type="submit"
              variant="primary"
              size="small"
              disabled={!!Object.keys(form.formState.errors || {}).length}
            >
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
