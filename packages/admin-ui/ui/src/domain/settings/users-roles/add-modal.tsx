import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import useRoles from "./use-role"
import InputField from "../../../components/molecules/input"
import { OptionsType, getPermissionsOptions, getOptionsValues } from "./utils"
import usePermissions from "../users-permissions/use-permission"
import { NextSelect } from "../../../components/molecules/select/next-select"
import FormValidator from "../../../utils/form-validator"

type Props = {
  open?: boolean
  onClose?: () => void,
  onSuccess?: () => void
}

type GeneralFormWrapper = {
  name: string
  permissions: OptionsType[]
}

const AddRoleModal = ({ open, onClose, onSuccess }: Props) => {
  const { t } = useTranslation()
  const { create, isLoading } = useRoles()
  const { get: getOptions } = usePermissions();
  const [permissionsOptions, setPermissionsOptions] = useState<OptionsType[]>();
  
  useEffect(()=>{
    getOptions().then(options=>{
      setPermissionsOptions(
        getPermissionsOptions(options)
      );
    })
  },[])

  const form = useForm<GeneralFormWrapper>({
    defaultValues: getDefaultValues(),
  })

  const {
    register,
    formState: { errors },
    formState: { isDirty },
    handleSubmit,
    reset,
    control
  } = form

  useEffect(() => {
    reset(getDefaultValues())
  }, [reset])

  const onReset = () => {
    reset(getDefaultValues())
    onClose && onClose()
  }

  const onSubmit = handleSubmit((data) => {
    create(
      {
        name: data.name,
        permissions: getOptionsValues(data.permissions)
      },
      onSuccess
    )
  })

  if(!permissionsOptions)
    return null;

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">
            {t(
              "users-premissions-add-title",
              "Add Role"
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
            <div className="mt-large">
              <Controller
                name={"permissions"}
                control={control}
                rules={{
                  required: FormValidator.required("Permissions"),
                }}
                render={({ field: { value, onChange, name, ref } }) => {
                  return (
                    <NextSelect
                      name={name}
                      ref={ref}
                      value={value}
                      onChange={(value) => {
                        onChange(value)
                      }}
                      label="Choose permissions"
                      isMulti={true}
                      selectAll={false}
                      isSearchable
                      required
                      options={permissionsOptions}
                      errors={errors}
                    />
                  )
                }}
              />
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
                loading={isLoading}
              >
                {t("users-roles-add-button", "Add")}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (): GeneralFormWrapper => {
  return {
    name: '',
    permissions: [],
  }
}

export default AddRoleModal
