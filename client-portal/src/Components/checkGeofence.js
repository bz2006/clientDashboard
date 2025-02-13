import React, { useEffect, useState } from "react";
import { getDistance } from "geolib";

const GeofenceChecker = ({ geofences, trackerLat, trackerLng }) => {
  const [result, setResult] = useState(null);

  const checkGeofence = () => {
    const trackerLocation = {
      latitude: parseFloat(trackerLat),
      longitude: parseFloat(trackerLng),
    };

    // Check if the tracker is inside any geofence
    const matchingGeofences = geofences.filter((geofence) => {
      const distance = getDistance(
        trackerLocation,
        { latitude: geofence.latitude, longitude: geofence.longitude }
      );
      return distance <= geofence.radius;
    });

    // Set the result
    if (matchingGeofences.length > 0) {
      setResult(matchingGeofences.map(({ name, pointType }) => ({ name, pointType })));
    } else {
      setResult(null);
    }
  };

  useEffect(() => {
    checkGeofence();
  }, [trackerLat, trackerLng, geofences]);

  return (
    <div>
      {result ? (
        <div>
          {result.map((geofence, index) => (
            <h1 key={index}>
              {geofence.name}
            </h1>
          ))}
        </div>
      ) : (
        <h1>--</h1>
      )}
    </div>
  );
};

export default GeofenceChecker;
