#!/bin/bash

seedJson=$(pwd)/$1

res=$(curl -s 'http://localhost:9000/store/products' | \
python3 -c "

import sys, json; 

loadedProducts = json.load(sys.stdin)['products']; 

seededProducts = json.load(open(\""$seedJson"\"))['products'];

result = set([product['title'] for product in loadedProducts]) == set([product['title'] for product in seededProducts])

print(result)
")

if [[ "$res" != "True" ]] ; then
  echo "Seed failed, products are not equal"
  exit 1
else
  exit 0
fi