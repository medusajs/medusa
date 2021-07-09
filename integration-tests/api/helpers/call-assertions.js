const { useApi } = require("../../helpers/use-api");

const header = {
  headers: {
    authorization: "Bearer test_token",
  },
};

const resolveCall = async (path, payload, header) => {
  const api = useApi();
  let res;
  try {
    res = (await api.post(path, payload, header)).status;
  } catch (e) {
    res = e.response.status;
  }
  return res;
};

const printIfFailing = (actual, expected, path) => {
  if (expected !== actual) {
    console.log(`failed at path : ${path}`);
  }
};

module.exports.expectPostCallToReturn = async function (
  input = {
    code,
    path,
    payload: {},
  }
) {
  const res = await resolveCall(input.path, input.payload, header);
  printIfFailing(res, input.code, input.path);
  expect(res).toEqual(input.code);
};

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
    );
    printIfFailing(res, input.code, input.pathf(i));
    expect(res).toEqual(input.code);
  }
};

module.exports.getObj = async function (path, obj) {
  const api = useApi();
  return (await api.get(path, header))?.data[obj];
};
