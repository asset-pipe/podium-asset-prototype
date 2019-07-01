import '../../node_modules/leaflet/dist/leaflet-src.js';
import '../../node_modules/wired-button/lib/wired-button.js';
import '../../node_modules/wired-card/lib/wired-card.js';
import '../../node_modules/wired-checkbox/lib/wired-checkbox.js';
import '../../node_modules/wired-item/lib/wired-item.js';
import '../../node_modules/wired-combo/lib/wired-combo.js';
import '../../node_modules/wired-icon-button/lib/wired-icon-button.js';
import '../../node_modules/wired-input/lib/wired-input.js';
import '../../node_modules/wired-listbox/lib/wired-listbox.js';
import '../../node_modules/wired-progress/lib/wired-progress.js';
import '../../node_modules/wired-radio/lib/wired-radio.js';
import '../../node_modules/wired-radio-group/lib/wired-radio-group.js';
import '../../node_modules/wired-slider/lib/wired-slider.js';
import '../../node_modules/wired-textarea/lib/wired-textarea.js';
import '../../node_modules/wired-toggle/lib/wired-toggle.js';
import '../../node_modules/wired-tooltip/lib/wired-tooltip.js';
import '../../node_modules/wired-tabs/lib/wired-tabs.js';
import '../../node_modules/wired-fab/lib/wired-fab.js';
import '../../node_modules/wired-spinner/lib/wired-spinner.js';

/* eslint-env browser */

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
};

document.addEventListener('DOMContentLoaded', load);
