"use client"

import React from "react"
import { useEffect, useMemo, useState } from "react"
import { useRequestRunner } from "../../../hooks"
import { CodeBlock } from ".."
import { Card } from "../../Card"
import { Button, InputText } from "../../.."
import { ApiMethod, ApiDataOptions, ApiTestingOptions } from "types"

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
  const pushMessage = (...message: string[]) =>
    setResponseLogs((prev) => [...prev, ...message])
  const { runRequest } = useRequestRunner({
    pushLog: pushMessage,
    onFinish: () => setIsRunning(false),
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

  const getParamsElms = ({
    data,
    title,
    nameInApiOptions,
  }: {
    data: ApiDataOptions
    title: string
    nameInApiOptions: "pathData" | "bodyData" | "queryData"
  }) => (
    <div className="flex flex-col gap-docs_0.5">
      <span className="text-compact-medium-plus text-medusa-fg-base">
        {title}
      </span>
      <div className="flex gap-docs_0.5">
        {Object.keys(data).map((pathParam, index) => (
          <InputText
            name={pathParam}
            onChange={(e) =>
              setApiTestingOptions((prev) => ({
                ...prev,
                [nameInApiOptions]: {
                  ...prev[nameInApiOptions],
                  [pathParam]: e.target.value,
                },
              }))
            }
            key={index}
            placeholder={pathParam}
            value={
              typeof data[pathParam] === "string"
                ? (data[pathParam] as string)
                : typeof data[pathParam] === "number"
                ? (data[pathParam] as number)
                : `${data[pathParam]}`
            }
          />
        ))}
      </div>
    </div>
  )

  return (
    <>
      {manualTestTrigger && (
        <Card className="font-base mb-docs_1" contentClassName="gap-docs_0.5">
          {apiTestingOptions.pathData &&
            getParamsElms({
              data: apiTestingOptions.pathData,
              title: "Path Parameters",
              nameInApiOptions: "pathData",
            })}
          {apiTestingOptions.bodyData &&
            getParamsElms({
              data: apiTestingOptions.bodyData,
              title: "Request Body Parameters",
              nameInApiOptions: "bodyData",
            })}
          {apiTestingOptions.queryData &&
            getParamsElms({
              data: apiTestingOptions.queryData,
              title: "Request Query Parameters",
              nameInApiOptions: "queryData",
            })}
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
        />
      )}
    </>
  )
}
