import _ from "lodash"

/**
 * Attempts to resolve the config file in a given root directory.
 * @param {string} rootDir - the directory to find the config file in.
 * @param {string} configName - the name of the config file.
 * @return {object} an object containing the config module and its path.
 */
function compareObjects(Obj1, Obj2) {
  var equivalent = []

  var keys = Object.keys(Obj1)
  keys.forEach(k => {
    if (Obj1.hasOwnProperty(k) && Obj2.hasOwnProperty(k)) {
      if (typeof Obj1[k] === "object") {
        let recursiveAnswer = compareObjects(Obj1[k], Obj2[k])
        equivalent.push(...recursiveAnswer)
      } else if (Obj1[k] === Obj2[k]) {
        equivalent.push(Obj1[k])
      }
    }
  })

  return equivalent
}

function compareObjectsByProp(object1, object2, prop) {
  if (Array.isArray(object1[prop])) {
    object2[prop] = object2[prop].map(({ _id, ...rest }) => rest)
    return (
      _.differenceWith(object1[prop], object2[prop], compareObjects).length ===
      0
    )
  } else if (typeof object1[prop] === "object") {
    delete object2[prop]._id
    return compareObjects(object1[prop], object2[prop])
  } else {
    return object1[prop] === object2[prop]
  }
}

export default compareObjectsByProp
