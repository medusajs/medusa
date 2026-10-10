import { promiseAll } from "../promise-all"
import { EOL } from "os"

describe("promiseAll", function () {
  it("should throw an error if any of the promises throw", async function () {
    const res = await promiseAll([
      Promise.resolve(1),
      (async () => {
        throw new Error("error")
      })(),
      Promise.resolve(3),
    ]).catch((e) => e)

    expect(res.message).toBe("error")
  })

  it("should throw errors if any of the promises throw and aggregate them", async function () {
    const res = await promiseAll(
      [
        Promise.resolve(1),
        (async () => {
          throw new Error("error")
        })(),
        (async () => {
          throw new Error("error2")
        })(),
        Promise.resolve(3),
      ],
      {
        aggregateErrors: true,
      }
    ).catch((e) => e)

    expect(res.message).toBe(["error", "error2"].join(EOL))
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
    const res = await promiseAll([
      Promise.resolve(1),
      (async () => {
        await promiseAll([Promise.resolve(1), Promise.resolve(2)])
      })(),
      Promise.resolve(3),
    ])

    expect(res).toEqual([1, undefined, 3])
  })
})

describe("promiseAll with non-Error rejection reasons", function () {
  it("should aggregate rejections whose reason is not an Error", async function () {
    const res = await promiseAll(
      [
        Promise.resolve(1),
        Promise.reject("plain string reason"),
        Promise.reject(undefined),
        Promise.reject(null),
        Promise.reject(42),
      ],
      { aggregateErrors: true }
    ).catch((e) => e)

    expect(res).toBeInstanceOf(Error)
    expect(res.message).toBe(
      ["plain string reason", "undefined", "null", "42"].join(EOL)
    )
  })

  it("should still use the message of Error rejections when aggregating", async function () {
    const res = await promiseAll(
      [Promise.reject(new Error("boom")), Promise.reject("raw")],
      { aggregateErrors: true }
    ).catch((e) => e)

    expect(res.message).toBe(["boom", "raw"].join(EOL))
  })
})
