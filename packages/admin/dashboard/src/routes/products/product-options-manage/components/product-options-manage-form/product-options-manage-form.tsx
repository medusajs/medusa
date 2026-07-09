import { HttpTypes } from "@medusajs/types"
import { Button, Hint, Label, toast, Tooltip } from "@medusajs/ui"
import { InformationCircle } from "@medusajs/icons"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../../components/common/form"
import { Combobox } from "../../../../../components/inputs/combobox"
import { RouteDrawer, useRouteModal } from "../../../../../components/modals"
import { KeyboundForm } from "../../../../../components/utilities/keybound-form"
import { useExtendableForm } from "../../../../../dashboard-app"
import {
  productOptionsQueryKeys,
  useLinkProductOptions,
} from "../../../../../hooks/api"
import { useExtension } from "../../../../../providers/extension-provider"
import { useComboboxData } from "../../../../../hooks/use-combobox-data"
import { sdk } from "../../../../../lib/client"

type ProductOptionsManageFormProps = {
  product: HttpTypes.AdminProduct
}

type ManageOption = Pick<
  HttpTypes.AdminProductOption,
  "id" | "title" | "is_exclusive" | "values"
>

type ManageOptionFormValue = {
  id?: string
  value: string
}

type ManageOptionFormOption = {
  id?: string
  title: string
  is_exclusive?: boolean
  values: ManageOptionFormValue[]
}

const ProductOptionsManageSchema = zod.object({
  options: zod.array(
    zod.object({
      id: zod.string().optional(),
      title: zod.string(),
      is_exclusive: zod.boolean().optional(),
      values: zod.array(
        zod.object({
          id: zod.string().optional(),
          value: zod.string(),
        })
      ),
    })
  ),
})

const LOCAL_OPTION_PREFIX = "new_"

const isLocalOptionId = (id?: string) => {
  return !!id && id.startsWith(LOCAL_OPTION_PREFIX)
}

