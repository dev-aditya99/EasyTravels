
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/standard',
    center: listing.geometry.coordinates,
    zoom: 14,
    projection: 'globe'
});


const marker = new mapboxgl
    .Marker({ color: "#ff385c" })
    .setLngLat(listing.geometry.coordinates)
     .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(
        `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
      )
  )
  .addTo(map);
  