import React, { useState, useEffect } from "react";
import axios from "axios";
import { UpdateCordAdress } from "../DataHelpers/getCordAddress";

const AddressCell = ({ latitude, longitude }) => {
  const [address, setAddress] = useState("Fetching address...");

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await UpdateCordAdress(latitude, longitude)
        setAddress(response); // Update state with the fetched address
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
