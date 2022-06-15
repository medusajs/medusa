#!/bin/bash

for i in 1..3
do
  status_code=$(curl \
    -X GET \
    --write-out %{http_code} \
    http://localhost:9000/store/products)

  if [[ "$status_code" -ne 000 ]] ; then
    exit 0
  else
    sleep 3s
  fi
done

echo "Site status changed to $status_code" 
exit 1
  