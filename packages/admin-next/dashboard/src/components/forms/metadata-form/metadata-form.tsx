import { zodResolver } from "@hookform/resolvers/zod"
import {
  Button,
  DropdownMenu,
  Heading,
  IconButton,
  clx,
  toast,
} from "@medusajs/ui"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import {
  ArrowDownMini,
  ArrowUpMini,
  EllipsisVertical,
  Trash,
} from "@medusajs/icons"
import { FetchError } from "@medusajs/js-sdk"
import { ComponentPropsWithoutRef, forwardRef, useRef } from "react"
import { ConditionalTooltip } from "../../common/conditional-tooltip"
import { Form } from "../../common/form"
import { InlineTip } from "../../common/inline-tip"
import { Skeleton } from "../../common/skeleton"
import { RouteDrawer, useRouteModal } from "../../modals"

type MetaDataSubmitHook<TRes> = (
  params: { metadata?: Record<string, any> | null },
  callbacks: { onSuccess: () => void; onError: (error: FetchError) => void }
) => Promise<TRes>

type MetadataFormProps<TRes> = {
  metadata?: Record<string, any> | null
  hook: MetaDataSubmitHook<TRes>
  isPending: boolean
  isMutating: boolean
}

const MetadataFieldSchema = z.object({
  key: z.string(),
  disabled: z.boolean().optional(),
  value: z.any(),
})

const MetadataSchema = z.object({
  metadata: z.array(MetadataFieldSchema),
})

export const MetadataForm = <TRes,>(props: MetadataFormProps<TRes>) => {
  const { t } = useTranslation()
  const { isPending, ...innerProps } = props

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("metadata.edit.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("metadata.edit.description")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      {isPending ? <PlaceholderInner /> : <InnerForm {...innerProps} />}
    </RouteDrawer>
  )
}

const METADATA_KEY_LABEL_ID = "metadata-form-key-label"
const METADATA_VALUE_LABEL_ID = "metadata-form-value-label"

