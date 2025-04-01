import axios from "axios";

const GetAddress = async (lat, lon) => {
  try {
    const lng=localStorage.getItem("lng");
    const adrs = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyBdtCj5H0N2_vLOHy4YuFKz_tc_NfPI5XI&language=${lng}`);

    return adrs.data.results[2].formatted_address;
  } catch (error) {
    console.log(error);
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
    const adrs = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyBdtCj5H0N2_vLOHy4YuFKz_tc_NfPI5XI&language=${lng}`);

    return adrs.data.results[2].formatted_address;
  } catch (error) {
    console.log(error);
    console.log("Adrerr");
    
  }
};

function removeLastWord(str) {
  let words = str.split(' ');
  words.pop();
  return words.join(' ');
}