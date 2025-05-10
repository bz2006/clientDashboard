import React, { useState, useEffect } from "react";
import axios from "axios";

const AddressCell = ({ latitude, longitude, maxLength = 70 }) => {
  const [address, setAddress] = useState("Fetching address...");
  const [isExpanded, setIsExpanded] = useState(false);

  const needsTruncation = address.length > maxLength;
  
  // Create truncated version if needed
  const truncatedText = needsTruncation 
    ? address.substring(0, maxLength) + '...' 
    : address;
  
  // Toggle expanded state
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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

  return <span
        className={`text-sm text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-200 ${needsTruncation ? 'cursor-pointer' : ''}`}
        onClick={needsTruncation ? toggleExpand : undefined}
      >
        {isExpanded ? address : truncatedText}
      </span>;
};

export default AddressCell;
