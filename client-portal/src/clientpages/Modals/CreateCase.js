import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Modal from '../../Components/Modal';
import { caseDescOptions } from '../../DataHelpers/caseOptions';
import { useAuth } from '../../contexts/AuthContext';
import LoadingOverlay from '../../Components/Loader';


function CreateNewCase({ open, onClose,selected }) {
    const now = new Date();
        const[loading,setloading]=useState(false)
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    const currentDateTime = now.toLocaleString('en-US', options);
    const { decryptData } = useAuth()
    const [userUnits, setUserUnits] = useState([]);
    const [formData, setFormData] = useState({
        userid: decryptData().id,
        unit: "",
        caseType: selected,
        caseDesc: "",
        created: `${decryptData().firstname} (Client), on ${currentDateTime}`,
        details: "",
    });



    const CreateIncident = async (e) => {
e.preventDefault();
        try {

            const response = await axios.post('/api-trkclt/create-incident', formData);

            if (response.status === 201) {
//message.success("Incident created successfully")
                setFormData({
                    unit: "",
                    caseType: "",
                    caseDesc: "",
                    details: "",
                    priority: "",
                    response: "",
                    cuvisible: false,
                    caseAssigned: "",
                });
                onClose()
            }
        } catch (error) {
            console.error('Error saving shipment:', error.response?.data?.message || error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "caseType" && { caseDesc: "" }), // Reset caseDesc if caseType changes
        }));
    };

    const GetUserUnits = async () => {
        try {
            const res = await axios.get(`/api-trkclt/get-units/${formData.userid}`);
       
            if (res.status === 200) {
                setUserUnits(res.data.units);
            } else {
                console.log("Empty data received");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } 
    };

    useEffect(() => {
        GetUserUnits()
    }, [])


    return (
        <>
       <LoadingOverlay isLoading={loading}/>
        <Modal open={open} onClose={onClose} size={"xl"}>

            <div className="text-gray-900 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center">Create New Case</h2>
                <form onSubmit={CreateIncident} className="flex flex-col gap-6">
                    <div className='w-full'>
                        <label
                            className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                            htmlFor="unit"
                        >
                            Select Asset
                        </label>
                        <select
                            id="unit"
                            value={formData.unit}
                            onChange={handleChange}
                            name="unit"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            required
                        >
                            <option value={""}>Select a Unit</option>
                            {userUnits.map((unit,index) => (
                                            <option value={unit._id} key={index}>{unit.assetMake} {unit.assetModel} - {unit.assetRegNo}</option>
                                        ))}

                        </select>
                    </div>
                    <div className='flex space-x-5'>
                        <div className='w-full'>
                            <label
                                className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                htmlFor="caseType"
                            >
                                Case Type
                            </label>
                            <select
                                id="caseType"
                                value={formData.caseType}
                                onChange={handleChange}
                                name="caseType"
                                className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                required
                            >
                                <option value="">Select a Case Type</option>
                                <option value="Accounts">Accounts</option>
                                <option value="Device">Device</option>
                                <option value="GIS">GIS</option>
                                <option value="IT">IT</option>
                                <option value="Sales">Sales</option>
                                <option value="Support">Support</option>
                            </select>
                        </div>
                        <div className='w-full'>
                            <label
                                className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                                htmlFor="caseDesc"
                            >
                                Case Description
                            </label>
                            <select
                                        id="caseDesc"
                                        value={formData.caseDesc}
                                        onChange={handleChange}
                                        name="caseDesc"
                                        className="w-72 px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                        disabled={!formData.caseType} // Disable if no caseType selected
                                    >
                                        <option value="">Select a Case Description</option>
                                        {formData.caseType &&
                                            caseDescOptions[formData.caseType].map((option,index) => (
                                                <option key={index} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                    </select>
                        </div>
                    </div>

                    <div className='w-full'>
                        <label
                            className="block text-sm font-medium mb-2"
                            htmlFor="details"
                        >
                            Issue Details
                        </label>
                        <textarea
                            type="text"
                            name="details"
                            required
                            value={formData.details}
                            onChange={handleChange}
                            placeholder='Enter Issue Details'
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                    </div>


                    <div className="flex justify-between gap-4 mt-2">
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
        </Modal>
        </>
    )
}

export default CreateNewCase