const InnerForm = <TRes,>({
  metadata,
  hook,
  isMutating,
}: Omit<MetadataFormProps<TRes>, "isPending">) => {
  const { t } = useTranslation()
  const { handleSuccess } = useRouteModal()

  const deletedOriginalRows = useRef<string[]>([])
  const hasUneditableRows = getHasUneditableRows(metadata)

  const form = useForm<z.infer<typeof MetadataSchema>>({
    defaultValues: {
      metadata: getDefaultValues(metadata),
    },
    resolver: zodResolver(MetadataSchema),
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    const parsedData = parseValues(data)

    await hook(
      {
        metadata: parsedData,
      },
      {
        onSuccess: () => {
          toast.success(t("metadata.edit.successToast"))
          handleSuccess()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  const { fields, insert, remove } = useFieldArray({
    control: form.control,
    name: "metadata",
  })

  function deleteRow(index: number) {
    remove(index)
  }

  function insertRow(index: number, position: "above" | "below") {
    insert(index + (position === "above" ? 0 : 1), {
      key: "",
      value: "",
      disabled: false,
    })
  }

  return (
    <RouteDrawer.Form form={form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-y-auto">
          <div className="bg-ui-bg-base shadow-elevation-card-rest grid grid-cols-1 divide-y rounded-lg">
            <div className="bg-ui-bg-subtle grid grid-cols-2 divide-x rounded-t-lg">
              <div className="txt-compact-small-plus text-ui-fg-subtle px-2 py-1.5">
                <label id={METADATA_KEY_LABEL_ID}>
                  {t("metadata.edit.labels.key")}
                </label>
              </div>
              <div className="txt-compact-small-plus text-ui-fg-subtle px-2 py-1.5">
                <label id={METADATA_VALUE_LABEL_ID}>
                  {t("metadata.edit.labels.value")}
                </label>
              </div>
            </div>
            {fields.map((field, index) => {
              const isDisabled = field.disabled || false
              let placeholder = "-"

              if (typeof field.value === "object") {
                placeholder = "{ ... }"
              }

              if (Array.isArray(field.value)) {
                placeholder = "[ ... ]"
              }

              return (
                <ConditionalTooltip
                  showTooltip={isDisabled}
                  content={t("metadata.edit.complexRow.tooltip")}
                  key={field.id}
                >
                  <div className="group/table relative">
                    <div
                      className={clx("grid grid-cols-2 divide-x", {
                        "overflow-hidden rounded-b-lg":
                          index === fields.length - 1,
                      })}
                    >
                      <Form.Field
                        control={form.control}
                        name={`metadata.${index}.key`}
                        render={({ field }) => {
                          return (
                            <Form.Item>
                              <Form.Control>
                                <GridInput
                                  aria-labelledby={METADATA_KEY_LABEL_ID}
                                  {...field}
                                  disabled={isDisabled}
                                  placeholder="Key"
                                />
                              </Form.Control>
                            </Form.Item>
                          )
                        }}
                      />
                      <Form.Field
                        control={form.control}
                        name={`metadata.${index}.value`}
                        render={({ field: { value, ...field } }) => {
                          return (
                            <Form.Item>
                              <Form.Control>
                                <GridInput
                                  aria-labelledby={METADATA_VALUE_LABEL_ID}
                                  {...field}
                                  value={isDisabled ? placeholder : value}
                                  disabled={isDisabled}
                                  placeholder="Value"
                                />
                              </Form.Control>
                            </Form.Item>
                          )
                        }}
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenu.Trigger
                        className={clx(
                          "invisible absolute inset-y-0 -right-2.5 my-auto group-hover/table:visible data-[state='open']:visible",
                          {
                            hidden: isDisabled,
                          }
                        )}
                        disabled={isDisabled}
                        asChild
                      >
                        <IconButton size="2xsmall">
                          <EllipsisVertical />
                        </IconButton>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Item
                          className="gap-x-2"
                          onClick={() => insertRow(index, "above")}
                        >
                          <ArrowUpMini className="text-ui-fg-subtle" />
                          {t("metadata.edit.actions.insertRowAbove")}
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          className="gap-x-2"
                          onClick={() => insertRow(index, "below")}
                        >
                          <ArrowDownMini className="text-ui-fg-subtle" />
                          {t("metadata.edit.actions.insertRowBelow")}
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                          className="gap-x-2"
                          onClick={() => deleteRow(index)}
                        >
                          <Trash className="text-ui-fg-subtle" />
                          {t("metadata.edit.actions.deleteRow")}
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu>
                  </div>
                </ConditionalTooltip>
              )
            })}
          </div>
          {hasUneditableRows && (
            <InlineTip
              variant="warning"
              label={t("metadata.edit.complexRow.label")}
            >
              {t("metadata.edit.complexRow.description")}
            </InlineTip>
          )}
        </RouteDrawer.Body>
        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <RouteDrawer.Close asChild>
              <Button
                size="small"
                variant="secondary"
                type="button"
                disabled={isMutating}
              >
                {t("actions.cancel")}
              </Button>
            </RouteDrawer.Close>
            <Button size="small" type="submit" isLoading={isMutating}>
              {t("actions.save")}
            </Button>
          </div>
        </RouteDrawer.Footer>
      </form>
    </RouteDrawer.Form>
  )
}

const GridInput = forwardRef<
  HTMLInputElement,
  ComponentPropsWithoutRef<"input">
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      autoComplete="off"
      className={clx(
        "txt-compact-small text-ui-fg-base placeholder:text-ui-fg-muted disabled:text-ui-fg-disabled disabled:bg-ui-bg-base px-2 py-1.5 outline-none",
        className
      )}
    />
  )
})
GridInput.displayName = "MetadataForm.GridInput"

const PlaceholderInner = () => {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <RouteDrawer.Body>
        <Skeleton className="h-[148ox] w-full rounded-lg" />
      </RouteDrawer.Body>
      <RouteDrawer.Footer>
        <div className="flex items-center justify-end gap-x-2">
          <Skeleton className="h-7 w-12 rounded-md" />
          <Skeleton className="h-7 w-12 rounded-md" />
        </div>
      </RouteDrawer.Footer>
    </div>
  )
}

const EDITABLE_TYPES = ["string", "number", "boolean"]

function getDefaultValues(
  metadata?: Record<string, any> | null
): z.infer<typeof MetadataFieldSchema>[] {
  if (!metadata || !Object.keys(metadata).length) {
    return [
      {
        key: "",
        value: "",
        disabled: false,
      },
    ]
  }

  return Object.entries(metadata).map(([key, value]) => {
    if (!EDITABLE_TYPES.includes(typeof value)) {
      return {
        key,
        value: value,
        disabled: true,
      }
    }

    let stringValue = value

    if (typeof value !== "string") {
      stringValue = JSON.stringify(value)
    }

    return {
      key,
      value: stringValue,
      original_key: key,
    }
  })
}

function parseValues(
  values: z.infer<typeof MetadataSchema>
): Record<string, any> | null {
  const metadata = values.metadata

  const isEmpty =
    !metadata.length ||
    (metadata.length === 1 && !metadata[0].key && !metadata[0].value)

  if (isEmpty) {
    return null
  }

  const update: Record<string, any> = {}

  metadata.forEach((field) => {
    let key = field.key
    let value = field.value
    const disabled = field.disabled

    if (!key || !value) {
      return
    }

    if (disabled) {
      update[key] = value
      return
    }

    key = key.trim()
    value = value.trim()

    // We try to cast the value to a boolean or number if possible
    if (value === "true") {
      update[key] = true
    } else if (value === "false") {
      update[key] = false
    } else {
      const parsedNumber = parseFloat(value)
      if (!isNaN(parsedNumber)) {
        update[key] = parsedNumber
      } else {
        update[key] = value
      }
    }
  })

  return update
}

function getHasUneditableRows(metadata?: Record<string, any> | null) {
  if (!metadata) {
    return false
  }

  return Object.values(metadata).some(
    (value) => !EDITABLE_TYPES.includes(typeof value)
  )
}
