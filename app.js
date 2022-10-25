// import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { createApp } from 'vue';
// import './js-yaml.js';
const jsyaml = require('js-yaml');
import { navlogApp } from './navlogApp.js';

const airplaneDataUrl = "static/airplaneData.yml";

const winds = require('@faa-aviation-data-portal/winds-aloft');

import airportLatLong from './airportLatLong.json' assert {type: 'json'};

function addHours(numOfHours, date = new Date()) {
    return new Date(date.getTime() + numOfHours * 60 * 60 * 1000);
}

function retrieveWindsAloft() {

    let existingData = JSON.parse(localStorage.getItem("windsAloft"));

    if (existingData !== null && existingData["expiration"]) {
        let expiration = new Date(existingData["expiration"]);

        if (expiration > new Date()) {
            // Data hasn't expired
            console.log(`Using previously acquired winds aloft data (issuance time: ${existingData["data"]["issuanceTime"]})`);
            return existingData["data"];
        }

    }
    // Data doesn't exist or has expired
    console.log("Updating winds aloft data from FAA API...");

    winds.FD1({
        location: 'US1',
        issuanceTimeFrom: addHours(-6),
    })
    .then(result => {
        console.log("Received winds aloft data")
        let data = result[0];
        let issuance = data["issuanceTime"]
        let expiration = addHours(6, new Date(issuance));

        let storeData = {
            expiration: expiration,
            data: data
        };

        localStorage.setItem("windsAloft", JSON.stringify(storeData));

        return data;
    });
}


$(document).ready(function () {
    $.ajax({
        mimeType: 'text/plain; charset=x-user-defined',
        url:         airplaneDataUrl,
        type:        "GET",
        dataType:    "text",
        cache:       false
    })
    .done(function (data) {

        let airplaneData = jsyaml.load(data);
        console.log('Finished loading airplane data YAML');

        // console.log(airplaneData);

        let windsAloft = retrieveWindsAloft();

        createApp(navlogApp(airplaneData, windsAloft, airportLatLong)).mount('#app');

    });
});