import { useTranslation } from "react-i18next"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { nestedForm } from "../../../utils/nested-form"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import useRoles, { RolesType, RolesDataType } from "./use-role"
import InputField from "../../../components/molecules/input"

type Props = {
  role: RolesType
  open?: boolean
  onClose?: () => void,
  onSuccess?: () => void
}

type GeneralFormWrapper = {
  name: string
}

const EditRoleModal = ({ role, open, onClose, onSuccess }: Props) => {
  const { t } = useTranslation()
  const { update, updating } = useRoles()
  const form = useForm<GeneralFormWrapper>({
    defaultValues: getDefaultValues(role),
  })

  const {
    register,
    formState: { errors },
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  useEffect(() => {
    reset(getDefaultValues(role))
  }, [role, reset])

  const onReset = () => {
    reset(getDefaultValues(role))
    onClose && onClose()
  }

  const onSubmit = handleSubmit((data) => {
    update(
      role.id,
      {
        name: data.name,
      },
      onSuccess
    )
  })

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">
            {t(
              "users-premissions-edit-title",
              "Edit Role"
            )}
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div>
            <InputField
              label="Name"
              placeholder={"Name"}
              required
              {...register("name", {
                required: "Name is required",
              })}
              errors={errors}
            />
            </div>
            <div className="mt-xlarge">
              <h2 className="inter-base-semibold mb-base">
                {t("users-roles-roles", "Roles")}
              </h2>
              
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end gap-x-2">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                {t("users-roles-cancel-button", "Cancel")}
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={updating}
              >
                {t("users-roles-save-button", "Save")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (role: RolesDataType): GeneralFormWrapper => {
  return {
    name: role.name,
  }
}

export default EditRoleModal
