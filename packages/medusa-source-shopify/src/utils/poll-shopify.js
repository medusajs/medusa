const poll = async ({ fn, interval, maxAttempts }) => {
  let attempts = 0

  const executePoll = async (resolve, reject) => {
    const result = await fn()
    attempts++

    if (maxAttempts && attempts === maxAttempts) {
      return reject(new Error("Exceeded max attempts"))
    } else {
      setTimeout(executePoll, interval, resolve, reject)
    }
  }

  return new Promise(executePoll)
}
