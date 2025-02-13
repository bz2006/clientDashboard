import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Units',
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    caseType: {
      type: String,
    },
    caseDesc: {
      type: Number,
    },
    details: {
      type: String,
    },
    priority: {
      type: String,
    },
    response: {
      type: String,
    },
    created: {
      type: String,
    },
    cuvisible: {
      type: Boolean,
      default:false
    },
    caseAssigned: {
      type: String,
    },
    datetime:{
      type:String
    },
    status: {
      type: String,
      default:"Active"
    },
    updates:[{
      status:{
        type:String
      },
      details:{
        type:String
      },
      datetime:{
        type:String
      },
      updatedBy:{
        type:String
      },
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Incidents", incidentSchema);
