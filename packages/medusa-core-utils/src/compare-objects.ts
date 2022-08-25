import _ from "lodash"

function compareObjectsByProp(object1: Object, object2: Object, prop: string) {
  if (Array.isArray(object1[prop])) {
    object2[prop] = object2[prop].map(({ _id, ...rest }) => rest)
    return (
      _.differenceWith(object1[prop], object2[prop], _.isEqual).length === 0
    )
  } else if (typeof object1[prop] === "object") {
    delete object2[prop]._id
    return _.isEqual(object1[prop], object2[prop])
  } else {
    return object1[prop] === object2[prop]
  }
}

export default compareObjectsByProp
