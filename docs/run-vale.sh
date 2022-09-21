#!/bin/bash

list=""
alertLevel=$1

if [ ${#alertLevel} -eq 0 ]; then
  alertLevel="suggestion"
fi

for i in `find content -type d -maxdepth 1 -not -path 'content/references' -not -path 'content'`
do
  if [ ${#list} -gt 0 ]; then
    list+=' '
  fi
  list+=$i
done

exec vale $list --minAlertLevel $alertLevel