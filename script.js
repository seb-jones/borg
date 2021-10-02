//
// Global Variables
//

// The ID of the country that the mouse is currently hovering over.
let highlightedFeatureId = null;

// Each key in this object is the ID of a country, and each value is an object
// containing various data about the country
let countries = {};

//
// Functions
//

function setupGame(features)
{
    // Populate neighbours global object with data from the features array
    features.forEach(feature => {
        const neighbours = feature
            .properties
            .neighbours
            .split(',')
            .filter(id => id !== feature.properties.geom_id);

        const name = feature.properties.SOVEREIGNT;

        countries[feature.properties.geom_id] = { name, neighbours };
    });

    const mapOptions = {
        minZoom: 2,

        // Remove 'Leaflet' link from the bottom-right corner of the map
        attributionControl: false,

        // Remove Zoom buttons from the top-left corner of the map
        zoomControl: false,
    };

    const map = L.map('map', mapOptions);

    const geojsonLayer = L.geoJSON(features, {
        style: featureStyle
    }).addTo(map);

    geojsonLayer.on('mouseover', e => {
        highlightedFeatureId = e.sourceTarget.feature.properties.geom_id;
        setHudText(countries[highlightedFeatureId].name.toLowerCase());
        geojsonLayer.resetStyle();
    });

    geojsonLayer.on('mouseout', e => {
        highlightedFeatureId = null;
        setHudText(null);
        geojsonLayer.resetStyle();
    });

    map.fitBounds(geojsonLayer.getBounds());

    map.setMaxBounds(geojsonLayer.getBounds());
}

function featureStyle(feature)
{
    const styles = {
        weight: 1,
        opacity: 1,
        color: '#00ff00',
        dashArray: '1',
        fillOpacity: 0.3,
        fillColor: '#00dd00'
    };

    const id = feature.properties.geom_id;

    if (id === highlightedFeatureId) {
        styles.fillColor = '#00ff00';
        styles.fillOpacity = 0.5;
    }

    return styles;
}

function setHudText(text, randomUppercase = false)
{
    document.getElementById('hud-text').innerText = text;
}

//
// Code Entry Point
//

// Fetch the GeoJSON data from the server and setup the game when that's done
fetch('/data/world-map-simplified-minified.geojson')
    .then(response => response.json())
    .then(data => setupGame(data.features))
