// Calculate bearing between two coordinates
function calculateBearing(lat1, lng1, lat2, lng2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    const dLng = toRad(lng2 - lng1);
    const y = Math.sin(dLng) * Math.cos(toRad(lat2));
    const x =
        Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
        Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Calculate velocity (meters per second)
function calculateVelocity(lat1, lng1, lat2, lng2, timeDelta) {
    const R = 6371000; // Earth radius in meters
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return distance / timeDelta; // Velocity in meters/second
}


function predictNextCoordinate(lat, lng, bearing, velocity, timeDelta) {
    const R = 6371000; // Earth radius in meters
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    const distance = velocity * timeDelta; // Distance = velocity × time
    const bearingRad = toRad(bearing);

    const latRad = toRad(lat);
    const lngRad = toRad(lng);

    const nextLat = Math.asin(
        Math.sin(latRad) * Math.cos(distance / R) +
        Math.cos(latRad) * Math.sin(distance / R) * Math.cos(bearingRad)
    );
    const nextLng =
        lngRad +
        Math.atan2(
            Math.sin(bearingRad) * Math.sin(distance / R) * Math.cos(latRad),
            Math.cos(distance / R) - Math.sin(latRad) * Math.sin(nextLat)
        );

    return { lat: toDeg(nextLat), lng: toDeg(nextLng) };
}


async function snapToRoad(lat, lng, apiKey) {
    const roadsUrl = `https://roads.googleapis.com/v1/snapToRoads?path=${lat},${lng}&interpolate=true&key=${apiKey}`;
    const response = await fetch(roadsUrl);
    const data = await response.json();
    return data.snappedPoints[0].location;
}


function interpolateCoordinates(current, predicted, progress) {
    const lat = current.lat + (predicted.lat - current.lat) * progress;
    const lng = current.lng + (predicted.lng - current.lng) * progress;
    return { lat, lng };
}


async function getNextCoordinate(
    currentLat,
    currentLng,
    prevLat,
    prevLng,
    prevTime,
    currentTime,
    apiKey
) {
    // Calculate time delta
    const timeDelta = (currentTime - prevTime) / 1000; // in seconds

    // Calculate bearing and velocity
    const bearing = calculateBearing(prevLat, prevLng, currentLat, currentLng);
    const velocity = calculateVelocity(prevLat, prevLng, currentLat, currentLng, timeDelta);

    // Predict next coordinate
    const predicted = predictNextCoordinate(currentLat, currentLng, bearing, velocity, timeDelta);

    // Snap to road
    const snapped = await snapToRoad(predicted.lat, predicted.lng, apiKey);

    return snapped; // Return smooth next coordinate
}
