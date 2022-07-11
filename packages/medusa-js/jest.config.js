module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": require.resolve("ts-jest"),
  },
  testRegex: "(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
}
