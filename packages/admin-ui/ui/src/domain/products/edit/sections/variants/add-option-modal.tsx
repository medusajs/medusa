import { Product } from "@medusajs/medusa"
import { useAdminCreateProductOption } from "medusa-react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import InputField from "../../../../../components/molecules/input"
import Modal from "../../../../../components/molecules/modal"

type Props = {
  onClose: () => void
  open: boolean
  product: Product
}

const AddOptionModal = ({ open, onClose, product }: Props) => {
  const form = useForm<{ title: string; initial_value: string }>({
    defaultValues: {
      title: "",
      initial_value: "",
    },
  })

  const { mutateAsync: create, isLoading: creating } =
    useAdminCreateProductOption(product.id)

  const { handleSubmit, reset } = form

  const resetAndClose = () => {
    reset()
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    create(data, {
      onSuccess: () => {
        resetAndClose()
      },
    })
  })

  return (
    <Modal open={open} handleClose={resetAndClose}>
      <Modal.Body>
        <Modal.Header handleClose={resetAndClose}>
          <h1 className="inter-xlarge-semibold">Add Option</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div className="flex gap-4">
              <InputField
                required
                label="Option name"
                placeholder="Color, Size, etc"
                {...form.register(`title`, {
                  required: `Option name is required`,
                })}
                errors={form.formState.errors}
              />
              {product.variants.length > 0 && (
                <InputField
                  required
                  label="Default value"
                  placeholder="Red, Small, etc"
                  {...form.register(`initial_value`, {
                    required: `Default value is required`,
                  })}
                  errors={form.formState.errors}
                  tooltipContent="This will be applied to all existing variants"
                />
              )}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center gap-x-xsmall justify-end w-full">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={resetAndClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                loading={creating}
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

export default AddOptionModal
