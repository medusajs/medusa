import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, Button, Heading, Input, Text } from "@medusajs/ui"
import { motion } from "framer-motion"
import { useAdminSendResetPasswordToken } from "medusa-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link, useSearchParams } from "react-router-dom"
import * as z from "zod"

import { Form } from "../../../components/common/form"
import { LogoBox } from "../../../components/common/logo-box"

const ResetPasswordSchema = z.object({
  email: z.string().email(),
})

export const ResetPassword = () => {
  const { t } = useTranslation()
  const [success, setSuccess] = useState(false)
  const [searchParams] = useSearchParams()

  const defaultValue = searchParams.get("email") || ""

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: defaultValue,
    },
  })

  const { mutateAsync } = useAdminSendResetPasswordToken({
    retry: false,
  })

  const handleSubmit = form.handleSubmit(async ({ email }) => {
    await mutateAsync(
      { email },
      {
        onSuccess: () => {
          setSuccess(true)
        },
        onError: (_error) => {
          /**
           * This endpoint is not supposed to return any errors.
           * If it does, we can assume it's a server error.
           */
          setSuccess(false)
          form.setError("root", {
            type: "manual",
            message: t("errors.serverError"),
          })
        },
      }
    )
  })

  return (
    <div className="min-h-dvh w-dvw bg-ui-bg-base flex items-center justify-center">
      <div className="m-4 flex w-full max-w-[300px] flex-col items-center">
        <LogoBox className="mb-4" checked={success} />
        <div className="mb-4 flex flex-col items-center">
          <Heading>{t("resetPassword.title")}</Heading>
          <Text
            size="small"
            className="text-ui-fg-subtle text-pretty text-center"
          >
            {t("resetPassword.hint")}
          </Text>
        </div>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col gap-y-6"
          >
            <div className="flex flex-col">
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
              {success && (
                <motion.div
                  initial={{
                    opacity: 0,
                    height: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    y: 0,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  layout
                >
                  <Alert variant="success" dismissible className="mt-4">
                    {t("resetPassword.successfulRequest")}
                  </Alert>
                </motion.div>
              )}
              {form.formState.errors.root && (
                <Alert variant="error" dismissible className="mt-4">
                  {form.formState.errors.root.message}
                </Alert>
              )}
            </div>
            <Button className="w-full" type="submit">
              {t("resetPassword.sendResetInstructions")}
            </Button>
          </form>
        </Form>
        <div className="my-6 h-px w-full border-b border-dotted" />
        <span className="text-ui-fg-subtle txt-small">
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
