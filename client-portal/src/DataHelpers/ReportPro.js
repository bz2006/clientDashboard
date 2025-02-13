import { GetReportAddress } from "./getCordAddress";

function calculateTimeDifference(startTime, endTime) {
    if (startTime, endTime) {
        const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
        const [endHours, endMinutes, endSeconds] = endTime.split(':').map(Number);

        // Convert times to total minutes
        const startTotalSeconds = startHours * 3600 + startMinutes * 60 + startSeconds;
        const endTotalSeconds = endHours * 3600 + endMinutes * 60 + endSeconds;

        // Calculate the difference in seconds
        let diffSeconds = endTotalSeconds - startTotalSeconds;

        if (diffSeconds < 0) {
            diffSeconds += 24 * 3600; // Add 24 hours if the end time is the next day
        }

        // Convert the difference back to hours and minutes
        const hours = Math.floor(diffSeconds / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);

        if (hours === 0) {
            return `${minutes} min`;
        }
        else {
            return `${hours}h ${minutes} min`;
        }
    }
}
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }); // Gets the month in short format
    const year = date.getFullYear();

    // Adding the 'th', 'st', 'nd', 'rd' suffix based on the day
    const suffix = (day === 1 || day === 21 || day === 31) ? 'st' :
        (day === 2 || day === 22) ? 'nd' :
            (day === 3 || day === 23) ? 'rd' : 'th';
    return `${day}${suffix} ${month} ${year}`;
}
export async function processReportData(reports) {
    // Create an array to hold the processed report data
    let result = [];

    // Map through the incoming reports and format the data for the table
    for (let index = 0; index < reports.length; index++) {
        const report = reports[index];

        // Convert start and stop time to the desired format
        const startDate = formatDate(report.totalTime.startDate);
        const stopDate = formatDate(report.totalTime.stopDate);

        // Calculate the duration (in hours and minutes)
        const duration = calculateTimeDifference(report.totalTime?.startTime, report.totalTime?.endTime);

        // Extract start and stop locations from the path
        const startLocation = await GetReportAddress(report.path.start.latitude, report.path.start.longitude);
        const stopLocation = await GetReportAddress(report.path.stop.latitude, report.path.stop.longitude);

        // Get start and stop KM values from the Distance field
        const startKm = report.Distance.startOdometer;
        const stopKm = report.Distance.endOdometer;

        let distance = Math.abs(stopKm - startKm);

        // Calculate total average speed and max speed
        const totalSpeed = report.avgSpeed?.reduce((sum, speed) => sum + speed, 0);
        const averageSpeed = Math.trunc(totalSpeed / report.avgSpeed?.length);
        const maxSpeed = Math.max(...(report.avgSpeed || []));
        const speedInfo = `Avg: ${averageSpeed} Km/h, Max: ${maxSpeed} Km/h`;

        // Push the formatted data into the result array
        result.push({
            slNo: index + 1,
            startTD: `${startDate}, ${report.totalTime?.startTime} `,  // You can adjust this format
            stopTD: `${stopDate}, ${report.totalTime?.endTime} `,   // You can adjust this format
            duration: duration,
            startLocation: startLocation,
            stopLocation: stopLocation,
            startKm: startKm,
            stopKm: stopKm,
            distance: distance,
            speedInfo: speedInfo,
        });
    }

    // Return the final array after processing all reports
    return result;
}
