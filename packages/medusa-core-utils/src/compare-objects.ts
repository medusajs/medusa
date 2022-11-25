import { differenceWith, isEqual } from "lodash"

type InputObj = Object | Record<string | number | symbol, unknown>

function compareObjectsByProp(
  object1: InputObj,
  object2: InputObj,
  prop: string
): boolean {
  if (Array.isArray(object1[prop])) {
    object2[prop] = object2[prop].map(({ _id, ...rest }) => rest)
    return differenceWith(object1[prop], object2[prop], isEqual).length === 0
  } else if (typeof object1[prop] === "object") {
    delete object2[prop]._id
    return isEqual(object1[prop], object2[prop])
  } else {
    return object1[prop] === object2[prop]
  }
}

export default compareObjectsByProp
