import Link from "next/link";
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  Code2,
  Laptop,
  Award,
  CheckCircle2,
  Users,
  Rocket,
  Layers,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  FileCheck,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { getAllJobs } from "@/lib/db";

export const metadata = {
  title: "Internship Program | SevaManjari Labs",
  description:
    "Join the SevaManjari Labs Internship Program. Gain real-world software engineering, UI/UX, and product experience with 1-on-1 mentorship, modern technology, and PPO opportunities.",
};

export const revalidate = 60;

const benefits = [
  {
    icon: Rocket,
    title: "Real Production Impact",
    description:
      "Work directly on live products, platforms, and architectures rather than dummy or throwaway assignments. What you build gets used by real people.",
  },
  {
    icon: Users,
    title: "1-on-1 Mentorship",
    description:
      "Receive regular code reviews, architectural advice, and professional guidance directly from seasoned developers and founders.",
  },
  {
    icon: Code2,
    title: "Modern Tech Stack",
    description:
      "Gain deep practical exposure to Next.js 15, React, TypeScript, Node.js, Tailwind CSS, MongoDB, and cloud infrastructure.",
  },
  {
    icon: Award,
    title: "Certificate & Verified Recommendation",
    description:
      "Receive an official completion certificate, college project documentation/NOC verification, and recommendations highlighting your achievements.",
  },
  {
    icon: Laptop,
    title: "Flexible Work Modes",
    description:
      "Work remotely from anywhere in India, or join our hybrid team in Manawar, Madhya Pradesh. Schedules are structured to support your college commitments.",
  },
  {
    icon: FileCheck,
    title: "PPO & Fast-track Hiring",
    description:
      "Exceptional interns are given priority for Pre-Placement Offers (PPOs) and full-time software engineering and product roles upon completion.",
  },
];

const tracks = [
  {
    icon: Code2,
    title: "Frontend Engineering",
    description:
      "Craft high-performance, accessible, and responsive user interfaces with Next.js, React, Tailwind CSS, and TypeScript.",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Web Performance"],
  },
  {
    icon: Layers,
    title: "Backend & Systems",
    description:
      "Build secure RESTful APIs, manage databases, implement authentication workflows, and deploy cloud infrastructure.",
    tags: ["Node.js", "Express / Next API", "MongoDB", "Auth & Security", "REST APIs"],
  },
  {
    icon: Laptop,
    title: "UI/UX & Product Design",
    description:
      "Design clean user journeys, wireframes, and design systems in Figma that translate complex real-world workflows into intuitive apps.",
    tags: ["Figma", "UI/UX Design", "Wireframing", "User Research", "Design Systems"],
  },
  {
    icon: Rocket,
    title: "Product & Digital Operations",
    description:
      "Help manage product roadmaps, coordinate seller and artisan onboarding, perform QA testing, and drive user engagement.",
    tags: ["Product Management", "QA Testing", "User Operations", "Analytics"],
  },
];

const steps = [
  {
    step: "01",
    title: "Apply Online",
    text: "Submit your details along with your GitHub profile, portfolio, or resume explaining what you want to learn.",
  },
  {
    step: "02",
    title: "Technical Discussion",
    text: "A friendly 30-minute conversation to discuss your fundamentals, previous projects, and enthusiasm for building.",
  },
  {
    step: "03",
    title: "Offer & Onboarding",
    text: "Receive your internship offer letter, get paired with a mentor, and access our engineering repositories and tools.",
  },
  {
    step: "04",
    title: "Build, Ship & Grow",
    text: "Participate in real project sprints, receive regular feedback on your pull requests, and ship tangible features.",
  },
];

const faqs = [
  {
    q: "Who is eligible to apply for an internship?",
    a: "We welcome undergraduate and graduate students (B.Tech, BCA, MCA, B.Sc, or equivalent) as well as self-taught builders who possess solid fundamentals and genuine passion for software development and design.",
  },
  {
    q: "What is the typical duration of an internship?",
    a: "Our internships typically range from 2 to 6 months depending on your university requirements and mutual availability. Timings can be coordinated around exam schedules.",
  },
  {
    q: "Is the internship remote or on-site?",
    a: "We offer both remote internships across India and on-site / hybrid options at our registered office in Manawar, Dhar, Madhya Pradesh.",
  },
  {
    q: "Do you provide college project credits or NOC assistance?",
    a: "Yes. We provide official internship offer letters, periodic evaluations, mentor sign-offs, and final project completion certificates necessary for your university requirements.",
  },
  {
    q: "Is there a stipend provided?",
    a: "Yes, we offer performance-linked stipends to dedicated contributors based on role, technical capability, and time commitment.",
  },
];

