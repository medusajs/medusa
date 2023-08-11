import axios from "axios"
import { MEDUSA_BACKEND_URL } from "../constants/medusa-backend-url"

const client = axios.create({ baseURL: MEDUSA_BACKEND_URL })

export default function medusaRequest(method, path = "", payload = {}) {
  const options = {
    method,
    withCredentials: true,
    url: path,
    data: payload,
    json: true,
  }
  return client(options)
}
