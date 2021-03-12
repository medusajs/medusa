#!/bin/bash

medusa-dev --set-path-to-repo .

cd integration-tests/api

medusa-dev --force-install --scan-once
yarn test


