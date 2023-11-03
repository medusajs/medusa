import { promiseAll } from "../promise-all"

describe("promiseAll", function () {
  it("should throw an error if any of the promises throw", async function () {
    const res = await promiseAll([
      Promise.resolve(1),
      Promise.reject("error"),
      Promise.resolve(3),
    ]).catch((e) => e)

    expect(res).toBe("error")
  })

  it("should return all values if all promises are fulfilled", async function () {
    const res = await promiseAll([
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
    ])

    expect(res).toEqual([1, 2, 3])
  })

  it("should return all values if all promises are fulfilled including waiting for nested promises", async function () {
    const res = await promiseAll<number | void>([
      Promise.resolve(1),
      (async () => {
        await promiseAll([Promise.resolve(1), Promise.resolve(2)])
      })(),
      Promise.resolve(3),
    ])

    expect(res).toEqual([1, undefined, 3])
  })
})
