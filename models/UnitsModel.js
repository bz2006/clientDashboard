import mongoose from "mongoose";

const unitsSchema = new mongoose.Schema({
  imei: {
    type: String,
  },
  simNumber: {
    type: Number,
  },
  simAttached: {
    type: Boolean,
    default:false
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users'
  },
  assetRegNo: {
    type: String,
    default: "-- -- -- ----"
  },
  assetType: {
    type: String,
    default: "car"
  },
  assetMake: {
    type: String,
  },
  assetModel: {
    type: String,
  },
  gprsPort: {
    type: String,
  },
  liveData: {
    header: { type: String },
    device_id: { type: String },
    gps_validity: { type: String },
    date: { type: String },
    time: { type: String },
    latitude: { type: String },
    latitude_direction: { type: String },
    longitude: { type: String },
    longitude_direction: { type: String },
    speed: { type: String },
    gps_odometer: { type: String },
    direction: { type: String },
    num_satellites: { type: String },
    box_status: { type: String },
    gsm_signal: { type: String },
    main_battery_status: { type: String },
    digital_input_1_status: { type: String },
    digital_input_2_status: { type: String },
    digital_input_3_status: { type: String },
    analog_input_1: { type: String },
    reserved: { type: String },
    internal_battery_voltage: { type: String },
    firmware_version: { type: String },
    ccid_number: { type: String },
    external_battery_voltage: { type: String },
    rpm_value: { type: String },
  },
  shipment: {
    type: String,
  },
  model: {
    type: String,
  },
  status: {
    type: String,
  },
  remarks: {
    type: String,
  },
  stockListed: {
    type: Boolean,
    default:false
  },
  reports: [{
    travelid: {
      type: String
    },
    imei: {
      type: String
    },
    startDate: {
      type: Date
    },
    path:
    {
      start: {
        latitude: {
          type: Number,
        },
        latiD: {
          type: String,
        },
        longitude: {
          type: Number,
        },
        longiD: {
          type: String,
        },
      },
      stop: {
        latitude: {
          type: Number,
        },
        latiD: {
          type: String,
        },
        longitude: {
          type: Number,
        },
        longiD: {
          type: String,
        },
      },
    },
    history: [
      {
        latitude: {
          type: Number,
        },
        latiD: {
          type: String,
        },
        longitude: {
          type: Number,
        },
        longiD: {
          type: String,
        },
      }
    ],
    Distance: {
      startOdometer: {
        type: Number,
      },
      endOdometer: {
        type: Number,
      },
    },
    totalTime: {
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      },
      startDate: {
        type: String
      },
      stopDate: {
        type: String
      },
    },
    avgSpeed: {
      type: [Number],
      default: [],
    },

  }]
});

// Default export for the model
export default mongoose.model("Units", unitsSchema);
