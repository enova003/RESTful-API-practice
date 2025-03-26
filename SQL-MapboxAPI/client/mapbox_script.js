mapboxgl.accessToken =
  "ENV_ACCESS_TOKEN";

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/standard-satellite",
  showRoadsAndTransit: true,
  //projection: 'naturalEarth',
  center: [-95, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
  zoom: 3, // starting zoom
});

// Add the control to the map.
map.addControl(
  new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
  }),
  "top-right"
);

map.addControl(
  new MapboxDirections({
    accessToken: mapboxgl.accessToken,
  }),
  "bottom-left"
);

map.addControl(new mapboxgl.FullscreenControl(), "top-right");

map.addControl(
  new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
    showUserHeading: true,
  })
);

map.addControl(
  new mapboxgl.NavigationControl({
    visualizePitch: true,
    showZoom: true,
    showCompass: true,
  }),
  "top-right"
);

//const marker1 = new mapboxgl.Marker().setLngLat([2.349014, 48.864716]).addTo(map);

async function fetchPOI() {
  try {
    const response = await fetch("/api/coordinates");
    const coordinates = await response.json();
    coordinates.forEach((coordinate) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([coordinate.longitude, coordinate.latitude])
        .addTo(map);
    });
  } catch (error) {
    console.log(error);
  }
};

//post marker to DB
function postMarker(event) {
  event.preventDefault();

  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;

  const latNum = parseFloat(latitude);
  const longNum = parseFloat(longitude);

  if(latNum < -90 || latNum > 90 || longNum < -180 || longNum > 180 || isNaN(latNum) || isNaN(longNum)) {
    alert("Please enter a valid latitude and longitude");
    return;
  }
  
  try{
    fetch("/api/post/coordinates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude,
        longitude,
      }),
    }).then((response) => {
      if (response.ok) {
        location.reload();
      } else {
        alert("Failed to add marker");
      }
    });

  } catch (error) {
    alert(error);
  }
};

var Draw = new MapboxDraw();
map.addControl(Draw, 'bottom-right');

map.on("style.load", () => {
  fetchPOI();

  map.setFog({
    color: "rgb(186, 210, 235)", // Lower atmosphere
    "high-color": "rgb(36, 92, 223)", // Upper atmosphere
    "horizon-blend": 0.02, // Atmosphere thickness (default 0.2 at low zooms)
    "space-color": "rgb(11, 11, 25)", // Background color
    "star-intensity": 0.6, // Background star brightness (default 0.35 at low zoooms )
  });

/*   map.addSource("wyoming", {
    type: "geojson",
    data: "data/wyoming.geojson",
  });

  map.addLayer({
    id: "wyoming-fill",
    type: "fill",
    source: "wyoming", 
    layout: {},
    paint: {
      "fill-color": "#0080ff", 
      "fill-opacity": 0.5,
    },
  });

  map.addLayer({
    id: "outline",
    type: "line",
    source: "wyoming",
    layout: {},
    paint: {
      "line-color": "#000",
      "line-width": 1,
    },
  }); */
});

