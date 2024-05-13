"use client"

import React from "react"
import { useEffect, useMemo, useState } from "react"
import { useRequestRunner } from "../../hooks"
import { CodeBlock } from "../CodeBlock"
import { Card } from "../Card"
import { Button } from "../.."
import { ApiMethod, ApiTestingOptions } from "types"
import { ApiRunnerParamInputs } from "./ParamInputs"

type ApiRunnerProps = {
  apiMethod: ApiMethod
  apiUrl: string
  pathData?: Record<string, unknown>
  queryData?: Record<string, unknown>
  bodyData?: Record<string, unknown>
}

export const ApiRunner = ({
  apiMethod,
  apiUrl,
  pathData,
  bodyData,
  queryData,
}: ApiRunnerProps) => {
  // assemble api testing options
  const [apiTestingOptions, setApiTestingOptions] = useState<ApiTestingOptions>(
    {
      method: apiMethod,
      url: apiUrl,
      pathData,
      bodyData,
      queryData,
    }
  )
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
    <>
      {manualTestTrigger && (
        <Card className="font-base mb-docs_1" contentClassName="gap-docs_0.5">
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
          <Button
            onClick={() => {
              setIsRunning(true)
              setRan(false)
            }}
          >
            Send Request
          </Button>
        </Card>
      )}
      {(isRunning || ran) && (
        <CodeBlock
          source={responseLogs.join("\n")}
          lang="json"
          title="Testing Result"
          collapsed={true}
          blockStyle="subtle"
          noReport={true}
          badgeLabel={responseCode}
          badgeColor={
            !responseCode
              ? undefined
              : responseCode.startsWith("2")
              ? "green"
              : "red"
          }
        />
      )}
    </>
  )
}
