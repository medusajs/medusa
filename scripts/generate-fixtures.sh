#!/bin/bash

FIXTURE_PATTERN=$1

lerna run build

medusa-dev --set-path-to-repo .

cd docs-util/fixture-gen

medusa-dev --force-install --scan-once

cd ../..

if [ "$FIXTURE_PATTERN" ]; then
  yarn test:fixtures -t $FIXTURE_PATTERN
else
  yarn test:fixtures
fi

