import { zodResolver } from "@hookform/resolvers/zod"
import { XCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Alert, Button, Input, toast } from "@medusajs/ui"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "@medusajs/framework/zod"
import { Form } from "../../../../../../components/form"
import { KeyboundForm } from "../../../../../../components/keybound-form"
import { RouteDrawer, useRouteModal } from "../../../../../../components/modals"
import { useUpdateProduct } from "../../../../../../hooks/api/products"
import { optionalFloat } from "../../../../../../utils/validations"

type GiftCardProductEditDenominationsProps = {
  product: HttpTypes.AdminProduct
}

const EditProductSchema = z.object({
  denominations: z
    .array(
      z.object({
        id: z.string().optional(),
        value: z.string().min(1),
        prices: z.record(z.string(), optionalFloat).optional(),
      })
    )
    .min(1),
})

export const GiftCardProductEditDenominationsForm = ({
  product,
}: GiftCardProductEditDenominationsProps) => {
  const { handleSuccess } = useRouteModal()

  const form = useForm<z.infer<typeof EditProductSchema>>({
    defaultValues: {
      denominations: product.variants?.map((variant) => ({
        id: variant.id,
        value: variant.title!,
      })),
    },
    resolver: zodResolver(EditProductSchema),
  })

  const { mutateAsync, isPending } = useUpdateProduct(product.id)

  const handleSubmit = form.handleSubmit(async (data: any) => {
    const optionValues = data.denominations.map(
      (denomination) => denomination.value
    )

    const options = [
      {
        title: "denomination",
        values: optionValues,
      },
    ]

    await mutateAsync(
      {
        options,
        variants: data.denominations.map((denomination) => ({
          id: denomination.id,
          title: denomination.value,
          manage_inventory: false,
          options: {
            denomination: denomination.value,
          },
        })),
      },
      {
        onSuccess: () => {
          toast.success(`Denominations updated successfully`)
          handleSuccess()
        },
        onError: (e) => {
          toast.error(e.message)
        },
      }
    )
  })

  const {
    fields: denominationsFields,
    append: addDenomination,
    remove: removeDenomination,
  } = useFieldArray({
    name: "denominations",
    control: form.control,
  })

  return (
    <RouteDrawer.Form form={form}>
      <KeyboundForm
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <RouteDrawer.Body className="flex flex-1 flex-col gap-y-8 overflow-y-auto">
          <div className="flex flex-col gap-y-6">
            <div>
              <div className="flex flex-col gap-y-2">
                {denominationsFields.map((denominationField, index) => {
                  return (
                    <div
                      key={denominationField.id}
                      className="shadow-elevation-card-rest bg-ui-bg-component transition-fg flex items-center justify-between rounded-md px-4 py-2"
                    >
                      <Form.Field
                        key={denominationField.id}
                        control={form.control}
                        name={`denominations.${index}.value`}
                        render={({ field }) => {
                          return (
                            <Form.Item className="w-full">
                              <Form.Control>
                                <Input {...field} placeholder="100" />
                              </Form.Control>

                              <Form.ErrorMessage />
                            </Form.Item>
                          )
                        }}
                      />

                      <div className="flex items-center rounded-xl">
                        <Button
                          size="small"
                          variant="secondary"
                          type="button"
                          className="ml-4 rounded-full p-0"
                          onClick={() => {
                            removeDenomination(index)
                          }}
                        >
                          <XCircleSolid className="rounded-full" />
                        </Button>
                      </div>
                    </div>
                  )
                })}

                <Button
                  size="small"
                  variant="secondary"
                  type="button"
                  className="w-full"
                  onClick={() => {
                    addDenomination({ value: "", prices: {} })
                  }}
                >
                  Add denomination
                </Button>

                {form.formState.errors.denominations && (
                  <Alert variant="error">
                    Please add at least one denomination.
                  </Alert>
                )}
              </div>
            </div>
          </div>
        </RouteDrawer.Body>

        <RouteDrawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
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
