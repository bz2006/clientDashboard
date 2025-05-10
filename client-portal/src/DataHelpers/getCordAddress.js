import axios from "axios";

const GetAddress = async (lat, lon) => {
  try {
    const lng=localStorage.getItem("lng");
    const adrs = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyDs3BF4HE5kdu27oCgeZP3wlcR-c4euzNk&language=${lng}`);

    return adrs.data.results[2].formatted_address;
  } catch (error) {
  }
};

export async function UpdateCordAdress(lat, lon) {

  // Get address from latitude and longitude
  const address = await GetAddress(lat, lon);
  const updatedData = address
  return updatedData; // Return the updated array with the added addresses
};



export const GetReportAddress = async (lat, lon) => {
  try {
    const lng=localStorage.getItem("lng");
    const adrs = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyDs3BF4HE5kdu27oCgeZP3wlcR-c4euzNk&language=${lng}`);

    return adrs.data.results[2].formatted_address;
  } catch (error) {
    
  }
};

function removeLastWord(str) {
  let words = str.split(' ');
  words.pop();
  return words.join(' ');
}