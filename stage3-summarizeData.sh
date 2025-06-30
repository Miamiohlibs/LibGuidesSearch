#!/usr/bin/env bash 
# This script summarizes the data from the previous stage and outputs it to a file.
# Usage: ./stage3-summarizeData.sh
# reads input from output/results.json
# writes output to output/summary.json

# Check if the input file exists
if [ ! -f output/results.json ]; then
  echo "Input file output/results.txt does not exist."
  exit 1
fi      

jq '[.[] | { id, name,type_label,status_label,url,updated, owner_name: (.owner.first_name + " " + .owner.last_name), owner_email: .owner.email, page_urls: [.pages[]?.url], terms }]' output/results.json > output/summary.json