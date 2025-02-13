import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    mobile: {
      type: Number,
    },
    company: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contacts: [
      {
        name: {
          type: String,
        },
        comType: {
          type: String,
        },
        email: {
          type: String,
        },
        phNumber: {
          type: String,
        },
        notes: {
          type: String,
        },
        address: {
          type: String,
        },
        active: {
          type: Boolean,
          default: true
        },
      },
    ],
    address: {
      type: Object,
      street: {
        type: String,
      },
      district: {
        type: String,
      },
      state: {
        type: String,
      },
      pinCode: {
        type: String,
      },
      landline: {
        type: Number,
      },
    },

    salesPerson: {
      type: String,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    customerType: {
      type: String,
    },
    imeis: {
      type: [String],
      default: [],
    },
    permissions: {
      weblogin: {
        type: Boolean,
        default: false, // Default value for weblogin
      },
      applogin: {
        type: Boolean,
        default: false, // Default value for applogin
      },
      dailyAutoReports: {
        type: Boolean,
        default: false, // Default value for daily auto reports
      },
    },
    geoFences: [{
      name: {
        type: String,
      },
      pointType: {
        type: Number,
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
      radius: {
        type: Number,
      },
    }]
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
