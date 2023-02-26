import { Product } from "@medusajs/medusa"
import {
  useAdminCreateProductOption,
  useAdminDeleteProductOption,
  useAdminUpdateProductOption,
} from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import PlusIcon from "../../../../../components/fundamentals/icons/plus-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import InputField from "../../../../../components/molecules/input"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import FormValidator from "../../../../../utils/form-validator"
import { useOptionsContext } from "./options-provider"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

type Option = {
  id: string | null
  title: string
}

type OptionsForm = {
  options: Option[]
}

const OptionsModal = ({ product, open, onClose }: Props) => {
  const { mutate: update, isLoading: updating } = useAdminUpdateProductOption(
    product.id
  )
  const { mutate: create, isLoading: creating } = useAdminCreateProductOption(
    product.id
  )
  const { mutate: del, isLoading: deleting } = useAdminDeleteProductOption(
    product.id
  )

  const { refetch } = useOptionsContext()

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<OptionsForm>({
    defaultValues: getDefaultValues(product),
  })

  const { fields, remove, append } = useFieldArray({
    name: "options",
    control,
    shouldUnregister: true,
  })

  const notification = useNotification()

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product])

  const handleClose = () => {
    reset(getDefaultValues(product))
    onClose()
  }

  const handleAddAnOption = () => {
    append({ title: "", id: null })
  }

  const isSubmitting = useMemo(() => {
    return updating || creating || deleting
  }, [updating, creating, deleting])

  const onSubmit = handleSubmit((data) => {
    const errors: string[] = []

    const toCreate: Option[] = []
    const toUpdate: Option[] = []
    const toDelete: Option[] = product.options.filter(
      (o) => data.options.find((d) => d.id === o.id) === undefined
    )

    data.options.forEach((option) => {
      if (option.id) {
        toUpdate.push(option)
      } else {
        toCreate.push(option)
      }
    })

    toCreate.forEach((option) => {
      create(
        {
          title: option.title,
        },
        {
          onError: () => {
            errors.push(`create ${option.title}`)
          },
          onSuccess: () => {
            refetch()
          },
        }
      )
    })

    toUpdate.forEach((option) => {
      update(
        {
          option_id: option.id!,
          title: option.title,
        },
        {
          onError: () => {
            errors.push(`update ${option.title}`)
          },
          onSuccess: () => {
            refetch()
          },
        }
      )
    })

    toDelete.forEach((option) => {
      del(option.id!, {
        onError: () => {
          errors.push(`delete ${option.title}`)
        },
        onSuccess: () => {
          refetch()
        },
      })
    })

    if (errors.length === toCreate.length + toUpdate.length + toDelete.length) {
      notification("Error", "Failed to update product options", "error")
      return
    }

    if (errors.length > 0) {
      notification(
        "Warning",
        "Failed to; " + errors.join(", ") + ".",
        "warning"
      )
    }

    refetch()
    notification("Success", "Successfully updated product options", "success")
    handleClose()
  })

  return (
    <Modal open={open} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <h1 className="inter-xlarge-semibold">Edit Options</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <h2 className="inter-large-semibold mb-base">Product options</h2>
            <div className="flex flex-col gap-y-small">
              <p className="inter-small-semibold text-grey-50">Option title</p>
              <div className="flex flex-col gap-y-xsmall">
                {fields.map((field, index) => {
                  return (
                    <div
                      className="grid grid-cols-[1fr,40px] gap-x-xsmall"
                      key={field.id}
                    >
                      <InputField
                        key={field.id}
                        placeholder="Color"
                        {...register(`options.${index}.title`, {
                          required: "Option title is required",
                          minLength: FormValidator.minOneCharRule(
                            "Option title"
                          ),
                          pattern: FormValidator.whiteSpaceRule("Option title"),
                        })}
                        errors={errors}
                      />
                      <Button
                        variant="secondary"
                        className="px-2.5 py-2.5 max-h-[40px]"
                        type="button"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon className="text-grey-40" size="20" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full h-10 mt-base"
              type="button"
              onClick={handleAddAnOption}
            >
              <PlusIcon size="20" /> Add an option
            </Button>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end gap-xsmall w-full">
              <Button variant="secondary" size="small" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                disabled={!isDirty}
                loading={isSubmitting}
              >
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product) => {
  return {
    options: product.options.map((option) => ({
      title: option.title,
      id: option.id,
    })),
  }
}

export default OptionsModal
