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
            } else {
                console.log("Empty data received");
            }
            setloading(false)
        } catch (error) {
            console.error("Error fetching data:", error);
            setloading(false)
        }
    };


    console.log(Data);

    return (
        <>
            <LoadingOverlay isLoading={loading} />
            <Header />
            <div className=' mt-24 flex flex-row justify-between items-center h-full'>
                <div>
                    <h1 className='text-black dark:text-white font-semibold text-3xl p-6'>
                        Assets Informations ({Data.length})
                    </h1>
                </div>
            </div>



            <div className={`   min-h-screen`}> {/* Theme-based background and text color */}
                <div className="overflow-x-auto p-4 ">
                    <table className="min-w-full border border-gray-300 dark:bg-[#16181d] dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#343a46]">
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Assets</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Vehicle Reg No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Service Started On</th>

                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Speed Limit</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">Odometer</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">GPS Info</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {Data.map((item, index) => (
                                <React.Fragment key={index}>
                                    {/* Main Row */}
                                    <tr
                                        className="hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer"
                                  
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.assetMake} {item.assetModel}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.assetRegNo}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center"><GeofenceChecker geofences={Geofences} trackerLat={item.liveData.latitude} trackerLng={item.liveData.longitude} /></td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center w-72">70 km/h</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">
                                            <div className='flex flex-col items-center space-y-3 text-md'>
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
                                    </tr>

                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default AssetsInfo