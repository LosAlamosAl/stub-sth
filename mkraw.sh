#!/usr/bin/env sh

# mkraw.sh - build raw data files of ticket sales/usage
#
# This script takes a CSV file (exported from and Emacs Org table)
# of season ticket sales and usage and converts it to a json file
# for dirent import into a JavaScript code.
# ./mkraw.sh


CSVTOJSON=./node_modules/csvtojson/bin/csvtojson

echo "let rawData = " > raw_data.js
sed '$d' cr.csv | $CSVTOJSON >> raw_data.js
echo ";" >> raw_data.js 

# cd ~/kap-dash-ispeed
# git pull
# sed "s+\/\* SED TARGET \*\/+{d: \"$DATE\", s: \"$FASTCLI\"},\\
#   &+" raw_data.js > raw_data.js.tmp && mv raw_data.js.tmp raw_data.js
# git commit -am "New data: ${DATE}"
# git push
# # Remove puppeteer cruft or it'll exhaust /tmp space
# rm -rf /tmp/.org.chromium.Chromium.*
