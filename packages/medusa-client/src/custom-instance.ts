import { AxiosRequestConfig } from "axios"
import Medusa from "."

export const getClient = <ResponseType, RequestType = AxiosRequestConfig>(
  config: RequestType
): Promise<ResponseType> => {
  return Medusa.getInstance().handleRequest(config)
}
