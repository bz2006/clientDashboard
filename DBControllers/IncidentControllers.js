import Units from '../models/UnitsModel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import IncidentModel from '../models/IncidentModel.js';
import AnalyticsModel from '../models/AnalyticsModel.js';


export const createIncident = async (req, res) => {
  try {
    const { unit, userid, caseType, caseDesc, details, created } = req.body;

    const newIncident = new IncidentModel({
      unit,
      userid,
      caseType,
      caseDesc: parseInt(caseDesc),
      details,
      created,
    });

    await newIncident.save();

    let analytics = await AnalyticsModel.findOne();
    if (analytics) {
      analytics.incidents = (analytics.incidents || 0) + 1;
      await analytics.save();
    }

    res.status(201).json({ success: true, message: 'Incident added successfully' });
  } catch (error) {
    console.error(`Error creating incident: ${error.message}`);
    res.status(500).json({ success: false, message: `Error creating incident: ${error.message}` });
  }
};
