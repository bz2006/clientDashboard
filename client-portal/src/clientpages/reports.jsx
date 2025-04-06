import React, { useContext, useEffect, useState } from "react";
import Header from "../Components/header";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

function Reports() {
    const [Data, setData] = useState([]);
    const [Asset, setAsset] = useState("");
    const [start, setstart] = useState("");
    const [end, setend] = useState("");
    const{decryptData}=useAuth()

  const GetData = async () => {
    try {
        console.log("Loading");
        //setIsLoading(true);
        const res = await axios.get(`/api-trkclt/get-units/${decryptData().id}`);
        if (res.status === 200) {
            setData(res.data.units);
        } else {
            console.log("Empty data received");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        // Ensure loading and refreshing states are reset
        //   setIsLoading(false);
        //   setIsRefreshing(false);
    }
};

function getAssetDetailsByIMEI() {
  
  const unit = Data.find(unit => unit.imei === Asset);
  
  if (unit) {
      return {
          assetRegNo: unit.assetRegNo,
          assetModel: unit.assetModel,
          assetMake: unit.assetMake
      };
  } else {
      return null; // IMEI not found
  }
}

useEffect(() => {
  GetData()
}, [])

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


// function GetReports() {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1.
//   const day = String(today.getDate()).padStart(2, '0');
//   const date = `${year}-${month}-${day}`;

//   const res=getAssetDetailsByIMEI()
//   const arrayData = {imei:Asset,start:start,end:end, company: decryptData().company,make:res.assetMake,model:res.assetModel,regNo:res.assetRegNo, firstname: decryptData().firstname,genDate:`${formatDateTime(today)}`, range: `${formatDateTime(new Date(start))} to ${formatDateTime(new Date(end))}` };
// console.log(arrayData);


//   const serializedArray = encodeURIComponent(JSON.stringify(arrayData));
//  window.open(`/reports-center/viewer?array=${serializedArray}`, '_blank');

// }
const triggerFileDownload = (url) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', ''); // Let the browser handle file name
  link.setAttribute('target', '_blank'); // Optional
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
const GetReports=async()=>{
try {
  const res = await axios.get(`/api-trkclt/generate-reports/${start}/${end}/${Asset}`);
        if (res.status === 200) {
          triggerFileDownload(res.data.downloadUrl);
            
        } else {
            console.log("Empty data received");
        }
} catch (error) {
  console.log(error.message);
  
}

}


  return (
    <>
  <Header />
  <div className="flex mt-10 flex-col items-center justify-center min-h-screen p-6">

    <div className="w-full max-w-md bg-white dark:bg-[#1b1b1d] rounded-2xl p-8 transition-all duration-300  shadow-[8px_8px_16px_0px_#d1d9e6,_-8px_-8px_16px_0px_#ffffff] 
    dark:shadow-[8px_8px_16px_0px_#151517,_-8px_-8px_16px_0px_#222224]">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-300 rounded-xl flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-1h3.5a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V8a1 1 0 00-1-1h-3.5V5a1 1 0 00-1-1H3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-purple-600 bg-clip-text text-transparent">
          Trip Reports
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center text-sm mt-2">
          Generate detailed reports by selecting your asset and date range
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-2">
            Select Asset
          </label>
          <div className="relative">
            <select
              value={Asset}
              onChange={(e) => setAsset(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-[#1b1b1d] border dark:border-gray-700 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 appearance-none transition-all duration-300"
            >
              <option value="">Select a Vehicle</option>
              {Array.isArray(Data) && Data.length > 0 ? (
                Data.map((unit, index) => (
                  <option key={index} value={unit.imei}>
                    {unit.assetMake} {unit.assetModel} - {unit.assetRegNo}
                  </option>
                ))
              ) : (
                <option value="" disabled>No vehicles found</option>
              )}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-2">
              From Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={start}
                onChange={(e) => setstart(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-[#1b1b1d] border dark:border-gray-700 border-gray-200  rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 ml-2">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={end}
                onChange={(e) => setend(e.target.value)}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-[#1b1b1d] border dark:border-gray-700 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-200 transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={GetReports}
          className="w-full px-6 py-4 bg-orange-600  text-white font-medium rounded-xl transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
        >
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
            </svg>
            Generate Report
          </div>
        </button>
      </div>
    </div>
  </div>
</>
  );
}

export default Reports;
