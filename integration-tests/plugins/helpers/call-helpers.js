const { useApi } = require("../../helpers/use-api")

const header = {
  headers: {
    authorization: "Bearer test_token",
  },
}

const resolveCall = async (path, payload, header) => {
  const api = useApi()
  let res
  try {
    const resp = await api.post(path, payload, header)
    res = resp.status
  } catch (expectedException) {
    try {
      res = expectedException.response.status
    } catch (_) {
      console.error(expectedException)
    }
  }
  return res
}

const determineFail = (actual, expected, path) => {
  if (expected !== actual) {
    console.log(`failed at path : ${path}`)
  }
  expect(actual).toEqual(expected)
}

/**
 * Allows you to wrap a Call function so that you may reuse some input values.
 * @param {Function} fun - the function to call with partial information
 * @param {Object} input - the constant input which we want to supply now
 * @returns
 */
module.exports.partial = function (fun, input = {}) {
  return async (remaining) => await fun({ ...remaining, ...input })
}

/**
 * Allows you to assert a specific code result from a POST call.
 * @param {Object} input - the information needed to make the call
 * (path & payload) and the expected code (code)
 */
module.exports.expectPostCallToReturn = async function (
  input = {
    code,
    path,
    payload: {},
  }
) {
  const res = await resolveCall(input.path, input.payload, header)
  determineFail(res, input.code, input.path)
}

/**
 * Allows you to assert a specific code result from multiple POST
 * calls.
 * @param {Object} input - the collection of objects to execute
 * calls from (col), a function which yields the path (pathf),
 * and another one which provides the payload (payloadf), as
 * well as the code (code) which we want to assert.
 */
module.exports.expectAllPostCallsToReturn = async function (
  input = {
    code,
    col,
    pathf,
    payloadf,
  }
) {
  for (const i of input.col) {
    const res = await resolveCall(
      input.pathf(i),
      input.payloadf ? input.payloadf(i) : {},
      header
    )
    determineFail(res, input.code, input.pathf(i))
  }
}

/**
 * Allows you to retrieve a specific object the response
 * from get call,
 * and simultaneously assert that the call was successful.
 * @param {Object} param0 - contains the path which to
 * call (path), and the object within the response.data (get)
 * we want to retrieve.
 * @returns {Object} found within response.data corresponding
 * to the get parameter provided.
 */
module.exports.callGet = async function ({ path, get }) {
  const api = useApi()
  const res = await api.get(path, header)

  determineFail(res.status, 200, path)
  return res?.data[get]
}
