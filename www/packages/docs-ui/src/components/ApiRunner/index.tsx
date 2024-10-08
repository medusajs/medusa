"use client"

import React from "react"
import { useEffect, useMemo, useState } from "react"
import { useRequestRunner } from "../../hooks"
import { CodeBlock } from "../CodeBlock"
import { Button } from "../.."
import { ApiMethod, ApiTestingOptions } from "types"
import { ApiRunnerParamInputs } from "./ParamInputs"
import clsx from "clsx"
import { ArrowDownRightMini } from "@medusajs/icons"
import { ArrowRightDownIcon } from "../Icons/ArrowRightDown"
import { ApiRunnerFooterBackground } from "./FooterBackground"

type ApiRunnerProps = {
  apiMethod: ApiMethod
  apiUrl: string
  pathData?: Record<string, unknown>
  queryData?: Record<string, unknown>
  bodyData?: Record<string, unknown>
}

export const ApiRunner = React.forwardRef<HTMLDivElement, ApiRunnerProps>(
  function ApiRunner(
    { apiMethod, apiUrl, pathData, bodyData, queryData }: ApiRunnerProps,
    ref
  ) {
    // assemble api testing options
    const [apiTestingOptions, setApiTestingOptions] =
      useState<ApiTestingOptions>({
        method: apiMethod,
        url: apiUrl,
        pathData,
        bodyData,
        queryData,
      })
    const [isRunning, setIsRunning] = useState(false)
    const [ran, setRan] = useState(false)
    const hasData = (data?: Record<string, unknown>): boolean =>
      data !== undefined && Object.keys(data).length > 0
    // TODO change to be based on whether auth/data needed
    const manualTestTrigger = useMemo(
      () =>
        hasData(apiTestingOptions.pathData) ||
        hasData(apiTestingOptions.queryData) ||
        hasData(apiTestingOptions.bodyData),
      [apiTestingOptions]
    )
    const [responseLogs, setResponseLogs] = useState<string[]>([])
    const [responseCode, setResponseCode] = useState<string | undefined>()
    const pushMessage = (...message: string[]) =>
      setResponseLogs((prev) => [...prev, ...message])
    const { runRequest } = useRequestRunner({
      pushLog: pushMessage,
      onFinish: (_message, statusCode) => {
        setIsRunning(false)
        setResponseCode(statusCode)
      },
      replaceLog: (message) => setResponseLogs([message]),
    })

    useEffect(() => {
      if (!isRunning && !manualTestTrigger && !ran) {
        setIsRunning(true)
      }
    }, [apiTestingOptions, manualTestTrigger, isRunning, ran])

    useEffect(() => {
      if (isRunning && !ran) {
        setRan(true)
        setResponseLogs(["Sending request..."])
        runRequest(apiTestingOptions)
      }
    }, [isRunning, ran])

    return (
      <div className="mb-docs_1" ref={ref}>
        {manualTestTrigger && (
          <div
            className={clsx(
              "bg-medusa-bg-component rounded-docs_DEFAULT",
              "shadow-elevation-card-rest dark:shadow-elevation-card-rest-dark",
              "mb-docs_0.75"
            )}
          >
            <div
              className={clsx(
                "flex items-center gap-docs_0.75",
                "px-docs_0.75 pb-docs_0.75 pt-docs_0.5"
              )}
            >
              <ArrowDownRightMini className="text-medusa-fg-muted" />
              <div className="flex-1 flex items-center gap-docs_0.75">
                {apiTestingOptions.pathData && (
                  <ApiRunnerParamInputs
                    data={apiTestingOptions.pathData}
                    title="Path Parameters"
                    baseObjPath="pathData"
                    setValue={
                      setApiTestingOptions as React.Dispatch<
                        React.SetStateAction<unknown>
                      >
                    }
                  />
                )}
                {apiTestingOptions.bodyData && (
                  <ApiRunnerParamInputs
                    data={apiTestingOptions.bodyData}
                    title="Request Body Parameters"
                    baseObjPath="bodyData"
                    setValue={
                      setApiTestingOptions as React.Dispatch<
                        React.SetStateAction<unknown>
                      >
                    }
                  />
                )}
                {apiTestingOptions.queryData && (
                  <ApiRunnerParamInputs
                    data={apiTestingOptions.queryData}
                    title="Request Query Parameters"
                    baseObjPath="queryData"
                    setValue={
                      setApiTestingOptions as React.Dispatch<
                        React.SetStateAction<unknown>
                      >
                    }
                  />
                )}
              </div>
              <ArrowRightDownIcon className="text-medusa-fg-muted" />
            </div>
            <div
              className={clsx(
                "border-t border-medusa-border-base",
                "py-docs_0.5 px-docs_0.75 relative",
                "flex justify-end items-center gap-docs_0.5"
              )}
            >
              <ApiRunnerFooterBackground />
              <Button
                onClick={() => {
                  setIsRunning(true)
                  setRan(false)
                }}
                className="relative"
                variant="secondary"
              >
                Send Request
              </Button>
            </div>
          </div>
        )}
        {(isRunning || ran) && (
          <CodeBlock
            source={responseLogs.join("\n")}
            lang="json"
            title="Testing Result"
            collapsed={true}
            noReport={true}
            badgeLabel={responseCode || "Failed"}
            badgeColor={
              !responseCode
                ? "red"
                : responseCode.startsWith("2")
                ? "green"
                : "red"
            }
          />
        )}
      </div>
    )
  }
)