export const ProductOptionsManageForm = ({
  product,
}: ProductOptionsManageFormProps) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()
  const { getFormConfigs } = useExtension()
  const configs = getFormConfigs("product", "edit")

  const form = useExtendableForm({
    defaultValues: {
      options:
        product.options?.map((option) => ({
          id: option.id,
          title: option.title,
          is_exclusive: option.is_exclusive,
          values:
            option.values?.map((value) => ({
              id: value.id,
              value: value.value,
            })) || [],
        })) || [],
    },
    schema: ProductOptionsManageSchema,
    configs: configs,
    data: product,
  })

  const watchedOptions = form.watch("options")
  const formOptions = useMemo(() => watchedOptions ?? [], [watchedOptions])
  const selectedOptionIds = useMemo(
    () =>
      formOptions.map((option) => option.id).filter((id): id is string => !!id),
    [formOptions]
  )

  // Stable picker query for global (non-exclusive) options.
  const productOptionsCombobox = useComboboxData({
    queryKey: productOptionsQueryKeys.list({ is_exclusive: false }),
    queryFn: (params) =>
      sdk.admin.productOption.list({
        ...params,
        is_exclusive: false,
        fields: "id,title,is_exclusive,values.id,values.value,values.rank",
      } as HttpTypes.AdminProductOptionListParams),
    getOptions: (data) =>
      data.product_options.map((option) => ({
        label: option.title,
        value: option.id,
        option,
      })),
  })

  // Accumulate full option details as they appear in the picker pages.
  // Accumulating (rather than reading only the current page) keeps a selected
  // option's values available even if a later search filters it out of the
  // current results. A new Map is only created when something actually changed.
  const [accumulatedOptionDetails, setAccumulatedOptionDetails] = useState(
    () => new Map<string, ManageOption>()
  )

  useEffect(() => {
    setAccumulatedOptionDetails((prev) => {
      let next: Map<string, ManageOption> | undefined

      for (const choice of productOptionsCombobox.options) {
        if (choice.option && prev.get(choice.value) !== choice.option) {
          next ??= new Map(prev)
          next.set(choice.value, choice.option)
        }
      }

      return next ?? prev
    })
  }, [productOptionsCombobox.options])

  // The product's already-linked options (incl. exclusive ones that never
  // appear in the global-only picker) seed the lookup; the accumulated picker
  // details take precedence so global options expose their full value set.
  const optionDetailsById = useMemo(() => {
    const merged = new Map<string, ManageOption>()
    product.options?.forEach((option) => merged.set(option.id, option))
    accumulatedOptionDetails.forEach((option, id) => merged.set(id, option))
    return merged
  }, [accumulatedOptionDetails, product.options])

  const optionChoices = useMemo(() => {
    const merged = new Map<string, { label: string; value: string }>()
    productOptionsCombobox.options.forEach((option) =>
      merged.set(option.value, option)
    )

    // Ensure every option already in the form (the product's linked options,
    // selected existing options, and locally-created ones) has a label entry so
    // its chip resolves even when it's not on the current page / search result.
    formOptions.forEach((option) => {
      if (option.id && !merged.has(option.id)) {
        merged.set(option.id, { label: option.title, value: option.id })
      }
    })

    return [...merged.values()]
  }, [formOptions, productOptionsCombobox.options])

  const { mutateAsync, isPending } = useLinkProductOptions(product.id)

  const handleProductOptionSelect = (optionIds: string[]) => {
    const currentOptions = form.getValues("options") || []
    const createdOptionIdsByTitle = new Map(
      currentOptions
        .filter((option) => isLocalOptionId(option.id))
        .map((option) => [option.title.toLowerCase(), option.id])
    )
    const optionIdsByLabel = new Map(
      optionChoices.map((option) => [option.label.toLowerCase(), option.value])
    )

    const normalizedOptionIds = Array.from(
      new Set( // deduplicate if needed
        optionIds.flatMap((optionId) => {
          /**
           * map label from the combobox input to the option id
           */

          if (optionIdsByLabel.has(optionId.toLowerCase())) {
            return [optionIdsByLabel.get(optionId.toLowerCase())!]
          }

          if (createdOptionIdsByTitle.has(optionId.toLowerCase())) {
            return [createdOptionIdsByTitle.get(optionId.toLowerCase())!]
          }

          return optionChoices.some((option) => option.value === optionId)
            ? [optionId]
            : []
        })
      )
    )

    const optionsById = new Map(
      currentOptions
        .filter(
          (option): option is ManageOptionFormOption & { id: string } =>
            !!option.id
        )
        .map((option) => [option.id, option])
    )
    const nextOptions: ManageOptionFormOption[] = normalizedOptionIds.flatMap(
      (optionId) => {
        const existingOption = optionsById.get(optionId)
        if (existingOption) {
          return [existingOption]
        }

        const optionDetails = optionDetailsById.get(optionId)
        const optionChoice = optionChoices.find(
          (option) => option.value === optionId
        )

        if (!optionDetails && !optionChoice) {
          return []
        }

        return [
          {
            id: optionId,
            title: optionDetails?.title ?? optionChoice?.label ?? "",
            is_exclusive: optionDetails?.is_exclusive,
            values: [],
          },
        ]
      }
    )

    form.setValue("options", nextOptions)
  }

  const handleValueChange = (
    option: ManageOptionFormOption,
    optionDetails: ManageOption | undefined,
    valueIds: string[]
  ) => {
    if (!option.id) {
      return
    }

    // Deselecting every value is the user's way of saying "remove this option
    // from the product". Drop the row so the submit pipeline routes it through
    // optionsToRemove, where the backend's "variants are using it" guard kicks
    // in if the option can't actually be detached.
    if (!valueIds.length) {
      const currentOptions = form.getValues("options") || []
      form.setValue(
        "options",
        currentOptions.filter((entry) => entry.id !== option.id)
      )
      return
    }

    const isExclusive =
      optionDetails?.is_exclusive ??
      option.is_exclusive ??
      isLocalOptionId(option.id)
    const existingValueLabels = new Map(
      (optionDetails?.values ?? []).map((value) => [value.id, value.value])
    )

    const nextValues: ManageOptionFormValue[] = []
    const seenExisting = new Set<string>()
    const seenNew = new Set<string>()

    valueIds.forEach((valueId) => {
      if (existingValueLabels.has(valueId)) {
        if (!seenExisting.has(valueId)) {
          nextValues.push({
            id: valueId,
            value: existingValueLabels.get(valueId) || valueId,
          })
          seenExisting.add(valueId)
        }
        return
      }

      // we can create new values for exclusive options only
      if (isExclusive) {
        const normalizedValue = valueId.trim()
        if (normalizedValue && !seenNew.has(normalizedValue)) {
          nextValues.push({ value: normalizedValue })
          seenNew.add(normalizedValue)
        }
      }
    })

    const currentOptions = form.getValues("options") || []

    form.setValue(
      "options",
      currentOptions.map((entry) => {
        return entry.id === option.id ? { ...entry, values: nextValues } : entry
      })
    )
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    const currentOptions = product.options || []
    const currentOptionIds = new Set(currentOptions.map((opt) => opt.id))
    const currentOptionsById = new Map(
      currentOptions.map((option) => [option.id, option])
    )
    const submittedOptions = data.options || []
    const submittedOptionIds = new Set(
      submittedOptions
        .map((option) => option.id)
        .filter((id): id is string => !!id)
    )

    const optionsToAdd: NonNullable<HttpTypes.AdminLinkProductOptions["add"]> =
      []
    const optionsToRemove: string[] = []
    const optionsToUpdate: NonNullable<
      HttpTypes.AdminLinkProductOptions["update"]
    > = []

    // Check for completely removed options
    for (const currentId of currentOptionIds) {
      if (!submittedOptionIds.has(currentId)) {
        optionsToRemove.push(currentId)
      }
    }

    // Check for new options or options with changed values
    for (const option of submittedOptions) {
      const optionId = option.id
      const isLocalOption = isLocalOptionId(optionId)
      const optionDetails = optionId
        ? optionDetailsById.get(optionId)
        : undefined
      const isExclusive =
        optionDetails?.is_exclusive ?? option.is_exclusive ?? isLocalOption

      const existingValueIds = Array.from(
        new Set(
          option.values
            .map((value) => value.id)
            .filter((id): id is string => !!id)
        )
      )
      const createdValueNames = isExclusive
        ? Array.from(
            new Set(
              option.values
                .filter((value) => !value.id)
                .map((value) => value.value.trim())
                .filter(Boolean)
            )
          )
        : []

      /**
       * handle newly created options
       */
      if (!optionId || isLocalOption) {
        const newOptionValues = Array.from(
          new Set(
            option.values.map((value) => value.value.trim()).filter(Boolean)
          )
        )
        const newOptionRanks = Object.fromEntries(
          newOptionValues.map((value, index) => [value, index + 1])
        )

        if (!newOptionValues.length) {
          toast.error(t("products.options.manage.error.noValues"))
          return
        }

        optionsToAdd.push({
          title: option.title,
          values: newOptionValues,
          ranks: newOptionRanks,
          is_exclusive: true,
        })
        continue
      }

      /**
       * handle existing options not yet linked to the product
       */
      if (!currentOptionIds.has(optionId)) {
        const newValueEntries = createdValueNames.map((value) => ({
          value,
        }))

        if (!existingValueIds.length && !newValueEntries.length) {
          toast.error(t("products.options.manage.error.noValues"))
          return
        }

        optionsToAdd.push({
          id: optionId,
          value_ids: existingValueIds,
        })

        if (newValueEntries.length) {
          optionsToUpdate.push({
            product_option_id: optionId,
            add: newValueEntries,
          })
        }
      } else {
        const currentOption = currentOptionsById.get(optionId)
        const currentValueIds =
          currentOption?.values?.map((v) => v.id).sort() || []
        const newValueIds = [...existingValueIds].sort()
        const newValueEntries = createdValueNames.map((value) => ({
          value,
        }))

        const valuesToAdd = newValueIds.filter(
          (valueId) => !currentValueIds.includes(valueId)
        )
        const valuesToRemove = currentValueIds.filter(
          (valueId) => !newValueIds.includes(valueId)
        )
        const addEntries = [...valuesToAdd, ...newValueEntries] // link new values to PPO and create new values if needed

        if (addEntries.length || valuesToRemove.length) {
          optionsToUpdate.push({
            product_option_id: optionId,
            add: addEntries.length ? addEntries : undefined,
            remove: valuesToRemove.length ? valuesToRemove : undefined,
          })
        }
      }
    }

    await mutateAsync(
      {
        add: optionsToAdd,
        remove: optionsToRemove,
        update: optionsToUpdate,
      },
      {
        onSuccess: ({ product }) => {
          toast.success(
            t("products.organization.edit.toasts.success", {
              title: product.title,
            })
          )
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
      <KeyboundForm onSubmit={handleSubmit} className="flex h-full flex-col">
        <RouteDrawer.Body>
          <div className="flex h-full flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="options"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>
                      {t("products.options.manage.label")}
                    </Form.Label>
                    <Form.Hint>{t("products.options.manage.hint")}</Form.Hint>
                    <Form.Control>
                      <Combobox
                        name={field.name}
                        ref={field.ref}
                        value={selectedOptionIds}
                        onChange={(value) =>
                          handleProductOptionSelect(value as string[])
                        }
                        onBlur={field.onBlur}
                        options={optionChoices}
                        searchValue={productOptionsCombobox.searchValue}
                        onSearchValueChange={
                          productOptionsCombobox.onSearchValueChange
                        }
                        fetchNextPage={productOptionsCombobox.fetchNextPage}
                        isFetchingNextPage={
                          productOptionsCombobox.isFetchingNextPage
                        }
                        shouldAlwaysShowCreateOption
                        onCreateOption={async (options) => {
                          const optionTitle = Array.isArray(options)
                            ? options[options.length - 1]?.trim()
                            : options.trim()

                          if (!optionTitle) {
                            return
                          }

                          /**
                           * Handle if the option already exists, don't create just assign
                           */

                          const existingOption = optionChoices.find(
                            (option) =>
                              option.label.toLowerCase() ===
                              optionTitle.toLowerCase()
                          )

                          if (existingOption) {
                            handleProductOptionSelect([
                              ...new Set([
                                ...selectedOptionIds,
                                existingOption.value,
                              ]),
                            ])
                            return
                          }

                          /**
                           * Creation of the new options
                           */

                          const newOptionId = `${LOCAL_OPTION_PREFIX}${Math.random()
                            .toString(36)
                            .slice(2, 8)}`

                          const createdOption: ManageOptionFormOption = {
                            id: newOptionId,
                            title: optionTitle,
                            is_exclusive: true,
                            values: [],
                          }

                          const currentOptions = form.getValues("options") || []
                          form.setValue("options", [
                            ...currentOptions,
                            createdOption,
                          ])
                        }}
                        placeholder={t("products.options.manage.placeholder")}
                        disabled={productOptionsCombobox.isLoading}
                        displayMode="chips"
                      />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            {formOptions.length > 0 && (
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col">
                  <Label weight="plus">{t("fields.values")}</Label>
                  <Hint>{t("products.create.variants.selectValuesHint")}</Hint>
                </div>
                <div className="flex flex-col gap-y-3">
                  {formOptions.map((option) => {
                    if (!option.id) {
                      return null
                    }

                    const optionDetails = optionDetailsById.get(option.id)
                    const isExclusive =
                      optionDetails?.is_exclusive ??
                      option.is_exclusive ??
                      isLocalOptionId(option.id)
                    const valueOptions = [...(optionDetails?.values ?? [])]
                      .sort((a, b) => {
                        const rankA = a.rank ?? Number.MAX_VALUE
                        const rankB = b.rank ?? Number.MAX_VALUE
                        return rankA - rankB
                      })
                      .map((value) => ({
                        value: value.id,
                        label: value.value,
                      }))

                    const selectedValues = option.values || []
                    const valueOptionIds = new Set(
                      valueOptions.map((value) => value.value)
                    )
                    const customValueOptions = selectedValues
                      .filter(
                        (value) => !value.id || !valueOptionIds.has(value.id)
                      )
                      .map((value) => ({
                        value: value.id ?? value.value,
                        label: value.value,
                      }))

                    const mergedOptions = [
                      ...new Map(
                        [...valueOptions, ...customValueOptions].map(
                          (value) => [value.value, value]
                        )
                      ).values(),
                    ]
                    const mergedValues = selectedValues.map(
                      (value) => value.id ?? value.value
                    )

                    return (
                      <div key={option.id} className="flex flex-col gap-y-2">
                        <Label
                          className="flex items-center gap-x-1"
                          size="small"
                          weight="plus"
                        >
                          {optionDetails?.title ?? option.title}
                          {isExclusive && (
                            <Tooltip
                              content={t(
                                "productOptions.manage.exclusiveOption"
                              )}
                            >
                              <InformationCircle className="text-ui-fg-subtle pt-[1px]" />
                            </Tooltip>
                          )}
                        </Label>
                        <Combobox
                          value={mergedValues}
                          onChange={(value) =>
                            handleValueChange(
                              option,
                              optionDetails,
                              value as string[]
                            )
                          }
                          shouldAlwaysShowCreateOption
                          onCreateOption={isExclusive ? () => {} : undefined}
                          options={mergedOptions}
                          placeholder={t(
                            "products.fields.options.variantionsPlaceholder"
                          )}
                          displayMode="chips"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
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
      </KeyboundForm>
    </RouteDrawer.Form>
  )
}
