---
"@medusajs/framework": patch
---

fix(framework): load workflows from index.[js|ts] files in worker mode

The workflow loader skipped any file named `index.[js|ts]` due to the default `discoverResources` filter inherited from `ResourceLoader`. In `WORKER_MODE=server` or `shared` this went unnoticed because HTTP route imports registered the workflows as a side effect, but a `worker`-only instance never loads routes, so index-file workflows were silently unregistered.

Added an `allowIndex` option to `discoverResources` and set it in `WorkflowLoader.load()`.
