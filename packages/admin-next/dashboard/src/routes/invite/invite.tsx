import { UserRoles } from "@medusajs/medusa"
import { Button, Heading, Input, Text, Tooltip } from "@medusajs/ui"
import { Trans, useTranslation } from "react-i18next"
import { decodeToken } from "react-jwt"
import { Link, useSearchParams } from "react-router-dom"
import * as z from "zod"

import { zodResolver } from "@hookform/resolvers/zod"
import { useAdminAcceptInvite } from "medusa-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form } from "../../components/common/form"
import { LogoBox } from "../../components/common/logo-box"

const CreateAccountSchema = z
  .object({
    email: z.string().email(),
    first_name: z.string(),
    last_name: z.string(),
    password: z.string(),
    repeat_password: z.string(),
  })
  .superRefine(({ password, repeat_password }, ctx) => {
    if (password !== repeat_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["repeat_password"],
      })
    }
  })

export const Invite = () => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [success, setSuccess] = useState(false)

  let tokenStatus: "valid" | "invalid" | "expired" = "valid"
  const decodedToken: {
    invite_id: string
    role: UserRoles
    user_email: string
    iat: number
  } | null = token ? decodeToken(token) : null

  if (!decodedToken) {
    tokenStatus = "invalid"
  }

  const form = useForm<z.infer<typeof CreateAccountSchema>>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      email: decodedToken?.user_email || "",
      first_name: "",
      last_name: "",
      password: "",
      repeat_password: "",
    },
  })

  const { mutateAsync, isLoading } = useAdminAcceptInvite()

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        user: {
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
        },
        token: token!,
      },
      {
        onSuccess: () => {
          setSuccess(true)
        },
        onError: (error) => {
          console.log(error)
        },
      }
    )
  })

  return (
    <div className="flex items-center justify-center min-h-dvh w-dvw bg-ui-bg-base">
      <div className="max-w-[300px] w-full m-4 flex flex-col items-center">
        <LogoBox className="mb-4" />
        <div className="flex flex-col items-center mb-4">
          <Heading>{t("invite.title")}</Heading>
          <Text size="small" className="text-ui-fg-subtle text-center">
            {t("invite.hint")}
          </Text>
        </div>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full gap-y-6"
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
                        <Tooltip content={t("invite.emailTooltip")}>
                          <Input autoComplete="off" {...field} disabled />
                        </Tooltip>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="first_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.firstName")}</Form.Label>
                      <Form.Control>
                        <Input autoComplete="given-name" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
              <Form.Field
                control={form.control}
                name="last_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>{t("fields.lastName")}</Form.Label>
                      <Form.Control>
                        <Input autoComplete="family-name" {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )
                }}
              />
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
                        <Input autoComplete="off" type="password" {...field} />
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
              {t("invite.createAccount")}
            </Button>
          </form>
        </Form>
        <div className="w-full h-px border-b border-dotted my-6" />
        <span className="text-ui-fg-subtle txt-small">
          <Trans
            t={t}
            i18nKey="invite.alreadyHaveAccount"
            components={[
              <Link
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
