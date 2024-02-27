type Options = {
  leading?: boolean
}

export const debounce = (
  func: (...args: any[]) => void,
  delay: number,
  { leading }: Options = {}
): ((...args: any[]) => void) => {
  let timerId: NodeJS.Timeout | undefined

  return (...args) => {
    if (!timerId && leading) {
      func(...args)
    }
    clearTimeout(timerId)

    timerId = setTimeout(() => func(...args), delay)
  }
}
