import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function PanToMarker({ latitude, longitude, allowZoom }) {
  const map = useMap();

  useEffect(() => {
    if (latitude && longitude) {
      map.flyTo([latitude, longitude], allowZoom ? 14 : map.getZoom(), {
        animate: true,
        duration: 1,
      });
    }
  }, [latitude, longitude, allowZoom, map]);

  return null;
}

function MapView({ latitude, longitude, pin, size, allowZoom = false }) {
  const customIcon = new L.Icon({
    iconUrl: pin,
    iconSize: [size, size],
  });

  const [currentPosition, setCurrentPosition] = useState({ latitude, longitude });

  useEffect(() => {
    if (latitude !== currentPosition.latitude || longitude !== currentPosition.longitude) {
      setCurrentPosition({ latitude, longitude });
    }
  }, [latitude, longitude, currentPosition]);

  return (
    <MapContainer
      center={[currentPosition.latitude || 9.324796, currentPosition.longitude || 76.39656]}
      zoom={10}
      className="w-full h-full"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; Trak24.com" />
      {currentPosition.latitude && currentPosition.longitude && (
        <>
          <Marker position={[currentPosition.latitude, currentPosition.longitude]} icon={customIcon} />
          <PanToMarker latitude={currentPosition.latitude} longitude={currentPosition.longitude} allowZoom={allowZoom} />
        </>
      )}
    </MapContainer>
  );
}

export default MapView;
