import mongoose, { Schema, Document } from "mongoose";

export interface IJob extends Document {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  status: "active" | "paused" | "closed";
  description: string;
  requirements: string[];
  createdAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    department: { type: String, required: true },
    location: { type: String, default: "Remote" },
    type: { type: String, default: "Full-time" },
    experience: { type: String, default: "0 - 1 years" },
    status: {
      type: String,
      enum: ["active", "paused", "closed"],
      default: "active",
    },
    description: { type: String, default: "" },
    requirements: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

export const JobModel = mongoose.models.Job || mongoose.model<IJob>("Job", JobSchema);
