import Units from '../models/UnitsModel.js';
import User from '../models/userModel.js';
import IncidentModel from '../models/IncidentModel.js';
import AnalyticsModel from '../models/AnalyticsModel.js';
import ReportPath from '../models/ReportPathModel.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  host: 'smtp.gmail.com',
port: 465,
secure: true,
  auth: {
    user: 'noreply.trak24.in@gmail.com', 
    pass: 'gtly iari dxxm dnue' 
  }
});

export const getUserUnits = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from request parameters

    // Fetch units and their latest report's path along with liveData and other fields
    const units = await Units.find({ customer: id })
      .select('_id imei simNumber simAttached customer assetRegNo assetType assetMake assetModel gprsPort liveData shipment model status remarks stockListed')
      .populate({
        path: 'reports',
        options: { sort: { startDate: -1 }, limit: 1 },
        select: 'path'
      });

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Extract and return liveData, all unit fields, and path from the latest report for each unit
    const result = units.map(unit => {
      const latestReport = unit.reports && unit.reports.length > 0 ? unit.reports[0] : null;
      return {
        _id: unit._id,
        imei: unit.imei,
        simNumber: unit.simNumber,
        simAttached: unit.simAttached,
        customer: unit.customer,
        assetRegNo: unit.assetRegNo,
        assetType: unit.assetType,
        assetMake: unit.assetMake,
        assetModel: unit.assetModel,
        gprsPort: unit.gprsPort,
        liveData: unit.liveData,
        shipment: unit.shipment,
        model: unit.model,
        status: unit.status,
        remarks: unit.remarks,
        stockListed: unit.stockListed,
        path: latestReport ? latestReport.path : null
      };
    });

    res.status(200).json({
      units: result,
      geofences: user.geoFences,
      userData: {
        firstname: user.firstname,
        company: user.company
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getLiveData = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Units.findById(id, 'liveData');

    if (!data) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getReportUnitData = async (req, res) => {
  try {
    const { imei } = req.params;
    const unit = await Units.findOne({ imei });

    if (!unit) {
      return res.status(404).json({ success: false, message: 'Unit not found' });
    }

    res.status(200).json({
      make: unit.assetMake || 'Unknown',
      model: unit.assetModel || 'Unknown',
      regNo: unit.assetRegNo || 'Unknown',
    });
  } catch (error) {
    console.error('Error fetching unit details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const parseDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`); // Set time to midnight in UTC
  return isNaN(date) ? null : date;
};


export const getReportsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, imei } = req.query;

    // Parse the start and end dates
    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || !end) {
      return res.status(400).json({ success: false, message: 'Invalid date format. Use DD-MM-YYYY.' });
    }

    console.log(start, end);

    const results = await Units.find({
      imei: imei,
      "reports.startDate": { $exists: true }
    });

    if (!results.length) {
      return res.status(404).json({ success: false, message: 'No reports found.' });
    }

    // Filter reports array within the date range
    const filteredReports = results.map(doc => ({
      ...doc.toObject(),
      reports: doc.reports.filter(report =>
          report.startDate >= start && report.startDate <= end
      ),
  }));

  console.log(filteredReports);
  

    res.status(200).json({ success: true, reports: filteredReports });
  } catch (error) {
    console.error("Error fetching reports:", error.message);
    res.status(500).json({ success: false, message: 'Could not fetch reports. Ensure the inputs are correct.' });
  }
};

export const getHistoryByTravelId = async (req, res) => {
  try {
    const { travelid } = req.params;
    
    // Find the report by travelid
    const report = await ReportPath.findOne({ travelid });
    
    if (!report) {
      return res.status(404).json({ message: "No history found for this travel ID." });
    }
    
    res.status(200).json(report.history);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const GetReportUnitData =  async (imei) => {
  try {
    // Find the unit by IMEI
    const unit = await Units.findOne({ imei });

    // If no unit is found, return null
    if (!unit) {
        return null;
    }

    // Return the required fields
    return {
        make: unit.assetMake || "Unknown",
        model: unit.assetModel || "Unknown",
        regNo: unit.assetRegNo || "Unknown"
    };
} catch (error) {
    console.error("Error fetching unit details:", error);
    throw new Error("Internal server error");
}
};

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

export const GenerateAppReport = async (req, res) => {
  try {
    const currentDate = new Date(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    console.log(new Date().toISOString());
    
    const { start, end, imei, company, firstname, directDown, emailSend, emailAddresses } = req.body;
    console.log("report gen data", start, end, imei, company, firstname, directDown, emailSend, emailAddresses);

    const unitData = await GetReportUnitData(imei);
    if (!unitData) {
        return res.status(400).json({ error: "Unit data not found" });
    }

    const serializedArray = encodeURIComponent(JSON.stringify({
        start,
        ts: new Date().toISOString(),
        end,
        imei,
        company,
        make: unitData.make,
        model: unitData.model,
        regNo: unitData.regNo,
        firstname,
        genDate: formatDateTime(currentDate),
        range: `${formatDateTime(new Date(start))} to ${formatDateTime(new Date(end))}`
    }));

    const path = `https://clientdashboard.trak24.in/media/reports?data=${serializedArray}`;

    

    if (emailSend===true && emailAddresses.length > 0) {
        console.log("email sending");
        
        for (const email of emailAddresses) {
           await sendReports(email, path);
        }
    }

    if (directDown) {
        res.status(200).json({ message: 'Report generated successfully', path });
   }else{
    res.status(200).json({ message: 'Report email sent successfully' });
   }

} catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
}
};

const sendReports = async (email, pdfPath) => {
  const mailOptions = {
      from: 'noreply.trak24@gmail.com',
      to: email,
      subject: 'Daily Trip Report',
      text: 'Attached is your daily trip report.',
       html: `<p>Attached is your daily trip report.</p><p>You can also download it here: <a href="${pdfPath}" target="_blank">Dounload as PDF</a></p>`
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
  } catch (error) {
      console.error("Email Sending Error:", error);
      throw new Error("Failed to send email");
  }
};