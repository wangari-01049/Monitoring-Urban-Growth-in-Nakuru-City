var map = L.map("map").setView([-0.303099, 36.080025], 6); // Set initial view

// Base layers
var osmMap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
).addTo(map);
// Load population GeoJSON data
// Note: Make sure the countrypopulation variable is defined in countrypopulation.js
var populationLayer = L.geoJSON(countrypopulation, {
  style: style,
  onEachFeature: onEachFeature,
});

// Legend
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "legend-choropleth"), // Changed class name to 'legend-choropleth'
    grades = [0, 10, 20, 50, 100, 200, 500, 1000],
    labels = [];

  for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
      '<i style="background:' +
      getColor(grades[i] + 1) +
      '"></i> ' +
      grades[i] +
      (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
  }

  return div;
};

legend.addTo(map);

function getColor(d) {
  return d > 1000
    ? "#800026"
    : d > 500
    ? "#BD0026"
    : d > 200
    ? "#E31A1C"
    : d > 100
    ? "#FC4E2A"
    : d > 50
    ? "#FD8D3C"
    : d > 20
    ? "#FEB24C"
    : d > 10
    ? "#FED976"
    : "#FFEDA0";
}

function style(feature) {
  return {
    fillColor: getColor(feature.properties.Population_Density),
    weight: 1,
    opacity: 0.5,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.7,
  };
}



function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {

  layer.bindPopup(
    "<b>" +
      feature.properties.COUNTY +
      "</b><br />Population Density: " +
      feature.properties.Population_Density +
      " people / mi<sup>2</sup>"
  );
}

var infopop = L.control(); // Changed variable name to infopop

infopop.onAdd = function (map) {
  this._div = L.DomUtil.create("div", "info-choropleth"); // Changed class name to 'info-choropleth'
  this.update();
  return this._div;
};

infopop.update = function (props) {
  this._div.innerHTML =
    "<h4>Kenyan Population Density</h4>" +
    (props
      ? "<b>" +
        props.COUNTY +
        "</b><br />" +
        props.Population_Density +
        " people / mi<sup>2</sup>"
      : "Hover over a county");
};

infopop.addTo(map);

// Layer Controls
var baseMaps = {
  OpenStreetMap: osmMap,
};

var overlayMaps = {
  Population: populationLayer,
};

L.control.layers(baseMaps, overlayMaps).addTo(map);

// Add population layer to map after legend is added
populationLayer.addTo(map);
