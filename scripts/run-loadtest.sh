#!/bin/bash

# required inputs:
#  TARGET_ENV

# optional inputs:
#  INPUT_NFR_FILE
#  INPUT_LAUNCH_ARGS
#  INPUT_TITLE
#  INPUT_NOTES

if [ -z "${TARGET_ENV}" ]; then
  echo "TARGET_ENV variable required" > /dev/stderr
  exit 1
fi

TMP_TESTCASE="/tmp/loadtest.js"

LAUNCH_ARGS="${INPUT_LAUNCH_ARGS}"
if [ ! -z "${INPUT_NFR_FILE}" ]; then
  LAUNCH_ARGS="--nfr-check-file=${INPUT_NFR_FILE}"
else
  LAUNCH_ARGS="--watch"
fi

./scripts/compile-loadtest.sh "${TARGET_ENV}" "${TMP_TESTCASE}"
./forge test-case launch "demo/example-github-actions-${TARGET_ENV}" --test-case-file="${TMP_TESTCASE}" --title="${INPUT_TITLE}" --notes="${INPUT_NOTES}" ${LAUNCH_ARGS}