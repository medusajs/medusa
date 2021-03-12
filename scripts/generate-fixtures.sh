#!/bin/bash

FIXTURE_PATTERN=$1

lerna run build

cd docs-util/fixture-gen

yarn
yarn link @medusajs/medusa medusa-interfaces

cd ../..

if [ "$FIXTURE_PATTERN" ]; then
  yarn test:fixtures -t $FIXTURE_PATTERN
else
  yarn test:fixtures
fi

