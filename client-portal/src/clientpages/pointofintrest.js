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
            } else {
                console.log("Empty data received");
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
            <LoadingOverlay isLoading={loading}/>
            {isModalOpen === true ? (<CreatePOI open={isModalOpen} GetData={GetData} id={user} onClose={closeModal} />) : null}

            <div className=' mt-24 flex flex-row justify-between items-center h-full'>
                <div>
                    <h1 className='text-black dark:text-white font-semibold text-3xl p-6'>
                        Points of Intrest (Geofencing)
                    </h1>
                </div>

                <div className='flex flex-row justify-end space-x-4 m-4 p-3'>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className=" w-72 px-4 py-3 border border-gray-600 text-black dark:text-white font-medium rounded-lg dark:hover:bg-[#28282a] hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                        Add New Point
                    </button>
                    {/* <select
                        id="assetType"
                        name="assetType"
                        // value={selectedCustomer}
                        // onChange={handleChange}
                        className="w-full md:min-w-72 px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-600 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        required
                    >
                        <option value={""}>Select a Point</option>
                        {Data.map((unit) => (
                            <option value={unit._id}>{unit.assetMake}</option>
                        ))}
                    </select> */}
                </div>
            </div>

            <div className={`   min-h-screen`}> {/* Theme-based background and text color */}
                <div className="overflow-x-auto p-4 ">
                    <table className="min-w-full border border-gray-300 dark:bg-[#1b1b1d] dark:border-gray-700">
                        <thead>
                            <tr className="bg-gray-200 dark:bg-[#3b3b3b]">
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap">No</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Points</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Point Type</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Latitude & Longitude</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Radius</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">View</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Edit</th>
                                <th className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {Data.map((item, index) => (
                                <React.Fragment key={index}>
                                    {/* Main Row */}
                                    <tr
                                        className="hover:bg-gray-200 dark:hover:bg-[#28282a] cursor-pointer"
                                    >
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.pointType}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center"> <AddressCell latitude={item.latitude} longitude={item.longitude} /></td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center">{item.radius}m</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center underline">
                                            {upModalOpen && selectedItem === item ? (
                                                <UpdatePOI open={upModalOpen} poiData={item} GetData={GetData} id={user} onClose={upcloseModal} />
                                            ) : null}
                                            <a
                                                onClick={() => {
                                                    setupModalOpen(true); // Open the modal
                                                    setSelectedItem(item); // Pass the selected row data
                                                }}
                                            >
                                                View
                                            </a>
                                        </td><td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center underline">
                                            {upModalOpen && selectedItem === item ? (
                                                <UpdatePOI open={upModalOpen} poiData={item} GetData={GetData} id={user} onClose={upcloseModal} />
                                            ) : null}
                                            <a
                                                onClick={() => {
                                                    setupModalOpen(true); // Open the modal
                                                    setSelectedItem(item); // Pass the selected row data
                                                }}
                                            >
                                                Edit
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 text-center underline"><a
                                                onClick={() => DeleteGeofence(item._id)}
                                            >
                                                Delete
                                            </a></td>
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

export default PointIntrest