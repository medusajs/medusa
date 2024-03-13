import { zodResolver } from "@hookform/resolvers/zod"
import { PriceList } from "@medusajs/medusa"
import { Button, Input, RadioGroup, Switch, Textarea } from "@medusajs/ui"
import { useAdminUpdatePriceList } from "medusa-react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { PriceListType } from "../../../common/constants"

type EditPriceListFormProps = {
  priceList: PriceList
}

const EditPriceListFormSchema = z.object({
  type: z.nativeEnum(PriceListType),
  name: z.string().min(1),
  description: z.string().min(1),
  includes_tax: z.boolean(),
})

export const EditPriceListForm = ({ priceList }: EditPriceListFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditPriceListFormSchema>>({
    defaultValues: {
      type: priceList.type,
      name: priceList.name,
      description: priceList.description,
      includes_tax: priceList.includes_tax,
    },
    resolver: zodResolver(EditPriceListFormSchema),
  })

  const { mutateAsync } = useAdminUpdatePriceList(priceList.id)

  const handleSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(values, {
      onSuccess: () => {
        handleSuccess()
      },
    })
  })

  return (
    <RouteDrawer.Form form={form}>
      <form
        className="flex flex-1 flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-auto">
          <Form.Field
            control={form.control}
            name="type"
            render={({ field: { onChange, ...field } }) => {
              return (
                <Form.Item>
                  <div>
                    <Form.Label>{t("fields.type")}</Form.Label>
                    <Form.Hint>{t("pricing.settings.typeHint")}</Form.Hint>
                  </div>
                  <Form.Control>
                    <RadioGroup {...field} onValueChange={onChange}>
                      <RadioGroup.ChoiceBox
                        value={PriceListType.SALE}
                        label={t("pricing.type.sale")}
                        description={t("pricing.settings.saleTypeHint")}
                      />
                      <RadioGroup.ChoiceBox
                        value={PriceListType.OVERRIDE}
                        label={t("pricing.type.override")}
                        description={t("pricing.settings.overrideTypeHint")}
                      />
                    </RadioGroup>
                  </Form.Control>
                </Form.Item>
              )
            }}
          />
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.name")}</Form.Label>
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
          <Form.Field
            control={form.control}
            name="includes_tax"
            render={({ field: { value, onChange, ...field } }) => {
              return (
                <Form.Item>
                  <div>
                    <div className="flex items-start justify-between">
                      <Form.Label>{t("fields.taxInclusivePricing")}</Form.Label>
                      <Form.Control>
                        <Switch
                          {...field}
                          checked={value}
                          onCheckedChange={onChange}
                        />
                      </Form.Control>
                    </div>
                    <Form.Hint>
                      {t("pricing.settings.taxInclusivePricingHint")}
                    </Form.Hint>
                    <Form.ErrorMessage />
                  </div>
                </Form.Item>
              )
            }}
          />
        </RouteDrawer.Body>
        <RouteDrawer.Footer className="shrink-0">
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button size="small" variant="secondary">
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit">
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
