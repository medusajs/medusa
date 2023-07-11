// The YAML reader does not convert the YAML files into proper
// OpenAPI Specs. These utility functions handle doing that.

const keysToConvert = [
  {
    key: "requestBody",
    options: {
      removeNumericalKeys: true,
    },
  },
  {
    key: "responses",
    options: {
      removeNumericalKeys: true,
      numericalKeysExceptions: ["20[0-9]", "40[0-9]"],
    },
  },
]

const max_depth = process.env.REFS_MAX_DEPTH
  ? parseInt(process.env.REFS_MAX_DEPTH)
  : 15

export default function convertToOpenApi(obj: Record<string, any>) {
  Object.keys(obj).forEach((key) => {
    const keyToConvert = keysToConvert.find((k) => k.key === key)
    if (keyToConvert) {
      // flatten everything recursively
      obj[key] = arrayToObject(obj[keyToConvert.key], keyToConvert.options)
    }
  })

  return obj
}

function arrayToObject(
  arr: any[],
  options: {
    removeNumericalKeys: boolean
    numericalKeysExceptions?: string[]
    currentDepth?: number
  }
): any {
  const { currentDepth = 1 } = options
  if (currentDepth > max_depth) {
    return arr
  }
  if (arr.length !== 1) {
    if (!isArrayOfObjects(arr)) {
      return arr
    }

    if (hasOverlappingObjects(arr)) {
      arr = arr.map((item: Record<string, any>) => {
        Object.keys(item).forEach((key) => {
          if (Array.isArray(key)) {
            item[key] = arrayToObject(item[key], {
              ...options,
              currentDepth: currentDepth + 1,
            })
          }
        })

        return item
      })

      return arr
    }
    const tempObj = {}
    for (let i = 0; i < arr.length; i++) {
      Object.assign(tempObj, arr[i])
    }

    arr[0] = tempObj
  }

  if (isObject(arr[0])) {
    Object.keys(arr[0]).forEach((key) => {
      arr[0][key] = Array.isArray(arr[0][key])
        ? arrayToObject(arr[0][key], {
            ...options,
            currentDepth: currentDepth + 1,
          })
        : arr[0][key]
    })
  }

  if (
    options.removeNumericalKeys &&
    isObject(arr[0]) &&
    objectHasNumericalKeys(arr[0], options.numericalKeysExceptions)
  ) {
    const values = Object.values(arr[0])

    if (Array.isArray(values)) {
      return arrayToObject(values, {
        ...options,
        currentDepth: currentDepth + 1,
      })
    }

    return values
  }

  return arr[0]
}

function isObject(value: any) {
  return typeof value === "object" && value !== null
}

function isArrayOfObjects(arr: any[]) {
  return arr.every(isObject)
}

function objectHasNumericalKeys(
  obj: Record<string, any>,
  exceptions: string[] = []
) {
  return Object.keys(obj).every((key) => isNumericalKey(key, exceptions))
}

function isNumericalKey(key: string, exceptions: string[] = []) {
  if (isNaN(+key)) {
    return false
  }

  return !exceptions.some((exception) => {
    const exceptionRegex = new RegExp(exception)
    return key.match(exceptionRegex)
  })
}

function hasOverlappingObjects(arr: any[]) {
  return arr.some((item: Record<string, any>) => {
    return Object.entries(item).some(([key, value]) =>
      arr.some(
        (item2) => item !== item2 && key in item2 && item2[key] === value
      )
    )
  })
}
