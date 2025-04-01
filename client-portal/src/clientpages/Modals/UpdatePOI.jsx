import React, { useState,useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import Modal from '../../Components/Modal';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import axios from 'axios';

// Fix Leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Merge options with correct image paths
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function LocationPicker({ onLocationSelect }) {
    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            onLocationSelect({ lat, lng });
        },
    });
    return null;
}


function UpdatePOI({ open, onClose, id,GetData,poiData }) {
    const [location, setLocation] = useState({ lat: 9.939093, lng: 76.270523 }); // Default location
    const [markerPosition, setMarkerPosition] = useState({ lat: 9.939093, lng: 76.270523 });
    const [radius, setRadius] = useState(0);
    const [type, setType] = useState(0);
    const [name, setName] = useState(""); // State for the geofence radius

    const handleLocationSelect = (newLocation) => {
        setMarkerPosition(newLocation); // Update marker position
        setLocation(newLocation); // Update state with new location
    };
    useEffect(() => {
       if(poiData){
        setLocation({ lat: poiData.latitude, lng: poiData.longitude });
        setMarkerPosition({ lat: poiData.latitude, lng: poiData.longitude });
        setRadius(poiData.radius);
        setType(poiData.pointType);
        setName(poiData.name);
       }
    }, [])
    
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocation((prevLocation) => ({
            ...prevLocation,
            [name]: parseFloat(value),
        }));
        setMarkerPosition((prevPosition) => ({
            ...prevPosition,
            [name]: parseFloat(value),
        }));
    };

    const handleRadiusChange = (e) => {
        setRadius(parseInt(e.target.value, 10)); // Update radius state
    };

    const handleSubmit =async (e) => {
        e.preventDefault();
        try {
            
            const response = await axios.put(`/api-trkclt/update-geofence/${id}/${poiData._id}`, {name:name,pointType:type,latitude:location.lat,longitude:location.lng,radius:radius});
   
            if (response.status === 200) {
                onClose()
                GetData()
            }

        } catch (error) {
            console.error("Error adding Contact:", error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} size={"xl"}>
            <div className="text-gray-900 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center">Update Point</h2>

                <div className="flex flex-col space-x-5">
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="flex flex-row space-x-5">
                            <div className="space-y-5">
                            <div className="flex flex-row space-x-5">
                                <div className="w-full">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        htmlFor="name"
                                    >
                                        Point Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e)=>setName(e.target.value)}
                                        name="name"
                                        placeholder="Enter Point Name"
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                    />
                                </div>

                                <div className="w-full">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        htmlFor="type"
                                    >
                                        Point Type
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={type}
                                        onChange={(e)=>setType(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                    >
                                        <option value={0}>Select a Point Type</option>
                                        <option value={0}>Select a Point Type</option>
                                            <option value={1}>Apartment</option>
                                            <option value={2}>ATM</option>
                                            <option value={3}>Bakery</option>
                                            <option value={4}>Bank</option>
                                            <option value={5}>Bar</option>
                                            <option value={6}>Bus Stop</option>
                                            <option value={7}>Cafeteria</option>
                                            <option value={8}>Car Rental</option>
                                            <option value={9}>Church</option>
                                            <option value={10}>City Center</option>
                                            <option value={11}>Coffee Shop</option>
                                            <option value={12}>Company</option>
                                            <option value={13}>Conference Hall</option>
                                            <option value={14}>Court</option>
                                            <option value={15}>Customs</option>
                                            <option value={16}>Department Store</option>
                                            <option value={17}>Doctor</option>
                                            <option value={18}>Entrance</option>
                                            <option value={19}>Exit</option>
                                            <option value={20}>Factory</option>
                                            <option value={21}>Family</option>
                                            <option value={22}>Fire Dept</option>
                                            <option value={23}>Fuel Station</option>
                                            <option value={24}>Furniture Shop</option>
                                            <option value={25}>Garage</option>
                                            <option value={26}>Grocery</option>
                                            <option value={27}>Hospital</option>
                                            <option value={28}>Hostel</option>
                                            <option value={29}>Hotel</option>
                                            <option value={30}>House</option>
                                            <option value={31}>Hypermarket</option>
                                            <option value={32}>Jewelery</option>
                                            <option value={33}>Kiosk</option>
                                            <option value={34}>Mosque</option>
                                            <option value={35}>Office</option>
                                            <option value={36}>Parking</option>
                                            <option value={37}>Pharmacy</option>
                                            <option value={38}>Police</option>
                                            <option value={39}>Residence</option>
                                            <option value={40}>Restaurant</option>
                                            <option value={41}>School</option>
                                            <option value={42}>Service Center</option>
                                            <option value={43}>Shop</option>
                                            <option value={44}>Shop Stationary</option>
                                            <option value={45}>Shop Textiles</option>
                                            <option value={46}>Shopping Mall</option>
                                            <option value={47}>Showroom</option>
                                            <option value={48}>Supermarket</option>
                                            <option value={49}>Temple</option>
                                            <option value={50}>Toll Station</option>
                                            <option value={51}>University</option>
                                            <option value={52}>Collage</option>
                                            <option value={53}>Yard</option>
                                    </select>
                                </div>
                                </div>

                                <div className="flex flex-row space-x-5">
                                    <div className="w-full">
                                        <label
                                            className="block text-sm font-medium mb-2"
                                            htmlFor="latitude"
                                        >
                                            Latitude
                                        </label>
                                        <input
                                            type="number"
                                            id="latitude"
                                            name="lat"
                                            value={location.lat}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            required
                                        />
                                    </div>

                                    <div className="w-full">
                                        <label
                                            className="block text-sm font-medium mb-2"
                                            htmlFor="longitude"
                                        >
                                            Longitude
                                        </label>
                                        <input
                                            type="number"
                                            id="longitude"
                                            name="lng"
                                            value={location.lng}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="w-full">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        htmlFor="radius"
                                    >
                                        Radius
                                    </label>
                                    <select
                                        id="radius"
                                        name="radius"
                                        value={radius}
                                        onChange={handleRadiusChange}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                    >
                                        <option value="">Select a Radius</option>
                                        <option value={25}>25 Meters</option>
                                        <option value={50}>50 Meters</option>
                                        <option value={100}>100 Meters</option>
                                        <option value={150}>150 Meters</option>
                                        <option value={200}>200 Meters</option>
                                        <option value={250}>250 Meters</option>
                                        <option value={500}>500 Meters</option>
                                        <option value={750}>750 Meters</option>
                                        <option value={1000}>1000 Meters</option>
                                        <option value={1500}>1500 Meters</option>
                                    </select>
                                </div>
                            </div>

                            <div className="w-[500px]">
                                <MapContainer
                                    center={[location.lat, location.lng]}
                                    zoom={10}
                                    scrollWheelZoom={true}
                                    style={{ height: "300px", width: "100%", borderRadius: "8px" }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    {markerPosition && (
                                        <Marker position={[markerPosition.lat, markerPosition.lng]} />
                                    )}
                                    {radius > 0 && (
                                        <Circle
                                            center={[markerPosition.lat, markerPosition.lng]}
                                            radius={radius}
                                            pathOptions={{ color: 'red', fillOpacity: 0.08 }}
                                        />
                                    )}
                                    <LocationPicker onLocationSelect={handleLocationSelect} />
                                </MapContainer>
                            </div>
                        </div>

                        <div className="flex justify-between gap-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-orange-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-orange-700 transition duration-200"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}

export default UpdatePOI;
