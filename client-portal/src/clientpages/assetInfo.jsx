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

function AssetsInfo() {

    const [loading, setloading] = useState(false)
    const [OdomterView, setOdomterView] = useState(false)
    const [Data, setData] = useState([]);
    const [Geofences, setGeofences] = useState([]);
    const [Imeis, setImeis] = useState([]);
    let Userid = ""
    const navigate = useNavigate();


    useEffect(() => {
        const id = localStorage.getItem('user')
        Userid = id

        GetData()

    }, [])

    const GetData = async () => {
        try {
            setloading(true)
            const res = await axios.get(`/api-trkclt/get-units/${Userid}`);
            if (res.status === 200) {
                setData(res.data.units);
                hasOdometerTrue(res.data.units)
            }
            setloading(false)
        } catch (error) {
            console.error("Error fetching data:", error);
            setloading(false)
        }
    };

    const hasOdometerTrue = (unitData) => {
        const res = unitData.some(unit => unit.settings?.odometer === true);
        if (res) {
            setOdomterView(true);
        }
    };


    return (
        <>
            <LoadingOverlay isLoading={loading} />
            <Header />
            <div className="mt-24 flex flex-col md:flex-row justify-between items-center h-full">
                <div>
                    <h1 className="text-black dark:text-white font-semibold text-4xl p-6 mb-10">
                        Assets Information ({Data.length})
                    </h1>
                </div>
            </div>

            <div className="min-h-screen px-6">
                <div className="overflow-hidden rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                    <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">No</th>
                                    <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Assets</th>
                                    <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Vehicle Reg No</th>
                                    <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Service Started On</th>
                                    <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Speed Limit</th>
                                                                        <th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">GPS Info</th>
                                                                        {OdomterView === true ? (<th scope="col" className="px-6 py-4 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Odometer</th>) : (null)}
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-[#1b1b1d] divide-y divide-gray-200 dark:divide-gray-700">
                                {Data.map((item, index) => (
                                    <React.Fragment key={index}>
                                        {/* Main Row */}
                                        <tr className="hover:bg-gray-100 dark:hover:bg-[#28282a] cursor-pointer transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">
                                                {item.assetMake} {item.assetModel}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">
                                                {item.assetRegNo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">
                                                <GeofenceChecker geofences={Geofences} trackerLat={item.liveData.latitude} trackerLng={item.liveData.longitude} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">
                                                70 km/h
                                            </td>
                                            
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">
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
                                                        href="/map-tracking"
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-[#16181d] rounded-full"
                                                        title="Live Tracking"
                                                    >
                                                        <GrMapLocation className="size-6 cursor-pointer" />
                                                    </a>
                                                </div>
                                            </td>
                                            {item.settings?.odometer === true ? (

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">
                                                    <div className="flex flex-col items-center space-y-3 text-md">
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
                                            ) : (null)}
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AssetsInfo