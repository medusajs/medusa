import { ApiTestingOptions } from "types"

export type useRequestRunnerProps = {
  pushLog: (...message: string[]) => void
  onFinish: (message: string, statusCode: string) => void
  replaceLog?: (message: string) => void
}

export const useRequestRunner = ({
  pushLog,
  onFinish,
  replaceLog,
}: useRequestRunnerProps) => {
  const runRequest = (apiRequestOptions: ApiTestingOptions) => {
    let requestUrl = apiRequestOptions.url
    if (apiRequestOptions.pathData) {
      Object.entries(apiRequestOptions.pathData).forEach(([key, value]) => {
        if (typeof value === "string") {
          requestUrl = requestUrl.replace(`{${key}}`, value)
        }
      })
    }

    // check if there are query params
    if (apiRequestOptions.queryData) {
      requestUrl += `?${new URLSearchParams(
        apiRequestOptions.queryData as Record<string, string>
      ).toString()}`
    }

    let responseCode = ""

    fetch(requestUrl, {
      method: apiRequestOptions.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: apiRequestOptions.bodyData
        ? JSON.stringify(apiRequestOptions.bodyData)
        : undefined,
    })
      .then(async (response) => {
        responseCode = `${response.status}`
        return response.json()
      })
      .then((data) => {
        const stringifiedData = JSON.stringify(data, undefined, 2)
        replaceLog ? replaceLog(stringifiedData) : pushLog(stringifiedData)
      })
      .catch((error) => {
        pushLog(
          `An error ocurred: ${JSON.stringify(error, undefined, 2)}`,
          `\nThis could be a CORS error. You can resolve it by adding\nthe docs' URLto your CORS configurations:\n`,
          `STORE_CORS=http://localhost:8000,https://docs.medusajs.com`,
          `ADMIN_CORS=http://localhost:7001,https://docs.medusajs.com`
        )
      })
      .finally(() => onFinish(`Finished running request.`, responseCode))
  }

  return {
    runRequest,
  }
}
