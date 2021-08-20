# SolarEdgeAPI
Collect data for your SolarEdge inverter using their REST API with
various programming languages.

All programs require filling in the site number and an API key.
See https://www.solaredge.com/sites/default/files/se_monitoring_api.pdf

* daily-output.html -- using HTML/JavaScript with AJAX calls
* daily-output.js -- Node.js
* daily-output.py -- Python 3
* daily-output.sh -- Shell script with 'curl' and JSON parser 'jq'

There is also `log-output.js` that takes things further by fetching the present output of the inverter, storing the value in a SQLite database and publishing to MQTT. By scheduling `log-output.js` in crontab, you can establish a history of inverter output in the databse, as well as providing the most recent reading to your home automation system through MQTT.
