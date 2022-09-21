#!/bin/bash

list=""
for i in `find content -type d -maxdepth 1 -not -path 'content/references' -not -path 'content'`
do
  if [ ${#list} -gt 0 ]; then
    list+=','
  fi
  list+="\"$i\""
done
echo "::set-output name=LIST::[$list]"