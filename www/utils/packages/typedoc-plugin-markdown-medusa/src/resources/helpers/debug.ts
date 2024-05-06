import * as Handlebars from "handlebars"

export default function () {
  Handlebars.registerHelper("debug", function (...data: unknown[]) {
    console.log(...data)
  })
}
