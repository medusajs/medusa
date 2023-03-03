import ConfettiGenerator from "confetti-js"
import { useAdminAcceptInvite } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { decodeToken } from "react-jwt"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Button from "../components/fundamentals/button"
import LongArrowRightIcon from "../components/fundamentals/icons/long-arrow-right-icon"
import MedusaIcon from "../components/fundamentals/icons/medusa-icon"
import MedusaVice from "../components/fundamentals/icons/medusa-vice"
import SigninInput from "../components/molecules/input-signin"
import SEO from "../components/seo"
import LoginLayout from "../components/templates/login-layout"
import useNotification from "../hooks/use-notification"
import { getErrorMessage } from "../utils/error-messages"

type formValues = {
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

  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const confettiSettings = {
      target: "confetti-canvas",
      start_from_edge: true,
      size: 3,
      clock: 25,
      colors: [
        [251, 146, 60],
        [167, 139, 250],
        [251, 146, 60],
        [96, 165, 250],
        [45, 212, 191],
        [250, 204, 21],
        [232, 121, 249],
      ],
      max: 26,
    }
    const confetti = new ConfettiGenerator(confettiSettings)
    confetti.render()

    return () => confetti.clear()
  }, [])

  const { register, handleSubmit, formState } = useForm<formValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      password: "",
      repeat_password: "",
    },
  })

  const accept = useAdminAcceptInvite()
  const navigate = useNavigate()
  const notification = useNotification()

  const handleAcceptInvite = (data: formValues) => {
    setPasswordMismatch(false)

    if (data.password !== data.repeat_password) {
      setPasswordMismatch(true)
      return
    }

    accept.mutate(
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
  }

  useEffect(() => {
    if (
      formState.dirtyFields.password &&
      formState.dirtyFields.repeat_password &&
      formState.dirtyFields.first_name &&
      formState.dirtyFields.last_name
    ) {
      setReady(true)
    } else {
      setReady(false)
    }
  }, [formState])

  return (
    <>
      {signUp ? (
        <LoginLayout>
          <SEO title="Create Account" />
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex min-h-[600px] bg-grey-0 rounded-rounded justify-center">
              <form
                className="flex flex-col py-12 w-full px-[120px] items-center"
                onSubmit={handleSubmit(handleAcceptInvite)}
              >
                <MedusaIcon />
                {!token ? (
                  <div className="h-full flex flex-col gap-y-2 text-center items-center justify-center">
                    <span className="inter-large-semibold text-grey-90">
                      You signup link is invalid
                    </span>
                    <span className="inter-base-regular mt-2 text-grey-50">
                      Contact your administrator to obtain a valid signup link
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="inter-2xlarge-semibold mt-4 text-grey-90">
                      Welcome to the team!
                    </span>
                    <span className="inter-base-regular text-grey-50 mt-2 mb-large">
                      Create your account below👇🏼
                    </span>
                    <SigninInput
                      placeholder="First name"
                      {...register("first_name", { required: true })}
                      autoComplete="given-name"
                    />
                    <SigninInput
                      placeholder="Last name"
                      {...register("last_name", { required: true })}
                      autoComplete="family-name"
                    />
                    <SigninInput
                      placeholder="Password"
                      type={"password"}
                      {...register("password", { required: true })}
                      autoComplete="new-password"
                    />
                    <SigninInput
                      placeholder="Repeat password"
                      type={"password"}
                      {...register("repeat_password", { required: true })}
                      autoComplete="new-password"
                    />
                    {passwordMismatch && (
                      <span className="text-rose-50 w-full mt-2 inter-small-regular">
                        The two passwords are not the same
                      </span>
                    )}
                    <Button
                      variant="primary"
                      size="large"
                      type="submit"
                      className="w-full mt-base"
                      loading={formState.isSubmitting}
                      disabled={!ready}
                    >
                      Create account
                    </Button>
                    <Link
                      to="/login"
                      className="inter-small-regular text-grey-50 mt-large"
                    >
                      Already signed up? Log in
                    </Link>
                  </>
                )}
              </form>
            </div>
          </div>
        </LoginLayout>
      ) : (
        <div className="bg-grey-90 h-screen w-full overflow-hidden">
          <div className="z-10 flex-grow flex flex-col items-center justify-center h-full absolute inset-0 max-w-[1080px] mx-auto">
            <MedusaVice className="mb-3xlarge" />
            <div className="flex flex-col items-center max-w-3xl text-center">
              <h1 className="inter-3xlarge-semibold text-grey-0 mb-base">
                You have been invited to join the team
              </h1>
              <p className="inter-xlarge-regular text-grey-50">
                You can now join the Medusa Store team. Sign up below and get
                started with your Medusa Admin account right away.
              </p>
            </div>
            <div className="mt-4xlarge">
              <Button
                size="large"
                variant="primary"
                className="w-[280px]"
                onClick={() => setSignUp(true)}
              >
                Sign up
                <LongArrowRightIcon size={20} className="pt-1" />
              </Button>
            </div>
          </div>
          <canvas id="confetti-canvas" />
        </div>
      )}
    </>
  )
}

export default InvitePage
