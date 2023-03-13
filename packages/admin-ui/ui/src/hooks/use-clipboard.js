// hugely inspired from @danoc https://github.com/danoc/react-use-clipboard/blob/master/src/index.tsx
import copy from "copy-to-clipboard"
import React from "react"

/**
 * @param {string} text
 * @param {Object} options
 * @param {number} options.successDuration - Duration of the success state in milliseconds
 * @param {function} options.onCopied - Callback function to call after copying
 * @return {Array} returns tuple containing isCopied state and handleCopy function
 */
const useClipboard = (text, options = {}) => {
  const [isCopied, setIsCopied] = React.useState(false)
  const successDuration = options?.successDuration
  const onCopied = options?.onCopied || function () {}

  React.useEffect(() => {
    if (isCopied && successDuration) {
      const timeout = setTimeout(() => {
        setIsCopied(false)
      }, successDuration)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [isCopied, successDuration])

  const handleCopy = React.useCallback(() => {
    copy(text)
    setIsCopied(true)
    onCopied()
  }, [text, onCopied, setIsCopied])

  return [isCopied, handleCopy]
}

export default useClipboard
