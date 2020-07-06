#!/bin/bash

# This script prepares a load-test for the specified environment
target_env="${1}"
output_path="${2}"
loadtest_src="./loadtest"
loadtest_script="${loadtest_src}/loadtest.js"

if [ ! -r "${loadtest_src}/${target_env}.js" ]; then
    echo "${loadtest_src}/${target_env}.js: file not found or not readable" > /dev/stderr
    exit 1
fi
if [ ! -r "${loadtest_script}" ]; then
    echo "${loadtest_script}: file not found or not readable" > /dev/stderr
    exit 1
fi

# Create the loadtest script with a EDIT disclaimer, the environment config and the actual test-script.
cat - "${loadtest_src}/${target_env}.js" "${loadtest_script}" <<EOF > "${output_path}"
/*
 * NOTICE: DO NOT EDIT!
 *
 * This file is managed via https://github.com/stormforger/example-github-actions/
 */
EOF