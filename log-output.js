#!/usr/bin/env node

// Fill in the values for your Solar Edge site.
// See https://www.solaredge.com/sites/default/files/se_monitoring_api.pdf
const SITE = "9999999"
const API_KEY = "ABCDEFGHIJKLMNOPQRST0123456789"

// Fill in the details for your MQTT broker.
const mqttUrl = "mqtt://127.0.0.1";
const mqttUser = "Contoso";
const mqttPassword = "P@ssw0rd";

// Adjust LONGITUDE and LATITUDE below for your geographic location.
// Wikipedia has coordinates for most major cities.
const LONGITUDE = 43.13;
const LATITUDE = 89.33;

// No changes should be required from here.
const https = require("https");
const mqtt = require("mqtt");         // 'npm install mqtt'.
const sqlite3 = require("sqlite3");   // 'npm install sqlite3'.

function publishToDatabase(date, wattHours) {
  db = new sqlite3.Database("inverter.sl3");
  db.serialize( () => {  // Run statements in order, not asynchronously.
    db.run("CREATE TABLE IF NOT EXISTS output (date date, kwh decimal);");
    db.run("INSERT INTO output (date, kwh) VALUES (?, ?);", date, wattHours / 1000);
    db.close();
  });
}

function publishToMQTT(wattHours) {
  let mqttClient = mqtt.connect(mqttUrl, {mqttUser, mqttPassword});
  mqttClient.on("connect", () => {
    mqttClient.publish("inverter/output", wattHours.toString(), {retain: "true"});
    mqttClient.end();
  });
}

// TO DO: Determine if sun is shining and only pull from API during daytime.

// Download from API.
let request = https.get(`https://monitoringapi.solaredge.com/site/${SITE}/overview.json?api_key=${API_KEY}`, (response) => {
  let buffer = [];
  response.on("data", (chunk) => {
    buffer.push(chunk);
  });

  response.on("end", (err) => {
    if (!err && response.statusCode == 200) {
      let data = JSON.parse(buffer);
      console.log(`${data.overview.lastUpdateTime} ${data.overview.currentPower.power}`);
      publishToDatabase(data.overview.lastUpdateTime, data.overview.currentPower.power);
      publishToMQTT(data.overview.currentPower.power);
    }
    else {
      console.error(`ERROR: ${err}`);
    }
  });

  response.on("error", (err) => {
    console.error(`ERROR: ${err}`);
  });
});
