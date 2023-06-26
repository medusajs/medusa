import { AdminCustomResource } from "@medusajs/medusa-js"

type GetResponseType = ReturnType<AdminCustomResource["get"]>

type GetPropsType = Parameters<AdminCustomResource["get"]>

function customGetRequest(fn: (args: GetPropsType) => GetResponseType) {
  return function (client: AdminCustomResource, request: GetPropsType) {
    return client.get(...request)
  }
}

// const re = customGetRequest(("", ) => {
//     return
// })
