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


function GetReports() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1.
  const day = String(today.getDate()).padStart(2, '0');
  const date = `${year}-${month}-${day}`;

  const res=getAssetDetailsByIMEI()
  const arrayData = {imei:Asset,start:start,end:end, company: decryptData().company,make:res.assetMake,model:res.assetModel,regNo:res.assetRegNo, firstname: decryptData().firstname,genDate:`${formatDateTime(today)}`, range: `${formatDateTime(new Date(start))} to ${formatDateTime(new Date(end))}` };


  const serializedArray = encodeURIComponent(JSON.stringify(arrayData));
 window.open(`/reports-center/viewer?array=${serializedArray}`, '_blank');

}


  return (
    <>
      <Header />
      <div className="flex flex-col mt-10 items-center justify-center min-h-screen  p-6">
        <div className="dark:bg-[#2b3039]  shadow-lg rounded-2xl p-6 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Generate Trip Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            Generate reports by selecting the asset and date range!
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                Select Asset
              </label>
              <select
              value={Asset}
              onChange={(e)=>setAsset(e.target.value)}
               className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500">
              <option value="">Select a Unit</option>
                            {Array.isArray(Data) && Data.length > 0 ? (
                                Data.map((unit, index) => (
                                    <option key={index} value={unit.imei}>{unit.assetMake} {unit.assetModel} - {unit.assetRegNo}</option>
                                ))
                            ) : (
                                <option value="" disabled>No Units Found, Create One!</option>
                            )}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={start}
                onChange={(e)=>setstart(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={end}
                onChange={(e)=>setend(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#23272f] border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>

            <button
            onClick={GetReports}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition dark:bg-blue-500 dark:hover:bg-blue-600">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Reports;
