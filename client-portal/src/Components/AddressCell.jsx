import React, { useState, useEffect } from "react";
import axios from "axios";
import { UpdateCordAdress } from "../DataHelpers/getCordAddress";

const AddressCell = ({ latitude, longitude }) => {
  const [address, setAddress] = useState("Fetching address...");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const lng = localStorage.getItem("lng") || "en";
        const response = await axios.get(`/api-trkclt/get-address/${latitude}/${longitude}/${lng}`);
        console.log(response);
        
        setAddress(response.data.address); // Update state with the fetched address
      } catch (error) {
        setAddress("Unable to fetch address");
        console.error(error);
      }
    };

    fetchAddress();
  }, [latitude, longitude]); // Dependency array ensures the effect runs when latitude or longitude changes

  return <span>{address}</span>;
};

export default AddressCell;
