import { useEffect } from "react"
import { useRouteError } from "react-router-dom"
import Button from "../../fundamentals/button"
import RefreshIcon from "../../fundamentals/icons/refresh-icon"
import WarningCircleIcon from "../../fundamentals/icons/warning-circle"

type PageErrorElementProps = {
  origin: string
}

const isProd = process.env.NODE_ENV === "production"

const RouteErrorElement = ({ origin }: PageErrorElementProps) => {
  const error = useRouteError()

  useEffect(() => {
    if (!isProd && error) {
      console.group(
        `%cAn error occurred in a page from ${origin}:`,
        "color: red; font-weight: bold;"
      )
      console.error(error)
      console.groupEnd()
    }
  }, [error, origin])

  const reload = () => {
    window.location.reload()
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="rounded-rounded p-base bg-rose-10 border-rose-40 gap-x-small flex justify-start border">
        <div>
          <WarningCircleIcon
            size={20}
            fillType="solid"
            className="text-rose-40"
          />
        </div>
        <div className="text-rose-40 inter-small-regular w-full pr-[20px]">
          <h1 className="inter-base-semibold mb-2xsmall">Uncaught error</h1>
          <p className="mb-small">
            {isProd
              ? "An error unknown error occurred, and the page could not be loaded."
              : `A Page from <strong>${origin}</strong> crashed. See the console for more info.`}
          </p>
          <p className="mb-large">
            <strong>What should I do?</strong>
            <br />
            If you are the developer of this page, you should fix the error and
            reload the page. If you are not the developer, you should contact
            the maintainer and report the error.
          </p>
          <div className="gap-x-base flex items-center">
            <Button
              variant="nuclear"
              size="small"
              type="button"
              onClick={reload}
              className="w-full"
            >
              <div className="flex items-center">
                <RefreshIcon size="20" />
                <span className="ml-xsmall">Reload</span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RouteErrorElement
