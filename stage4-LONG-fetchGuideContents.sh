#!/usr/bin/env bash
# This script fetches the guide contents from the URLs listed in output/page_urls.txt
# Usage: ./stage4-LONG-fetchGuideContents.sh
# reads input from output/page_urls.txt
# writes output to cache/libGuidesPages

# first, check if the input file exists
if [ ! -f output/page_urls.txt ]; then
  echo "Input file output/page_urls.txt does not exist."
  exit 1
fi

# create cache directory if it doesn't exist
mkdir -p cache 

# create cache/libGuidesPages directory if it doesn't exist
mkdir -p cache/libGuidesPages 

# make sure the filenamify command is available
if ! command -v filenamify &> /dev/null; then
  echo "filenamify command not found. Please install it to proceed."
  exit 1
fi  

# read each URL from the input file and fetch the content if it is not already cached
while IFS= read -r url; do
  # generate a filename from the URL
  filename=$(filenamify "$url")
  # check if the file already exists in the cache
  if [ -f "cache/libGuidesPages/$filename" ]; then
    echo "Content for $url already cached as cache/libGuidesPages/$filename"
    continue
  fi
  # fetch the content and save it to the cache directory
  if ! curl -s "$url" -o "cache/libGuidesPages/$filename"; then
    echo "Failed to fetch content from $url"
    sleep .5  # wait for 5 seconds before retrying
    if ! curl -s "$url" -o "cache/libGuidesPages/$filename"; then
      echo "Failed to fetch content from $url again. Skipping."
      continue
    fi
  else
    echo "Fetched content from $url and saved to cache/libGuidesPages/$filename"
    sleep .5  # wait for 5 seconds before the next request
  fi
done < output/page_urls.txt