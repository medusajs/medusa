const { processNode } = require("../src/process-node.ts");

describe("helper functions", () => {
  it("should return return a new node from processNode", () => {
    const fieldName = "product";
    const node = {
      id: "prod_test_1234",
      title: "Test Shirt",
      description: "A test product",
      unit_price: 2500,
    };

    const createContentDigest = jest.fn(() => "digest_string");
    const processNodeResult = processNode(node, fieldName, createContentDigest);

    expect(createContentDigest).toBeCalled();

    expect(processNodeResult).toMatchSnapshot();
  });
});
