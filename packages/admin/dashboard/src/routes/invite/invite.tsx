import { zodResolver } from "@hookform/resolvers/zod"
import { Alert, Button, Heading, Hint, Input, Text, toast } from "@medusajs/ui"
import { AnimatePresence, motion } from "framer-motion"
import i18n from "i18next"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { decodeToken } from "react-jwt"
import { Link, useSearchParams } from "react-router-dom"
import * as z from "zod"
import { Form } from "../../components/common/form"
import AvatarBox from "../../components/common/logo-box/avatar-box"
import { useSignUpWithEmailPass } from "../../hooks/api/auth"
import { useAcceptInvite } from "../../hooks/api/invites"
import { isFetchError } from "../../lib/is-fetch-error"

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

// TODO: Update to V2 format
type DecodedInvite = {
  id: string
  jti: any
  exp: string
  iat: number
  email: string
}

export const Invite = () => {
  const [searchParams] = useSearchParams()
  const [success, setSuccess] = useState(false)

  const token = searchParams.get("token")
  const invite: DecodedInvite | null = token ? decodeToken(token) : null
  const isValidInvite = invite && validateDecodedInvite(invite)

  return (
    <div className="bg-ui-bg-subtle relative flex min-h-dvh w-dvw items-center justify-center p-4">
      <div className="flex w-full max-w-[280px] flex-col items-center">
        <AvatarBox checked={success} />
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
      <Link
        key="login-link"
        to="/login"
        className="txt-small text-ui-fg-base transition-fg hover:text-ui-fg-base-hover focus-visible:text-ui-fg-base-hover font-medium outline-none"
      >
        {t("invite.backToLogin")}
      </Link>
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
  invite,
}: {
  onSuccess: () => void
  token: string
  invite: DecodedInvite
}) => {
  const { t } = useTranslation()
  const [invalid, setInvalid] = useState(false)

  const [params] = useSearchParams()
  const isFirstRun = params.get("first_run") === "true" // true when the invite page is open during a "create medusa app" run

  const form = useForm<z.infer<typeof CreateAccountSchema>>({
    resolver: zodResolver(CreateAccountSchema),
    defaultValues: {
      email: isFirstRun ? "" : invite.email || "",
      first_name: "",
      last_name: "",
      password: "",
      repeat_password: "",
    },
  })

  const { mutateAsync: signUpEmailPass, isPending: isCreatingAuthUser } =
    useSignUpWithEmailPass()

  const { mutateAsync: acceptInvite, isPending: isAcceptingInvite } =
    useAcceptInvite(token)

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      const authToken = await signUpEmailPass({
        email: data.email,
        password: data.password,
      })

      const invitePayload = {
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      }

      await acceptInvite({
        ...invitePayload,
        auth_token: authToken,
      })

      toast.success(t("invite.toast.accepted"))

      onSuccess()
    } catch (error) {
      if (isFetchError(error) && error.status === 400) {
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

  const serverError = form.formState.errors.root?.message
  const validationError =
    form.formState.errors.email?.message ||
    form.formState.errors.password?.message ||
    form.formState.errors.repeat_password?.message ||
    form.formState.errors.first_name?.message ||
    form.formState.errors.last_name?.message

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
          <div className="flex flex-col gap-y-2">
            <Form.Field
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Input
                        autoComplete="off"
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
              name="first_name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Control>
                      <Input
                        autoComplete="given-name"
                        {...field}
                        className="bg-ui-bg-field-component"
                        placeholder={t("fields.firstName")}
                      />
                    </Form.Control>
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
                    <Form.Control>
                      <Input
                        autoComplete="family-name"
                        {...field}
                        className="bg-ui-bg-field-component"
                        placeholder={t("fields.lastName")}
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
                    <Form.Control>
                      <Input
                        autoComplete="new-password"
                        type="password"
                        {...field}
                        className="bg-ui-bg-field-component"
                        placeholder={t("fields.password")}
                      />
                    </Form.Control>
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
                    <Form.Control>
                      <Input
                        autoComplete="off"
                        type="password"
                        {...field}
                        className="bg-ui-bg-field-component"
                        placeholder={t("fields.repeatPassword")}
                      />
                    </Form.Control>
                  </Form.Item>
                )
              }}
            />
            {validationError && (
              <div className="mt-6 text-center">
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

      <Link
        key="login-link"
        to="/login"
        className="txt-small text-ui-fg-base transition-fg hover:text-ui-fg-base-hover focus-visible:text-ui-fg-base-hover mt-3 font-medium outline-none"
      >
        {t("invite.backToLogin")}
      </Link>
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
