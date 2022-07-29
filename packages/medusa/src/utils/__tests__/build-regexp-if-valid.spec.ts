import { buildRegexpIfValid } from ".."

describe('buildRegexpIfValid', function () {
  it("should return either a regexp or undefined", () => {
    expect(buildRegexpIfValid('abc')).not.toBeDefined()
    expect(buildRegexpIfValid('/abc/')).toBeTruthy()
    expect(buildRegexpIfValid('/ab#\/[c]/ig')).toBeTruthy()
    expect(buildRegexpIfValid('@ab#\/[c]@ig')).toBeTruthy()
    expect(buildRegexpIfValid('/ab\/[c/ig')).not.toBeDefined()
    expect(buildRegexpIfValid('/abc/gig')).not.toBeDefined()
  })
})
