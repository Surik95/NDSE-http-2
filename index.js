#!/usr/bin/env node -r dotenv/config

const http = require('http');
const { tokenWeather, urlWeatherstack, region } = require('./config');

const weatherRegion = process.argv[2] ? process.argv[2] : region;
http
  .get(
    `${urlWeatherstack}access_key=${tokenWeather}&query=${weatherRegion}`,
    (res) => {
      const { statusCode } = res;
      if (statusCode !== 200) {
        console.log(`statusCode: ${statusCode}`);
        return;
      }

      res.setEncoding('utf8');
      let rowData = '';
      res.on('data', (chunk) => (rowData += chunk));
      res.on('end', () => {
        let apiResponse = JSON.parse(rowData);
        if (apiResponse.error) {
          console.log(apiResponse.error.info);
        } else {
          console.log(
            `Current temperature in ${apiResponse.location.name} is ${apiResponse.current.temperature}℃`
          );
        }
      });
    }
  )
  .on('error', (err) => {
    console.error(err);
  });
