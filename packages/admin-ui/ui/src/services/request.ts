import axios, { AxiosPromise } from "axios"
import { medusaUrl } from "./config"

const client = axios.create({ baseURL: medusaUrl })

export default function medusaRequest<T>(
  method,
  path = "",
  payload = {}
): AxiosPromise<T> {
  const options = {
    method,
    withCredentials: true,
    url: path,
    data: payload,
    json: true,
  }
  return client(options)
}
