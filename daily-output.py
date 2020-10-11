#!/usr/bin/env python3
#
# daily-output.py -- a sample script to fetch inverter output from SolarEdge API
# 
import requests
import json

# Fill in the two values below.
# See https://www.solaredge.com/sites/default/files/se_monitoring_api.pdf
SITE = ""
API_KEY = ""

# Request information from API.
response = requests.get("https://monitoringapi.solaredge.com/site/{0}/overview.json?api_key={1}".format(SITE, API_KEY))

# Show energy generated today along with date code. Run this after sundown to
# get the day's total output.
if (response.status_code == 200):
  print(response.text);
  data = json.loads(response.text);
  print(data['overview']['lastUpdateTime'], data['overview']['lastDayData']['energy'])
else:
  print("Error {0} connecting to API.".format(response.status_code))
