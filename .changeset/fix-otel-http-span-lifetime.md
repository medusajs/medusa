---
"@medusajs/medusa": patch
---

fix(@medusajs/medusa): close the root HTTP tracing span when the response finishes

The root HTTP span ended as soon as express dispatched the request instead of waiting for the response to be written. Every span therefore reported statusCode 200, spans for failed requests were never marked as errors, and the recorded duration only covered request dispatch. The traced handler now waits for the response finish or close event before ending the span, so the final status code, the error status and the full request duration are captured.
