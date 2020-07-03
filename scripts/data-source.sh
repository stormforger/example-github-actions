#!/bin/bash

# Fetch data from target environment (e.g. staging or prod) and export as CSV file for usage in test-run.
# For this example we just write some example data.

tee > countries-de.csv <<EOF
code,name
de,Germany
nl,Netherlands
fr,France
pl,Poland
at,Austria
ch,Switz
se,Sweden
be,Belgium
lu,Luxembourg
cz,Czech Republic
EOF
