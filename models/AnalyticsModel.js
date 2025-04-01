import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {

    totalClients: {
      type: Number,
    },
    totalUnits: {
      type: Number,
    },
    activeUnits: {
      type: Number,
    },
    incidents: {
      type: Number,
    },
    usage: [{
      month: {
        type: String,
      },
      year: {
        type: Number,
      },
      appUsers: {
        type: Number,
      },
      webUsers: {
        type: Number,
      },
    }],

    stockUnits: {
      type: Number,
    },
    totalRfids: {
      type: Number,
    },
    ActiveBeacons: {
      type: Number,
    },
    totalBeacons: {
      type: Number,
    },
    ActiveRfids: {
      type: Number,
    },
    expiredUnits: {
      type: Number,
    },
  },
);

export default mongoose.model("Analytics", analyticsSchema);
