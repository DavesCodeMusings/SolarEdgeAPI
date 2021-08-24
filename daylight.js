#!/usr/bin/env node

/**
 * Calculate sunrise and sunset times for the present day. Useful for not polling the solar inverter API when it's dark out.
 *
 * References:
 *   Sunrise Equation -- https://en.wikipedia.org/wiki/Sunrise_equation
 *   How to Calculate the Sun's Declination -- https://sciencing.com/calculate-suns-declination-6904335.html
 */

// Adjust this for your geographic location.
const latitudeDegrees = 43.13;

// No changes should be needed from here on down.

// Check options for silent / script mode used to suppress a lot of the output.
var verbose = true;
if (process.argv[2] && process.argv[2] == "-s") {
  verbose = false;
}

// Create an object for JSON output at the end.
var daylight = { };

// Express latitude in degrees, since that's what most humans expect.
daylight.latitude = `${Math.abs(latitudeDegrees)} ${(latitudeDegrees > 0 ? "N" : "S")}`;
if (verbose) console.error(`Calculating sunrise, sunset, and hours of daylight for ${daylight.latitude} latitude.`);

// All other angles will be in radians, because tht's what JavaScript Math functions expect.
const latitudeRadians = latitudeDegrees * Math.PI / 180;

// Calculate some important date-times based on today's date.
const currentDateTime = new Date();
daylight.datetime = currentDateTime.toISOString();

const now = currentDateTime.getTime();  // milliseconds since Jan 1, 1970
const todayAtMidnight = new Date(currentDateTime);
todayAtMidnight.setHours(0, 0, 0, 0);  // zero out the time.
const jan1AtMidnight = new Date(`JAN-01-${currentDateTime.getFullYear()}`);
const jun1AtMidnight = new Date(`JUN-01-${currentDateTime.getFullYear()}`);
daylight.dayStart = todayAtMidnight.toISOString();
if (verbose) console.error(`The day started at: ${daylight.dayStart}`);

// Calculate how many days have passed since the winter sosltice (Dec 21) of the previous year.
// Rounding is because daylight saving time can throw things off by an hour.
daylight.daysAfterWinterSolstice = Math.round((todayAtMidnight - jan1AtMidnight) / 86400000) + 10;
if (verbose) console.error(`Days since winter solstice: ${daylight.daysAfterWinterSolstice}`);

// Calculate how far planet Earth has traveled around the sun in the days since the winter soltice.
const radiansPerDay = 2 * Math.PI / 365;
daylight.radiansOfRotation = radiansPerDay * daylight.daysAfterWinterSolstice;
if (verbose) console.error(`Radians traveled around sun since winter solstice: ${daylight.radiansOfRotation.toFixed(4)}`);

// Solar declination is the angle between the sun and Earth's equator.
// It's at its minimum on the day of the winter solstice (northern hemisphere.)
daylight.solarDeclination = -0.4102 * Math.cos(daylight.radiansOfRotation);  // 0.4102 is Earth's tilt in radians. (~23.5 deg.)
if (verbose) console.error(`Solar declination: ${daylight.solarDeclination.toFixed(4)} radians.`);

// The hour angle gives hours of daylight on either side of solar noon for a given declination and latitude.
daylight.hourAngle = Math.acos(-Math.tan(latitudeRadians) * Math.tan(daylight.solarDeclination));
if (verbose) console.error(`Hour angle: ${daylight.hourAngle.toFixed(4)} radians.`);

// The number of hours is that angle over 2pi radians (360 degrees) times 24 hours in a day.
daylight.hoursFromSolarNoon = 24 * daylight.hourAngle / (2 * Math.PI);
daylight.hoursOfDaylight = 2 * daylight.hoursFromSolarNoon;

if (verbose) console.error(`Sunrise: ${daylight.hoursFromSolarNoon.toFixed(2)} hours before solar noon.`);
if (verbose) console.error(`Sunset: ${daylight.hoursFromSolarNoon.toFixed(2)} hours after solar noon.`);
if (verbose) console.error(`Hours of daylight today: ${daylight.hoursOfDaylight.toFixed(2)}`);

// Calculates clock times.
// For sunrise, hours are subtracted from 11 (not 12) to account for the 60 minutes. (12:00 noon is 11:60 a.m.)
daylight.sunrise = new Date(todayAtMidnight.setHours(11 - Math.floor(daylight.hoursFromSolarNoon), 60 - Math.round((daylight.hoursFromSolarNoon % 1) * 60)));
daylight.sunset = new Date(todayAtMidnight.setHours(12 + Math.floor(daylight.hoursFromSolarNoon), Math.round((daylight.hoursFromSolarNoon % 1) * 60)));

// Adjust for Daylight Saving Time.
if (jan1AtMidnight.getTimezoneOffset() != jun1AtMidnight.getTimezoneOffset()) {
  if (verbose) console.error('Daylight Saving Time is in effect.');
  if (verbose) console.error('Solar noon is 1:00 PM');
  daylight.sunrise.setHours(daylight.sunrise.getHours() + 1);
  daylight.sunset.setHours(daylight.sunset.getHours() + 1);
}
else {
  if (verbose) console.error('Solar noon is 12:00 PM');
}

// Report results.
if (verbose) console.error(`Sunrise is: ${daylight.sunrise.toLocaleString()}`);
if (verbose) console.error(`Sunrise is: ${daylight.sunset.toLocaleString()}`);
if (verbose) console.error(`It's currently: ${currentDateTime.toLocaleString()}`);
if (currentDateTime > daylight.sunrise && currentDateTime < daylight.sunset) {
  daylight.sunIsUp = true;
  if (verbose) console.error('The sun is up.');
}
else {
  daylight.sunIsUp = false;
  if (verbose) console.error('The sun is down.');
}
if (!verbose) console.log(JSON.stringify(daylight, null, 2));
