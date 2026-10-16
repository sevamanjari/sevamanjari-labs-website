import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
  id: string;
  title: string;
  category: string;
  client: string;
  status: "Planning" | "In Development" | "Live" | "Completed";
  summary: string;
  tags: string[];
  link?: string;
  featured: boolean;
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, default: "General" },
    client: { type: String, default: "Internal" },
    status: {
      type: String,
      enum: ["Planning", "In Development", "Live", "Completed"],
      default: "In Development",
    },
    summary: { type: String, default: "" },
    tags: { type: [String], default: [] },
    link: { type: String, default: "" },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const ProjectModel =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
