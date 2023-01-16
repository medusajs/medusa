# Troubleshooting Documentation Errors

## React Hook Errors

If you have installed the dependencies in the root of the Medusa repository (that is, if you have a `node_modules` directory at the root of the Medusa repository), this will cause an error when running the documentation website. 

This is because the content resides in `docs/content`. When that content is being imported from there, a mix up can happen between the dependencies in the root of the Medusa repository and the dependencies in `www/docs` which causes an `invalid hook call` error.

For that reason, when the `start` and `build` scripts in `www/docs` are used, the `clean-node-modules` script is called. This script deleted the `node_modules` directory in the root of the Medusa repository.

---

## Out of Memory Error

If you receive the following error when you run the `build` command in `www/docs`:

```bash noReport
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

This is because of an [ongoing issue in Docusaurus that occurs in large documentation websites](https://github.com/facebook/docusaurus/issues/4765). As it is still not resolved, the workaround would be to change the memory limit for Node.js while running the `build` command.

To do that, run the `build` command with the `NODE_OPTIONS` environment variable set:

```bash npm2yarn
NODE_OPTIONS="--max-old-space-size=8192" npm run build
```
