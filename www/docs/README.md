# Website

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

## Note Before Development

If you have installed the dependencies in the root of this repository (i.e., if you have a `node_modules` directory at the root of this repository), this will cause an error when running this documentation website. This is because the content resides in `docs/content` and when that content is being imported from there, a mix up can happen between the dependencies which will cause an `invalid hook call` error.

For that reason, we added a `clean-node-modules` script that deletes the `node_modules` directory, and we call that script before the `start` and `build` scripts are ran.

So, everytime you run these 2 scripts, the `node_modules` directory at the root will be deleted.
