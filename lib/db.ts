import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { connectToDatabase } from "./mongodb";
import { JobModel } from "@/models/Job";
import { ProjectModel } from "@/models/Project";
import { EnquiryModel } from "@/models/Enquiry";
import { SettingsModel } from "@/models/Settings";
import { JobApplicationModel } from "@/models/JobApplication";

export interface JobVacancy {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  status: "active" | "paused" | "closed";
  description: string;
  requirements: string[];
  createdAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  client: string;
  status: "Planning" | "In Development" | "Live" | "Completed";
  summary: string;
  tags: string[];
  link?: string;
  featured: boolean;
  createdAt: string;
}

export interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  subject?: string;
  message: string;
  status: "new" | "in_review" | "replied" | "archived";
  createdAt: string;
}

export interface JobApplicationItem {
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

export interface CompanySettings {
  companyName: string;
  cin: string;
  email: string;
  phone: string;
  address: string;
  announcement: string;
  isHiringActive: boolean;
}

export interface DatabaseSchema {
  jobs: JobVacancy[];
  projects: ProjectItem[];
  enquiries: EnquiryItem[];
  applications: JobApplicationItem[];
  settings: CompanySettings;
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

function getDefaultData(): DatabaseSchema {
  return {
    jobs: [],
    projects: [],
    enquiries: [],
    applications: [],
    settings: {
      companyName: "SevaManjari Labs Private Limited",
      cin: "U62011MP2026PTC086722",
      email: "info@sevamanjarilabs.in",
      phone: "+91 91039 63025",
      address:
        "C/O Ramesh Babulal, Balipur Manawar Rural, Manawar, Dhar – 454446, Madhya Pradesh, India",
      announcement: "",
      isHiringActive: true,
    },
  };
}

export function readLocalDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const dataDir = path.dirname(DB_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      const initial = getDefaultData();
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading database:", error);
    return getDefaultData();
  }
}

export function writeLocalDb(data: DatabaseSchema): boolean {
  try {
    const dataDir = path.dirname(DB_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
}

// ================= JOBS =================
export async function getAllJobs(): Promise<JobVacancy[]> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const docs = await JobModel.find().sort({ createdAt: -1 }).lean();
      return docs.map((d: any) => ({
        id: d.id,
        title: d.title,
        department: d.department,
        location: d.location,
        type: d.type,
        experience: d.experience,
        status: d.status,
        description: d.description,
        requirements: d.requirements || [],
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.error("MongoDB getAllJobs error, falling back to local JSON:", e);
    }
  }
  return readLocalDb().jobs || [];
}

export async function createJob(job: Omit<JobVacancy, "id" | "createdAt">): Promise<JobVacancy> {
  const newId = "job-" + Date.now();
  const createdAt = new Date().toISOString();
  const item: JobVacancy = { ...job, id: newId, createdAt };

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      await JobModel.create(item);
      return item;
    } catch (e) {
      console.error("MongoDB createJob error, saving locally:", e);
    }
  }

  const db = readLocalDb();
  db.jobs.unshift(item);
  writeLocalDb(db);
  return item;
}

export async function updateJob(id: string, updates: Partial<JobVacancy>): Promise<JobVacancy | null> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const updated = await JobModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
      if (updated) {
        return {
          id: (updated as any).id,
          title: (updated as any).title,
          department: (updated as any).department,
          location: (updated as any).location,
          type: (updated as any).type,
          experience: (updated as any).experience,
          status: (updated as any).status,
          description: (updated as any).description,
          requirements: (updated as any).requirements || [],
          createdAt: (updated as any).createdAt ? new Date((updated as any).createdAt).toISOString() : new Date().toISOString(),
        };
      }
    } catch (e) {
      console.error("MongoDB updateJob error:", e);
    }
  }

  const db = readLocalDb();
  const index = db.jobs.findIndex((j) => j.id === id);
  if (index === -1) return null;
  db.jobs[index] = { ...db.jobs[index], ...updates };
  writeLocalDb(db);
  return db.jobs[index];
}

export async function deleteJob(id: string): Promise<boolean> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const res = await JobModel.deleteOne({ id });
      return res.deletedCount > 0;
    } catch (e) {
      console.error("MongoDB deleteJob error:", e);
    }
  }

  const db = readLocalDb();
  const prevLen = db.jobs.length;
  db.jobs = db.jobs.filter((j) => j.id !== id);
  if (db.jobs.length !== prevLen) {
    writeLocalDb(db);
    return true;
  }
  return false;
}

