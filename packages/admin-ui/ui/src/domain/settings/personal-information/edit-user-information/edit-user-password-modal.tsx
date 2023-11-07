import { User } from "@medusajs/medusa"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import SigninInput from "../../../../components/molecules/input-signin"
import InputError from "../../../../components/atoms/input-error"
import FormValidator from "../../../../utils/form-validator"
import { useAdminChangePassword } from "../../../../hooks/use-password"

type Props = {
  user: Omit<User, "password_hash">
  open: boolean
  onClose: () => void
}

type EditPasswordFormType = {
  password: string | null
  repeat_password: string | null
}

const EditUserPasswordModal = ({ user, open, onClose }: Props) => {
  const { mutate, isLoading: isSubmitting } = useAdminChangePassword()
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<EditPasswordFormType>({
    defaultValues: {},
  })

  useEffect(() => {
    reset({})
  }, [open, user])

  const notification = useNotification()

  const onSubmit = handleSubmit((data) => {

    if(data.password?.length && data.password.length < 5) {
      setError(
        "password",
        {
          type: "manual",
          message: "Passwords length must be 5 chars and more",
        },
        {
          shouldFocus: true,
        }
      )

      return
    }

    if (data.password !== data.repeat_password) {
      setError(
        "repeat_password",
        {
          type: "manual",
          message: "Passwords do not match",
        },
        {
          shouldFocus: true,
        }
      )

      return
    }

    mutate(
      // @ts-ignore
      data,
      {
        onSuccess: () => {
          notification(
            t("edit-user-information-success", "Success"),
            t(
              "edit-user-information-your-password-was-successfully-changed",
              "Your password was successfully changed"
            ),
            "success"
          )
          onClose()
        },
        onError: () => {},
      }
    )
  })

  return (
    <Modal handleClose={onClose} open={open} isLargeModal={false}>
      <Modal.Header handleClose={onClose}>
        <h1 className="inter-xlarge-semibold">
          {t("edit-user-information-edit-password", "Change password")}
        </h1>
      </Modal.Header>
      <Modal.Body>
        <Modal.Content>
          <div className="gap-y-base flex flex-col">
            <div>
              <SigninInput
                  placeholder="New password"
                  type={"password"}
                  {...register("password", {
                    required: FormValidator.required("Password"),
                  })}
                  autoComplete="new-password"
                  className="!w-full"
              />
              <InputError errors={errors} name="password" />
            </div>
            <div>
              <SigninInput
                  placeholder="Confirm password"
                  type={"password"}
                  {...register("repeat_password", {
                    required: "You must confirm your password",
                  })}
                  autoComplete="new-password"
                  className="!w-full"
              />
              <InputError errors={errors} name="repeat_password" />
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer className="border-grey-20 pt-base border-t">
          <div className="gap-x-xsmall flex w-full items-center justify-end">
            <Button variant="secondary" size="small" onClick={onClose}>
              {t("edit-user-information-cancel", "Cancel")}
            </Button>
            <Button
              variant="primary"
              size="small"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={onSubmit}
            >
              {t("edit-user-information-submit-and-close", "Submit and close")}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default EditUserPasswordModal
