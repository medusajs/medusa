#!/bin/bash

list=""
app="www/"
path="../apps/$1/$2"
alertLevel=$3
exceptions=("${@:4}")
exceptionsCommand=""

for index in ${!exceptions[@]}
do
  exceptionsCommand+="-not -path $path/${exceptions[$index]} "
done

if [ ${#alertLevel} -eq 0 ]; then
  alertLevel="suggestion"
fi

# get directories in content other than reference
for i in `find $path -type d -maxdepth 1 -not -path $path $exceptionsCommand`
do
  if [ ${#list} -gt 0 ]; then
    list+=' '
  fi
  list+="$app${i#../}"
done
#get files in content (not nested)
for i in `find $path -type f -maxdepth 1 $exceptionsCommand`
do
  if [ ${#list} -gt 0 ]; then
    list+=' '
  fi
  list+="$app${i#../}"
done

# echo $list
cd ../..
exec vale $list --minAlertLevel $alertLevel