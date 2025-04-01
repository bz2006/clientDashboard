import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Modal from '../../Components/Modal';
import { caseDescOptions } from '../../DataHelpers/caseOptions';
import { useAuth } from '../../contexts/AuthContext';
import LoadingOverlay from '../../Components/Loader';

function ChangeGeoLang({open, onClose}) {

    const[Language,setLanguage]=useState("")

  const Change=(e)=>{
    e.preventDefault();
    localStorage.setItem("lng",Language)
    onClose()
  }
    

    return (
        <>
        <Modal open={open} onClose={onClose} size={"xl"}>

            <div className="text-gray-900 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-6 mt-3 text-center">Change Geolocation Language</h2>
                <form  onSubmit={Change} className="flex flex-col gap-6">
                    <div className='w-full'>
                        <label
                            className="block text-md font-medium mb-2 text-gray-700 dark:text-gray-300"
                            htmlFor="lng"
                        >
                            Select Language
                        </label>
                        <select
                            id="lng"
                            value={Language}
                            onChange={(e)=>setLanguage(e.target.value)}
                            name="lng"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1b1b1d] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                            required
                        >
                            <option value={""}>Select a Language</option>
                            <option value={"en"}>English</option>
                            <option value={"ml"}>Malayalam</option>
                            <option value={"ta"}>Tamil</option>
                            <option value={"hi"}>Hindi</option>
                            <option value={"kn"}>Kannada</option>
                            <option value={"te"}>Telugu</option>
                        </select>
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
                            Change
                        </button>

                    </div>
                </form>
            </div>
        </Modal>
        </>
    )
}

export default ChangeGeoLang