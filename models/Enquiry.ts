import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject?: string;
  message: string;
  status: "new" | "in_review" | "replied" | "archived";
  createdAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, default: "" },
    subject: { type: String, default: "" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "in_review", "replied", "archived"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

export const EnquiryModel =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);
