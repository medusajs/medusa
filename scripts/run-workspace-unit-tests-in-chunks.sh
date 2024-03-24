#!/bin/bash

# Get array of workspaces
# convert NDJSON stream to an array of arrays, divided by chunk size
# get the workspaces of the current CHUNK environment
workspaces=$(echo $CHUNKS | jq -r ".[$CHUNK]")
echo "$workspaces"
# Initialize an empty string for the filters
filters=""

# Loop through each workspace in the array
for workspace in $(echo "$workspaces" | jq -r '.[]'); do
  # Add the workspace name to the filters array as an argument
  filters+=" --filter=${workspace}"
done
echo "$filters"
# Run the test in the selected chunk
yarn run test $filters
