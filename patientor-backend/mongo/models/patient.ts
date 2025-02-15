import { Gender, Patient } from "../../src/types";
import { Schema, model } from "mongoose";
import { Types } from "mongoose";

const patientSchema = new Schema<Patient>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  ssn: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: Object.values(Gender),
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  entries: {
    required: true,
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Entry",
      },
    ],
  },
});

patientSchema.set("toJSON", {
  transform: (
    _document,
    returnedObj: { _id?: Types.ObjectId; __v?: number; id?: string }
  ) => {
    if (returnedObj._id) {
      returnedObj.id = returnedObj._id.toString();
      delete returnedObj._id;
    }
    delete returnedObj.__v;
  },
});

const PatientModel = model<Patient>("Patient", patientSchema);

export default PatientModel;
