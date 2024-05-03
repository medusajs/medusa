import { HttpClient } from "../HttpClient"

/**
 * Generate the HttpRequest filename based on the selected client
 * @param httpClient The selected httpClient (fetch, xhr, node or axios)
 */
export const getHttpRequestName = (httpClient: HttpClient): string => {
  switch (httpClient) {
    case HttpClient.FETCH:
      return "FetchHttpRequest"
    case HttpClient.XHR:
      return "XHRHttpRequest"
    case HttpClient.NODE:
      return "NodeHttpRequest"
    case HttpClient.AXIOS:
      return "AxiosHttpRequest"
  }
}
