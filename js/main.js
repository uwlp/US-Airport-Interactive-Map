// 1. Create a map object.
var mymap = L.map('map', {
    center: [38, -100],
    zoom: 5,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true});

// 2. Add a base map.
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// 3. Add cell towers GeoJSON Data
// Null variable that will hold cell tower data
var airports = null;

// 4. build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale('Dark2').mode('lch').colors(13);

// 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 13; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

// Get GeoJSON and put on it on the map when it loads
airports= L.geoJson.ajax("assets/airports.geojson", {
    // assign a function to the onEachFeature parameter of the cellTowers object.
    // Then each (point) feature will bind a popup window.
    // The content of the popup window is the value of `feature.properties.company`
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.AIRPT_NAME + ", " + feature.properties.CITY);
        return feature.properties.CITY;
    },
    pointToLayer: function (feature, latlng) {
        var id = 0;
        if (feature.properties.CNTL_TWR == "Y") {
        return L.marker(latlng, {icon: L.divIcon({className: "fa fa-plane marker-color-1"})});} //Has control tower
        else {
        return L.marker(latlng, {icon: L.divIcon({className: "fa fa-plane marker-color-7"})});} //Doesn't have control tower
    },
    attribution: 'Airport Data &copy; US.GOV | U.S. States Data &copy; Mike Bostock | Base Map &copy; CartoDB | Made By Lizhi Peng'
}).addTo(mymap);

// 6. Set function for color ramp
colors = chroma.scale('Blues').colors(5);

function setColor(density) {
    var id = 0;
    if (density > 20) { id = 4; }
    else if (density > 10 && density <= 20) { id = 3; }
    else if (density > 5 && density <= 10) { id = 2; }
    else if (density > 0 &&  density <= 5) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

// 7. Set style function that sets fill color.md property equal to cell tower density
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

// 8. Add county polygons
// create counties variable, and assign null to it.
var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
    style: style
}).addTo(mymap);


// 9. Create Leaflet Control Object for Legend
var legend = L.control({position: 'topright'});

// 10. Function that runs when legend is added to map
legend.onAdd = function () {

    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b>Airport Per State</b><br />';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p> 20+ </p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p> 10-20 </p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p> 5-10 </p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 0-5 </p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0 </p>';
    div.innerHTML += '<hr><b>Air Traffic Control Tower<b><br />';
    div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p> Yes </p>';
    div.innerHTML += '<i class="fa fa-plane marker-color-7"></i><p> No </p>';
    // Return the Legend div containing the HTML content
    return div;
};

// 11. Add a legend to map
legend.addTo(mymap);

// 12. Add a scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);
