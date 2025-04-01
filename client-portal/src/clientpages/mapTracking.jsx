import React, { useEffect, useState } from 'react'
import Header from '../Components/header';
import MapView from '../Components/MapView';
import axios from 'axios';
import { LiveDataProcess } from '../DataHelpers/InDatapro';
import AddressCell from '../Components/AddressCell';
import { DateTimeFRMT } from '../DataHelpers/Date&Time';
import LoadingOverlay from '../Components/Loader';

function MapTracking() {
  const [Data, setData] = useState([]);
  const [selected, setselected] = useState("");
  let Userid = ""
  const [selectedData, setselectedData] = useState([]);
  const[loading,setloading]=useState(false)
  const [expandedRow, setExpandedRow] = useState(null);
  const [velocity, setVelocity] = useState(0);
  const [odo, setdod] = useState();
  const [bearing, setBearing] = useState(0);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };
  
  const [location, setlocation] = useState({
    latitude: null,
    longitude: null,
  });

  useEffect(() => {
    const id = localStorage.getItem('user')
    Userid = id
    GetData()
  }, [])

  useEffect(() => {
    let interval;
    if (selected) {
      interval = setInterval(() => {
        MapTracking(); // Call your function here
      }, 2000); // Change interval to 10 seconds (10,000 milliseconds)
    } else {
      clearInterval(interval);
    }

    // Cleanup the interval when selected changes or the component unmounts
    return () => clearInterval(interval);
  }, [selected]);


  const GetData = async () => {
    try {
      setloading(true);
      const res = await axios.get(`/api-trkclt/get-units/${Userid}`);
      if (res.status === 200) {
        setData(res.data.units);
      } else {
        console.log("Empty data received");
      }
      setloading(false)
    } catch (error) {
      console.error("Error fetching data:", error);
      setloading(false)
    } 
  };

  const MapTracking = async () => {
    try {
      console.log("Fetching LIve map Redis data");
      const res = await axios.get(`/api-trkclt/get-live/${selected}`);
      console.log(res.data.liveData);
      const liveData = res.data.liveData;
      setdod(liveData.gps_odometer)
      setselectedData(res.data.liveData);
      setlocation({
        latitude: res.data.liveData.latitude, // Convert latitude to float
        longitude: res.data.liveData.longitude, // Convert longitude to float
      });
      
      if (liveData.speed > 0) {
        setVelocity(liveData.speed);
      }

      if (liveData.digital_input_1_status === "0") {
        setselected("");
        GetData();
      }
    } catch (error) {
      console.error("Error fetching Redis data:", error);
    }
  };

  const predictNextCoordinate = () => {
    if (!location.latitude || !location.longitude || velocity === 0) return location;

    const R = 6371000; // Earth radius in meters
    const bearingRad = (bearing * Math.PI) / 180;
    const distance = velocity * 1; // Predict for 1 second

    const lat1 = (location.latitude * Math.PI) / 180;
    const lng1 = (location.longitude * Math.PI) / 180;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(distance / R) +
      Math.cos(lat1) * Math.sin(distance / R) * Math.cos(bearingRad)
    );
    const lng2 =
      lng1 +
      Math.atan2(
        Math.sin(bearingRad) * Math.sin(distance / R) * Math.cos(lat1),
        Math.cos(distance / R) - Math.sin(lat1) * Math.sin(lat2)
      );

    return { latitude: (lat2 * 180) / Math.PI, longitude: (lng2 * 180) / Math.PI };
  };

  const snapToRoads = async (lat, lng) => {
    try {
      console.log(lat, lng, "test");
      
      const url = `https://roads.googleapis.com/v1/snapToRoads?path=${lat},${lng}&interpolate=true&key=AIzaSyDrrCc7r581apqK_RiScoY-Xm-oohyEXAg`;
      const response = await axios.get(url);
      console.log(response);
      
      return response.data.snappedPoints ? response.data.snappedPoints[0].location : { lat, lng };
    } catch (error) {
      console.error("Error snapping to roads:", error);
      return { lat, lng };
    }
  };

  const calculateBearing = (prevPos, currPos) => {
    const dLng = ((currPos.longitude - prevPos.longitude) * Math.PI) / 180;
    const y = Math.sin(dLng) * Math.cos((currPos.latitude * Math.PI) / 180);
    const x =
      Math.cos((prevPos.latitude * Math.PI) / 180) * Math.sin((currPos.latitude * Math.PI) / 180) -
      Math.sin((prevPos.latitude * Math.PI) / 180) * Math.cos((currPos.latitude * Math.PI) / 180) * Math.cos(dLng);
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };


  return (
    <>
      <Header />
      <LoadingOverlay isLoading={loading} />
      <div className="mt-24 flex" style={{ height: 'calc(100vh - 96px)' }}>
        {/* Left Side: Asset Details Table - Fixed width */}
        <div className="w-96 bg-gray-100 dark:bg-[#1b1b1d] p-4 overflow-y-auto shadow-lg" style={{ minWidth: '340px', maxWidth: '340px' }}>
          <table className="w-full border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Sl No</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Asset Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-gray-300">Vehicle No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 dark:divide-gray-700">
              {Data.length > 0 && Data.map((asset, index) => (
                <React.Fragment key={index}>
                  {/* Main Row */}
                  <tr
                    className="hover:bg-gray-200 dark:hover:bg-[#28282a] cursor-pointer transition-colors duration-150"
                    onClick={() => {
                      if (asset.liveData.digital_input_1_status === "1") {
                        setselected(asset._id);
                      }
                      setlocation({ latitude: asset.liveData.latitude, longitude: asset.liveData.longitude });
                      toggleRow(index);
                    }}
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">{index + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">
                      {asset.assetMake ? `${asset.assetMake}, ${asset.assetModel}` : "NIL"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-300">{asset.assetRegNo}</td>
                  </tr>

                  {/* Collapsible Row */}
                  {expandedRow === index && (
                    <tr>
                      <td colSpan={3} className="px-4 py-3 bg-gray-50 dark:bg-[#28282a] border-t border-gray-300 dark:border-gray-700">
                        <div className="flex flex-col p-4 space-y-4">
                          {/* Date & Time */}
                          <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Date & Time:</p>
                            <p className="text-gray-900 dark:text-gray-100">
                              {DateTimeFRMT(
                                selectedData.length > 0 ? selectedData.date : asset.liveData.date,
                                selectedData.length > 0 ? selectedData.time : asset.liveData.time
                              )}
                            </p>
                          </div>

                          {/* Speed, Odometer, Ignition */}
                          <div className="flex flex-row space-x-6">
                            <div>
                              <p className="font-semibold text-gray-700 dark:text-gray-300">Speed:</p>
                              <p className="text-gray-900 dark:text-gray-100">{velocity} km/h</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 dark:text-gray-300">Odometer:</p>
                              <p className="text-gray-900 dark:text-gray-100">{odo ? odo : asset.liveData.gps_odometer} km</p>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-700 dark:text-gray-300">Ignition:</p>
                              <p className="text-gray-900 dark:text-gray-100">
                                {selectedData.length > 0
                                  ? selectedData.digital_input_1_status == 1 ? 'ON' : 'OFF'
                                  : asset.liveData.digital_input_1_status == 1 ? 'ON' : 'OFF'}
                              </p>
                            </div>
                          </div>

                          {/* Address */}
                          <div>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">Address:</p>
                            <p className="text-gray-900 dark:text-gray-100 max-w-80">
                              <AddressCell
                                latitude={location.latitude ? location.latitude : asset.liveData.latitude}
                                longitude={location.longitude ? location.longitude : asset.liveData.longitude}
                              />
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Side: Map Section - Takes remaining width */}
        <div className="flex-1 bg-gray-200 dark:bg-[#1c1f25]" style={{ height: '100%' }}>
          <MapView
            pin={'/assets/loc-pin.gif'}
            size={100}
            latitude={location.latitude}
            longitude={location.longitude}
          />
        </div>
      </div>
    </>
  );
}

export default MapTracking;