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

function setupGame(countryFeatures, cityFeatures)
{
    // Populate countries global object with data from the features array
    countryFeatures.forEach(feature => {
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

    const countryLayer = L.geoJSON(countryFeatures, {
        style: featureStyle
    }).addTo(map);

    // const cityMarkerOptions = {
    //     radius: 4,
    //     fillColor: "#dddddd",
    //     color: "#ffffff",
    //     weight: 1,
    //     opacity: 1.0,
    //     fillOpacity: 1.0
    // };

    // const cityLayer = L.geoJSON(cityFeatures, {
    //     pointToLayer: (feature, latlng) => L.circleMarker(latlng, cityMarkerOptions),
    // }).addTo(map);

    countryLayer.on('mouseover', e => {
        highlightedFeatureId = e.sourceTarget.feature.properties.geom_id;
        setHudText(countries[highlightedFeatureId].name.toLowerCase());
        countryLayer.resetStyle();
    });

    countryLayer.on('mouseout', e => {
        highlightedFeatureId = null;
        setHudText(null);
        countryLayer.resetStyle();
    });

    map.fitBounds(countryLayer.getBounds());

    map.setMaxBounds(countryLayer.getBounds());
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

function setHudText(text = null)
{
    const hudDiv = document.getElementById('hud');

    if (text === null) {
        hudDiv.style.display = 'none';
    } else {
        hudDiv.style.display = 'block';
        document.getElementById('hud-text').innerText = text;
    }
}

//
// Code Entry Point
//

// Fetch the GeoJSON data from the server and setup the game when that's done
Promise.all([
    fetch('/data/world-map-simplified-minified.geojson').then(response => response.json()),
    fetch('/data/cities-minified.geojson').then(response => response.json()),
]).then(results => {
    setupGame(results[0].features, results[1].features);
});
