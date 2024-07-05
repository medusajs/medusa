import { zodResolver } from "@hookform/resolvers/zod"
import { PromotionDTO } from "@medusajs/types"
import {
  Button,
  clx,
  CurrencyInput,
  Input,
  RadioGroup,
  Text,
} from "@medusajs/ui"
import { useForm, useWatch } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import { PercentageInput } from "../../../../../components/common/percentage-input"
import {
  RouteDrawer,
  useRouteModal,
} from "../../../../../components/route-modal"
import { useUpdatePromotion } from "../../../../../hooks/api/promotions"
import { getCurrencySymbol } from "../../../../../lib/currencies"

type EditPromotionFormProps = {
  promotion: PromotionDTO
}

const EditPromotionSchema = zod.object({
  is_automatic: zod.string().toLowerCase(),
  code: zod.string().min(1),
  value_type: zod.enum(["fixed", "percentage"]),
  value: zod.string(),
  allocation: zod.enum(["each", "across"]),
})

export const EditPromotionDetailsForm = ({
  promotion,
}: EditPromotionFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const form = useForm<zod.infer<typeof EditPromotionSchema>>({
    defaultValues: {
      is_automatic: promotion.is_automatic!.toString(),
      code: promotion.code,
      value: promotion.application_method!.value?.toString(),
      allocation: promotion.application_method!.allocation,
      value_type: promotion.application_method!.type,
    },
    resolver: zodResolver(EditPromotionSchema),
  })

  const watchValueType = useWatch({
    control: form.control,
    name: "value_type",
  })

  const isFixedValueType = watchValueType === "fixed"

  const { mutateAsync, isPending } = useUpdatePromotion(promotion.id)

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        is_automatic: data.is_automatic === "true",
        code: data.code,
        application_method: {
          value: data.value,
          type: data.value_type as any,
          allocation: data.allocation as any,
        },
      },
      {
        onSuccess: () => {
          handleSuccess()
        },
      }
    )
  })

  return (
    <RouteDrawer.Form form={form}>
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <div className="flex h-full flex-col gap-y-8">
            <Form.Field
              control={form.control}
              name="is_automatic"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Method</Form.Label>
                    <Form.Control>
                      <RadioGroup
                        className="flex-col gap-y-3"
                        {...field}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <RadioGroup.ChoiceBox
                          className={clx("basis-1/2", {
                            "border-2 border-ui-border-interactive":
                              "false" === field.value,
                          })}
                          value={"false"}
                          label={t("promotions.form.method.code.title")}
                          description={t(
                            "promotions.form.method.code.description"
                          )}
                        />
                        <RadioGroup.ChoiceBox
                          className={clx("basis-1/2", {
                            "border-2 border-ui-border-interactive":
                              "true" === field.value,
                          })}
                          value={"true"}
                          label={t("promotions.form.method.automatic.title")}
                          description={t(
                            "promotions.form.method.automatic.description"
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
                name="code"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("promotions.form.code.title")}</Form.Label>

                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                    </Form.Item>
                  )
                }}
              />

              <Text
                size="small"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                <Trans
                  t={t}
                  i18nKey="promotions.form.code.description"
                  components={[<br key="break" />]}
                />
              </Text>
            </div>

            <Form.Field
              control={form.control}
              name="value_type"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("promotions.fields.value_type")}</Form.Label>
                    <Form.Control>
                      <RadioGroup
                        className="flex-col gap-y-3"
                        {...field}
                        onValueChange={field.onChange}
                      >
                        <RadioGroup.ChoiceBox
                          className={clx("basis-1/2", {
                            "border-2 border-ui-border-interactive":
                              "fixed" === field.value,
                          })}
                          value={"fixed"}
                          label={t("promotions.form.value_type.fixed.title")}
                          description={t(
                            "promotions.form.value_type.fixed.description"
                          )}
                        />

                        <RadioGroup.ChoiceBox
                          className={clx("basis-1/2", {
                            "border-2 border-ui-border-interactive":
                              "percentage" === field.value,
                          })}
                          value={"percentage"}
                          label={t(
                            "promotions.form.value_type.percentage.title"
                          )}
                          description={t(
                            "promotions.form.value_type.percentage.description"
                          )}
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
              name="value"
              render={({ field: { onChange, ...field } }) => {
                return (
                  <Form.Item>
                    <Form.Label>
                      {isFixedValueType
                        ? t("fields.amount")
                        : t("fields.percentage")}
                    </Form.Label>
                    <Form.Control>
                      {isFixedValueType ? (
                        <CurrencyInput
                          min={0}
                          onValueChange={onChange}
                          code={"USD"}
                          symbol={getCurrencySymbol("USD")}
                          {...field}
                          value={Number(field.value)}
                        />
                      ) : (
                        <PercentageInput
                          key="amount"
                          min={0}
                          max={100}
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            onChange(
                              e.target.value === "" ? null : e.target.value
                            )
                          }}
                        />
                      )}
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />

            <Form.Field
              control={form.control}
              name="allocation"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("promotions.fields.allocation")}</Form.Label>
                    <Form.Control>
                      <RadioGroup
                        className="flex-col gap-y-3"
                        {...field}
                        onValueChange={field.onChange}
                      >
                        <RadioGroup.ChoiceBox
                          className={clx("basis-1/2", {
                            "border-2 border-ui-border-interactive":
                              "each" === field.value,
                          })}
                          value={"each"}
                          label={t("promotions.form.allocation.each.title")}
                          description={t(
                            "promotions.form.allocation.each.description"
                          )}
                        />

                        <RadioGroup.ChoiceBox
                          className={clx("basis-1/2", {
                            "border-2 border-ui-border-interactive":
                              "across" === field.value,
                          })}
                          value={"across"}
                          label={t("promotions.form.allocation.across.title")}
                          description={t(
                            "promotions.form.allocation.across.description"
                          )}
                        />
                      </RadioGroup>
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </div>
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
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
      </form>
    </RouteDrawer.Form>
  )
}
