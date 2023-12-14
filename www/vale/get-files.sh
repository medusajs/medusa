#!/bin/bash

list=""
app="www/"
path="../apps/$1/$2"
exception="$path/$3"
# get directories in content other than reference
for i in `find $path -type d -maxdepth 1 -not -path $exception -not -path $path`
do
  if [ ${#list} -gt 0 ]; then
    list+=','
  fi
  list+="\"$app${i#../}\""
done
#get files in content (not nested)
for i in `find $path -type f -maxdepth 1 -not -path $exception`
do
  if [ ${#list} -gt 0 ]; then
    list+=','
  fi
  list+="\"$app${i#../}\""
done
echo "::set-output name=LIST::[$list]"