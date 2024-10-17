import { zodResolver } from "@hookform/resolvers/zod"
import { HttpTypes } from "@medusajs/types"
import {
  Button,
  Input,
  RadioGroup,
  Select,
  Textarea,
  toast,
} from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { Form } from "../../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useUpdatePriceList } from "../../../../../hooks/api/price-lists"
import { PriceListStatus, PriceListType } from "../../../common/constants"

type PriceListEditFormProps = {
  priceList: HttpTypes.AdminPriceList
}

const PriceListEditSchema = z.object({
  status: z.nativeEnum(PriceListStatus),
  type: z.nativeEnum(PriceListType),
  title: z.string().min(1),
  description: z.string().min(1),
})

export const PriceListEditForm = ({ priceList }: PriceListEditFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof PriceListEditSchema>>({
    defaultValues: {
      type: priceList.type as PriceListType,
      title: priceList.title,
      description: priceList.description,
      status: priceList.status as PriceListStatus,
    },
    resolver: zodResolver(PriceListEditSchema),
  })

  const { mutateAsync, isPending } = useUpdatePriceList(priceList.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: ({ price_list }) => {
        toast.success(
          t("priceLists.edit.successToast", {
            title: price_list.title,
          })
        )

        handleSuccess()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-6 overflow-auto">
          <Form.Field
            control={form.control}
            name="type"
            render={({ field: { onChange, ...field } }) => {
              return (
                <Form.Item>
                  <div>
                    <Form.Label>{t("priceLists.fields.type.label")}</Form.Label>
                    <Form.Hint>{t("priceLists.fields.type.hint")}</Form.Hint>
                  </div>
                  <Form.Control>
                    <RadioGroup {...field} onValueChange={onChange}>
                      <RadioGroup.ChoiceBox
                        value={PriceListType.SALE}
                        label={t("priceLists.fields.type.options.sale.label")}
                        description={t(
                          "priceLists.fields.type.options.sale.description"
                        )}
                      />
                      <RadioGroup.ChoiceBox
                        value={PriceListType.OVERRIDE}
                        label={t(
                          "priceLists.fields.type.options.override.label"
                        )}
                        description={t(
                          "priceLists.fields.type.options.override.description"
                        )}
                      />
                    </RadioGroup>
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="title"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.title")}</Form.Label>
                    <Form.Control>
                      <Input {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="status"
              render={({ field: { onChange, ref, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>
                      {t("priceLists.fields.status.label")}
                    </Form.Label>
                    <Form.Control>
                      <Select {...field} onValueChange={onChange}>
                        <Select.Trigger ref={ref}>
                          <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item value={PriceListStatus.ACTIVE}>
                            {t("priceLists.fields.status.options.active")}
                          </Select.Item>
                          <Select.Item value={PriceListStatus.DRAFT}>
                            {t("priceLists.fields.status.options.draft")}
                          </Select.Item>
                        </Select.Content>
                      </Select>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.description")}</Form.Label>
                    <Form.Control>
                      <Textarea {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteDrawer.Body>
        <RouteDrawer.Footer className="shrink-0">
          <div className="flex items-center justify-end gap-x-2">
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
