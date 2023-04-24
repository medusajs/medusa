import { useForm } from "react-hook-form"
import { CustomProductField } from "."
import TextInput from "../../../../../components/atoms/text-input"
import Button from "../../../../../components/fundamentals/button"
import InputField from "../../../../../components/molecules/input"
import Modal from "../../../../../components/molecules/modal"
import TextArea from "../../../../../components/molecules/textarea"

export interface EditCustomFieldModalProps {
  field: CustomProductField
  save: (field: CustomProductField) => void
  handleClose: () => void
}

interface CustomFieldForm {
  label: string
  value: string
}

export const EditCustomFieldModal = ({
  save,
  handleClose,
  field,
}: EditCustomFieldModalProps) => {
  const form = useForm<CustomFieldForm>({
    defaultValues: { label: field.label, value: field.value },
  })

  const {
    register,
    formState: { isDirty, isSubmitting },
    handleSubmit,
  } = form

  const onSubmit = (values: CustomFieldForm) => {
    save({ ...field, ...values })
    handleClose()
  }

  return (
    <Modal isLargeModal={true} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <h1 className="inter-xlarge-semibold">Edit {field.label}</h1>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Content>
            <div className="flex flex-col gap-y-small">
              <div className="flex flex-col gap-y-xsmall">
                <InputField
                  label="Label"
                  className="mb-small"
                  {...register("label")}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-small">
              <div className="flex flex-col gap-y-xsmall">
                <TextArea
                  label="Content"
                  rows={5}
                  className="mb-small"
                  resize={true}
                  {...register("value")}
                />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-2">
              <Button
                onClick={() => handleClose()}
                variant="ghost"
                size="small"
                type="button"
              >
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
