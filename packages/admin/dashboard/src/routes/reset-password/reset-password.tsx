import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, Button, Heading, Input, Text, toast } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link, useSearchParams } from "react-router-dom"
import * as z from "zod"

import { Form } from "../../components/common/form"
import { LogoBox } from "../../components/common/logo-box"
import {
  useResetPasswordForEmailPass,
  useUpdateProviderForEmailPass,
} from "../../hooks/api/auth"
import { useState } from "react"
import { decodeToken } from "react-jwt"
import { i18n } from "../../components/utilities/i18n"

const ResetPasswordInstructionsSchema = z.object({
  email: z.string().email(),
})

const ResetPasswordSchema = z
  .object({
    password: z.string().min(1),
    repeat_password: z.string().min(1),
  })
  .superRefine(({ password, repeat_password }, ctx) => {
    if (password !== repeat_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t("resetPassword.passwordMismatch"),
        path: ["repeat_password"],
      })
    }
  })

const ResetPasswordTokenSchema = z.object({
  id: z.string(),
  jti: z.string(),
  exp: z.number(),
  iat: z.number(),
})

type DecodedResetPasswordToken = {
  id: string
  jti: any
  exp: string
  iat: number
  email: string
}

const validateDecodedResetPasswordToken = (
  decoded: any
): decoded is DecodedResetPasswordToken => {
  return ResetPasswordTokenSchema.safeParse(decoded).success
}

const ChooseNewPassword = ({ token }: { token: string }) => {
  const { t } = useTranslation()

  const [searchParams] = useSearchParams()
  const [showAlert, setShowAlert] = useState(false)

  const invite: DecodedResetPasswordToken | null = token
    ? decodeToken(token)
    : null

  const isValidResetPasswordToken =
    invite && validateDecodedResetPasswordToken(invite)

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      repeat_password: "",
    },
  })

  const { mutateAsync, isPending } = useUpdateProviderForEmailPass()

  const handleSubmit = form.handleSubmit(async ({ password }) => {
    try {
      await mutateAsync({
        password,
      })
    } catch (error) {
      toast.error(error.message)
    }
  })

  return (
    <div className="bg-ui-bg-base flex min-h-dvh w-dvw items-center justify-center">
      <div className="m-4 flex w-full max-w-[300px] flex-col items-center">
        <LogoBox className="mb-4" />
        <div className="mb-4 flex flex-col items-center">
          <Heading>{t("resetPassword.resetPassword")}</Heading>
          <Text size="small" className="text-ui-fg-subtle text-center">
            {t("resetPassword.newPasswordHint")}
          </Text>
        </div>
        <div className="flex w-full flex-col gap-y-3">
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-y-6"
            >
              <div className="flex flex-col gap-y-4">
                <Input type="email" disabled value={"test@test.com"} />
                <Form.Field
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.password")}</Form.Label>
                        <Form.Control>
                          <Input
                            autoComplete="new-password"
                            type="password"
                            {...field}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="repeat_password"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.repeatPassword")}</Form.Label>
                        <Form.Control>
                          <Input
                            autoComplete="off"
                            type="password"
                            {...field}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              <Button className="w-full" type="submit" isLoading={isPending}>
                {t("resetPassword.resetPassword")}
              </Button>
            </form>
            {showAlert && (
              <Alert dismissible variant="success">
                <div className="flex flex-col">
                  <span className="text-ui-fg-base mb-1">
                    {t("resetPassword.successfulRequestTitle")}
                  </span>
                  <span>{t("resetPassword.successfulRequest")}</span>
                </div>
              </Alert>
            )}
          </Form>
        </div>
        <span className="txt-small my-6">
          <Trans
            i18nKey="resetPassword.backToLogin"
            components={[
              <Link
                key="login-link"
                to="/login"
                className="text-ui-fg-interactive transition-fg hover:text-ui-fg-interactive-hover focus-visible:text-ui-fg-interactive-hover outline-none"
              />,
            ]}
          />
        </span>
      </div>
    </div>
  )
}

export const ResetPassword = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [showAlert, setShowAlert] = useState(false)

  const token = searchParams.get("token")

  if (token) {
    return <ChooseNewPassword token={token} />
  }

  const form = useForm<z.infer<typeof ResetPasswordInstructionsSchema>>({
    resolver: zodResolver(ResetPasswordInstructionsSchema),
    defaultValues: {
      email: "",
    },
  })

  const { mutateAsync, isPending } = useResetPasswordForEmailPass()

  const handleSubmit = form.handleSubmit(async ({ email }) => {
    try {
      await mutateAsync({
        email,
      })
      form.setValue("email", "")
      setShowAlert(true)
    } catch (error) {
      toast.error(error.message)
    }
  })

  return (
    <div className="bg-ui-bg-base flex min-h-dvh w-dvw items-center justify-center">
      <div className="m-4 flex w-full max-w-[300px] flex-col items-center">
        <LogoBox className="mb-4" />
        <div className="mb-4 flex flex-col items-center">
          <Heading>{t("resetPassword.resetPassword")}</Heading>
          <Text size="small" className="text-ui-fg-subtle text-center">
            {t("resetPassword.hint")}
          </Text>
        </div>
        <div className="flex w-full flex-col gap-y-3">
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-y-6"
            >
              <div className="mt-4 flex flex-col gap-y-3">
                <Form.Field
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Control>
                          <Input
                            autoComplete="email"
                            {...field}
                            placeholder={t("fields.email")}
                          />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
              </div>
              {showAlert && (
                <Alert dismissible variant="success">
                  <div className="flex flex-col">
                    <span className="text-ui-fg-base mb-1">
                      {t("resetPassword.successfulRequestTitle")}
                    </span>
                    <span>{t("resetPassword.successfulRequest")}</span>
                  </div>
                </Alert>
              )}
              <Button className="w-full" type="submit" isLoading={isPending}>
                {t("resetPassword.sendResetInstructions")}
              </Button>
            </form>
          </Form>
        </div>
        <span className="txt-small my-6">
          <Trans
            i18nKey="resetPassword.backToLogin"
            components={[
              <Link
                key="login-link"
                to="/login"
                className="text-ui-fg-interactive transition-fg hover:text-ui-fg-interactive-hover focus-visible:text-ui-fg-interactive-hover outline-none"
              />,
            ]}
          />
        </span>
      </div>
    </div>
  )
}
