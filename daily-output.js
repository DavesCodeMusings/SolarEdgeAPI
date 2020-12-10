#!/usr/bin/env node

/*
 * solar-output.js -- a sample script to fetch inverter output from SolarEdge API
 */
 
const https = require("https");

// Fill in the two values below.
// See https://www.solaredge.com/sites/default/files/se_monitoring_api.pdf
const SITE = ""
const API_KEY = ""

// Make a call to the API.
let request = https.get(`https://monitoringapi.solaredge.com/site/${SITE}/overview.json?api_key=${API_KEY}`, (response) => {
  let buffer = [];

  // Piece together the response as it comes in.
  response.on('data', (chunk) => {
    buffer.push(chunk);
  });

  // When response is complete, show the results.
  response.on('end', (err) => {
    if (!err && response.statusCode == 200) {
      let data = JSON.parse(buffer);
      console.log(`${data.overview.lastUpdateTime} ${data.overview.lastDayData.energy}`);
    }
    else {
      console.error(`ERROR: ${err}`);
    }
  });

  // Complain if there was an error.
  response.on("error", (err) => {
    console.error(`ERROR: ${err}`);
  });
});
