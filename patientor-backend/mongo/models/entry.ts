import { HealthCheckRating } from "../../src/types";
import { Schema, model } from "mongoose";
import { Types } from "mongoose";
import {
  BaseEntrySchema,
  HealthCheckEntrySchema,
  HospitalEntrySchema,
  OccupationalHealthcareEntrySchema,
} from "../../src/utils/newEntry";
import { z } from "zod";

type BaseEntryType = z.infer<typeof BaseEntrySchema>;
type HealthCheckEntryType = z.infer<typeof HealthCheckEntrySchema>;
type OccupationalHealthcareType = z.infer<
  typeof OccupationalHealthcareEntrySchema
>;
type HospitalEntryType = z.infer<typeof HospitalEntrySchema>;

const entrySchema = new Schema<BaseEntryType>(
  {
    date: {
      type: String,
      required: true,
    },
    specialist: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    diagnosisCodes: {
      type: [
        {
          type: String,
          required: true,
        },
      ],
    },
  },
  {
    discriminatorKey: "type",
  }
);

entrySchema.set("toJSON", {
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

export const EntryModel = model<BaseEntryType>("Entry", entrySchema);

export const HealthCheckModel = EntryModel.discriminator<
  BaseEntryType & HealthCheckEntryType
>(
  "HealthCheck",
  new Schema({
    healthCheckRating: {
      type: Number,
      enum: Object.values(HealthCheckRating).filter(
        (value) => typeof value === "number"
      ),
    },
  })
);

export const OccupationalHealthcareModel = EntryModel.discriminator<
  BaseEntryType & OccupationalHealthcareType
>(
  "OccupationalHealthcare",
  new Schema({
    employerName: {
      type: String,
    },
    sickLeave: {
      startDate: {
        type: String,
      },
      endDate: {
        type: String,
      },
    },
  })
);

export const HospitalModel = EntryModel.discriminator<
  BaseEntryType & HospitalEntryType
>(
  "Hospital",
  new Schema({
    discharge: {
      date: {
        required: true,
        type: String,
      },
      criteria: {
        required: true,
        type: String,
      },
    },
  })
);
