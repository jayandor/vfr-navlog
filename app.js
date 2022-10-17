import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import './js-yaml.js';
import { navlogApp } from './navlogApp.js'

const airplaneDataUrl = "airplaneData.yml";

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

        createApp(navlogApp(airplaneData)).mount('#app');

    });
});