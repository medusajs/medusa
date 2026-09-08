import { zodResolver } from "@hookform/resolvers/zod"
import type { AuthTypes } from "@medusajs/types"
import { Alert, Button, Hint, Input } from "@medusajs/ui"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import * as z from "zod"

import { Form } from "../../../components/common/form"
import { useSignInWithEmailPass } from "../../../hooks/api"
import { isFetchError } from "../../../lib/is-fetch-error"

const EmailPassSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type EmailPassLoginProps = {
  onMfaChallenge?: (
    challenge: AuthTypes.AuthMfaChallengeDTO,
    onSuccess: (token: string) => void | Promise<void>
  ) => void
}

export const EmailPassLogin = ({ onMfaChallenge }: EmailPassLoginProps) => {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const from = location.state?.from?.pathname || "/orders"

  const form = useForm<z.infer<typeof EmailPassSchema>>({
    resolver: zodResolver(EmailPassSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutateAsync, isPending } = useSignInWithEmailPass()

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

              return
            }
          }

          form.setError("root.serverError", {
            type: "manual",
            message: error.message,
          })
        },
        onSuccess: (result) => {
          if (typeof result === "object" && "mfa_challenge" in result) {
            onMfaChallenge?.(result.mfa_challenge, () => {
              navigate(from, { replace: true })
            })
            return
          }

          navigate(from, { replace: true })
        },
      }
    )
  })

  const serverError = form.formState.errors?.root?.serverError?.message
  const validationError =
    form.formState.errors.email?.message ||
    form.formState.errors.password?.message

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-y-6">
        <div className="flex flex-col gap-y-1">
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
                      className="bg-ui-bg-field-component"
                      placeholder={t("fields.email")}
                    />
                  </Form.Control>
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
                  <Form.Label>{}</Form.Label>
                  <Form.Control>
                    <Input
                      type="password"
                      autoComplete="current-password"
                      {...field}
                      className="bg-ui-bg-field-component"
                      placeholder={t("fields.password")}
                    />
                  </Form.Control>
                </Form.Item>
              )
            }}
          />
        </div>
        {validationError && (
          <div className="text-center">
            <Hint className="inline-flex" variant={"error"}>
              {validationError}
            </Hint>
          </div>
        )}
        {serverError && (
          <Alert
            className="bg-ui-bg-base items-center p-2"
            dismissible
            variant="error"
          >
            {serverError}
          </Alert>
        )}
        <Button className="w-full" type="submit" isLoading={isPending}>
          {t("actions.continueWithEmail")}
        </Button>
      </form>
    </Form>
  )
}
