
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/Users/oliverjuhl/Desktop/medusa/core/www/reference/.cache/dev-404-page.js")),
  "component---src-templates-reference-page-js": preferDefault(require("/Users/oliverjuhl/Desktop/medusa/core/www/reference/src/templates/reference-page.js"))
}

