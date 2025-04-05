import { processReportData } from "./ReportPro.js";
import { generateTripReport } from "./reportTemplate.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// These two lines are necessary when using ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

export const BuildReport=async(data,unitData,start,end)=>{
    try {
        const currentDate = new Date(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
        console.log(currentDate);
        
        const Essentials = {
            company: unitData.company,
            make: unitData.make,
            model: unitData.model,
            regNo: unitData.regNo,
            range: `${formatDateTime(new Date(start))} to ${formatDateTime(new Date(end))}`,
            genDate: formatDateTime(currentDate),
            firstname: unitData.firstname
          };
          
        const res=await processReportData(data[0].reports)
        console.log(__dirname);
        const outputPath = path.join(__dirname, "trip-report.pdf"); // or any desired filename
        generateTripReport(res, Essentials, outputPath);
        return outputPath;
        
    } catch (error) {
        console.log(error);
        
    }
}