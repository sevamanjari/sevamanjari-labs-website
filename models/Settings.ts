import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  companyName: string;
  cin: string;
  email: string;
  phone: string;
  address: string;
  announcement: string;
  isHiringActive: boolean;
}

const SettingsSchema = new Schema<ISettings>(
  {
    companyName: {
      type: String,
      default: "SevaManjari Labs Private Limited",
    },
    cin: { type: String, default: "U62011MP2026PTC086722" },
    email: { type: String, default: "info@sevamanjarilabs.in" },
    phone: { type: String, default: "+91 91039 63025" },
    address: {
      type: String,
      default:
        "C/O Ramesh Babulal, Balipur Manawar Rural, Manawar, Dhar – 454446, Madhya Pradesh, India",
    },
    announcement: { type: String, default: "" },
    isHiringActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const SettingsModel =
  mongoose.models.Settings ||
  mongoose.model<ISettings>("Settings", SettingsSchema);
