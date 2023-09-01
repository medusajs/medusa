#!/bin/bash

log_missing_dependencies() {
  package_name="$1"

  echo "Analyzing $package_name..."

  json_data=$(cd $package_name && echo && echo "-----> DIR: $package_name" && yarn dlx depcheck --json)

  result=$(echo "$json_data" | grep -o '"missing":{[^}]*}' | grep -o '{[^}]*}')

  if [ "$result" != "{}" ]; then
    echo "Missing dependencies in $package_name:"
    echo "$result" | jq .
    return 0
  else
    return 1
  fi
}

for package in packages/*; do
  check_package "$package"
done
