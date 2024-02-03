import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Input, Text } from "@medusajs/ui"
import { useAdminResetPassword } from "medusa-react"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { decodeToken } from "react-jwt"
import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import * as z from "zod"

import { Clock } from "@medusajs/icons"
import { useEffect, useState } from "react"
import { Form } from "../../../components/common/form"
import { LogoBox } from "../../../components/common/logo-box"

const ResetPasswordTokenSchema = z
  .object({
    email: z.string().email(),
    new_password: z.string(),
    repeat_new_password: z.string(),
  })
  .superRefine(({ new_password, repeat_new_password }, ctx) => {
    if (new_password !== repeat_new_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["repeat_new_password"],
      })
    }
  })

export const ResetPasswordToken = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { token } = useParams()

  let tokenStatus: "valid" | "invalid" | "expired" = "valid"
  const decodedToken: { email: string; exp: number } | null = token
    ? decodeToken(token)
    : null

  if (!decodedToken) {
    tokenStatus = "invalid"
  }

  const expiresAt = decodedToken ? new Date(decodedToken.exp * 1000) : null

  if (expiresAt && expiresAt < new Date()) {
    tokenStatus = "expired"
  }

  const redirectLink = `/reset-password${
    decodedToken ? `?email=${decodedToken.email}` : ""
  }`

  const form = useForm<z.infer<typeof ResetPasswordTokenSchema>>({
    resolver: zodResolver(ResetPasswordTokenSchema),
    defaultValues: {
      email: decodedToken?.email || "",
      new_password: "",
      repeat_new_password: "",
    },
  })

  const { mutateAsync, isLoading } = useAdminResetPassword({
    retry: false,
  })

  const handleSubmit = form.handleSubmit(async ({ new_password }) => {
    await mutateAsync(
      { password: new_password, token: token! },
      {
        onSuccess: () => {
          navigate("/orders")
        },
        onError: (_error) => {
          form.setError("root", {
            type: "manual",
            message: t("errors.serverError"),
          })
        },
      }
    )
  })

  const [title, hint] = {
    valid: [t("resetPassword.title"), t("resetPassword.newPasswordHint")],
    invalid: [
      t("resetPassword.invalidTokenTitle"),
      t("resetPassword.invalidTokenHint"),
    ],
    expired: [
      t("resetPassword.expiredTokenTitle"),
      t("resetPassword.invalidTokenHint"),
    ],
  }[tokenStatus]

  return (
    <div className="min-h-dvh w-dvw bg-ui-bg-base flex items-center justify-center">
      <div className="m-4 flex w-full max-w-[300px] flex-col items-center">
        <LogoBox className="mb-4" />
        <div className="mb-4 flex flex-col items-center">
          <Heading>{title}</Heading>
          <Text
            size="small"
            className="text-ui-fg-subtle text-pretty text-center"
          >
            {hint}
          </Text>
        </div>
        {tokenStatus === "valid" ? (
          <Form {...form}>
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-y-6"
            >
              <div className="flex flex-col gap-y-4">
                <Form.Field
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.email")}</Form.Label>
                        <Form.Control>
                          <Input autoComplete="off" {...field} disabled />
                        </Form.Control>
                        <Form.ErrorMessage />
                      </Form.Item>
                    )
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="new_password"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.newPassword")}</Form.Label>
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
                  name="repeat_new_password"
                  render={({ field }) => {
                    return (
                      <Form.Item>
                        <Form.Label>{t("fields.repeatNewPassword")}</Form.Label>
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
                {form.formState.errors.root && (
                  <span>{form.formState.errors.root.message}</span>
                )}
              </div>
              <Button className="w-full" type="submit" isLoading={isLoading}>
                {t("resetPassword.resetPassword")}
              </Button>
              {expiresAt && <Countdown expiresAt={expiresAt} />}
            </form>
          </Form>
        ) : (
          <Button variant="secondary" asChild className="w-full">
            <Link to={redirectLink} replace>
              {t("resetPassword.goToResetPassword")}
            </Link>
          </Button>
        )}
        <div className="my-6 h-px w-full border-b border-dotted" />
        <span className="text-ui-fg-subtle txt-small">
          <Trans
            t={t}
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

const Countdown = ({ expiresAt }: { expiresAt: Date }) => {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState<number>(
    Math.floor((expiresAt.getTime() - Date.now()) / 1000)
  )

  // Total time is 15 minutes
  const totalTime = 15 * 60

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(Math.floor((expiresAt.getTime() - Date.now()) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const timespan = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`

  const percentageLeft = ((timeLeft / totalTime) * 100).toFixed(2)

  const isExpired = timeLeft <= 0

  if (isExpired) {
    return <Navigate to="." replace />
  }

  return (
    <div className="bg-ui-bg-subtle border-ui-border-base txt-compact-small relative w-full rounded-lg border p-2">
      <div className="absolute inset-0 flex overflow-hidden rounded-lg">
        <div
          className="bg-ui-bg-subtle-hover h-full transition-[width]"
          style={{
            width: `${percentageLeft}%`,
          }}
        />
      </div>
      <div className="text-ui-fg-subtle relative z-10 flex items-center gap-x-2">
        <Clock className="text-ui-tag-neutral-icon" />
        <span>
          <Trans
            t={t}
            i18nKey={"resetPassword.tokenExpiresIn"}
            values={{ time: timespan }}
            components={[<span key="countdown" className="tabular-nums" />]}
          />
        </span>
      </div>
    </div>
  )
}
