import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, Button, Heading, Input, Text } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link, useLocation, useNavigate } from "react-router-dom"
import * as z from "zod"

import { Divider } from "../../components/common/divider"
import { Form } from "../../components/common/form"
import { LogoBox } from "../../components/common/logo-box"
import { useSignInWithEmailPassword } from "../../hooks/api/auth"

import after from "virtual:medusa/widgets/login/after"
import before from "virtual:medusa/widgets/login/before"
import { isFetchError } from "../../lib/is-fetch-error"

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const Login = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from?.pathname || "/orders"

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutateAsync, isPending } = useSignInWithEmailPassword()

  const handleSubmit = form.handleSubmit(async ({ email, password }) => {
    await mutateAsync(
      {
        email,
        password,
      },
      {
        onError: (error) => {
          if (isFetchError(error)) {
            if (error.status === 401) {
              form.setError("email", {
                type: "manual",
                message: error.message,
              })
            }
          }

          form.setError("root.serverError", {
            type: "manual",
            message: error.message,
          })
        },
        onSuccess: () => {
          navigate(from, { replace: true })
        },
      }
    )
  })

  const serverError = form.formState.errors?.root?.serverError?.message

  return (
    <div className="bg-ui-bg-base flex min-h-dvh w-dvw items-center justify-center">
      <div className="m-4 flex w-full max-w-[300px] flex-col items-center">
        <LogoBox className="mb-4" />
        <div className="mb-4 flex flex-col items-center">
          <Heading>{t("login.title")}</Heading>
          <Text size="small" className="text-ui-fg-subtle text-center">
            {t("login.hint")}
          </Text>
        </div>
        <div className="flex w-full flex-col gap-y-3">
          {before.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            )
          })}
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
                          <Input autoComplete="email" {...field} />
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
                            type="password"
                            autoComplete="current-password"
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
                {t("actions.continue")}
              </Button>
            </form>
            {serverError && (
              <Alert className="mt-4" dismissible variant="error">
                {serverError}
              </Alert>
            )}
          </Form>
          {after.widgets.map((w, i) => {
            return (
              <div key={i}>
                <w.Component />
              </div>
            )
          })}
        </div>
        <Divider variant="dashed" className="my-6" />
        <span className="text-ui-fg-subtle txt-small">
          <Trans
            i18nKey="login.forgotPassword"
            components={[
              <Link
                key="reset-password-link"
                to="/reset-password"
                className="text-ui-fg-interactive transition-fg hover:text-ui-fg-interactive-hover focus-visible:text-ui-fg-interactive-hover outline-none"
              />,
            ]}
          />
        </span>
      </div>
    </div>
  )
}
