import { useAdminAcceptInvite } from "medusa-react"
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

type FormValues = {
  password: string
  repeat_password: string
  first_name: string
  last_name: string
}

const InvitePage = () => {
  const location = useLocation()
  const parsed = qs.parse(location.search.substring(1))
  const [signUp, setSignUp] = useState(false)

  let token: Object | null = null
  if (parsed?.token) {
    try {
      token = decodeToken(parsed.token as string)
    } catch (e) {
      token = null
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      password: "",
      repeat_password: "",
    },
  })

  const { mutate, isLoading } = useAdminAcceptInvite()
  const navigate = useNavigate()
  const notification = useNotification()

  const handleAcceptInvite = handleSubmit((data: FormValues) => {
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
      {
        token: parsed.token as string,
        user: {
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
        },
      },
      {
        onSuccess: () => {
          navigate("/login")
        },
        onError: (err) => {
          notification("Error", getErrorMessage(err), "error")
        },
      }
    )
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
          <div className="flex flex-col items-center">
            <h1 className="inter-xlarge-semibold mb-large text-[20px]">
              Create your Medusa account
            </h1>
            <div className="gap-y-small flex flex-col">
              <div>
                <SigninInput
                  placeholder="First name"
                  {...register("first_name", {
                    required: FormValidator.required("First name"),
                  })}
                  autoComplete="given-name"
                />
                <InputError errors={errors} name="first_name" />
              </div>
              <div>
                <SigninInput
                  placeholder="Last name"
                  {...register("last_name", {
                    required: FormValidator.required("Last name"),
                  })}
                  autoComplete="family-name"
                />
                <InputError errors={errors} name="last_name" />
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
            <Button
              variant="secondary"
              size="medium"
              className="mt-large w-[280px]"
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
            You have been invited to join the team
          </h1>
          <p className="inter-base-regular text-grey-50 mt-xsmall">
            You can now join the team. Sign up below and get started
            <br />
            with your Medusa account right away.
          </p>
          <Button
            variant="secondary"
            size="medium"
            className="mt-xlarge w-[280px]"
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
