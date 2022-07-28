import { isValidRegex } from ".."

describe('isValidRegexp', function () {
  it("should return true is a string is a valid regexp", () => {
    expect(isValidRegex('abc')).toBeFalsy()
    expect(isValidRegex('/abc/')).toBeTruthy()
    expect(isValidRegex('/ab#\/[c]/ig')).toBeTruthy()
    expect(isValidRegex('@ab#\/[c]@ig')).toBeTruthy()
    expect(isValidRegex('/ab\/[c/ig')).toBeFalsy()
    expect(isValidRegex('/abc/gig')).toBeFalsy()
  })
})
