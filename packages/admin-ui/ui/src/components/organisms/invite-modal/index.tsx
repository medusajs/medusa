import { useAdminRegions } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import useNotification from "../../../hooks/use-notification"
import { Option, Role } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"
import { NextSelect } from "../../molecules/select/next-select"
import useRoles from "../../../domain/settings/users-roles/use-role"
import { getOptions } from "../../../domain/settings/users-roles/utils"
import { defaultRegion, defaultRole } from "../edit-user-modal"
import { useAdminCreateInviteWithRole } from "../../../hooks/use-invites"

type InviteModalProps = {
  handleClose: () => void
}

export type InviteModalFormData = {
  user: string
  role: Role
  role_id: Option
  region_id: Option
}

const InviteModal: React.FC<InviteModalProps> = ({ handleClose }) => {
  const notification = useNotification()
  const { t } = useTranslation()

  const { mutate, isLoading } = useAdminCreateInviteWithRole()

  const { control, register, handleSubmit } = useForm<InviteModalFormData>()

  const {get: getRoles} = useRoles();

  const onSubmit = (data: InviteModalFormData) => {
    mutate(
      {
        user: data.user,
        role: 'member',
        role_id: data.role_id?.value || '',
        region_id: data.region_id?.value || ''
      },
      {
        onSuccess: () => {
          notification(
            t("invite-modal-success", "Success"),
            t(
              "invite-modal-invitation-sent-to",
              "Invitation sent to {{user}}",
              {
                user: data.user,
              }
            ),
            "success"
          )
          handleClose()
        },
        onError: (error) => {
          notification(
            t("invite-modal-error", "Error"),
            getErrorMessage(error),
            "error"
          )
        },
      }
    )
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

  return (
    <Modal handleClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">
              {t("invite-modal-invite-users", "Invite Users")}
            </span>
          </Modal.Header>
          <Modal.Content>
            <div className="gap-y-base flex flex-col">
              <div>
                <InputField
                  label={t("invite-modal-email", "Email")}
                  placeholder="lebron@james.com"
                  required
                  {...register("user", { required: true })}
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
                        defaultValue={defaultRegion.id}
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
            <div className="flex h-8 w-full justify-end">
              <Button
                variant="ghost"
                className="text-small mr-2 w-32 justify-center"
                size="large"
                type="button"
                onClick={handleClose}
              >
                {t("invite-modal-cancel", "Cancel")}
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                size="large"
                className="text-small w-32 justify-center"
                variant="primary"
              >
                {t("invite-modal-invite", "Invite")}
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default InviteModal
