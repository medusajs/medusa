export function stringifyNullProperties<T extends object>(input: T): T {
  const convertProperties = (obj: T) => {
    const res = {} as T

    Object.keys(obj).reduce((acc: T, key: string) => {
      if (obj[key] === null) {
        acc[key] = "null"
      } else if (typeof obj[key] === "object") {
        acc[key] = convertProperties(obj[key])
      } else {
        acc[key] = obj[key]
      }

      return acc
    }, res)

    return res
  }

  return convertProperties(input)
}

export function createAdminPath(path: string, id?: string) {
  let formattedPath = path

  if (!path.startsWith("/")) {
    formattedPath = `/${path}`
  }

  if (!formattedPath.startsWith("/admin")) {
    formattedPath = `/admin${formattedPath}`
  }

  if (id) {
    formattedPath = `${formattedPath}/${id}`
  }

  return formattedPath
}
