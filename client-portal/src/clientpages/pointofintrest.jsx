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
import CreatePOI from './Modals/CreatePOI';
import UpdatePOI from './Modals/UpdatePOI';
import LoadingOverlay from '../Components/Loader';
function PointIntrest() {

    const [Data, setData] = useState([]);
    const [Imeis, setImeis] = useState([]);
    let Userid = ""
    const [expandedRow, setExpandedRow] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState("");
        const[loading,setloading]=useState(false)
    const [upModalOpen, setupModalOpen] = useState("");
    const [user, setUser] = useState("");
    const navigate = useNavigate();

    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };
    const closeModal = () => setIsModalOpen(false);
    const upcloseModal = () => setupModalOpen(false);
    useEffect(() => {
        const id = localStorage.getItem('user')
        Userid = id
        setUser(Userid);
        GetData()
    }, [])




    const GetData = async () => {
        try {
            setloading(true);

            const res = await axios.get(`/api-trkclt/get-geofence/${Userid?Userid:user}`);
            if (res.status === 200) {
                setData(res.data.geoFences);
            }
            setloading(false)
        } catch (error) {
            console.error("Error fetching data:", error);
            setloading(false)
        }
    };

    const DeleteGeofence = async (geofenceid) => {
        
        try {
            setloading(true);

            const res = await axios.delete(`/api-trkclt/delete-geofence/${Userid?Userid:user}/${geofenceid}`);
            if (res.status === 200) {
                GetData()
            }
            setloading(false)
        } catch (error) {
            console.error("Error fetching data:", error);
            setloading(false)
        }
    };

    return (
        <>
        <Header />
        <LoadingOverlay isLoading={loading} />
        {isModalOpen === true ? (
            <CreatePOI open={isModalOpen} GetData={GetData} id={user} onClose={closeModal} />
        ) : null}
    
        <div className="mt-24 flex flex-col md:flex-row justify-between items-center h-full">
            <div>
                <h1 className="text-black dark:text-white font-semibold text-4xl p-6 mb-10">
                    Points of Interest (Geofencing)
                </h1>
            </div>
    
            <div className="flex flex-row justify-end m-4 p-3 mb-10">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-72 px-4 py-3 border border-gray-600 text-black dark:text-white font-medium rounded-lg dark:hover:bg-[#28282a] hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                    Add New Point
                </button>
            </div>
        </div>
    
        <div className="min-h-screen px-6">
            <div className="overflow-hidden rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">No</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Points</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Point Type</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Latitude & Longitude</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Radius</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">View</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Edit</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-[#1b1b1d] divide-y divide-gray-200 dark:divide-gray-700">
                            {Data.map((item, index) => (
                                <React.Fragment key={index}>
                                    {/* Main Row */}
                                    <tr className="hover:bg-gray-100 dark:hover:bg-[#28282a] cursor-pointer transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-300">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.pointType}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                            <AddressCell latitude={item.latitude} longitude={item.longitude} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.radius}m</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center underline">
                                            {upModalOpen && selectedItem === item ? (
                                                <UpdatePOI open={upModalOpen} poiData={item} GetData={GetData} id={user} onClose={upcloseModal} />
                                            ) : null}
                                            <a
                                                onClick={() => {
                                                    setupModalOpen(true); // Open the modal
                                                    setSelectedItem(item); // Pass the selected row data
                                                }}
                                                className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400"
                                            >
                                                View
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center underline">
                                            <a
                                                onClick={() => {
                                                    setupModalOpen(true); // Open the modal
                                                    setSelectedItem(item); // Pass the selected row data
                                                }}
                                                className="text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400"
                                            >
                                                Edit
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center underline">
                                            <a
                                                onClick={() => DeleteGeofence(item._id)}
                                                className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                            >
                                                Delete
                                            </a>
                                        </td>
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

export default PointIntrest