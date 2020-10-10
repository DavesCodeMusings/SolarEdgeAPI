#!/bin/sh
#
# Requires 'jq' to parse JSON.
# Use 'sudo apt install jq' to install for Raspberry Pi OS.
#
# Fill in the two values below.
# See https://www.solaredge.com/sites/default/files/se_monitoring_api.pdf
SITE=""
API_KEY=""

# Show energy generated today along with date code. Run this after sundown to
# get the day's total output.
curl -s "https://monitoringapi.solaredge.com/site/${SITE}/overview.json?api_key=${API_KEY}" | jq .overview.lastUpdateTime,.overview.lastDayData.energy
