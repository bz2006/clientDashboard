import React, { useEffect, useState } from 'react'
import Header from '../Components/header'
import { MdOutlineDirections } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import { InDataProcess } from '../DataHelpers/InDatapro';
import axios from 'axios';
import MapView from '../Components/MapView';
import { useNavigate } from 'react-router-dom';
import { processReportData } from '../DataHelpers/ReportPro';
import AddressCell from '../Components/AddressCell';
import SignalStrengthIcon from '../Components/SignalStrength';
import GeofenceChecker from '../Components/checkGeofence';
import { DateTimeFRMT } from '../DataHelpers/Date&Time';
import AlertRow from '../DataHelpers/caseOptions';
import LoadingOverlay from '../Components/Loader';

function CoreTracking() {

    const [loading, setloading] = useState(false)
    const [Data, setData] = useState([]);
    const [Geofences, setGeofences] = useState([]);
    const [userData, setuserData] = useState([]);
    const [Imeis, setImeis] = useState([]);
    let Userid = ""
    const [expandedRow, setExpandedRow] = useState(null);
    const [headers, setheaders] = useState({
        total: 0,
        moving: 0,
        stopped: 0,
        alerts: 0
    })
    const navigate = useNavigate();

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    useEffect(() => {
        const id = localStorage.getItem('user')
        Userid = id

        GetInitData()

    }, [])


    useEffect(() => {
        let interval;
        if (Data) {
            interval = setInterval(() => {
                GetData(); // Call your function here
            }, 20000); // Change interval to 10 seconds (10,000 milliseconds)
        } else {
            clearInterval(interval);
        }

        // Cleanup the interval when selected changes or the component unmounts
        return () => clearInterval(interval);
    }, []);
    const GetInitData = async () => {
        try {
            setloading(true)
            const res = await axios.get(`/api-trkclt/get-units/${Userid}`);
            if (res.status === 200) {
                setData(res.data.units);
                setGeofences(res.data.geofences)
                setuserData(res.data.userData)
                const total = res.data.units.length;
                const moving = res.data.units.filter(unit => parseFloat(unit.liveData.speed) > 0).length;
                const stopped = res.data.units.filter(unit => parseFloat(unit.liveData.speed) === 0).length;
                const alerts = res.data.units.filter(unit => unit.liveData.header !== "BSTPL$1").length;

                setheaders({ total, moving, stopped, alerts });
            } else {
                console.log("Empty data received");
            }
            setloading(false)
        } catch (error) {
            console.error("Error fetching data:", error);
            setloading(false)
        }
    };
    const GetData = async () => {
        try {
            const res = await axios.get(`/api-trkclt/get-units/${Userid}`);

            if (res.status === 200) {
                setData(res.data.units);
                setGeofences(res.data.geofences)
                setuserData(res.data.userData)
                const total = res.data.units.length;
                const moving = res.data.units.filter(unit => parseFloat(unit.liveData.speed) > 0).length;
                const stopped = res.data.units.filter(unit => parseFloat(unit.liveData.speed) === 0).length;
                const alerts = res.data.units.filter(unit => unit.liveData.header !== "BSTPL$1").length;

                setheaders({ total, moving, stopped, alerts });
            } else {
                console.log("Empty data received");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    function formatDateTime(date) {
        const options = { day: "2-digit", month: "short", year: "numeric" }; // Format: 04 Jan 2025
        const datePart = date.toLocaleDateString("en-US", options);

        const timePart = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true, // Ensures AM/PM format
        });

        return `${datePart}, ${timePart}`;
    }


    function GetReportToday(imei, make, model, regNo) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1.
        const day = String(today.getDate()).padStart(2, '0');
        const date = `${year}-${month}-${day}`;

        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

        const arrayData = { start:date,end: date, imei: imei,company: userData.company, make: make, model: model, regNo: regNo, firstname: userData.firstname, genDate: `${formatDateTime(today)}`, range: `${formatDateTime(startOfDay)} to ${formatDateTime(today)}` };

        
        const serializedArray = encodeURIComponent(JSON.stringify(arrayData));
        window.open(`/reports-center/viewer?array=${serializedArray}`, '_blank');

    }

    function GetReportYesterday(imei, make, model, regNo) {
        const today = new Date();
        today.setDate(today.getDate() - 1);

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        const date = `${year}-${month}-${day}`;
        const todayAtMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);

        // Get yesterday's date at 12:00 AM
        const yesterdayAtMidnight = new Date(todayAtMidnight);
        yesterdayAtMidnight.setDate(yesterdayAtMidnight.getDate() - 1);

        const arrayData = {start:date,end: date, imei: imei, company: userData.company, make: make, model: model, regNo: regNo, firstname: userData.firstname, genDate: `${formatDateTime(today)}`, range: `${formatDateTime(yesterdayAtMidnight)} To: ${formatDateTime(todayAtMidnight)}` };


        const serializedArray = encodeURIComponent(JSON.stringify(arrayData));
        window.open(`/reports-center/viewer?array=${serializedArray}`, '_blank');

    }

    console.log(Data);

    return (
        <>
            <LoadingOverlay isLoading={loading} />
            <Header />
            <div className=' mt-24 flex flex-row justify-between items-center h-full'>
                <div>
                    <h1 className='text-black dark:text-white font-semibold text-3xl p-6'>
                        Core Tracking
                    </h1>
                </div>

                <div className='flex flex-row justify-end space-x-4 dark:bg-[#16181d] shadow-[0_0px_20px_rgba(0,0,0,0.1)] m-4 p-3 rounded-lg'>
                    <div className='w-fit h-12 px-4 border border-orange-600 bg-[#f6f7f9] dark:bg-[#28282a] rounded-md flex justify-center items-center'>Total {headers.total} Assets</div>
                    <div className='w-28 h-12 bg-[#f6f7f9] border border-green-600 dark:bg-[#28282a] rounded-md flex justify-center items-center'>{headers.moving} Moving</div>
                    <div className='w-28 h-12 bg-[#f6f7f9] border border-red-600 dark:bg-[#28282a] rounded-md flex justify-center items-center'>{headers.stopped} stopped</div>
                    <div className='w-28 h-12 bg-[#f6f7f9] border border-red-600 dark:bg-[#28282a] rounded-md flex justify-center items-center' title={`${headers.alerts} Assets with Alerts`}>{headers.alerts} Alerts</div>
                </div>
            </div>



            <div className={`   min-h-screen`}> {/* Theme-based background and text color */}
                <div className="overflow-x-auto p-4 ">
                    <table className="min-w-full border border-gray-300 dark:bg-[#1b1b1d] dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Assets</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Date & Time</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">POI</th>

                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Curent Location</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center whitespace-nowrap">GPS Info</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Dashboard</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Telemetry</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Status</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">Caution</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {Data.map((item, index) => (
                                <React.Fragment key={index}>
                                    {/* Main Row */}
                                    <tr
                                        className="hover:bg-gray-200 dark:hover:bg-[#28282a] cursor-pointer"
                                        onClick={() => toggleRow(index)}
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.assetMake} {item.assetModel}<br />{item.assetRegNo}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{DateTimeFRMT(item.liveData.date, item.liveData.time)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center"><GeofenceChecker geofences={Geofences} trackerLat={item.liveData.latitude} trackerLng={item.liveData.longitude} /></td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center w-72"><AddressCell latitude={item.liveData.latitude} longitude={item.liveData.longitude} /></td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">
                                            <div className="flex space-x-1 justify-center">
                                                <a
                                                    href={`https://www.google.com/maps/search/${item.liveData.latitude},${item.liveData.longitude}`}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-[#16181d] rounded-full"
                                                    title="Directions"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <MdOutlineDirections className="size-6 cursor-pointer" />
                                                </a>
                                                <a
                                                    href='/map-tracking'
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-[#16181d] rounded-full"
                                                    title="Live Tracking"
                                                >
                                                    <GrMapLocation className="size-6 cursor-pointer" />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300  text-center">
                                            <div className='flex flex-col items-center space-y-3 text-md'>
                                                <h1><span className='font-bold'>{item.liveData.speed}</span> km\h</h1>
                                                <h1>
                                                    {item.liveData.gps_odometer.toString().padStart(7, '0').split('').map((digit, index) => (
                                                        <span
                                                            key={index}
                                                            className={`bg-gray-700 dark:bg-black p-1 text-white ${index === 6 ? 'bg-gray-800 dark:bg-gray-500' : ''}`}
                                                        >
                                                            {digit}
                                                        </span>
                                                    ))}

                                                </h1>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{"telemetry"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">
                                            {item.liveData.speed > "0" && item.liveData.digital_input_1_status === "1"
                                                ? "Moving"
                                                : item.liveData.speed === "0" && item.liveData.digital_input_1_status === "1"
                                                    ? "Engine Started"
                                                    : item.liveData.speed === "0" && item.liveData.digital_input_1_status === "0"
                                                        ? "Stopped"
                                                        : "Unknown"}
                                        </td>
                                        <AlertRow item={item.liveData.header} />
                                    </tr>
                                    {/* Collapsible Row */}
                                    {expandedRow === index && (
                                        <tr>
                                            <td colSpan="10" className="px-6 py-4 bg-gray-100 dark:bg-[#1b1b1d] text-gray-900 dark:text-gray-300">
                                                <div className="flex justify-between items-start">
                                                    {/* Information Section */}
                                                    <div className='space-y-7'>


                                                        <div className="flex space-x-16">
                                                            <div className="flex flex-col space-y-1">
                                                                <span className="text-sm ">Ignition</span>
                                                                <span className="text-md font-semibold">{item.liveData.digital_input_1_status === "1" ? 'ON' : 'OFF'}</span>
                                                            </div>
                                                            <div className="flex flex-col space-y-1" title={item.liveData.gsm_signal}>
                                                                <span className="text-sm ">GPS Signal</span>
                                                                <span className="text-md font-semibold" ><SignalStrengthIcon strength={item.liveData.gsm_signal} /></span>
                                                            </div>
                                                            <div className="flex flex-col space-y-1">
                                                                <span className="text-sm ">Internal Battery</span>
                                                                <span className="text-md font-semibold">{item.liveData.internal_battery_voltage}</span>
                                                            </div>
                                                            <div className="flex flex-col space-y-1">
                                                                <span className="text-sm ">External Battery</span>
                                                                <span className="text-md font-semibold">{item.liveData.external_battery_voltage}</span>
                                                            </div>

                                                            <div className="flex flex-col space-y-1">
                                                                <span className="text-sm ">Reports For Today</span>
                                                                <a className='text-blue-600 cursor-pointer' onClick={() => GetReportToday(item.liveData.device_id, item.assetMake, item.assetModel, item.assetRegNo)}>Generate Report ↗</a>
                                                            </div>

                                                            <div className="flex flex-col space-y-1">
                                                                <span className="text-sm ">Reports For Yesterday</span>
                                                                <a className='text-blue-600 cursor-pointer' onClick={() => GetReportYesterday(item.liveData.device_id, item.assetMake, item.assetModel, item.assetRegNo)}>Generate Report ↗</a>
                                                            </div>
                                                        </div>

                                                        <div className="flex space-x-10">
                                                            <div className="flex flex-col space-y-1 max-w-md">
                                                                <span className="text-sm ">Last Start Location</span>
                                                                <span className="text-md font-semibold">{item.path ? <AddressCell latitude={item.path?.start.latitude} longitude={item.path?.start.longitude} /> : "NIL"}</span>
                                                            </div>
                                                            <div className="flex flex-col space-y-1 max-w-md">
                                                                <h1 className="text-sm ">Last Stop Location</h1>
                                                                <h1 className="text-md font-semibold">{item.path ? <AddressCell latitude={item.path?.stop.latitude} longitude={item.path?.stop.longitude} /> : "NIL"}</h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Map Section */}
                                                    <div className="h-48 w-96 ml-8">
                                                        <MapView pin={'/assets/pin.png'} size={40} allowZoom latitude={item.liveData.latitude} longitude={item.liveData.longitude} />
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
            </div>
        </>
    )
}

export default CoreTracking