// ================= PROJECTS =================
export async function getAllProjects(): Promise<ProjectItem[]> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const docs = await ProjectModel.find().sort({ createdAt: -1 }).lean();
      return docs.map((d: any) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        client: d.client,
        status: d.status,
        summary: d.summary,
        tags: d.tags || [],
        link: d.link || "",
        featured: Boolean(d.featured),
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.error("MongoDB getAllProjects error, falling back to local JSON:", e);
    }
  }
  return readLocalDb().projects || [];
}

export async function createProject(project: Omit<ProjectItem, "id" | "createdAt">): Promise<ProjectItem> {
  const newId = "proj-" + Date.now();
  const createdAt = new Date().toISOString();
  const item: ProjectItem = { ...project, id: newId, createdAt };

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      await ProjectModel.create(item);
      return item;
    } catch (e) {
      console.error("MongoDB createProject error:", e);
    }
  }

  const db = readLocalDb();
  db.projects.unshift(item);
  writeLocalDb(db);
  return item;
}

export async function updateProject(id: string, updates: Partial<ProjectItem>): Promise<ProjectItem | null> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const updated = await ProjectModel.findOneAndUpdate({ id }, { $set: updates }, { new: true }).lean();
      if (updated) {
        return {
          id: (updated as any).id,
          title: (updated as any).title,
          category: (updated as any).category,
          client: (updated as any).client,
          status: (updated as any).status,
          summary: (updated as any).summary,
          tags: (updated as any).tags || [],
          link: (updated as any).link || "",
          featured: Boolean((updated as any).featured),
          createdAt: (updated as any).createdAt ? new Date((updated as any).createdAt).toISOString() : new Date().toISOString(),
        };
      }
    } catch (e) {
      console.error("MongoDB updateProject error:", e);
    }
  }

  const db = readLocalDb();
  const index = db.projects.findIndex((p) => p.id === id);
  if (index === -1) return null;
  db.projects[index] = { ...db.projects[index], ...updates };
  writeLocalDb(db);
  return db.projects[index];
}

export async function deleteProject(id: string): Promise<boolean> {
  let mongoDeleted = false;
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const isObjectId = mongoose.isValidObjectId(id);
      const query = isObjectId ? { $or: [{ id }, { _id: id }] } : { id };
      const res = await ProjectModel.deleteOne(query);
      if (res.deletedCount && res.deletedCount > 0) {
        mongoDeleted = true;
      }
    } catch (e) {
      console.error("MongoDB deleteProject error:", e);
    }
  }

  const db = readLocalDb();
  const prevLen = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  const localDeleted = db.projects.length !== prevLen;
  if (localDeleted) {
    writeLocalDb(db);
  }
  return mongoDeleted || localDeleted;
}

// ================= ENQUIRIES =================
export async function getAllEnquiries(): Promise<EnquiryItem[]> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const docs = await EnquiryModel.find().sort({ createdAt: -1 }).lean();
      return docs.map((d: any) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        company: d.company,
        subject: d.subject,
        message: d.message,
        status: d.status,
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.error("MongoDB getAllEnquiries error:", e);
    }
  }
  return readLocalDb().enquiries || [];
}

export async function saveEnquiry(enquiry: Omit<EnquiryItem, "id" | "createdAt" | "status">): Promise<EnquiryItem> {
  const newId = "enq-" + Date.now();
  const createdAt = new Date().toISOString();
  const item: EnquiryItem = { ...enquiry, id: newId, status: "new", createdAt };

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      await EnquiryModel.create(item);
      return item;
    } catch (e) {
      console.error("MongoDB saveEnquiry error:", e);
    }
  }

  const db = readLocalDb();
  db.enquiries.unshift(item);
  writeLocalDb(db);
  return item;
}

export async function updateEnquiryStatus(id: string, status: EnquiryItem["status"]): Promise<boolean> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const res = await EnquiryModel.updateOne({ id }, { $set: { status } });
      return res.modifiedCount > 0;
    } catch (e) {
      console.error("MongoDB updateEnquiryStatus error:", e);
    }
  }

  const db = readLocalDb();
  const item = db.enquiries.find((e) => e.id === id);
  if (!item) return false;
  item.status = status;
  writeLocalDb(db);
  return true;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const res = await EnquiryModel.deleteOne({ id });
      return res.deletedCount > 0;
    } catch (e) {
      console.error("MongoDB deleteEnquiry error:", e);
    }
  }

  const db = readLocalDb();
  const prevLen = db.enquiries.length;
  db.enquiries = db.enquiries.filter((e) => e.id !== id);
  if (db.enquiries.length !== prevLen) {
    writeLocalDb(db);
    return true;
  }
  return false;
}

