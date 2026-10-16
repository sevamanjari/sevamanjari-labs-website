"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  Clock,
  Search,
  ArrowUpRight,
  Globe,
  RefreshCw,
  X,
  Mail,
  Phone,
  Building,
  Menu,
  MapPin,
  Copy,
  Check,
  LogOut,
  ShieldCheck,
  KeyRound,
  UserPlus,
  Users,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  FileCheck,
  FileText,
} from "lucide-react";
import type { JobVacancy, ProjectItem, EnquiryItem, CompanySettings, JobApplicationItem } from "@/lib/db";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<
    "overview" | "jobs" | "applications" | "projects" | "enquiries" | "security" | "settings"
  >("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data States
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [applications, setApplications] = useState<JobApplicationItem[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<JobApplicationItem | null>(null);
  const [applicationSearch, setApplicationSearch] = useState("");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [officials, setOfficials] = useState<{ id: string; email: string; name: string; role: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [currentOfficial, setCurrentOfficial] = useState<{ email: string; name: string } | null>(null);

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswordToggle, setShowPasswordToggle] = useState(false);

  // Add Official State
  const [officialModalOpen, setOfficialModalOpen] = useState(false);
  const [newOfficialForm, setNewOfficialForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "official" as "admin" | "official",
  });
  const [officialLoading, setOfficialLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.authenticated && d.official) {
          setCurrentOfficial(d.official);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  // Search & Filter
  const [jobSearch, setJobSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  // Modals
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobVacancy | null>(null);
  const [jobFormData, setJobFormData] = useState({
    title: "",
    department: "Engineering",
    location: "Remote / Manawar, MP",
    type: "Internship",
    experience: "0 - 1 years",
    status: "active" as "active" | "paused" | "closed",
    description: "",
    requirements: "",
  });

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: "",
    category: "Web & Mobile Platform",
    client: "In-house Product",
    status: "In Development" as "Planning" | "In Development" | "Live" | "Completed",
    summary: "",
    tags: "",
    link: "",
    featured: false,
  });

  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);

  // Notifications
  const notify = (text: string, type: "success" | "error" = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  // Fetch all initial data
  const loadData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes, projRes, enqRes, setRes, offRes] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/applications"),
        fetch("/api/projects"),
        fetch("/api/enquiries"),
        fetch("/api/settings"),
        fetch("/api/officials"),
      ]);

      const [jobsData, appsData, projData, enqData, setData, offData] = await Promise.all([
        jobsRes.json(),
        appsRes.json(),
        projRes.json(),
        enqRes.json(),
        setRes.json(),
        offRes.json(),
      ]);

      if (jobsData.success) setJobs(jobsData.data);
      if (appsData?.success) setApplications(appsData.data);
      if (projData.success) setProjects(projData.data);
      if (enqData.success) setEnquiries(enqData.data);
      if (setData.success) setSettings(setData.data);
      if (offData.success) setOfficials(offData.data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      notify("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- JOB ACTIONS ---
  const handleOpenJobModal = (job?: JobVacancy) => {
    if (job) {
      setEditingJob(job);
      setJobFormData({
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        experience: job.experience,
        status: job.status,
        description: job.description,
        requirements: (job.requirements || []).join("\n"),
      });
    } else {
      setEditingJob(null);
      setJobFormData({
        title: "",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        experience: "1 - 3 years",
        status: "active",
        description: "",
        requirements: "",
      });
    }
    setJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJob) {
        const res = await fetch(`/api/jobs/${editingJob.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobFormData),
        });
        const result = await res.json();
        if (result.success) {
          notify("Job vacancy updated successfully");
          setJobModalOpen(false);
          loadData();
        } else {
          notify(result.message || "Failed to update job", "error");
        }
      } else {
        const res = await fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(jobFormData),
        });
        const result = await res.json();
        if (result.success) {
          notify("New job vacancy posted successfully");
          setJobModalOpen(false);
          loadData();
        } else {
          notify(result.message || "Failed to create job", "error");
        }
      }
    } catch {
      notify("An unexpected error occurred", "error");
    }
  };

  const [copiedJobId, setCopiedJobId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: "active" | "paused" | "closed") => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await res.json();
      if (result.success) {
        notify(`Vacancy status updated to ${newStatus}`);
        setJobs(jobs.map((j) => (j.id === id ? { ...j, status: newStatus } : j)));
      } else {
        notify(result.message || "Failed to update status", "error");
      }
    } catch {
      notify("Error updating status", "error");
    }
  };

  const handleCopyApplyLink = (title: string, id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/contact?subject=${encodeURIComponent("Application for " + title)}`;
    navigator.clipboard.writeText(url);
    setCopiedJobId(id);
    notify("Direct application link copied to clipboard!");
    setTimeout(() => setCopiedJobId(null), 2500);
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        notify("Job deleted successfully");
        setJobs(jobs.filter((j) => j.id !== id));
      } else {
        notify("Failed to delete job", "error");
      }
    } catch {
      notify("Error deleting job", "error");
    }
  };

  // --- PROJECT ACTIONS ---
  const handleOpenProjectModal = (proj?: ProjectItem) => {
    if (proj) {
      setEditingProject(proj);
      setProjectFormData({
        title: proj.title,
        category: proj.category,
        client: proj.client,
        status: proj.status,
        summary: proj.summary,
        tags: (proj.tags || []).join(", "),
        link: proj.link || "",
        featured: proj.featured,
      });
    } else {
      setEditingProject(null);
      setProjectFormData({
        title: "",
        category: "Web & Mobile Platform",
        client: "Client / In-House",
        status: "In Development",
        summary: "",
        tags: "",
        link: "",
        featured: false,
      });
    }
    setProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        const res = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectFormData),
        });
        const result = await res.json();
        if (result.success) {
          notify("Project updated successfully");
          setProjectModalOpen(false);
          loadData();
        } else {
          notify(result.message || "Failed to update project", "error");
        }
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectFormData),
        });
        const result = await res.json();
        if (result.success) {
          notify("New project added successfully");
          setProjectModalOpen(false);
          loadData();
        } else {
          notify(result.message || "Failed to create project", "error");
        }
      }
    } catch {
      notify("An unexpected error occurred", "error");
    }
  };

  const [projectToDelete, setProjectToDelete] = useState<{ id: string; title: string } | null>(null);

  const handleProjectStatusChange = async (
    id: string,
    status: ProjectItem["status"]
  ) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (result.success) {
        notify(`Project status updated to ${status}`);
        setProjects(projects.map((p) => (p.id === id ? { ...p, status } : p)));
      } else {
        notify(result.message || "Failed to update project status", "error");
      }
    } catch {
      notify("Error updating project status", "error");
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        notify("Project deleted successfully");
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setProjectToDelete(null);
      } else {
        notify(result.message || "Failed to delete project", "error");
      }
    } catch {
      notify("Error deleting project", "error");
    }
  };

  // --- ENQUIRY ACTIONS ---
  const handleUpdateEnquiryStatus = async (id: string, status: EnquiryItem["status"]) => {
    try {
      const res = await fetch("/api/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const result = await res.json();
      if (result.success) {
        notify(`Enquiry status updated to ${status}`);
        setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status } : e)));
        if (selectedEnquiry?.id === id) {
          setSelectedEnquiry({ ...selectedEnquiry, status });
        }
      }
    } catch {
      notify("Failed to update enquiry status", "error");
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await fetch(`/api/enquiries?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        notify("Enquiry removed");
        setEnquiries(enquiries.filter((e) => e.id !== id));
        if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      }
    } catch {
      notify("Failed to delete enquiry", "error");
    }
  };

  // --- APPLICATION ACTIONS ---
  const handleUpdateApplicationStatus = async (
    id: string,
    status: JobApplicationItem["status"]
  ) => {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const result = await res.json();
      if (result.success) {
        notify(`Candidate status updated to ${status}`);
        setApplications((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status } : a))
        );
        if (selectedApplication?.id === id) {
          setSelectedApplication({ ...selectedApplication, status });
        }
      } else {
        notify(result.message || "Failed to update application", "error");
      }
    } catch {
      notify("Failed to update candidate application", "error");
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm("Are you sure you want to remove this job application?")) return;
    try {
      const res = await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        notify("Job application removed");
        setApplications((prev) => prev.filter((a) => a.id !== id));
        if (selectedApplication?.id === id) setSelectedApplication(null);
      } else {
        notify(result.message || "Failed to delete application", "error");
      }
    } catch {
      notify("Failed to delete application", "error");
    }
  };

  // --- SETTINGS ACTIONS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const result = await res.json();
      if (result.success) {
        notify("Company settings updated successfully");
      } else {
        notify("Failed to save settings", "error");
      }
    } catch {
      notify("Error saving settings", "error");
    }
  };

  // --- OFFICIALS & SECURITY ACTIONS ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notify("New password and confirmation do not match", "error");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      notify("New password must be at least 6 characters long", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/officials/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordForm),
      });
      const data = await res.json();
      if (data.success) {
        notify(data.message || "Password updated successfully!");
        setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        notify(data.message || "Failed to update password", "error");
      }
    } catch {
      notify("An error occurred while updating password", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAddOfficial = async (e: React.FormEvent) => {
    e.preventDefault();
    setOfficialLoading(true);
    try {
      const res = await fetch("/api/officials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOfficialForm),
      });
      const data = await res.json();
      if (data.success) {
        notify("New official user created successfully!");
        setOfficialModalOpen(false);
        setNewOfficialForm({ name: "", email: "", password: "", role: "official" });
        const offRes = await fetch("/api/officials").then((r) => r.json());
        if (offRes.success) setOfficials(offRes.data);
      } else {
        notify(data.message || "Failed to add official", "error");
      }
    } catch {
      notify("Error adding official account", "error");
    } finally {
      setOfficialLoading(false);
    }
  };

  const handleDeleteOfficial = async (email: string) => {
    if (!confirm(`Are you sure you want to revoke official access for ${email}?`)) return;
    try {
      const res = await fetch(`/api/officials?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        notify("Official access revoked");
        setOfficials((prev) => prev.filter((o) => o.email.toLowerCase() !== email.toLowerCase()));
      } else {
        notify(data.message || "Failed to remove official", "error");
      }
    } catch {
      notify("Error removing official", "error");
    }
  };

  // Filtered lists
  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.department.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(projectSearch.toLowerCase()) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(projectSearch.toLowerCase()))
  );

  const filteredApplications = applications.filter(
    (a) =>
      a.name.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      a.email.toLowerCase().includes(applicationSearch.toLowerCase()) ||
      a.department.toLowerCase().includes(applicationSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fcf9f2] text-zinc-900 flex flex-col md:flex-row font-sans">
      {/* Toast Notification */}
      {message && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl text-sm font-semibold transition-all ${
            message.type === "success"
              ? "bg-zinc-900 text-amber-300 border border-amber-400/40"
              : "bg-red-700 text-white"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between px-5 py-4 bg-[#fffaf2] border-b border-amber-950/10">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="SevaManjari Labs" width={140} height={42} className="h-8 w-auto object-contain" />
          <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
            Admin
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-zinc-100 hover:bg-zinc-200"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1f0505] text-white flex flex-col justify-between p-5 transform transition-transform duration-200 md:translate-x-0 md:static ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Hub Title */}
          <div className="pb-6 border-b border-white/10">
            <Link href="/" className="inline-block bg-white/95 p-2 rounded-xl">
              <Image
                src="/logo.png"
                alt="SevaManjari Labs"
                width={160}
                height={50}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs tracking-wider text-amber-300 font-semibold uppercase">Management Suite</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Local Dev
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 flex flex-col gap-1.5">
            {[
              { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
              { id: "jobs", label: "Job Vacancies", icon: Briefcase, badge: jobs.filter((j) => j.status === "active").length },
              { id: "applications", label: "Job Applications", icon: FileText, badge: applications.filter((a) => a.status === "new").length },
              { id: "projects", label: "Projects & Products", icon: FolderKanban, badge: projects.length },
              { id: "enquiries", label: "Enquiries & Leads", icon: MessageSquare, badge: enquiries.filter((e) => e.status === "new").length },
              { id: "security", label: "Access & Security", icon: KeyRound, badge: officials.length },
              { id: "settings", label: "Company Settings", icon: Settings },
            ].map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id as typeof activeTab);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{label}</span>
                </div>
                {badge !== undefined && badge > 0 && (
                  <span className="text-[11px] font-semibold bg-amber-400 text-zinc-950 px-2 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Quick Actions */}
        <div className="pt-6 border-t border-white/10 flex flex-col gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Globe size={14} /> View Live Website
            </span>
            <ExternalLink size={13} />
          </Link>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Data
          </button>

          {/* Official Profile & Sign Out */}
          <div className="mt-2 pt-3 border-t border-white/10">
            <div className="px-2 py-1 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">Logged in as</span>
              <span className="text-xs font-medium text-zinc-200 truncate block">
                {currentOfficial?.email || "info@sevamanjari.com"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-red-300 bg-red-950/40 hover:bg-red-900/60 hover:text-white transition-colors border border-red-900/30"
            >
              <span className="flex items-center gap-2">
                <LogOut size={13} /> Sign Out
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-zinc-200">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-800 flex items-center gap-2">
              <ShieldCheck size={14} className="text-amber-700" />
              <span>
                {activeTab === "overview" && "Platform Summary"}
                {activeTab === "jobs" && "Talent & Recruitment"}
                {activeTab === "applications" && "Talent Acquisition & Candidates"}
                {activeTab === "projects" && "Portfolio & In-House Products"}
                {activeTab === "enquiries" && "Client & Partner Enquiries"}
                {activeTab === "security" && "Corporate Governance & Security"}
                {activeTab === "settings" && "Configuration"}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mt-1 capitalize">
              {activeTab === "overview"
                ? "System Overview"
                : activeTab === "security"
                ? "Access & Security"
                : activeTab === "applications"
                ? "Candidate Applications"
                : activeTab.replace("-", " ")}
            </h1>
          </div>

          {/* Action Buttons depending on tab */}
          <div className="flex items-center flex-wrap gap-2.5">
            {activeTab === "security" && (
              <button
                onClick={() => setOfficialModalOpen(true)}
                className="btn-primary py-2.5 text-xs shadow-md"
              >
                <UserPlus size={16} /> Add Official User
              </button>
            )}
            {activeTab === "jobs" && (
              <button
                onClick={() => handleOpenJobModal()}
                className="btn-primary py-2.5 text-xs shadow-md"
              >
                <Plus size={16} /> Post New Vacancy
              </button>
            )}
            {activeTab === "projects" && (
              <button
                onClick={() => handleOpenProjectModal()}
                className="btn-primary py-2.5 text-xs shadow-md"
              >
                <Plus size={16} /> Add New Project
              </button>
            )}
            <Link
              href="/careers"
              target="_blank"
              className="text-xs font-semibold px-3 py-2 rounded-full border border-zinc-300 bg-white hover:border-amber-600 text-zinc-700 transition"
            >
              Public Careers <ArrowUpRight size={13} className="inline ml-1" />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 text-xs font-semibold transition"
              title="End official session"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* ================= OVERVIEW TAB ================= */}
        {activeTab === "overview" && (
          <div className="mt-8 space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="card p-6 bg-white border border-zinc-200/90 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Active Openings</span>
                  <div className="p-2.5 bg-amber-50 text-amber-800 rounded-2xl">
                    <Briefcase size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900">
                    {jobs.filter((j) => j.status === "active").length}
                  </span>
                  <span className="text-xs text-zinc-500">/ {jobs.length} total</span>
                </div>
                <button
                  onClick={() => setActiveTab("jobs")}
                  className="mt-4 text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1"
                >
                  Manage job vacancies &rarr;
                </button>
              </div>

              <div className="card p-6 bg-white border border-zinc-200/90 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Projects & Products</span>
                  <div className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl">
                    <FolderKanban size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900">{projects.length}</span>
                  <span className="text-xs text-zinc-500">
                    ({projects.filter((p) => p.status === "Live").length} Live)
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab("projects")}
                  className="mt-4 text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                >
                  Manage showcase &rarr;
                </button>
              </div>

              <div className="card p-6 bg-white border border-zinc-200/90 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Enquiries</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                    <MessageSquare size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900">{enquiries.length}</span>
                  {enquiries.filter((e) => e.status === "new").length > 0 && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {enquiries.filter((e) => e.status === "new").length} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab("enquiries")}
                  className="mt-4 text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  Review client leads &rarr;
                </button>
              </div>

              <div className="card p-6 bg-white border border-zinc-200/90 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Job Applications</span>
                  <div className="p-2.5 bg-purple-50 text-purple-700 rounded-2xl">
                    <FileText size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900">{applications.length}</span>
                  {applications.filter((a) => a.status === "new").length > 0 && (
                    <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      {applications.filter((a) => a.status === "new").length} new
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab("applications")}
                  className="mt-4 text-xs font-semibold text-purple-800 hover:text-purple-950 flex items-center gap-1"
                >
                  Review candidate CVs &rarr;
                </button>
              </div>
            </div>

            {/* Quick Overview Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Enquiries Preview */}
              <div className="card bg-white p-6 border border-zinc-200/90">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                  <h3 className="font-bold text-lg text-zinc-900">Recent Enquiries</h3>
                  <button
                    onClick={() => setActiveTab("enquiries")}
                    className="text-xs font-semibold text-amber-800 hover:underline"
                  >
                    View All ({enquiries.length})
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {enquiries.length === 0 ? (
                    <p className="text-sm text-zinc-400 py-6 text-center">No enquiries yet.</p>
                  ) : (
                    enquiries.slice(0, 4).map((enq) => (
                      <div
                        key={enq.id}
                        onClick={() => {
                          setSelectedEnquiry(enq);
                          setActiveTab("enquiries");
                        }}
                        className="p-3.5 rounded-2xl bg-zinc-50 hover:bg-amber-50/50 cursor-pointer transition border border-zinc-100 flex items-start justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-zinc-900">{enq.name}</span>
                            {enq.company && (
                              <span className="text-xs text-zinc-500">({enq.company})</span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-600 line-clamp-1 mt-1">{enq.message}</p>
                          <span className="text-[10px] text-zinc-400 mt-1.5 block">
                            {new Date(enq.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            enq.status === "new"
                              ? "bg-amber-100 text-amber-800"
                              : enq.status === "replied"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {enq.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Active Openings Preview */}
              <div className="card bg-white p-6 border border-zinc-200/90">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                  <h3 className="font-bold text-lg text-zinc-900">Active Job Roles</h3>
                  <button
                    onClick={() => setActiveTab("jobs")}
                    className="text-xs font-semibold text-amber-800 hover:underline"
                  >
                    Manage Roles ({jobs.length})
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {jobs.slice(0, 4).map((j) => (
                    <div
                      key={j.id}
                      className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-900">{j.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                          <span>{j.department}</span>
                          <span>•</span>
                          <span>{j.location}</span>
                          <span>•</span>
                          <span className="font-medium text-amber-800">{j.type}</span>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">
                        {j.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= JOBS VACANCIES TAB ================= */}
        {activeTab === "jobs" && (
          <div className="mt-8 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search jobs by title, department..."
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
              <span className="text-xs font-medium text-zinc-500">
                Showing {filteredJobs.length} of {jobs.length} vacancies
              </span>
            </div>

            {/* Jobs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`card p-6 bg-white border transition-all duration-200 flex flex-col justify-between hover:shadow-lg ${
                    job.status === "active"
                      ? "border-zinc-200/90 hover:border-amber-400/80"
                      : job.status === "paused"
                      ? "border-amber-200 bg-amber-50/20"
                      : "border-zinc-200 bg-zinc-50/50 opacity-80"
                  }`}
                >
                  <div>
                    {/* Top Row: Department & Status Badge */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                        <Briefcase size={13} />
                        <span>{job.department}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            job.status === "active"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                              : job.status === "paused"
                              ? "bg-amber-100 text-amber-900 border border-amber-300"
                              : "bg-zinc-200 text-zinc-700 border border-zinc-300"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              job.status === "active"
                                ? "bg-emerald-500 animate-pulse"
                                : job.status === "paused"
                                ? "bg-amber-500"
                                : "bg-zinc-400"
                            }`}
                          />
                          {job.status === "active" ? "Live on Site" : job.status}
                        </span>
                      </div>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-xl font-bold text-zinc-900 mt-3 leading-snug">{job.title}</h3>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-zinc-600">
                      <span className="inline-flex items-center gap-1 bg-zinc-100 px-2.5 py-1 rounded-lg font-medium">
                        <MapPin size={12} className="text-amber-700" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-zinc-100 px-2.5 py-1 rounded-lg font-medium">
                        <Clock size={12} className="text-amber-700" />
                        {job.experience}
                      </span>
                      <span className="bg-amber-50 text-amber-900 border border-amber-200/60 px-2.5 py-1 rounded-lg font-semibold">
                        {job.type}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="mt-4 text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Requirements preview */}
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-zinc-100">
                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
                          Requirements ({job.requirements.length})
                        </span>
                        <ul className="text-xs text-zinc-600 space-y-1">
                          {job.requirements.slice(0, 2).map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                              <CheckCircle2 size={13} className="text-amber-700 mt-0.5 shrink-0" />
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Status Switcher & Action Controls */}
                  <div className="mt-6 pt-4 border-t border-zinc-100 space-y-3">
                    {/* Status Changer Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-zinc-50 p-2 rounded-2xl border border-zinc-200/70">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 pl-1">
                        Change Status:
                      </span>
                      <div className="flex items-center gap-1">
                        {(["active", "paused", "closed"] as const).map((st) => (
                          <button
                            key={st}
                            onClick={() => handleStatusChange(job.id, st)}
                            className={`text-xs px-2.5 py-1 rounded-lg font-semibold capitalize transition-all ${
                              job.status === st
                                ? st === "active"
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : st === "paused"
                                  ? "bg-amber-600 text-white shadow-sm"
                                  : "bg-zinc-800 text-white shadow-sm"
                                : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Secondary Actions: Copy Link & Edit */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-zinc-400">
                        Added {new Date(job.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyApplyLink(job.title, job.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition"
                          title="Copy direct application link"
                        >
                          {copiedJobId === job.id ? (
                            <>
                              <Check size={13} className="text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} className="text-zinc-500" />
                              <span>Share Link</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenJobModal(job)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 transition border border-amber-200/70"
                          title="Edit Vacancy Details"
                        >
                          <Edit size={13} />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= JOB APPLICATIONS TAB ================= */}
        {activeTab === "applications" && (
          <div className="mt-8 space-y-6">
            {/* Search and Counts */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search candidate by name, role, email..."
                  value={applicationSearch}
                  onChange={(e) => setApplicationSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-600">
                <span className="font-semibold text-zinc-900">
                  {applications.length} Total Received
                </span>
                <span>•</span>
                <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {applications.filter((a) => a.status === "new").length} New
                </span>
                <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {applications.filter((a) => a.status === "shortlisted").length} Shortlisted
                </span>
              </div>
            </div>

            {/* Split Screen Layout: List on Left, Detail Dossier on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Candidates List */}
              <div className="lg:col-span-5 space-y-3">
                {filteredApplications.length === 0 ? (
                  <div className="card p-12 text-center text-zinc-400 bg-white border border-dashed border-zinc-200 rounded-3xl">
                    <FileText size={32} className="mx-auto mb-3 opacity-40 text-amber-800" />
                    <p className="font-semibold text-zinc-700">No Job Applications Found</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Candidates applying through the careers portal will appear here in real-time.
                    </p>
                  </div>
                ) : (
                  filteredApplications.map((app) => (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApplication(app)}
                      className={`card p-5 cursor-pointer transition-all border rounded-2xl ${
                        selectedApplication?.id === app.id
                          ? "bg-amber-50/40 border-amber-500 shadow-md ring-1 ring-amber-400"
                          : "bg-white border-zinc-200/90 hover:border-amber-300 hover:shadow"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-base text-zinc-900">{app.name}</div>
                          <span className="inline-block mt-1 text-[11px] font-semibold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                            {app.jobTitle}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            app.status === "new"
                              ? "bg-amber-100 text-amber-800"
                              : app.status === "in_review"
                              ? "bg-blue-100 text-blue-800"
                              : app.status === "shortlisted"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-zinc-200 text-zinc-700"
                          }`}
                        >
                          {app.status === "in_review" ? "In Review" : app.status}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-amber-700" />
                          {app.experience || "Fresher"}
                        </span>
                        {app.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-amber-700" />
                              {app.location}
                            </span>
                          </>
                        )}
                      </div>

                      <p className="mt-2 text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {app.coverNote}
                      </p>

                      <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>
                          {app.createdAt
                            ? new Date(app.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "Recent"}
                        </span>
                        <span className="font-medium text-amber-800">View Dossier &rarr;</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Right Column: Full Candidate Dossier */}
              <div className="lg:col-span-7">
                {selectedApplication ? (
                  <div className="card p-6 md:p-8 bg-white border border-zinc-200/90 shadow-sm rounded-3xl sticky top-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold text-zinc-900">
                            {selectedApplication.name}
                          </h2>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              selectedApplication.status === "new"
                                ? "bg-amber-100 text-amber-800"
                                : selectedApplication.status === "in_review"
                                ? "bg-blue-100 text-blue-800"
                                : selectedApplication.status === "shortlisted"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-zinc-200 text-zinc-700"
                            }`}
                          >
                            {selectedApplication.status === "in_review"
                              ? "In Review"
                              : selectedApplication.status}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                          <span className="font-semibold text-amber-800">
                            {selectedApplication.jobTitle}
                          </span>
                          <span>•</span>
                          <span>{selectedApplication.department}</span>
                          <span>•</span>
                          <span>
                            Applied{" "}
                            {selectedApplication.createdAt
                              ? new Date(selectedApplication.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Recently"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteApplication(selectedApplication.id)}
                        className="p-2 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 transition border border-transparent hover:border-red-200 self-start sm:self-center"
                        title="Delete application record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Candidate Contact & Professional Details */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                        <span className="font-semibold text-zinc-500 block mb-1">Email Address</span>
                        <a
                          href={`mailto:${selectedApplication.email}`}
                          className="font-medium text-amber-900 hover:underline flex items-center gap-1.5"
                        >
                          <Mail size={13} className="text-amber-700" />
                          {selectedApplication.email}
                        </a>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                        <span className="font-semibold text-zinc-500 block mb-1">Phone / WhatsApp</span>
                        <a
                          href={`tel:${selectedApplication.phone}`}
                          className="font-medium text-amber-900 hover:underline flex items-center gap-1.5"
                        >
                          <Phone size={13} className="text-amber-700" />
                          {selectedApplication.phone}
                        </a>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                        <span className="font-semibold text-zinc-500 block mb-1">Current Location</span>
                        <div className="font-medium text-zinc-800 flex items-center gap-1.5">
                          <MapPin size={13} className="text-amber-700" />
                          {selectedApplication.location || "Not specified"}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100">
                        <span className="font-semibold text-zinc-500 block mb-1">Total Experience</span>
                        <div className="font-medium text-zinc-800 flex items-center gap-1.5">
                          <Clock size={13} className="text-amber-700" />
                          {selectedApplication.experience || "Not specified"}
                        </div>
                      </div>
                    </div>

                    {/* External Links: Resume & Portfolio */}
                    <div className="mt-4 flex flex-wrap gap-3">
                      {selectedApplication.resumeUrl ? (
                        <a
                          href={selectedApplication.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-primary py-2 px-4 text-xs shadow-sm"
                        >
                          <ExternalLink size={13} /> Open Candidate Resume / CV
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-400 italic py-2">
                          No direct resume link provided.
                        </span>
                      )}

                      {selectedApplication.portfolioUrl && (
                        <a
                          href={selectedApplication.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary py-2 px-4 text-xs"
                        >
                          <Globe size={13} /> View Portfolio / GitHub / LinkedIn
                        </a>
                      )}
                    </div>

                    {/* Cover Note Section */}
                    <div className="mt-6 pt-5 border-t border-zinc-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                        Candidate Cover Note & Self-Pitch
                      </span>
                      <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap">
                        {selectedApplication.coverNote}
                      </div>
                    </div>

                    {/* Hiring Stage / Status Changer */}
                    <div className="mt-6 pt-5 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                          Update Hiring Stage
                        </span>
                        <p className="text-[11px] text-zinc-400">Move candidate across hiring workflow</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleUpdateApplicationStatus(selectedApplication.id, "new")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                            selectedApplication.status === "new"
                              ? "bg-amber-700 text-white shadow-sm"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                        >
                          New
                        </button>
                        <button
                          onClick={() => handleUpdateApplicationStatus(selectedApplication.id, "in_review")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                            selectedApplication.status === "in_review"
                              ? "bg-blue-600 text-white shadow-sm"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                        >
                          In Review
                        </button>
                        <button
                          onClick={() => handleUpdateApplicationStatus(selectedApplication.id, "shortlisted")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                            selectedApplication.status === "shortlisted"
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleUpdateApplicationStatus(selectedApplication.id, "rejected")}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                            selectedApplication.status === "rejected"
                              ? "bg-zinc-800 text-white shadow-sm"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card p-12 text-center text-zinc-400 bg-white border border-dashed border-zinc-200 rounded-3xl">
                    Select a candidate from the left to view complete application details, resume document, and update hiring stage.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= PROJECTS & PRODUCTS TAB ================= */}
        {activeTab === "projects" && (
          <div className="mt-8 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search projects, tags, category..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                />
              </div>
              <span className="text-xs font-medium text-zinc-500">
                Showing {filteredProjects.length} of {projects.length} projects
              </span>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="card p-6 bg-white border border-zinc-200/90 flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        {proj.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          proj.status === "Live"
                            ? "bg-emerald-100 text-emerald-800"
                            : proj.status === "In Development"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {proj.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-zinc-900 mt-2">{proj.title}</h3>
                    <p className="text-xs font-medium text-amber-800 mt-0.5">Client: {proj.client}</p>

                    <p className="mt-3 text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                      {proj.summary}
                    </p>

                    {proj.tags && proj.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {proj.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Status Bar */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">Status:</span>
                    <div className="flex items-center gap-1">
                      {(["Planning", "In Development", "Live", "Completed"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleProjectStatusChange(proj.id, st)}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition ${
                            proj.status === st
                              ? st === "Live"
                                ? "bg-emerald-600 text-white"
                                : st === "In Development"
                                ? "bg-amber-600 text-white"
                                : "bg-zinc-800 text-white"
                              : "text-zinc-500 hover:bg-zinc-100"
                          }`}
                        >
                          {st === "In Development" ? "In Dev" : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between">
                    {proj.link ? (
                      <a
                        href={proj.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1"
                      >
                        View Link <ArrowUpRight size={12} />
                      </a>
                    ) : (
                      <span className="text-xs text-zinc-400">Internal</span>
                    )}

                    {projectToDelete?.id === proj.id ? (
                      <div className="flex items-center gap-1.5 bg-red-50 p-1 rounded-xl border border-red-200">
                        <span className="text-[10px] font-bold text-red-800 pl-1">Delete?</span>
                        <button
                          onClick={() => handleDeleteProject(proj.id)}
                          className="px-2 py-1 text-[11px] font-bold rounded-lg bg-red-700 text-white hover:bg-red-800 transition shadow-sm"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setProjectToDelete(null)}
                          className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-zinc-200 text-zinc-700 hover:bg-zinc-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenProjectModal(proj)}
                          className="p-2 rounded-xl text-zinc-600 hover:text-amber-800 hover:bg-amber-50 transition"
                          title="Edit Project"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setProjectToDelete({ id: proj.id, title: proj.title })}
                          className="p-2 rounded-xl text-zinc-400 hover:text-red-700 hover:bg-red-50 transition"
                          title="Delete Project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ENQUIRIES TAB ================= */}
        {activeTab === "enquiries" && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-2">
                All Enquiries ({enquiries.length})
              </h3>
              {enquiries.length === 0 ? (
                <div className="card p-8 text-center text-sm text-zinc-400 bg-white">No incoming enquiries yet.</div>
              ) : (
                enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    onClick={() => setSelectedEnquiry(enq)}
                    className={`card p-4 bg-white cursor-pointer transition border ${
                      selectedEnquiry?.id === enq.id
                        ? "border-amber-600 shadow-md ring-1 ring-amber-500"
                        : "border-zinc-200/80 hover:border-zinc-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-zinc-900 text-sm">{enq.name}</h4>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          enq.status === "new"
                            ? "bg-amber-100 text-amber-800"
                            : enq.status === "replied"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-zinc-200 text-zinc-700"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">{enq.email}</p>
                    <p className="text-xs text-zinc-600 line-clamp-2 mt-2">{enq.message}</p>
                    <span className="text-[10px] text-zinc-400 mt-2 block">
                      {new Date(enq.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Details Panel */}
            <div className="lg:col-span-2">
              {selectedEnquiry ? (
                <div className="card p-8 bg-white border border-zinc-200/90 shadow-sm">
                  <div className="flex items-start justify-between border-b border-zinc-100 pb-5">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                        {selectedEnquiry.subject || "General Enquiry"}
                      </span>
                      <h2 className="text-2xl font-bold text-zinc-900 mt-1">{selectedEnquiry.name}</h2>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-zinc-600">
                        <span className="flex items-center gap-1.5">
                          <Mail size={14} className="text-zinc-400" />
                          <a href={`mailto:${selectedEnquiry.email}`} className="text-amber-800 hover:underline">
                            {selectedEnquiry.email}
                          </a>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone size={14} className="text-zinc-400" />
                          <a href={`tel:${selectedEnquiry.phone}`} className="text-zinc-700">
                            {selectedEnquiry.phone}
                          </a>
                        </span>
                        {selectedEnquiry.company && (
                          <span className="flex items-center gap-1.5">
                            <Building size={14} className="text-zinc-400" />
                            {selectedEnquiry.company}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteEnquiry(selectedEnquiry.id)}
                      className="p-2 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Delete this enquiry"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Message Body</h4>
                    <div className="p-5 rounded-2xl bg-[#fffaf2] border border-amber-950/10 text-sm leading-relaxed text-zinc-800 whitespace-pre-wrap">
                      {selectedEnquiry.message}
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="mt-8 pt-5 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-500">Change Status:</span>
                      {(["new", "in_review", "replied", "archived"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleUpdateEnquiryStatus(selectedEnquiry.id, st)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition ${
                            selectedEnquiry.status === st
                              ? "bg-zinc-900 text-white"
                              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                          }`}
                        >
                          {st.replace("_", " ")}
                        </button>
                      ))}
                    </div>

                    <a
                      href={`mailto:${selectedEnquiry.email}?subject=Re: ${encodeURIComponent(
                        selectedEnquiry.subject || "Enquiry regarding SevaManjari Labs"
                      )}`}
                      className="btn-primary py-2.5 text-xs"
                    >
                      Reply via Email <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="card p-12 text-center text-zinc-400 bg-white border border-dashed border-zinc-300">
                  Select an enquiry from the left to view message details and respond.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= ACCESS & SECURITY TAB ================= */}
        {activeTab === "security" && (
          <div className="mt-8 space-y-8 max-w-6xl">
            {/* Header Advisory Banner */}
            <div className="card p-6 bg-gradient-to-r from-amber-950 via-zinc-900 to-[#1f0505] text-white border border-amber-900/40 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-amber-500/10 to-transparent pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
                    <ShieldCheck size={14} /> Corporate Access Control
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                    Official Credentials & Access Management
                  </h2>
                  <p className="text-xs md:text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                    This management suite is strictly private. All credentials are encrypted using bcrypt and stored securely in MongoDB Atlas. Public links are disabled; officials access via direct URL.
                  </p>
                </div>
                <button
                  onClick={() => setOfficialModalOpen(true)}
                  className="btn-primary py-2.5 px-5 text-xs whitespace-nowrap self-start md:self-center shadow-lg"
                >
                  <UserPlus size={15} /> Add Official User
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Change Password Card */}
              <div className="lg:col-span-5 card p-6 md:p-8 bg-white border border-zinc-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 pb-4 border-b border-zinc-100">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-zinc-900">Change Password</h3>
                      <p className="text-xs text-zinc-500">Update your official login password</p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Current Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswordToggle ? "text" : "password"}
                          required
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                          }
                          placeholder="Enter your current password"
                          className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordToggle(!showPasswordToggle)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                          tabIndex={-1}
                        >
                          {showPasswordToggle ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        New Password *
                      </label>
                      <input
                        type={showPasswordToggle ? "text" : "password"}
                        required
                        minLength={6}
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                        }
                        placeholder="At least 6 characters"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 mb-1">
                        Confirm New Password *
                      </label>
                      <input
                        type={showPasswordToggle ? "text" : "password"}
                        required
                        minLength={6}
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                        }
                        placeholder="Re-type new password"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="btn-primary w-full py-2.5 text-xs justify-center disabled:opacity-60"
                      >
                        {passwordLoading ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" /> Updating...
                          </>
                        ) : (
                          <>
                            <KeyRound size={14} /> Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 text-[11px] text-zinc-500 leading-relaxed">
                  <span className="font-semibold text-zinc-700">Security Tip:</span> Use a combination of letters, numbers, and special characters. Never share access credentials outside authorized company personnel.
                </div>
              </div>

              {/* Right Column: Authorized Officials Card */}
              <div className="lg:col-span-7 card p-6 md:p-8 bg-white border border-zinc-200/90 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200/60">
                        <Users size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-zinc-900">Authorized Officials</h3>
                        <p className="text-xs text-zinc-500">Users permitted to sign into the dashboard</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                      {officials.length} {officials.length === 1 ? "Official" : "Officials"}
                    </span>
                  </div>

                  {/* Officials Table */}
                  <div className="mt-6 overflow-x-auto">
                    {officials.length === 0 ? (
                      <div className="p-8 text-center text-zinc-400 text-sm border border-dashed border-zinc-200 rounded-2xl">
                        No officials registered. Click &quot;Add Official User&quot; to authorize an account.
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-200 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                            <th className="pb-3 pl-1">Official Name</th>
                            <th className="pb-3 px-3">Role</th>
                            <th className="pb-3 px-3">Added Date</th>
                            <th className="pb-3 pr-1 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-xs">
                          {officials.map((off) => {
                            const isCurrent =
                              currentOfficial?.email?.toLowerCase() === off.email.toLowerCase() ||
                              (!currentOfficial && off.email === "info@sevamanjari.com");
                            return (
                              <tr key={off.id || off.email} className="hover:bg-zinc-50/70 transition-colors">
                                <td className="py-3 pl-1">
                                  <div className="font-semibold text-zinc-900 flex items-center gap-2">
                                    <span>{off.name || "Company Official"}</span>
                                    {isCurrent && (
                                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md">
                                        You
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-zinc-500 font-mono text-[11px]">{off.email}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                      off.role === "admin"
                                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                                        : "bg-blue-100 text-blue-800 border border-blue-200"
                                    }`}
                                  >
                                    {off.role || "Official"}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-zinc-500 text-[11px]">
                                  {off.createdAt
                                    ? new Date(off.createdAt).toLocaleDateString("en-IN", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : "Default"}
                                </td>
                                <td className="py-3 pr-1 text-right">
                                  {isCurrent ? (
                                    <span className="text-[11px] text-zinc-400 italic">Active</span>
                                  ) : (
                                    <button
                                      onClick={() => handleDeleteOfficial(off.email)}
                                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                      title="Revoke access"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Need to give access to another team member?</span>
                  <button
                    onClick={() => setOfficialModalOpen(true)}
                    className="text-amber-700 hover:text-amber-900 font-semibold inline-flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Official
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SETTINGS TAB ================= */}
        {activeTab === "settings" && settings && (
          <div className="mt-8 max-w-3xl card p-8 bg-white border border-zinc-200/90">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">Corporate Information</h3>
                <p className="text-xs text-zinc-500">
                  Update basic corporate and contact information rendered across the website.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Company Legal Name</label>
                  <input
                    type="text"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Corporate Identification Number (CIN)</label>
                  <input
                    type="text"
                    value={settings.cin}
                    onChange={(e) => setSettings({ ...settings, cin: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Primary Email</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Primary Contact Phone</label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Registered Office Address</label>
                <textarea
                  rows={2}
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hiringToggle"
                    checked={settings.isHiringActive}
                    onChange={(e) => setSettings({ ...settings, isHiringActive: e.target.checked })}
                    className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500 border-zinc-300"
                  />
                  <label htmlFor="hiringToggle" className="text-sm font-semibold text-zinc-800">
                    Display &apos;We Are Hiring&apos; callouts across website
                  </label>
                </div>

                <button type="submit" className="btn-primary py-2.5 text-xs">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ================= MODAL: ADD / EDIT JOB ================= */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-zinc-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="text-xl font-bold text-zinc-900">
                {editingJob ? "Edit Job Vacancy" : "Post New Job Vacancy"}
              </h3>
              <button
                onClick={() => setJobModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={jobFormData.title}
                  onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Department *</label>
                  <select
                    value={jobFormData.department}
                    onChange={(e) => setJobFormData({ ...jobFormData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Growth & Sales">Growth & Sales</option>
                    <option value="Operations">Operations</option>
                    <option value="Creative & Design">Creative & Design</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Job Type *</label>
                  <select
                    value={jobFormData.type}
                    onChange={(e) => setJobFormData({ ...jobFormData, type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Remote / Hybrid"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Experience</label>
                  <input
                    type="text"
                    placeholder="0 - 2 years"
                    value={jobFormData.experience}
                    onChange={(e) => setJobFormData({ ...jobFormData, experience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Status</label>
                  <select
                    value={jobFormData.status}
                    onChange={(e) =>
                      setJobFormData({ ...jobFormData, status: e.target.value as "active" | "paused" | "closed" })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Overview of the role and key goals..."
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Key Requirements (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Proficiency in Next.js&#10;Understanding of APIs&#10;Team mindset"
                  value={jobFormData.requirements}
                  onChange={(e) => setJobFormData({ ...jobFormData, requirements: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500 font-mono text-xs"
                />
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-zinc-300 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2.5 text-xs">
                  {editingJob ? "Save Changes" : "Publish Vacancy"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT PROJECT ================= */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-zinc-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="text-xl font-bold text-zinc-900">
                {editingProject ? "Edit Project" : "Add New Project / Showcase"}
              </h3>
              <button
                onClick={() => setProjectModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SevaManjari Marketplace"
                  value={projectFormData.title}
                  onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. E-Commerce, SaaS, Web App"
                    value={projectFormData.category}
                    onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Client / Owner</label>
                  <input
                    type="text"
                    placeholder="e.g. In-house Product or Client Name"
                    value={projectFormData.client}
                    onChange={(e) => setProjectFormData({ ...projectFormData, client: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Status</label>
                  <select
                    value={projectFormData.status}
                    onChange={(e) =>
                      setProjectFormData({
                        ...projectFormData,
                        status: e.target.value as "Planning" | "In Development" | "Live" | "Completed",
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Planning">Planning</option>
                    <option value="In Development">In Development</option>
                    <option value="Live">Live</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Project Link / URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={projectFormData.link}
                    onChange={(e) => setProjectFormData({ ...projectFormData, link: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Summary / Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief overview of what this project achieves..."
                  value={projectFormData.summary}
                  onChange={(e) => setProjectFormData({ ...projectFormData, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Next.js, Tailwind, React, E-commerce"
                  value={projectFormData.tags}
                  onChange={(e) => setProjectFormData({ ...projectFormData, tags: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={projectFormData.featured}
                  onChange={(e) => setProjectFormData({ ...projectFormData, featured: e.target.checked })}
                  className="h-4 w-4 rounded text-amber-600 focus:ring-amber-500 border-zinc-300"
                />
                <label htmlFor="featuredToggle" className="text-xs font-semibold text-zinc-700">
                  Feature prominently on homepage / showcase
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-zinc-300 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2.5 text-xs">
                  {editingProject ? "Save Changes" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD OFFICIAL USER ================= */}
      {officialModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-zinc-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-zinc-900">Authorize Official</h3>
                  <p className="text-xs text-zinc-500">Add user with dashboard login access</p>
                </div>
              </div>
              <button
                onClick={() => setOfficialModalOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddOfficial} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={newOfficialForm.name}
                  onChange={(e) =>
                    setNewOfficialForm({ ...newOfficialForm, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@sevamanjari.com"
                  value={newOfficialForm.email}
                  onChange={(e) =>
                    setNewOfficialForm({ ...newOfficialForm, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Initial Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Min 6 characters"
                  value={newOfficialForm.password}
                  onChange={(e) =>
                    setNewOfficialForm({ ...newOfficialForm, password: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
                <p className="text-[11px] text-zinc-400 mt-1">
                  They can change their password anytime in this tab.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Access Role *
                </label>
                <select
                  value={newOfficialForm.role}
                  onChange={(e) =>
                    setNewOfficialForm({
                      ...newOfficialForm,
                      role: e.target.value as "admin" | "official",
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="official">Official (Standard Dashboard Access)</option>
                  <option value="admin">Administrator (Full Privileges)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setOfficialModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-zinc-300 text-sm font-semibold text-zinc-700 hover:bg-zinc-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={officialLoading}
                  className="btn-primary py-2.5 text-xs disabled:opacity-60"
                >
                  {officialLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Authorizing...
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} /> Grant Access
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

