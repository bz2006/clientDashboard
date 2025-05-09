
import User from '../models/userModel.js';
import AdminRoles from '../models/AdminRoles.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AnalyticsModel from '../models/AnalyticsModel.js';

// Get GeoFences for a user
export const getGeoFences = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, geoFences: user.geoFences });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching geo fences' });
  }
};

// Add a new GeoFence
export const addGeoFence = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, pointType, latitude, longitude, radius } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.geoFences.push({ name, pointType, latitude, longitude, radius });
    await user.save();

    res.status(201).json({ success: true, message: 'Geo fence added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error adding geo fence' });
  }
};

export const updateGeoFence = async (req, res) => {
  try {
    const { userid, geofenceid } = req.params;
    const { name, pointType, latitude, longitude, radius } = req.body;

    // Find the user
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Find the geofence within the user's geoFences array
    const geofence = user.geoFences.id(geofenceid);
    if (!geofence) {
      return res.status(404).json({ success: false, message: 'Geofence not found' });
    }

    // Update geofence fields
    if (name !== undefined) geofence.name = name;
    if (pointType !== undefined) geofence.pointType = pointType;
    if (latitude !== undefined) geofence.latitude = latitude;
    if (longitude !== undefined) geofence.longitude = longitude;
    if (radius !== undefined) geofence.radius = radius;

    await user.save(); // Save the updated user document

    res.status(200).json({ success: true, message: 'Geofence updated successfully', geofence });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error updating geofence' });
  }
};


// Get live data of a unit


// Delete a GeoFence by ID
export const deleteGeofenceById = async (req, res) => {
  try {
    const { userid, geofenceid } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userid,
      { $pull: { geoFences: { _id: geofenceid } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'Geofence deleted successfully' });
  } catch (error) {
    console.error('Error deleting geofence:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const VerifyPassword = async (req, res) => {
  try {
    const { userid, password } = req.body;

    // Find user by username
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Password is correct" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Extract userId from request parameters

    if (!id) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const updatedUser = await User.findById(id);

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updatedUser.password = hashedPassword
    }
    await updatedUser.save();
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


export const AdmClientLogin = async (req, res) => {
  try {
    const { admid, clid } = req.body;


    // Check if admin exists
    const admin = await AdminRoles.findById(admid);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Check if client exists
    const client = await User.findOne({ _id: clid });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }


    // Generate JWT token
    const token = jwt.sign(
      { userId: client._id, admid: admin._id },
      'TR24-PWRD-STRE', // Replace with process.env.SECRET_KEY for security
      { expiresIn: '5m' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      data: {
        userId: client._id,
        firstname: client.firstname,
        company: client.company,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addDevice = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from request params
    const { fcmToken } = req.body; // Get fcmToken from request body

    if (!fcmToken) {
      return res.status(400).json({ message: "FCM token is required" });
    }

    // Find the user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the new device
    const newDevice = { fcmToken };
    user.devices.push(newDevice);
    await user.save();

    // Retrieve the newly added device (last item in the array)
    const addedDevice = user.devices[user.devices.length - 1];

    // Return only the newly added device with _id
    res.status(200).json({
      message: "Device added successfully",
      device: addedDevice, // Includes _id and fcmToken
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteDevice = async (req, res) => {
  const { id, fcmToken } = req.body;

  if (!id || !fcmToken) {
    return res.status(400).json({ message: "userId and token are required." });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const originalDeviceCount = user.devices.length;

    user.devices = user.devices.filter(device => device.fcmToken !== fcmToken);

    if (user.devices.length === originalDeviceCount) {
      return res.status(404).json({ message: "Device not found for given token." });
    }

    await user.save();

    return res.status(200).json({ message: "Device deleted successfully." });
  } catch (error) {
    console.error("Error deleting device:", error);
    return res.status(500).json({ message: "Server error." });
  }
};


export const updateSettings = async (req, res) => {
  try {
    const { id } = req.params;
    const { settings } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ message: "Invalid settings data" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.settings = { ...user.settings, ...settings };

    await user.save();

    res.status(200).json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getSettings = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id).select("settings"); // Fetch only the settings field

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ settings: user.settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const checkSpecificFcmToken = async (req, res) => {
  try {
    const { id } = req.params;
    const { fcmToken } = req.query; // Extract from query parameters

    if (!fcmToken) {
      return res.status(400).json({ found: false, message: "FCM token is required" });
    }

    // Find user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ found: false, message: "User not found" });
    }

    // Check if the provided FCM token exists in the user's devices array
    const tokenExists = user.devices.some(device => device.fcmToken === fcmToken);

    if (!tokenExists) {
      return res.status(200).json({ found: false, message: "FCM token not associated with this user" });
    }

    res.status(200).json({ found: true });
  } catch (error) {
    console.error("Error checking FCM token:", error);
    res.status(500).json({ found: false, message: "Internal server error" });
  }
};



// Get current month and year
const getCurrentMonthYear = () => {
  const now = new Date();
  return { month: now.toLocaleString('default', { month: 'long' }), year: now.getFullYear() };
};

// Update app usage count
export const updateAppUsage = async (req, res) => {
  try {
    const { month, year } = getCurrentMonthYear();

    const analytics = await AnalyticsModel.findOne();

    if (!analytics) {
      return res.status(404).json({ message: "Analytics document not found" });
    }

    // Find usage entry for the current month and year
    const usageEntry = analytics.usage.find((entry) => entry.month === month && entry.year === year);

    if (usageEntry) {
      usageEntry.appUsers += 1; // Increment app usage count
    } else {
      analytics.usage.push({ month, year, appUsers: 1, webUsers: 0 });
    }

    await analytics.save();
    res.status(200).json({ message: "App usage updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update web usage count
export const updateWebUsage = async (req, res) => {
  try {
    const { month, year } = getCurrentMonthYear();

    const analytics = await AnalyticsModel.findOne();

    if (!analytics) {
      return res.status(404).json({ message: "Analytics document not found" });
    }

    // Find usage entry for the current month and year
    const usageEntry = analytics.usage.find((entry) => entry.month === month && entry.year === year);

    if (usageEntry) {
      usageEntry.webUsers += 1; // Increment web usage count
    } else {
      analytics.usage.push({ month, year, appUsers: 0, webUsers: 1 });
    }

    await analytics.save();
    res.status(200).json({ message: "Web usage updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};