// ================= SETTINGS =================
export async function getSettings(): Promise<CompanySettings> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      let doc = await SettingsModel.findOne().lean();
      if (!doc) {
        const defaultSettings = getDefaultData().settings;
        await SettingsModel.create(defaultSettings);
        return defaultSettings;
      }
      return {
        companyName: (doc as any).companyName,
        cin: (doc as any).cin,
        email: (doc as any).email,
        phone: (doc as any).phone,
        address: (doc as any).address,
        announcement: (doc as any).announcement,
        isHiringActive: (doc as any).isHiringActive,
      };
    } catch (e) {
      console.error("MongoDB getSettings error:", e);
    }
  }
  return readLocalDb().settings;
}

export async function updateSettings(updates: Partial<CompanySettings>): Promise<CompanySettings> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const doc = await SettingsModel.findOneAndUpdate({}, { $set: updates }, { new: true, upsert: true }).lean();
      return {
        companyName: (doc as any).companyName,
        cin: (doc as any).cin,
        email: (doc as any).email,
        phone: (doc as any).phone,
        address: (doc as any).address,
        announcement: (doc as any).announcement,
        isHiringActive: (doc as any).isHiringActive,
      };
    } catch (e) {
      console.error("MongoDB updateSettings error:", e);
    }
  }

  const db = readLocalDb();
  db.settings = { ...db.settings, ...updates };
  writeLocalDb(db);
  return db.settings;
}

export async function getJobById(id: string): Promise<JobVacancy | null> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const doc = await JobModel.findOne({ id }).lean();
      if (doc) {
        return {
          id: (doc as any).id,
          title: (doc as any).title,
          department: (doc as any).department,
          location: (doc as any).location,
          type: (doc as any).type,
          experience: (doc as any).experience,
          status: (doc as any).status,
          description: (doc as any).description,
          requirements: (doc as any).requirements || [],
          createdAt: (doc as any).createdAt ? new Date((doc as any).createdAt).toISOString() : new Date().toISOString(),
        };
      }
    } catch (e) {
      console.error("MongoDB getJobById error:", e);
    }
  }
  const db = readLocalDb();
  return db.jobs.find((j) => j.id === id) || null;
}

// ================= JOB APPLICATIONS =================
export async function getAllJobApplications(): Promise<JobApplicationItem[]> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const docs = await JobApplicationModel.find().sort({ createdAt: -1 }).lean();
      return docs.map((d: any) => ({
        id: d.id,
        jobId: d.jobId,
        jobTitle: d.jobTitle,
        department: d.department || "Engineering",
        name: d.name,
        email: d.email,
        phone: d.phone,
        location: d.location || "",
        experience: d.experience || "",
        portfolioUrl: d.portfolioUrl || "",
        resumeUrl: d.resumeUrl || "",
        coverNote: d.coverNote,
        status: d.status || "new",
        createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : new Date().toISOString(),
      }));
    } catch (e) {
      console.error("MongoDB getAllJobApplications error:", e);
    }
  }
  const db = readLocalDb();
  return db.applications || [];
}

export async function saveJobApplication(
  application: Omit<JobApplicationItem, "id" | "createdAt" | "status">
): Promise<JobApplicationItem> {
  const newId = "app-" + Date.now();
  const createdAt = new Date().toISOString();
  const item: JobApplicationItem = { ...application, id: newId, status: "new", createdAt };

  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      await JobApplicationModel.create(item);
      return item;
    } catch (e) {
      console.error("MongoDB saveJobApplication error:", e);
    }
  }

  const db = readLocalDb();
  if (!db.applications) db.applications = [];
  db.applications.unshift(item);
  writeLocalDb(db);
  return item;
}

export async function updateJobApplicationStatus(
  id: string,
  status: JobApplicationItem["status"]
): Promise<boolean> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const res = await JobApplicationModel.updateOne({ id }, { $set: { status } });
      return res.modifiedCount > 0;
    } catch (e) {
      console.error("MongoDB updateJobApplicationStatus error:", e);
    }
  }

  const db = readLocalDb();
  if (!db.applications) db.applications = [];
  const item = db.applications.find((a) => a.id === id);
  if (!item) return false;
  item.status = status;
  writeLocalDb(db);
  return true;
}

export async function deleteJobApplication(id: string): Promise<boolean> {
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const res = await JobApplicationModel.deleteOne({ id });
      return res.deletedCount > 0;
    } catch (e) {
      console.error("MongoDB deleteJobApplication error:", e);
    }
  }

  const db = readLocalDb();
  if (!db.applications) db.applications = [];
  const initialLen = db.applications.length;
  db.applications = db.applications.filter((a) => a.id !== id);
  if (db.applications.length !== initialLen) {
    writeLocalDb(db);
    return true;
  }
  return false;
}

