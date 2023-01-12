---
"@medusajs/medusa-js": patch
"medusa-react": patch
---

hotfix: Fixes an issue where the use of a Node only package and a Rollup config targeted at browser usage only would throw an error when `@medusajs/medusa-js` was used in an environment where code is run both in Node and in the browser (eg. SSR). Also fixes type of payload used for uploads in the JS client.
