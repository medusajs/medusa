#!/bin/bash

for i in {1..6}
do
  echo $i
  status_code=$(curl \
    -X GET \
    --write-out %{http_code} \
    --silent\
    --output /dev/null\
    http://localhost:9000/store/products)

echo $status_code
  if [[ "$status_code" -ne 000 ]] ; then
    echo "exiting"
    exit 0
  else
    sleep 5
  fi
done

echo $status_code

if [[ "$status_code" =  000 ]] ; then
  echo "Site status changed to $status_code"
  exit 1
else
  exit 0
fi
