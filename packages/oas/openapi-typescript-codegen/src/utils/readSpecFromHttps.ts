import { get } from "https"

/**
 * Download the spec file from a HTTPS resource
 * @param url
 */
export const readSpecFromHttps = async (url: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    get(url, (response) => {
      let body = ""
      response.on("data", (chunk) => {
        body += chunk
      })
      response.on("end", () => {
        resolve(body)
      })
      response.on("error", () => {
        reject(`Could not read OpenApi spec: "${url}"`)
      })
    })
  })
}
