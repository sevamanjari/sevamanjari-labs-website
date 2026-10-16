import mongoose, { Schema, Document } from "mongoose";

export interface IJobApplication extends Document {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  coverNote: string;
  status: "new" | "in_review" | "shortlisted" | "rejected";
  createdAt: string;
}

const JobApplicationSchema = new Schema<IJobApplication>(
  {
    id: { type: String, required: true, unique: true },
    jobId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    department: { type: String, default: "Engineering" },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, default: "" },
    experience: { type: String, default: "" },
    portfolioUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    coverNote: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "in_review", "shortlisted", "rejected"],
      default: "new",
    },
    createdAt: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const JobApplicationModel =
  mongoose.models.JobApplication ||
  mongoose.model<IJobApplication>("JobApplication", JobApplicationSchema);
