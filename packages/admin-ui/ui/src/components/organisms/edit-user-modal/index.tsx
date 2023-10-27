import { useAdminRegions, useAdminUpdateUser } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import FormValidator from "../../../utils/form-validator"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import { NextSelect } from "../../molecules/select/next-select"
import { getOptions } from "../../../domain/settings/users-roles/utils"
import useRoles from "../../../domain/settings/users-roles/use-role"
import { UserWithRole } from "../../../types/users"
import { Option } from "../../../types/shared"

type EditUserModalProps = {
  handleClose: () => void
  user: UserWithRole
  onSuccess: () => void
}

type EditUserModalFormData = {
  first_name: string
  last_name: string
  role_id: any
  region_id: any
}

const defaultRole = {
  id: '',
  name: 'Superadmin'
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  handleClose,
  user,
  onSuccess,
}) => {
  const { mutate, isLoading } = useAdminUpdateUser(user.id)
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserModalFormData>()
  const notification = useNotification()
  const { t } = useTranslation()

  useEffect(() => {
    reset(mapUser(user))
  }, [user])

  const {get: getRoles, setRole, setRegion} = useRoles();
  
  const onSubmit = (data: EditUserModalFormData) => {
    const role_id = data.role_id?.value || '';
    const region_id = data.region_id?.value || '';
    delete data.role_id;
    delete data.region_id;
    mutate(data, {
      onSuccess: () => {
        setRole(user.id, role_id).then(res=>{
          setRegion(user.id, region_id).then(res=>{
            notification(
              t("edit-user-modal-success", "Success"),
              t("edit-user-modal-user-was-updated", "User was updated"),
              "success"
            )
            onSuccess()
          })
        })
      },
      onError: (error) => {
        notification(
          t("edit-user-modal-error", "Error"),
          getErrorMessage(error),
          "error"
        )
      },
      onSettled: () => {
        handleClose()
      },
    })
  }

  // Role options

  const [roleOptions, setRoleOptions] = useState<Option[]>();
  
  useEffect(()=>{
    getRoles().then(roles=>{
      setRoleOptions(getOptions(roles))
    })
  },[])

  // Regions options

  const { regions } = useAdminRegions({limit: 100})

  const regionOptions: Option[] = useMemo(() => {
    return (
      regions?.map((r) => ({
        label: r.name,
        value: r.id,
      })) || []
    )
  }, [regions])

  // Check

  return (
    <Modal handleClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">
              {t("edit-user-modal-edit-user", "Edit User")}
            </span>
          </Modal.Header>
          <Modal.Content>
            <div className="flex flex-col gap-4">
              <div className="gap-large grid w-full grid-cols-2">
                <InputField
                  label={t("edit-user-modal-first-name-label", "First Name")}
                  placeholder={t(
                    "edit-user-modal-first-name-placeholder",
                    "First name..."
                  )}
                  required
                  {...register("first_name", {
                    required: FormValidator.required("First name"),
                    pattern: FormValidator.whiteSpaceRule("First name"),
                    minLength: FormValidator.minOneCharRule("First name"),
                  })}
                  errors={errors}
                />
                <InputField
                  label={t("edit-user-modal-last-name-label", "Last Name")}
                  placeholder={t(
                    "edit-user-modal-last-name-placeholder",
                    "Last name..."
                  )}
                  required
                  {...register("last_name", {
                    required: FormValidator.required("Last name"),
                    pattern: FormValidator.whiteSpaceRule("Last name"),
                    minLength: FormValidator.minOneCharRule("last name"),
                  })}
                  errors={errors}
                />
              </div>
              <div>
                <InputField
                  label={t("edit-user-modal-email", "Email")}
                  disabled
                  value={user.email}
                />
              </div>
              <div>
                <Controller
                  name="role_id"
                  control={control}
                  render={({ field: { value, onChange, onBlur, ref } }) => {
                    return (
                      <NextSelect
                        label={t("edit-user-modal-role", "Role")}
                        placeholder={defaultRole.name}
                        onBlur={onBlur}
                        ref={ref}
                        onChange={onChange}
                        options={roleOptions}
                        value={value}
                        defaultValue={defaultRole.id}
                        isClearable
                        isSearchable
                      />
                    )
                  }}
                />
              </div>
              <div>
                <Controller
                  name="region_id"
                  control={control}
                  render={({ field: { value, onChange, onBlur, ref } }) => {
                    return (
                      <NextSelect
                        label={t("edit-user-modal-region", "Region restriction")}
                        placeholder={t("edit-user-modal-select-region", "No region restriction")}
                        onBlur={onBlur}
                        ref={ref}
                        onChange={onChange}
                        options={regionOptions}
                        value={value}
                        defaultValue={defaultRole}
                        isClearable
                        isSearchable
                      />
                    )
                  }}
                />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end">
              <Button
                variant="ghost"
                size="small"
                onClick={handleClose}
                className="mr-2"
              >
                {t("edit-user-modal-cancel", "Cancel")}
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                variant="primary"
                size="small"
              >
                {t("edit-user-modal-save", "Save")}
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

const mapUser = (user: UserWithRole): EditUserModalFormData => {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    role_id: user.teamRole ? getOptions([user.teamRole]).pop() : '',
    region_id: user.Region ? getOptions([user.Region]).pop() : ''
  }
}

export default EditUserModal
