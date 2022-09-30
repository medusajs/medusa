# Documentation Error

If you have installed the dependencies in the root of the Medusa repository (that is, if you have a `node_modules` directory at the root of the Medusa repository), this will cause an error when running the documentation website. 

This is because the content resides in `docs/content`. When that content is being imported from there, a mix up can happen between the dependencies in the root of the Medusa repository and the dependencies in `www/docs` which causes an `invalid hook call` error.

For that reason, when the `start` and `build` scripts in `www/docs` are used, the `clean-node-modules` script is called. This script deleted the `node_modules` directory in the root of the Medusa repository.
