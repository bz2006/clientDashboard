import { UpdateCordAdress } from "./getCordAddress";

export async function InDataProcess(rawData) {


    function formatDate(dateString) {
        
        if (dateString?.length !== 6) {
            throw new Error("Invalid date format");
        }
        const day = dateString.slice(0, 2);
        const month = dateString.slice(2, 4);
        const year = "20" + dateString.slice(4, 6);
        return `${day}-${month}-${year}`;
    }

    function formatTime(timeString) {
        if (timeString?.length !== 6) {
            return "Invalid time format";
        }
        const hours = timeString.slice(0, 2);
        const minutes = timeString.slice(2, 4);
        const seconds = timeString.slice(4, 6);
        return `${hours}:${minutes}:${seconds}`;
    }

    const unifiedArray = [];
    const AllImeis = [];

    for (let i = 0; i < rawData.length; i++) {
        let data = rawData[i];

        const bufferData = String.fromCharCode(...data.liveb.data || "data");
        const fields = bufferData.split(',');

        const adrs = await UpdateCordAdress(fields[5], fields[7])

        const processedPacket = {
            "clientDevice": data.clientDevice,
            "vlNo": data.vlNo,
            "header": fields[0],
            "device_id": fields[1],
            "gps_validity": fields[2],
            "date": formatDate(fields[3]),
            "time": formatTime(fields[4]),
            "latitude": fields[5],
            "latitude_direction": fields[6],
            "longitude": fields[7],
            "longitude_direction": fields[8],
            "speed": fields[9],
            "gps_odometer": fields[10],
            "direction": fields[11],
            "num_satellites": fields[12],
            "box_status": fields[13],
            "gsm_signal": fields[14],
            "main_battery_status": fields[15],
            "digital_input_1_status": fields[16],
            "digital_input_2_status": fields[17],
            "digital_input_3_status": fields[18],
            "analog_input_1": fields[19],
            "reserved": fields[20],
            "internal_battery_voltage": fields[21],
            "firmware_version": fields[22],
            "ccid_number": fields[23],
            "external_battery_voltage": fields[24],
            "rpm_value": fields[25],
            "address": adrs // Replace with actual geocoding if needed
        };
        unifiedArray.push(processedPacket);
        AllImeis.push(fields[1]);
    }

    return { proData: unifiedArray, UserImeis: AllImeis }; // Return a single array containing all sub-arrays
}


export async function LiveDataProcess(rawData) {
    // Function to format date
    function formatDate(dateString) {
        if (dateString.length !== 6) {
            throw new Error("Invalid date format");
        }
        const day = dateString.slice(0, 2);
        const month = dateString.slice(2, 4);
        const year = "20" + dateString.slice(4, 6);
        return `${day}-${month}-${year}`;
    }

    // Function to format time
    function formatTime(timeString) {
        if (timeString.length !== 6) {
            return "Invalid time format";
        }
        const hours = timeString.slice(0, 2);
        const minutes = timeString.slice(2, 4);
        const seconds = timeString.slice(4, 6);
        return `${hours}:${minutes}:${seconds}`;
    }

    const unifiedArray = [];
    const AllImeis = [];
    let location = { latitude: 0, longitude: 0 }; // Initialize location

    // Iterate through rawData to process each entry
    for (let i = 0; i < rawData.length; i++) {
        let data = rawData[i];

        const bufferData = String.fromCharCode(...data.liveb.data || "data");
        const fields = bufferData.split(',');

        const adrs = await UpdateCordAdress(fields[5], fields[7]);

        const latitude = fields[5]; // Extract latitude
        const longitude = fields[7]; // Extract longitude

        // Update location state with latest latitude and longitude
        location = { latitude, longitude };

        const processedPacket = {
            "clientDevice": data.clientDevice,
            "vlNo": data.vlNo,
            "header": fields[0],
            "device_id": fields[1],
            "date": formatDate(fields[3]),
            "time": formatTime(fields[4]),
            "latitude": latitude,
            "latitude_direction": fields[6],
            "longitude": longitude,
            "longitude_direction": fields[8],
            "speed": fields[9],
            "gps_odometer": fields[10],
            "direction": fields[11],
            "digital_input_1_status": fields[16],
            "rpm_value": fields[25],
            "address": adrs // Replace with actual geocoding if needed
        };

        unifiedArray.push(processedPacket);
        AllImeis.push(fields[1]);
    }

    return { proData: unifiedArray, location:location }; // Return both unified data and location
}

