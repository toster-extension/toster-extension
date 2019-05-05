#!/usr/bin/env bash

source .env

rm -f extension/.web-extension-id

$(npm bin)/web-ext sign \
  --api-key=$WEB_EXT_API_KEY \
  --api-secret=$WEB_EXT_API_SECRET