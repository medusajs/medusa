#!/bin/bash

status_code=$(curl \
  -X POST\
  -H "Content-Type: application/json"\
  -d '{"email":"'$1'", "password":"'$2'"}'\
  --write-out %{http_code}\
  http://localhost:9000/auth/admin/emailpass)

if [[ "$status_code" -ne 200 ]] ; then
  echo "Site status changed to $status_code" 
  exit 1
else
  exit 0
fi