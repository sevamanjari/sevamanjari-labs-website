import mongoose, { Schema, Document } from "mongoose";

export interface IOfficial extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "official";
  createdAt: Date;
}

const OfficialSchema = new Schema<IOfficial>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "Company Official" },
    role: { type: String, enum: ["admin", "official"], default: "official" },
  },
  {
    timestamps: true,
  }
);

export const OfficialModel =
  mongoose.models.Official || mongoose.model<IOfficial>("Official", OfficialSchema);
