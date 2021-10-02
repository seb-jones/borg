// 
// Global Variables
//

//
// Functions
//

function setupGame(features)
{
    let highlightedFeatureId = null;

    const options = {
        minZoom: 2,

        // Remove 'Leaflet' link from the bottom-right corner of the map
        attributionControl: false,

        // Remove Zoom buttons from the top-left corner of the map
        zoomControl: false,
    };

    const map = L.map('mapid', options);

    const geojsonLayer = L.geoJSON(features, {
        style: feature => {
            return {
                weight: 2,
                opacity: 1,
                color: '#00ff00',
                dashArray: '3',
                fillOpacity: 0.3,
                fillColor: '#00dd00'
            };
        }
    }).addTo(map);

    // geojsonLayer.on('click', e => console.log(e.sourceTarget.feature.properties.SOVEREIGNT));

    geojsonLayer.on('mouseover', e => {
        highlightedFeatureId = e.sourceTarget.feature.properties.geom_id;
        console.log(highlightedFeatureId);
        geojsonLayer.resetStyle();
    });
    geojsonLayer.on('mouseout', e => highlightedFeatureId = null);

    map.fitBounds(geojsonLayer.getBounds());

    map.setMaxBounds(geojsonLayer.getBounds());
}

//
// Code Entry Point
//

// Fetch the GeoJSON data from the server and setup the game when that's done
fetch('/data/world-map-simplified-minified.geojson')
    .then(response => response.json())
    .then(data => setupGame(data.features))

