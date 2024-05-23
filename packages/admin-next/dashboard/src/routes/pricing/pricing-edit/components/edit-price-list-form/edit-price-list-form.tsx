import { zodResolver } from "@hookform/resolvers/zod"
import { PriceListDTO } from "@medusajs/types"
import { Button, Input, RadioGroup, Textarea } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { Form } from "../../../../../components/common/form"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdatePriceList } from "../../../../../hooks/api/price-lists"
import { PriceListType } from "../../../common/constants"

type EditPriceListFormProps = {
  priceList: PriceListDTO
}

const EditPriceListFormSchema = z.object({
  type: z.nativeEnum(PriceListType),
  title: z.string().min(1),
  description: z.string().min(1),
})

export const EditPriceListForm = ({ priceList }: EditPriceListFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditPriceListFormSchema>>({
    defaultValues: {
      type: priceList.type,
      title: priceList.title,
      description: priceList.description,
    },
    resolver: zodResolver(EditPriceListFormSchema),
  })

  const { mutateAsync } = useUpdatePriceList(priceList.id)

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
                    <Form.Hint>{t("pricing.fields.typeHint")}</Form.Hint>
                  </div>
                  <Form.Control>
                    <RadioGroup {...field} onValueChange={onChange}>
                      <RadioGroup.ChoiceBox
                        value={PriceListType.SALE}
                        label={t("pricing.type.sale")}
                        description={t("pricing.fields.saleTypeHint")}
                      />
                      <RadioGroup.ChoiceBox
                        value={PriceListType.OVERRIDE}
                        label={t("pricing.type.override")}
                        description={t("pricing.fields.overrideTypeHint")}
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
            <Button size="small" type="submit">
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}
