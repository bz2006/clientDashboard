import Units from '../models/UnitsModel.js';
import User from '../models/userModel.js';
import IncidentModel from '../models/IncidentModel.js';
import AnalyticsModel from '../models/AnalyticsModel.js';
import ReportPath from '../models/ReportPathModel.js';

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