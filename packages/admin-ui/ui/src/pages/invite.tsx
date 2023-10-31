import { useAdminAcceptInvite, useAdminLogin } from "medusa-react"
import qs from "qs"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { decodeToken } from "react-jwt"
import { useLocation, useNavigate } from "react-router-dom"
import InputError from "../components/atoms/input-error"
import Button from "../components/fundamentals/button"
import SigninInput from "../components/molecules/input-signin"
import SEO from "../components/seo"
import PublicLayout from "../components/templates/login-layout"
import useNotification from "../hooks/use-notification"
import { getErrorMessage } from "../utils/error-messages"
import FormValidator from "../utils/form-validator"
import { useAdminCreateAnalyticsConfig } from "../services/analytics"
import { useAnalytics } from "../providers/analytics-provider"
import AnalyticsConfigForm, {
  AnalyticsConfigFormType,
} from "../components/organisms/analytics-config-form"
import { nestedForm } from "../utils/nested-form"
import { useFeatureFlag } from "../providers/feature-flag-provider"

type FormValues = {
  password: string
  repeat_password: string
  first_name: string
  last_name: string
  analytics: AnalyticsConfigFormType
}

const InvitePage = () => {
  const location = useLocation()
  const parsed = qs.parse(location.search.substring(1))
  const [signUp, setSignUp] = useState(false)
  const { trackUserEmail } = useAnalytics()

  const first_run = !!parsed.first_run

  let token: {
    iat: number
    invite_id: string
    role: string
    user_email: string
  } | null = null
  if (parsed?.token) {
    try {
      token = decodeToken(parsed.token as string)
    } catch (e) {
      token = null
    }
  }

  const form = useForm<FormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      password: "",
      repeat_password: "",
      analytics: {
        opt_out: false,
        anonymize: false,
      },
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = form

  const { isFeatureEnabled } = useFeatureFlag()

  const { mutateAsync: acceptInvite, isLoading: acceptInviteIsLoading } =
    useAdminAcceptInvite()
  const {
    mutateAsync: createAnalyticsConfig,
    isLoading: createAnalyticsConfigIsLoading,
  } = useAdminCreateAnalyticsConfig()
  const { mutateAsync: doLogin, isLoading: loginIsLoading } = useAdminLogin()

  const isLoading =
    acceptInviteIsLoading || createAnalyticsConfigIsLoading || loginIsLoading

  const navigate = useNavigate()
  const notification = useNotification()

  const handleAcceptInvite = handleSubmit(async (data: FormValues) => {
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

    try {
      await acceptInvite({
        token: parsed.token as string,
        user: {
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
        },
      })

      await doLogin({ email: token!.user_email, password: data.password })

      const shouldTrackEmail =
        !data.analytics.anonymize &&
        !data.analytics.opt_out &&
        token?.user_email

      try {
        await createAnalyticsConfig(data.analytics)
      } catch (e) {
        // gracefully handle error if analytics are disabled
      }

      if (shouldTrackEmail) {
        trackUserEmail({
          email: token?.user_email,
        })
      }

      navigate("/a/orders")
    } catch (err) {
      notification("Error", getErrorMessage(err), "error")
    }
  })

  if (!token) {
    return (
      <PublicLayout>
        <SEO title="Create Account" />
        <div className="gap-y-xsmall flex flex-col items-center">
          <h1 className="inter-xlarge-semibold mb- text-[20px]">
            Invalid invite
          </h1>
          <p className="inter-base-regular text-grey-50 w-[280px] text-center">
            The invite link you have used is invalid. Please contact your
            administrator.
          </p>
          <p className="inter-small-regular text-grey-40 mt-xlarge">
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <SEO title="Create Account" />
      {signUp ? (
        <form onSubmit={handleAcceptInvite}>
          <div className="flex w-[300px] flex-col items-center">
            <h1 className="inter-xlarge-semibold mb-large text-[20px]">
              Create your Medusa account
            </h1>
            <div className="gap-y-small flex flex-col">
              <div>
                <SigninInput readOnly placeholder={token.user_email} />
              </div>
              <div>
                <SigninInput
                  placeholder="Password"
                  type={"password"}
                  {...register("password", {
                    required: FormValidator.required("Password"),
                  })}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <SigninInput
                  placeholder="Confirm password"
                  type={"password"}
                  {...register("repeat_password", {
                    required: "You must confirm your password",
                  })}
                  autoComplete="new-password"
                />
                <InputError errors={errors} name="repeat_password" />
              </div>
            </div>
            <div className="gap-y-small my-8 flex w-[300px] flex-col">
              <AnalyticsConfigForm
                form={nestedForm(form, "analytics")}
                compact={true}
              />
            </div>
            <Button
              variant="secondary"
              size="medium"
              className="mt-large w-[300px]"
              loading={isLoading}
            >
              Create account
            </Button>
            <p className="inter-small-regular text-grey-50 mt-xlarge">
              Already signed up? <a href="/login">Log in</a>
            </p>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center text-center">
          <h1 className="inter-xlarge-semibold text-[20px]">
            {first_run
              ? `Let's get you started!`
              : `You have been invited to join the team`}
          </h1>
          {first_run ? (
            <p className="inter-base-regular text-grey-50 mt-xsmall">
              Create an admin account to access your <br /> Medusa dashboard.
            </p>
          ) : (
            <p className="inter-base-regular text-grey-50 mt-xsmall">
              You can now join the team. Sign up below and get started
              <br />
              with your Medusa account right away.
            </p>
          )}
          <Button
            variant="secondary"
            size="medium"
            className="mt-xlarge w-[300px]"
            onClick={() => setSignUp(true)}
          >
            Sign up
          </Button>
        </div>
      )}
    </PublicLayout>
  )
}

export default InvitePage