export default async function InternshipPage() {
  const allJobs = await getAllJobs();
  const internshipJobs = allJobs.filter(
    (j) =>
      j.status === "active" &&
      (j.type.toLowerCase().includes("intern") || j.title.toLowerCase().includes("intern"))
  );

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="brand-grid relative border-b border-zinc-200/80 bg-gradient-to-b from-[#fffaf2] to-amber-50/30 py-20 lg:py-28">
        <div className="container-x relative">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100/70 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900">
              <GraduationCap size={15} />
              SevaManjari Labs Internship Program
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl text-zinc-950">
              Learn by building. <br />
              <span className="text-[#8b0000]">Kickstart your career</span> with real-world tech.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">
              Gain hands-on software development, design, and product experience. Work directly on production codebases, collaborate with experienced builders, and shape impactful digital solutions.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/careers/apply?jobId=open&role=Internship"
                className="btn-primary"
              >
                Apply for Internship <ArrowRight size={16} />
              </Link>
              <a href="#tracks" className="btn-secondary">
                Explore Tracks & Domains
              </a>
            </div>

            {/* Quick Stat Highlights */}
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
              {[
                ["100% Real", "Production projects"],
                ["1-on-1", "Mentor guidance"],
                ["Verifiable", "Certificates & NOC"],
                ["Fast-track", "PPO Opportunities"],
              ].map(([top, bottom], idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
                >
                  <div className="text-xl font-bold text-zinc-950 sm:text-2xl">{top}</div>
                  <div className="text-xs font-medium text-zinc-500 mt-0.5">{bottom}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why Intern Section */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeading
          eyebrow="Why Join Us"
          title="Everything you need to grow into a confident engineer."
          text="We know that the best learning happens by solving real problems. Here is what you can expect during your internship at SevaManjari Labs."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <Reveal key={b.title} delay={idx * 0.05}>
                <div className="card h-full flex flex-col justify-between hover:border-amber-400 transition-colors">
                  <div>
                    <div className="inline-flex rounded-xl bg-amber-50 p-3 text-amber-800 border border-amber-200/70">
                      <Icon size={24} />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-zinc-900">{b.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-zinc-600">{b.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Internship Tracks */}
      <section id="tracks" className="border-y border-zinc-200 bg-white/70 py-20 lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Specialization Tracks"
            title="Choose your domain of interest."
            text="Whether your passion lies in visual interfaces, scalable server architectures, or product thinking, we have hands-on opportunities for you."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {tracks.map((t, idx) => {
              const Icon = t.icon;
              return (
                <Reveal key={t.title} delay={idx * 0.06}>
                  <div className="card h-full p-8 border border-zinc-200/90 hover:border-amber-500 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-[#210606] p-2.5 text-amber-400">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-zinc-900">{t.title}</h3>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-zinc-600">{t.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {t.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Listings / Open Application Section */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeading
          eyebrow="Opportunities"
          title="Open Internship Positions"
          text="Explore currently listed vacancies or submit an open application tailored to your interests."
        />

        <div className="mt-12">
          {internshipJobs.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {internshipJobs.map((job) => (
                <div
                  key={job.id}
                  className="card flex flex-col justify-between border-amber-200/90 hover:border-amber-500 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                        {job.department}
                      </span>
                      <span className="rounded-full bg-amber-100 px-3 py-0.5 text-xs font-semibold text-amber-950 border border-amber-300">
                        {job.type}
                      </span>
                    </div>

                    <h3 className="mt-4 text-2xl font-bold text-zinc-900">{job.title}</h3>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-amber-700" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-amber-700" />
                        {job.experience}
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-zinc-600">{job.description}</p>

                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mt-5 border-t border-zinc-100 pt-4">
                        <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                          Key Requirements
                        </span>
                        <ul className="space-y-1.5 text-xs text-zinc-600">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 size={13} className="mt-0.5 text-amber-700 shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 border-t border-zinc-100 pt-4">
                    <Link
                      href={`/careers/apply?jobId=${job.id}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-950 hover:text-amber-800 transition"
                    >
                      Apply for this role <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-amber-300 bg-amber-50/40 p-10 text-center sm:p-14">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#210606] text-amber-400">
                <Sparkles size={26} />
              </div>
              <h3 className="mt-5 text-2xl font-bold text-zinc-900">
                Open Applications Are Welcome!
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-600">
                While we don&apos;t have a restricted roster of fixed seats right now, we are continuously onboarding motivated interns across Engineering, Design, and Product. Send your open proposal and show us what you&apos;ve built.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-4">
                <Link
                  href="/careers/apply?jobId=open&role=Internship"
                  className="btn-primary"
                >
                  Submit Open Internship Application <Send size={16} />
                </Link>
                <Link href="/careers" className="btn-secondary">
                  View Full Careers Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="bg-zinc-950 py-20 text-white lg:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Application Process"
            title="How our internship selection works."
            text="A transparent, straightforward process designed to understand your passion and fundamentals rather than dry memorization."
          />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, idx) => (
              <Reveal key={s.step} delay={idx * 0.05}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-amber-400 font-mono">
                      {s.step}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">{s.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container-x py-20 lg:py-28">
        <SectionHeading
          eyebrow="Common Questions"
          title="Frequently Asked Questions"
          text="Got questions about our internship structure, duration, or eligibility? Here are quick answers."
        />

        <div className="mt-12 max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <h4 className="flex items-start gap-2.5 font-bold text-zinc-900 text-base">
                <HelpCircle size={18} className="mt-0.5 text-amber-700 shrink-0" />
                {faq.q}
              </h4>
              <p className="mt-3 pl-7 text-sm leading-7 text-zinc-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="container-x pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-[#210606] to-[#450a0a] p-10 text-white sm:p-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Start Your Journey
            </div>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl text-white">
              Ready to learn by building real products?
            </h2>
            <p className="mt-3 max-w-xl text-zinc-300 text-sm leading-6">
              Join SevaManjari Labs as an intern. Work on real production challenges, level up your engineering skills, and launch your software career.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <Link
              href="/careers/apply?jobId=open&role=Internship"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-400 px-7 py-3.5 text-sm font-bold text-zinc-950 transition hover:bg-amber-300"
            >
              Apply for Internship <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

