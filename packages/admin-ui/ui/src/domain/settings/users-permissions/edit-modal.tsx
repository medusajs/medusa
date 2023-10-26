import { useTranslation } from "react-i18next"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { nestedForm } from "../../../utils/nested-form"
import MetadataForm, {
  getMetadataFormValues,
  getSubmittableMetadata,
  MetadataFormType,
} from "../../../components/forms/general/metadata-form"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import usePermissions, { PermissionsType, PermissionsDataType } from "./use-permission"
import InputField from "../../../components/molecules/input"

type Props = {
  permission: PermissionsType
  open?: boolean
  onClose?: () => void,
  onSuccess?: () => void
}

type GeneralFormWrapper = {
  name: string
  metadata: MetadataFormType
}

const EditPermissionModal = ({ permission, open, onClose, onSuccess }: Props) => {
  const { t } = useTranslation()
  const { update, updating } = usePermissions()
  const form = useForm<GeneralFormWrapper>({
    defaultValues: getDefaultValues(permission),
  })

  const {
    register,
    formState: { errors },
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  useEffect(() => {
    reset(getDefaultValues(permission))
  }, [permission, reset])

  const onReset = () => {
    reset(getDefaultValues(permission))
    onClose && onClose()
  }

  const onSubmit = handleSubmit((data) => {
    update(
      permission.id,
      {
        name: data.name,
        metadata: getSubmittableMetadata(data.metadata),
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
              "Edit Permission"
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
                {t("users-permissions-rules", "Rules")}
              </h2>
              <MetadataForm form={nestedForm(form, "metadata")} />
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
                {t("users-permissions-cancel-button", "Cancel")}
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={updating}
              >
                {t("users-permissions-save-button", "Save")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (permission: PermissionsDataType): GeneralFormWrapper => {
  return {
    name: permission.name,
    metadata: getMetadataFormValues(permission.metadata),
  }
}

export default EditPermissionModal
