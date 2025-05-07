import { Transporter } from "../helpers/mailTransporter.js";
import ReportPath from "../models/ReportPathModel.js";
import StaticMedia from "../models/StaticMediaModel.js";
import UnitsModel from "../models/UnitsModel.js";
import userModel from "../models/userModel.js";
import fs from 'fs';
import path from 'path';

export const deleteShortTrips = async () => {
    try {
        const documents = await UnitsModel.find();

        await Promise.all(documents.map(async (doc) => {
            // Filter reports where distance traveled is <= 1 km
            const reportsToDelete = doc.reports.filter(report => {
                const distanceTraveled = report.Distance?.endOdometer - report.Distance?.startOdometer;
                return distanceTraveled <= 1;
            });

            if (reportsToDelete.length > 0) {
                const travelIdsToDelete = reportsToDelete.map(report => report.travelid);

                // Run delete and update in parallel
                await Promise.all([
                    ReportPath.deleteMany({ travelid: { $in: travelIdsToDelete } }), // Delete paths
                    UnitsModel.updateOne(
                        { _id: doc._id },
                        { $pull: { reports: { travelid: { $in: travelIdsToDelete } } } }
                    ) // Update reports
                ]);
            }
        }));
    } catch (error) {
    }
};

export const getExpiredUnitsDetails = async () => {
    try {
      const currentDate = new Date();
  
      // Find all expired units
      const expiredUnits = await UnitsModel.find({ expiry: { $lt: currentDate } }).populate('customer');
  
      if (!expiredUnits.length) {
        return [];
      }
  
      // Map through expired units to get required details
      const expiredDetails = await Promise.all(expiredUnits.map(async (unit) => {
        const customer = await userModel.findById(unit.customer._id).populate('contacts');
  
        // Check if contacts exist and filter active contacts
        if (!customer.contacts || !customer.contacts.length) {
          return null; // Skip to next unit if no contacts found
        }
  
        const activeContacts = customer.contacts.filter(contact => contact.active);
        if (!activeContacts.length) {
          return null; // Skip if no active contacts
        }
  
        const emails = activeContacts.map(contact => contact.email);
        await Promise.all(emails.map(email => ExpiredMail(email, `${unit.assetMake} ${unit.assetModel} - ${unit.assetRegNo}`)));
        // return {
        //   assetModel: unit.assetModel,
        //   assetMake: unit.assetMake,
        //   assetRegNo: unit.assetRegNo,
        //   emails: emails
        // };
      }));
  
      // Filter out null values where no contacts were found
      return expiredDetails.filter(detail => detail !== null);
  
    } catch (error) {
      console.error("Error fetching expired unit details:", error);
      throw error;
    }
  };



const UPLOAD_DIR = '/var/www/static-media/uploads';

export const deleteExpiredStaticMedia = async () => {
const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
 // const oneHourAgo = new Date(Date.now() - 5 * 60 * 1000);//5min
  try {
    // Find records older than 1 hour
    const expiredMedia = await StaticMedia.find({ time: { $lt: oneHourAgo } });

    for (const media of expiredMedia) {
      const filePath = path.join(UPLOAD_DIR, media.file);

      // Delete file if exists
      fs.unlink(filePath, (err) => {
        if (err && err.code !== 'ENOENT') {
          console.error(`Error deleting file ${filePath}:`, err);
        } else {
          console.log(`Deleted file: ${filePath}`);
        }
      });

      // Delete DB record
      await StaticMedia.deleteOne({ _id: media._id });
      console.log(`Deleted DB record: ${media._id}`);
    }
  } catch (error) {
    console.error('Error during media cleanup:', error);
  }
};



const ExpiredMail = async (email, assetInfo) => {
  const layout=`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Expired</title>
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
        
        .header h2 {
            color: #e74c3c; /* Red color for alert */
            margin: 0;
        }
        
        .content {
            padding: 30px 20px;
            line-height: 1.6;
        }
        
        .asset-info {
            font-weight: bold;
            color: #333333;
        }
        
        .warning-text {
            margin-top: 15px;
        }
        
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #e74c3c;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 25px;
            transition: background-color 0.3s ease;
        }
        
        .button:hover {
            background-color: #c0392b;
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
            
            .header h2 {
                color: #ff6b6b;
            }
            
            .asset-info {
                color: #f5f5f5;
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
            <h2>Subscription Expired!</h2>
        </div>
        
        <div class="content">
            <p>Subscription for the asset <span class="asset-info">${assetInfo}</span> has been expired.</p>
            
            <p class="warning-text">Please renew the subscription to retain the tracking services without disruption.</p>
            
            <a href="#" class="button">Renew Subscription</a>
        </div>
        
        <div class="footer">
            <p>© 2025 Trak24.com, All rights reserved.</p>
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
  `
  const mailOptions = {
      from: 'noreply.trak24@gmail.com',
      to: email,
      subject: 'Subscription Expired — Renew to Avoid Service Disruption',
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