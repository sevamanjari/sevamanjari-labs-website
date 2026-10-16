"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Clock,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Send,
  Building2,
  FileText,
  User,
  Mail,
  Phone,
  Globe,
  Link2,
  AlertCircle,
  Sparkles,
  UploadCloud,
  FileCheck,
  X,
  Loader2,
} from "lucide-react";

interface JobInfo {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  requirements?: string[];
  status: string;
}

function ApplyForm() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get("jobId") || "";

  // Open proposal mode if explicitly requested as 'open' or if no specific job ID was provided
  const isOpen = initialJobId === "open" || !initialJobId;

  const [selectedJob, setSelectedJob] = useState<JobInfo | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Custom fields for Open Proposal
  const [customRoleTitle, setCustomRoleTitle] = useState("");
  const [customDepartment, setCustomDepartment] = useState("Engineering & Technology");

  // Resume Mode: "file" (direct PDF upload) or "link" (URL)
  const [resumeMode, setResumeMode] = useState<"file" | "link">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatusText, setUploadStatusText] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    experience: "Fresher (0 - 1 years)",
    portfolioUrl: "",
    resumeUrl: "",
    coverNote: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRoleTitle, setSubmittedRoleTitle] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedJob(null);
      setLoadingJobs(false);
      return;
    }

    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          const active = data.data.filter((j: JobInfo) => j.status === "active");
          const found = active.find((j: JobInfo) => j.id === initialJobId);
          if (found) {
            setSelectedJob(found);
          } else {
            setSelectedJob(null);
          }
        }
      })
      .catch((err) => console.error("Error fetching jobs:", err))
      .finally(() => setLoadingJobs(false));
  }, [initialJobId, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "doc", "docx"].includes(ext)) {
      setErrorMessage("Please select a valid document (.pdf, .doc, or .docx).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File exceeds 10MB limit. Please upload a smaller file.");
      return;
    }

    setErrorMessage("");
    setSelectedFile(file);
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isOpen && !selectedJob) {
      setErrorMessage("Please select a valid open position to proceed.");
      return;
    }

    if (isOpen && !customRoleTitle.trim()) {
      setErrorMessage("Please specify your desired role or proposal title.");
      return;
    }

    if (resumeMode === "link" && !formData.resumeUrl.trim() && !selectedFile) {
      // Optional check or allow submitting without resume if not mandatory
    }

    setSubmitting(true);
    let finalResumeUrl = formData.resumeUrl.trim();

    // 1. If direct PDF file is selected, upload it first to the server upload directory
    if (resumeMode === "file" && selectedFile) {
      setUploadStatusText("Uploading resume document to server...");
      try {
        const uploadForm = new FormData();
        uploadForm.append("file", selectedFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadForm,
        });

        const uploadData = await uploadRes.json();
        if (!uploadData.success) {
          setErrorMessage(uploadData.message || "Failed to upload resume file.");
          setSubmitting(false);
          setUploadStatusText("");
          return;
        }

        finalResumeUrl = uploadData.url;
      } catch {
        setErrorMessage("Network error while uploading resume document. Please try again.");
        setSubmitting(false);
        setUploadStatusText("");
        return;
      }
    }

    setUploadStatusText("Registering application...");

    const targetTitle = isOpen
      ? customRoleTitle.trim()
      : (selectedJob?.title || "Position Application");

    const targetDept = isOpen
      ? customDepartment
      : (selectedJob?.department || "Engineering");

    const targetJobId = isOpen
      ? "open-application"
      : (selectedJob?.id || "open-application");

    try {
      const payload = {
        jobId: targetJobId,
        jobTitle: targetTitle,
        department: targetDept,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        experience: formData.experience,
        portfolioUrl: formData.portfolioUrl,
        resumeUrl: finalResumeUrl,
        coverNote: formData.coverNote,
      };

      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setSubmittedRoleTitle(targetTitle);
        setSubmitted(true);
        setApplicationId(result.applicationId || "APP-" + Date.now().toString().slice(-6));
      } else {
        setErrorMessage(result.message || "Failed to submit application. Please try again.");
      }
    } catch {
      setErrorMessage("Network error. Please verify your connection and try again.");
    } finally {
      setSubmitting(false);
      setUploadStatusText("");
    }
  };

  if (submitted) {
    return (
      <div className="container-x py-20 max-w-3xl mx-auto">
        <div className="card p-8 md:p-12 text-center bg-white shadow-xl border border-zinc-200 rounded-3xl">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            Application Received
          </span>

          <h1 className="text-3xl font-bold text-zinc-900 mt-4">
            Thank you for applying, {formData.name}!
          </h1>

          <p className="text-zinc-600 mt-3 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Your official application for{" "}
            <span className="font-semibold text-zinc-900">
              {submittedRoleTitle || "Open Talent Application"}
            </span>{" "}
            has been registered in our database and forwarded directly to the hiring team.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 inline-block text-left text-xs text-zinc-600">
            <div>
              <span className="font-semibold text-zinc-800">Application Reference ID: </span>
              <span className="font-mono text-amber-800 font-bold">{applicationId}</span>
            </div>
            <div className="mt-1">
              <span className="font-semibold text-zinc-800">Notification Sent To: </span>
              <span>info@sevamanjarilabs.in</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/careers" className="btn-secondary text-xs">
              <ArrowLeft size={14} /> Back to Open Positions
            </Link>
            <Link href="/" className="btn-primary text-xs">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x py-16 lg:py-24 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Header */}
      <div className="mb-8">
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-amber-800 mb-4 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Careers & Open Roles
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="eyebrow">
              {isOpen ? "Open Initiative & Proposal" : "Formal Job Application"}
            </div>
            <h1 className="mt-1 text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">
              {isOpen ? "Submit Open Proposal" : "Submit Your Candidacy"}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-900 border border-amber-200/80 px-3.5 py-2 rounded-2xl font-medium">
            <Building2 size={15} className="text-amber-700" />
            <span>SevaManjari Labs Private Limited</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Job Description / Open Scope Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card p-6 md:p-8 bg-[#1f0505] text-white rounded-3xl shadow-lg border border-amber-900/30">
            {/* Status Badge */}
            {isOpen ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-4">
                <Sparkles size={12} /> Open Talent & Project Proposal
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-4">
                <Lock size={12} /> Target Role Locked to Requisition
              </div>
            )}

            {loadingJobs ? (
              <div className="py-12 text-center text-zinc-400 text-sm">Loading position details...</div>
            ) : isOpen ? (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
                  {customDepartment}
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">
                  {customRoleTitle.trim() || "Open / General Proposal"}
                </h2>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-zinc-200">
                    <MapPin size={13} className="text-amber-400" />
                    Flexible / Remote / Hybrid
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-zinc-200">
                    <Briefcase size={13} className="text-amber-400" />
                    Full-time / Internship / Contract
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-zinc-200">
                    <Clock size={13} className="text-amber-400" />
                    Open to all experience levels
                  </span>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                    Open Proposal Scope
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Don’t see an exact fit among current openings? Tell us what you would like to build. We are always eager to meet motivated engineers, designers, problem solvers, and commercial thinkers.
                  </p>
                </div>

                <div className="mt-5 pt-5 border-t border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                    Areas We Build In
                  </h3>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {[
                      "Full-Stack Web & Next.js Development",
                      "UI/UX Design & Digital Product Experiences",
                      "Marketplace Infrastructure & Logistics Tech",
                      "Mobile App & Progressive Web Engineering",
                      "Business Operations & Partner Outreach",
                    ].map((area, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-amber-400 mt-0.5 shrink-0" />
                        <span>{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-zinc-400 italic">
                  Your proposal will be reviewed directly by the founding team.
                </div>
              </div>
            ) : selectedJob ? (
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
                  {selectedJob.department}
                </span>
                <h2 className="text-2xl font-bold text-white mt-1">{selectedJob.title}</h2>

                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-zinc-200">
                    <MapPin size={13} className="text-amber-400" />
                    {selectedJob.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-zinc-200">
                    <Briefcase size={13} className="text-amber-400" />
                    {selectedJob.type}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-zinc-200">
                    <Clock size={13} className="text-amber-400" />
                    {selectedJob.experience}
                  </span>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                    Role Summary & Scope
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{selectedJob.description}</p>
                </div>

                {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-white/10">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-2">
                      Key Qualifications
                    </h3>
                    <ul className="space-y-1.5 text-xs text-zinc-300">
                      {selectedJob.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 size={13} className="text-amber-400 mt-0.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-zinc-400 italic">
                  Note: The requisition title and JD are locked to verified hiring requisitions.
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-white">General / Open Proposal</h2>
                <p className="text-xs text-zinc-300 mt-2 leading-relaxed">
                  Apply directly to share your engineering, design, or commercial background with our founding leadership team.
                </p>
              </div>
            )}
          </div>

          {/* Hiring Process Card */}
          <div className="card p-6 bg-white border border-zinc-200/90 rounded-3xl">
            <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-700" /> What to expect next
            </h3>
            <ol className="mt-4 space-y-3 text-xs text-zinc-600">
              <li className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>Immediate database registration & receipt confirmation.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <span>Profile screening by team leads within 48–72 hours.</span>
              </li>
              <li className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <span>Direct email or call invitation for hands-on technical discussion.</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Right Column: Formal Candidate Application Form */}
        <div className="lg:col-span-7 card p-6 md:p-8 bg-white border border-zinc-200/90 shadow-sm rounded-3xl">
          <div className="pb-5 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Candidate Information</h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Please provide accurate contact and professional details.
              </p>
            </div>
            <FileText size={22} className="text-amber-800" />
          </div>

          {errorMessage && (
            <div className="mt-4 p-4 rounded-2xl bg-red-50 text-red-800 border border-red-200 flex items-start gap-2.5 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Position Display: Editable custom role for Open Proposal, Locked for specific requisition */}
            {isOpen ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Desired Role / Proposed Title *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Frontend Engineer, UI/UX Designer..."
                      value={customRoleTitle}
                      onChange={(e) => setCustomRoleTitle(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                    <Briefcase size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Department / Area of Expertise *
                  </label>
                  <select
                    value={customDepartment}
                    onChange={(e) => setCustomDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Engineering & Technology">Engineering & Technology</option>
                    <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                    <option value="Product Strategy & Management">Product Strategy & Management</option>
                    <option value="Growth & Digital Marketing">Growth & Digital Marketing</option>
                    <option value="Business Operations & Partnerships">Business Operations & Partnerships</option>
                    <option value="Other / Cross-Functional">Other / Cross-Functional</option>
                  </select>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Applying For Position (Locked Requisition)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={
                      selectedJob
                        ? `${selectedJob.title} — ${selectedJob.department} (${selectedJob.type})`
                        : "Open Talent Application"
                    }
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-zinc-200 bg-zinc-100/80 text-zinc-700 text-xs font-medium cursor-not-allowed font-sans select-none"
                  />
                  <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>
            )}

            {/* Candidate Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Full Legal Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Phone & Current Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Phone / WhatsApp Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                  <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Current City / State *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indore, MP or Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Experience Level & Portfolio/GitHub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Total Relevant Experience *
                </label>
                <select
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="Fresher (0 - 1 years)">Fresher (0 - 1 years)</option>
                  <option value="Junior (1 - 2 years)">Junior (1 - 2 years)</option>
                  <option value="Mid-Level (2 - 4 years)">Mid-Level (2 - 4 years)</option>
                  <option value="Senior (4+ years)">Senior (4+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Portfolio / GitHub / LinkedIn URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://github.com/... or linkedin.com/in/..."
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
                  />
                  <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>
            </div>

            {/* Resume Upload / Link Section */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <label className="block text-xs font-bold text-zinc-800">
                  Resume / Curriculum Vitae (CV) *
                </label>
                <div className="inline-flex items-center gap-1 bg-zinc-200/80 p-0.5 rounded-lg text-[11px] font-medium">
                  <button
                    type="button"
                    onClick={() => setResumeMode("file")}
                    className={`px-3 py-1 rounded-md transition ${
                      resumeMode === "file"
                        ? "bg-white text-zinc-900 shadow-sm font-semibold"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Upload Document (PDF/DOC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeMode("link")}
                    className={`px-3 py-1 rounded-md transition ${
                      resumeMode === "link"
                        ? "bg-white text-zinc-900 shadow-sm font-semibold"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    Paste Link
                  </button>
                </div>
              </div>

              {resumeMode === "file" ? (
                <div>
                  {!selectedFile ? (
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-300 rounded-2xl hover:border-amber-600 hover:bg-amber-50/40 transition cursor-pointer group bg-white">
                      <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                        <UploadCloud size={22} />
                      </div>
                      <span className="text-xs font-semibold text-zinc-800">
                        Click to browse or drop your resume file here
                      </span>
                      <span className="text-[11px] text-zinc-500 mt-1">
                        Accepted: PDF, DOC, DOCX • Max: 10MB (stored securely in our server directory)
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-3.5 rounded-2xl border border-amber-300 bg-amber-50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                          <FileCheck size={20} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-zinc-900 truncate">
                            {selectedFile.name}
                          </p>
                          <p className="text-[11px] text-zinc-600">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • File attached ready to upload
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeSelectedFile}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Remove file"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/... or public PDF link"
                      value={formData.resumeUrl}
                      onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500 font-mono text-xs bg-white"
                    />
                    <Link2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Ensure link sharing permission is set to &quot;Anyone with the link can view&quot;.
                  </p>
                </div>
              )}
            </div>

            {/* Cover Note / Proposal Pitch */}
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                {isOpen
                  ? "Proposal Pitch & Introduction *"
                  : "Brief Cover Note & Relevant Highlights *"}
              </label>
              <textarea
                required
                rows={4}
                placeholder={
                  isOpen
                    ? "Introduce yourself, describe the projects you've built, technical or commercial proficiencies, and what you would like to create with SevaManjari Labs..."
                    : "Introduce yourself, mention key projects you've built, technical proficiencies, or why you'd like to work with SevaManjari Labs..."
                }
                value={formData.coverNote}
                onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 text-sm focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Consent & Submit */}
            <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-[11px] text-zinc-500 max-w-sm">
                By submitting, you certify that the information provided is genuine and consent to evaluation by SevaManjari Labs hiring personnel.
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary py-3 px-6 text-xs w-full sm:w-auto justify-center shadow-lg disabled:opacity-60 flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{uploadStatusText || "Submitting..."}</span>
                  </>
                ) : (
                  <>
                    <Send size={14} /> {isOpen ? "Submit Open Proposal" : "Submit Application"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CareerApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="container-x py-24 text-center text-zinc-500">
          Loading application portal...
        </div>
      }
    >
      <ApplyForm />
    </Suspense>
  );
}
