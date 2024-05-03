import { zodResolver } from "@hookform/resolvers/zod"
import { UserRoles } from "@medusajs/medusa"
import { Alert, Button, Heading, Input, Text, toast } from "@medusajs/ui"
import { AnimatePresence, motion } from "framer-motion"
import { Trans, useTranslation } from "react-i18next"
import { Link, useSearchParams } from "react-router-dom"
import * as z from "zod"

import i18n from "i18next"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { decodeToken } from "react-jwt"
import { Form } from "../../components/common/form"
import { LogoBox } from "../../components/common/logo-box"
import { isAxiosError } from "../../lib/is-axios-error"
import { useV2AcceptInvite, useV2CreateAuthUser } from "../../lib/api-v2"

const CreateAccountSchema = z
  .object({
    email: z.string().email(),
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    password: z.string().min(1),
    repeat_password: z.string().min(1),
  })
  .superRefine(({ password, repeat_password }, ctx) => {
    if (password !== repeat_password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: i18n.t("invite.passwordMismatch"),
        path: ["repeat_password"],
      })
    }
  })

type DecodedInvite = {
  id: string
  jti: UserRoles
  exp: string
  iat: number
}

export const Invite = () => {
  const [searchParams] = useSearchParams()
  const [success, setSuccess] = useState(false)

  const token = searchParams.get("token")
  const invite: DecodedInvite | null = token ? decodeToken(token) : null
  const isValidInvite = invite && validateDecodedInvite(invite)

  return (
    <div className="bg-ui-bg-base relative flex min-h-dvh w-dvw items-center justify-center p-4">
      <div className="flex w-full max-w-[300px] flex-col items-center">
        <LogoBox
          className="mb-4"
          checked={success}
          containerTransition={{
            duration: 1.2,
            delay: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          pathTransition={{
            duration: 1.3,
            delay: 1.1,
            bounce: 0.6,
            ease: [0.1, 0.8, 0.2, 1.01],
          }}
        />
        <div className="max-h-[557px] w-full will-change-contents">
          {isValidInvite ? (
            <AnimatePresence>
              {!success ? (
                <motion.div
                  key="create-account"
                  initial={false}
                  animate={{
                    height: "557px",
                    y: 0,
                  }}
                  exit={{
                    height: 0,
                    y: 40,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.6,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  className="w-full will-change-transform"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.7,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: 0,
                      ease: [0, 0.71, 0.2, 1.01],
                    }}
                    key="inner-create-account"
                  >
                    <CreateView
                      onSuccess={() => setSuccess(true)}
                      token={token!}
                      invite={invite}
                    />
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="success-view"
                  initial={{
                    opacity: 0,
                    scale: 0.4,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  transition={{
                    duration: 1,
                    delay: 0.6,
                    ease: [0, 0.71, 0.2, 1.01],
                  }}
                  className="w-full"
                >
                  <SuccessView />
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <InvalidView />
          )}
        </div>
      </div>
    </div>
  )
}

const LoginLink = () => {
  const { t } = useTranslation()

  return (
    <div className="flex w-full flex-col items-center">
      <div className="my-6 h-px w-full border-b border-dotted" />
      <span className="text-ui-fg-subtle txt-small">
        <Trans
          t={t}
          i18nKey="invite.alreadyHaveAccount"
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
  )
}

const InvalidView = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-y-1">
        <Heading>{t("invite.invalidTokenTitle")}</Heading>
        <Text size="small" className="text-ui-fg-subtle text-center">
          {t("invite.invalidTokenHint")}
        </Text>
      </div>
      <LoginLink />
    </div>
  )
}

const CreateView = ({
  onSuccess,
  token,
}: {
  onSuccess: () => void
  token: string
  invite: DecodedInvite
}) => {
  const { t } = useTranslation()
  const [invalid, setInvalid] = useState(false)

  const form = useForm<z.infer<typeof CreateAccountSchema>>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      repeat_password: "",
    },
  })

  const { mutateAsync: createAuthUser, isPending: isCreatingAuthUser } =
    useV2CreateAuthUser()

  const { mutateAsync: acceptInvite, isPending: isAcceptingInvite } =
    useV2AcceptInvite(token)

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const { token: authToken } = await createAuthUser({
        email: data.email,
        password: data.password,
      })

      const invitePayload = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      }

      await acceptInvite({
        payload: invitePayload,
        token: authToken,
      })
      onSuccess()
      toast.success(t("general.success"), {
        description: t("invite.toast.accepted"),
        dismissLabel: t("actions.close"),
      })
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        form.setError("root", {
          type: "manual",
          message: t("invite.invalidInvite"),
        })
        setInvalid(true)
        return
      }

      form.setError("root", {
        type: "manual",
        message: t("errors.serverError"),
      })
    }
  })

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mb-4 flex flex-col items-center">
        <Heading>{t("invite.title")}</Heading>
        <Text size="small" className="text-ui-fg-subtle text-center">
          {t("invite.hint")}
        </Text>
      </div>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-y-6">
          <div className="flex flex-col gap-y-4">
            <Form.Field
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.email")}</Form.Label>
                    <Form.Control>
                      <Input autoComplete="off" {...field} />
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
              <Alert
                variant="error"
                dismissible={false}
                className="text-balance"
              >
                {form.formState.errors.root.message}
              </Alert>
            )}
          </div>
          <Button
            className="w-full"
            type="submit"
            isLoading={isCreatingAuthUser || isAcceptingInvite}
            disabled={invalid}
          >
            {t("invite.createAccount")}
          </Button>
        </form>
      </Form>
      <LoginLink />
    </div>
  )
}

const SuccessView = () => {
  const { t } = useTranslation()

  return (
    <div className="flex w-full flex-col items-center gap-y-6">
      <div className="flex flex-col items-center gap-y-1">
        <Heading>{t("invite.successTitle")}</Heading>
        <Text size="small" className="text-ui-fg-subtle text-center">
          {t("invite.successHint")}
        </Text>
      </div>
      <Button variant="secondary" asChild className="w-full">
        <Link to="/login" replace>
          {t("invite.successAction")}
        </Link>
      </Button>
    </div>
  )
}

const InviteSchema = z.object({
  id: z.string(),
  jti: z.string(),
  exp: z.number(),
  iat: z.number(),
})

const validateDecodedInvite = (decoded: any): decoded is DecodedInvite => {
  return InviteSchema.safeParse(decoded).success
}
