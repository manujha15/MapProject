import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getDistance } from "geolib";

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const MapComponent = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destination, setDestination] = useState({ lat: 15.2993, lng: 74.124 }); // Default to Goa
  const [distance, setDistance] = useState(null);

  // Get User's Current Location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  // Calculate Distance
  const calculateDistance = () => {
    if (currentLocation && destination) {
      const dist = getDistance(currentLocation, destination) / 1000; // Convert to km
      setDistance(dist.toFixed(2));
    }
  };

  // Swap Current Location and Destination
  const swapLocations = () => {
    setCurrentLocation(destination);
    setDestination(currentLocation);
  };

  return (
    <div>
      <h1>OpenStreetMap in React</h1>
      <h2>Find Route & Distance</h2>
      
      <div>
        <label>From (Current Location): </label>
        <input
          type="text"
          value={currentLocation ? `${currentLocation.lat}, ${currentLocation.lng}` : "Fetching location..."}
          readOnly
        />
        
        <button onClick={swapLocations}>Swap</button>

        <label> To (Destination): </label>
        <input
          type="text"
          value={`${destination.lat}, ${destination.lng}`}
          readOnly
        />
        
        <button onClick={calculateDistance}>Calculate Distance</button>
      </div>

      <p>Distance: {distance ? `${distance} km` : "N/A"}</p>

      {currentLocation && (
        <MapContainer center={currentLocation} zoom={6} style={{ height: "500px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          <Marker position={currentLocation} icon={customIcon}>
            <Popup>Current Location</Popup>
          </Marker>

          <Marker position={destination} icon={customIcon}>
            <Popup>Destination</Popup>
          </Marker>

          <Polyline positions={[currentLocation, destination]} color="blue" />
        </MapContainer>
      )}
    </div>
  );
};

export default MapComponent;





