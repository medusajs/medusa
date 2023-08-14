#!/bin/bash

list=""
prefix="www/docs/"
# get directories in docs other than reference
for i in `find ../docs -type d -maxdepth 1 -not -path '../docs/references' -not -path '../docs'`
do
  if [ ${#list} -gt 0 ]; then
    list+=','
  fi
  list+="\"$prefix${i#../}\""
done
#get files in docs (not nested)
for i in `find ../docs -type f -maxdepth 1 -not -path '../docs/references'`
do
  if [ ${#list} -gt 0 ]; then
    list+=','
  fi
  list+="\"$prefix${i#../}\""
done
echo "::set-output name=LIST::[$list]"