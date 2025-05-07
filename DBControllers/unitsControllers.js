import Units from '../models/UnitsModel.js';
import User from '../models/userModel.js';
import IncidentModel from '../models/IncidentModel.js';
import AnalyticsModel from '../models/AnalyticsModel.js';
import ReportPath from '../models/ReportPathModel.js';
import nodemailer from 'nodemailer';
import { Transporter } from '../helpers/mailTransporter.js';
import { BuildReport } from '../helpers/reportGen.js';
import StaticMedia from '../models/StaticMediaModel.js';



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


    res.status(200).json({ success: true, reports: filteredReports });
  } catch (error) {
    console.error("Error fetching reports:", error.message);
    res.status(500).json({ success: false, message: 'Could not fetch reports. Ensure the inputs are correct.' });
  }
};

export const GetReports = async (startDate, endDate, imei) => {
  try {
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


    return filteredReports;
  } catch (error) {
    console.error("Error fetching reports:", error.message);
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

export const GetReportUnitData = async (imei) => {
  try {
    // Find the unit by IMEI
    const unit = await Units.findOne({ imei }).populate('customer', 'firstname company');

    if (!unit) {
      return null;
    }

    // Extract customer data if available
    const customer = unit.customer || {};

    return {
      make: unit.assetMake || "Unknown",
      model: unit.assetModel || "Unknown",
      regNo: unit.assetRegNo || "Unknown",
      firstname: customer.firstname || "Unknown",
      company: customer.company || "Unknown"
    };
  } catch (error) {
    console.error("Error fetching unit details:", error);
    throw new Error("Internal server error");
  }
};


export const GenerateAppReport = async (req, res) => {
  try {
    const currentDate = new Date(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    console.log(new Date().toISOString());

    const { startDate, endDate, imei, directDown, emailSend, emailAddresses } = req.body;
    if (!startDate || !endDate || !imei) {
      return res.status(400).json({ success: false, message: 'Missing required parameters.' });
    } else {
      const start = parseDate(startDate);
      const end = parseDate(endDate);

      if (!start || !end) {
        return res.status(400).json({ success: false, message: 'Invalid date format. Use DD-MM-YYYY.' });
      }

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
      const unitdata = await GetReportUnitData(imei)
      const path = await BuildReport(filteredReports, unitdata, startDate, endDate);
      console.log(path);
      const newMedia = new StaticMedia({
        file: path.fileName,
        time: new Date(),
      });
      await newMedia.save();

     const url=path.path

      if (emailSend === true && emailAddresses.length > 0) {
        console.log("email sending");
  
        for (const email of emailAddresses) {
          await sendReports(email, url);
        }
      }
  
      if (directDown) {
        res.status(200).json({ message: 'Report generated successfully', url });
      } else {
        res.status(200).json({ message: 'Report email sent successfully' });
      }
    }



   

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};



export const GenerateReport = async (req, res) => {
  try {
    const { startDate, endDate, imei } = req.params;
    if (!startDate || !endDate || !imei) {
      return res.status(400).json({ success: false, message: 'Missing required parameters.' });
    } else {
      const start = parseDate(startDate);
      const end = parseDate(endDate);

      if (!start || !end) {
        return res.status(400).json({ success: false, message: 'Invalid date format. Use DD-MM-YYYY.' });
      }

      const results = await Units.find({
        imei: imei,
        "reports.startDate": { $exists: true }
      });
console.log(results);

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
      if (!filteredReports) {
        return res.status(404).json({ success: false, message: 'No reports found.' });
      }
      const unitdata = await GetReportUnitData(imei)
      const path = await BuildReport(filteredReports, unitdata, startDate, endDate);
      console.log(path);
      const newMedia = new StaticMedia({
        file: path.fileName,
        time: new Date(),
      });
      await newMedia.save();

      res.status(200).json({
        success: true,
        downloadUrl:path.path, // return the full file URL
      });
    }


  } catch (error) {
    console.error("Error fetching reports:", error.message);
    res.status(500).json({ success: false, message: 'Could not generate reports. Ensure the inputs are correct.' });
  }
}




const sendReports = async (email, pdfPath) => {
  const layout = `
  <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Trip Report</title>
    <style>
        :root {
            color-scheme: light dark;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
            color: #333333;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            padding: 0 0 20px 0;
            background-color: #ffffff;
            border-radius: 0 0 12px 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        
        .logo-tab {
            width: 100%;
            background-color: #e0e0e0; /* Light gray color */
            padding: 20px 0;
            text-align: center;
            border-radius: 12px 12px 0 0;
        }
        
        .logo {
            max-width: 180px;
            height: auto;
        }
        
        .header {
            text-align: center;
            padding: 20px 20px;
            border-bottom: 1px solid #eeeeee;
        }
        
        .content {
            padding: 30px 20px;
            line-height: 1.6;
        }
        
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #3498db;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 20px;
            transition: background-color 0.3s ease;
        }
        
        .button:hover {
            background-color: #2980b9;
        }
        
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #777777;
            border-top: 1px solid #eeeeee;
        }
        
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #1a1a1a;
                color: #f5f5f5;
            }
            
            .email-container {
                background-color: #2d2d2d;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            
            .logo-tab {
                background-color: #3d3d3d; /* Darker gray for dark mode */
            }
            
            .header, .footer {
                border-color: #3d3d3d;
            }
            
            .footer {
                color: #aaaaaa;
            }
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                border-radius: 0;
            }
            
            .logo-tab {
                border-radius: 0;
            }
            
            .content {
                padding: 20px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="logo-tab">
            <img src="https://clientdashboard.trak24.in/assets/trak24comtr.png" alt="Trak24 Logo" class="logo">
        </div>
        
        <div class="header">
            <h2>Your Trip Report is Ready</h2>
        </div>
        
        <div class="content">
            <p>Hello,</p>
            <p>Your daily trip report has been processed and is ready for download. You can view all your travel details, routes, and analysis in this comprehensive report. The download link will be expired in 1 hour.</p>
            <p>Click the button below to Generate & download your report:</p>
            <a href="${pdfPath}" class="button">Generate & Download Trip Report</a>
        </div>
        
        <div class="footer">
            <p>© 2025 Trak24. All rights reserved.</p>
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
  `
  const mailOptions = {
    from: 'noreply.trak24@gmail.com',
    to: email,
    subject: 'Trip Report - Trak24',
    html: layout
  };

  try {
    await Transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Email Sending Error:", error);
    throw new Error("Failed to send email");
  }
};