import { useContext, useEffect, useState } from "react"
import { CacheContext } from "../context/cache"
import Medusa from "../services/api"
import useNotification from "./use-notification"

const getCacheKey = (endpoint, subcomponent, query) => {
  if (!query) {
    if (subcomponent.list) {
      return `${endpoint}.list`
    } else {
      return `${endpoint}.retrieve`
    }
  } else if (query.id) {
    return `${endpoint}.retrieve.${query.id}`
  } else if (!query.id) {
    return `${endpoint}.list.${JSON.stringify(query.search)}`
  }
}

const useMedusa = (endpoint, query) => {
  const subcomponent = Medusa[endpoint]
  if (!subcomponent) {
    throw Error(`Endpoint: "${endpoint}", does not exist`)
  }

  const cacheKey = getCacheKey(endpoint, subcomponent, query)
  const { cache, setCache } = useContext(CacheContext)

  const [hasCache, setHasCache] = useState(!!cache[cacheKey])
  const [isLoading, setLoading] = useState(true)
  const [isReloading, setReloading] = useState(false)
  const [didFail, setDidFail] = useState(false)
  const [result, setResult] = useState(hasCache ? cache[cacheKey] : {})

  const fetchData = async (refresh, query) => {
    if (refresh) {
      setReloading(true)
    } else {
      setLoading(true)
    }
    try {
      if (!query) {
        if (subcomponent.list) {
          const { data } = await subcomponent.list()
          setResult(data)
          setLoading(false)
          setReloading(false)
        } else {
          const { data } = await subcomponent.retrieve()
          setResult(data)
          setLoading(false)
          setReloading(false)
        }
      } else if (query.id) {
        const { data } = await subcomponent.retrieve(query.id)
        setResult(data)
        setLoading(false)
        setReloading(false)
      } else if (!query.id) {
        if (cache[cacheKey]) {
          setResult(cache[cacheKey])
          setLoading(false)
        }
        const { data } = await subcomponent.list(query.search)
        setCache(cacheKey, data)
        setResult(data)
      }
      setLoading(false)
      setReloading(false)
    } catch (error) {
      setDidFail(true)
      setLoading(false)
      setReloading(false)
    }
  }

  const notification = useNotification()

  useEffect(() => {
    fetchData(false, query)
  }, [])

  const value = {
    ...result,
    refresh: (query) => fetchData(true, query),
    hasCache,
    isLoading,
    isReloading,
    notification,
    didFail,
  }

  if (subcomponent.update && query && query.id) {
    value.update = (updateData) =>
      subcomponent.update(query.id, updateData).then(({ data }) => {
        setResult(data)
      })
  }

  if (subcomponent.delete && query && query.id) {
    value.delete = () => subcomponent.delete(query.id)
  }

  switch (endpoint) {
    case "orders":
      if (query && query.id) {
        value.capturePayment = () => {
          return subcomponent.capturePayment(query.id).then(({ data }) => {
            setResult(data)
          })
        }

        value.archive = () => {
          return subcomponent.archive(query.id).then(({ data }) => {
            setResult(data)
          })
        }

        value.complete = () => {
          return subcomponent.complete(query.id).then(({ data }) => {
            setResult(data)
          })
        }

        value.refund = (payload) => {
          return subcomponent
            .refund(query.id, payload)
            .then(({ data }) => setResult(data))
        }

        value.updateClaim = (claimId, payload) => {
          return subcomponent
            .updateClaim(query.id, claimId, payload)
            .then(({ data }) => setResult(data))
        }

        value.createShipment = (payload) => {
          return subcomponent
            .createShipment(query.id, payload)
            .then(({ data }) => setResult(data))
        }

        value.processSwapPayment = (swapId) => {
          return subcomponent
            .processSwapPayment(query.id, swapId)
            .then(({ data }) => setResult(data))
        }

        value.createSwapShipment = (swapId, payload) => {
          return subcomponent
            .createSwapShipment(query.id, swapId, payload)
            .then(({ data }) => setResult(data))
        }

        value.createClaimShipment = (claim, payload) => {
          return subcomponent
            .createClaimShipment(query.id, claim, payload)
            .then(({ data }) => setResult(data))
        }

        value.createSwap = (payload) => {
          return subcomponent
            .createSwap(query.id, payload)
            .then(({ data }) => setResult(data))
        }

        value.cancelSwap = (swap) => {
          return subcomponent
            .cancelReturn(swap.return_order.id)
            .then(({ data }) => subcomponent.cancelSwap(query.id, swap.id))
            .then(({ data }) => setResult(data))
        }

        value.createClaim = (payload) => {
          return subcomponent
            .createClaim(query.id, payload)
            .then(({ data }) => setResult(data))
        }

        value.cancelClaim = (claimId) => {
          return subcomponent
            .cancelClaim(query.id, claimId)
            .then(({ data }) => setResult(data))
        }

        value.fulfillSwap = (swapId, payload) => {
          return subcomponent
            .fulfillSwap(query.id, swapId, payload)
            .then(({ data }) => setResult(data))
        }

        value.cancelSwapFulfillment = (swapId, fulfillmentId) => {
          return subcomponent
            .cancelSwapFulfillment(query.id, swapId, fulfillmentId)
            .then(({ data }) => setResult(data))
        }

        value.fulfillClaim = (claimId, payload) => {
          return subcomponent
            .fulfillClaim(query.id, claimId, payload)
            .then(({ data }) => setResult(data))
        }

        value.cancelClaimFulfillment = (claimId, fulfillmentId) => {
          return subcomponent
            .cancelClaimFulfillment(query.id, claimId, fulfillmentId)
            .then(({ data }) => setResult(data))
        }

        value.createFulfillment = (payload) => {
          return subcomponent
            .createFulfillment(query.id, payload)
            .then(({ data }) => setResult(data))
        }

        value.cancelFulfillment = (fulfillmentId) => {
          return subcomponent
            .cancelFulfillment(query.id, fulfillmentId)
            .then(({ data }) => setResult(data))
        }

        value.requestReturn = (payload) => {
          return subcomponent
            .requestReturn(query.id, payload)
            .then(({ data }) => setResult(data))
        }

        value.receiveReturn = (returnId, payload) => {
          return subcomponent
            .receiveReturn(returnId, payload)
            .then(({ data }) => setResult(data))
        }

        value.cancelReturn = (returnId) => {
          return subcomponent
            .cancelReturn(returnId)
            .then(({ data }) => setResult(data))
        }

        value.cancel = () => {
          return subcomponent
            .cancel(query.id)
            .then(({ data }) => setResult(data))
        }
      }
      break
    case "store":
      value.update = (updateData) => {
        return subcomponent.update(updateData).then(({ data }) => {
          setResult(data)
        })
      }
      value.addCurrency = (code) =>
        subcomponent.addCurrency(code).then(({ data }) => {
          setResult(data)
        })
      value.removeCurrency = (code) =>
        subcomponent.removeCurrency(code).then(({ data }) => {
          setResult(data)
        })
      break
    case "products":
      if (query && query.id) {
        const variantMethods = {
          create: (variant) => {
            return subcomponent.variants
              .create(query.id, variant)
              .then(({ data }) => {
                setResult(data)
              })
          },
          retrieve: (variantId) => {
            return subcomponent.variants
              .retrieve(query.id, variantId)
              .then(({ data }) => {
                setResult(data)
              })
          },
          update: (variantId, update) => {
            return subcomponent.variants
              .update(query.id, variantId, update)
              .then(({ data }) => {
                setResult(data)
              })
          },
          delete: (variantId) => {
            return subcomponent.variants
              .delete(query.id, variantId)
              .then(({ data }) => {
                setResult(data)
              })
          },
          list: () => {
            return subcomponent.variants.delete(query.id)
          },
        }
        value.variants = variantMethods

        const optionMethods = {
          create: (option) => {
            return subcomponent.options
              .create(query.id, option)
              .then(({ data }) => {
                setResult(data)
              })
          },
          update: (optionId, update) => {
            return subcomponent.options
              .update(query.id, optionId, update)
              .then(({ data }) => {
                setResult(data)
              })
          },
          delete: (optionId) => {
            return subcomponent.options
              .delete(query.id, optionId)
              .then(({ data }) => {
                setResult(data)
              })
          },
        }
        value.options = optionMethods
      }
      break
    case "regions":
      value.fulfillmentOptions = subcomponent.fulfillmentOptions
      break
    default:
      break
  }

  return value
}

export default useMedusa
