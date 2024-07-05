console.log("hello");
const socket = io();

if ("geolocation" in navigator) {
  // Watch the user's position continuously
  navigator.geolocation.watchPosition(
    (position) => {
      // Extract latitude and longitude from the position object
      const { latitude, longitude } = position.coords;

      // Emit the location data to the server using the "sendLocation" event
      socket.emit("sendLocation", { latitude, longitude });
    },
    (error) => {
      console.log(error.message);
    },
    {
      // Set options for geolocation
      enableHighAccuracy: true, // Enable high accuracy mode
      timeout: 5000, // Set a timeout of 5 seconds
      maximumAge: 0, // Disable caching of location data
    }
  );
} else {
  alert("Your browser does not support geolocation.");
}

const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

const markers = {};

socket.on("receiveLocation", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]);
  } else {
    markers[id] = L.marker([latitude, longitude], "Danish").addTo(map);
  }
});

socket.on("userDisconnected", (id) => {
  if (markers[id]) {
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});
