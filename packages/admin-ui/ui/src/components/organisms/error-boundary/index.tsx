import { AxiosError } from "axios"
import React, { ErrorInfo } from "react"
import { Translation } from "react-i18next"
import { analytics, getAnalyticsConfig } from "../../../services/analytics"
import Button from "../../fundamentals/button"
import { TFunction } from "i18next"

type State = {
  hasError: boolean
  status?: number
  message?: string
}

type Props = {
  children?: React.ReactNode
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  static getDerivedStateFromError(error: Error) {
    const state: State = {
      hasError: true,
      status: undefined,
      message: error.message,
    }

    if (isNetworkError(error)) {
      state.status = error.response?.status
    }

    return state
  }

  public async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const shouldTrack = await shouldTrackEvent(error)

    if (!shouldTrack) {
      return
    }

    const properties = getTrackingInfo(error, errorInfo)
    analytics.track("error", properties)
  }

  public dismissError = () => {
    history.back()
    this.setState({ hasError: false })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="px-large flex h-screen items-center justify-center">
          <div className="max-w-[600px]">
            <div>
              <div>
                {this.state.status && (
                  <p className="text-grey-60 inter-small-semibold opacity-75">
                    {this.state.status}
                  </p>
                )}
                <h1 className="inter-xlarge-semibold mb-xsmall">
                  <Translation>
                    {(t) => errorMessage(t, this.state.status)}
                  </Translation>
                </h1>
                <p className="inter-base-regular text-grey-50">
                  <Translation>
                    {(t) => errorDescription(t, this.state.status)}
                  </Translation>
                </p>
              </div>

              <div className="mt-xlarge flex w-full  items-center">
                <Button
                  size="small"
                  variant="primary"
                  onClick={this.dismissError}
                >
                  <Translation>{(t) => t("Back to dashboard")}</Translation>
                </Button>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      )
    }

    return this.props.children
  }
}

const isNetworkError = (error: Error): error is AxiosError => {
  return error["response"] !== undefined && error["response"] !== null
}

const shouldTrackEvent = async (error: Error) => {
  // Don't track 404s
  if (isNetworkError(error) && error.response?.status === 404) {
    return false
  }

  const res = await getAnalyticsConfig().catch(() => undefined)

  // Don't track if we have no config to ensure we have permission
  if (!res) {
    return false
  }

  // Don't track if user has opted out from sharing usage insights
  if (res.analytics_config.opt_out) {
    return false
  }

  return true
}

const errorMessage = (t: TFunction, status?: number) => {
  const defaultMessage = t("An unknown error occured")

  if (!status) {
    return defaultMessage
  }

  const message = {
    400: t("Bad request"),
    401: t("You are not logged in"),
    403: t("You do not have permission perform this action"),
    404: t("Page was not found"),
    500: t("An unknown server error occured"),
    503: t("Server is currently unavailable"),
  }[status]

  return message || defaultMessage
}

const errorDescription = (t: TFunction, status?: number) => {
  const defaultDescription = t(
    "An error occurred with unspecified causes, this is most likely due to a techinical issue on our end. Please try refreshing the page. If the issue keeps happening, contact your administrator."
  )

  if (!status) {
    return defaultDescription
  }

  const description = {
    400: t("The request was malformed, fix your request and please try again."),
    401: t("You are not logged in, please log in to proceed."),
    403: t(
      "You do not have permission perform this action, if you think this is a mistake, contact your administrator."
    ),
    404: t(
      "The page you have requested was not found, please check the URL and try again."
    ),
    500: t(
      "The server was not able to handle your request, this is mostly likely due to a techinical issue on our end. Please try again. If the issue keeps happening, contact your administrator."
    ),
    503: t(
      "The server is temporarily unavailable, and your request could not be processed. Please try again later. If the issue keeps happening, contact your administrator."
    ),
  }[status]

  return description || defaultDescription
}

const getTrackingInfo = (error: Error, errorInfo: ErrorInfo) => {
  return {
    error: error.message,
    componentStack: errorInfo.componentStack,
  }
}

export default ErrorBoundary
