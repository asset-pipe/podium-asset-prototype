/* eslint-env browser */

'use strict';

import 'leaflet';
// import { WiredCard } from 'wired-elements';
import { WiredCard } from 'https://cdn.pika.dev/wired-elements/v1';

const load = () => {
    const map = L.map('geo-map').setView([48.210033, 16.363449], 11);  // Vienna
    // const map = L.map('geo-map').setView([48.137154, 11.576124], 11);     // Munich

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(map);
}

document.addEventListener('DOMContentLoaded', load);
