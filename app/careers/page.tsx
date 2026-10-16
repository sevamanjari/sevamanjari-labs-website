import Link from "next/link";
import { ArrowRight, Briefcase, MapPin, Clock, CheckCircle2 } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { getAllJobs } from "@/lib/db";

export const metadata = { title: "Careers" };
export const revalidate = 60;

export default async function Careers() {
  const allJobs = await getAllJobs();
  const activeJobs = allJobs.filter((j) => j.status === "active");

  return (
    <div className="container-x py-24 lg:py-32">
      <SectionHeading
        eyebrow="Careers"
        title="Build with us."
        text="We are creating a young technology company and are open to people who want hands-on experience, ownership and the chance to learn by building."
      />

      <div className="mt-14">
        {activeJobs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-300 p-12 text-center">
            <h3 className="text-xl font-bold text-zinc-800">No Open Vacancies Right Now</h3>
            <p className="mt-2 text-zinc-600">
              We don&apos;t have active listings at this moment, but we are always eager to meet talented developers, designers, and thinkers.
            </p>
            <Link href="/careers/apply?jobId=open" className="btn-primary mt-6">
              Send an open application
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {activeJobs.map((job) => (
              <div
                key={job.id}
                className="card flex flex-col justify-between hover:border-amber-400 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      {job.department}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
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
                    <div className="mt-5 pt-4 border-t border-zinc-100">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                        Key Requirements
                      </span>
                      <ul className="space-y-1.5 text-xs text-zinc-600">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 size={13} className="mt-0.5 text-amber-700 shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
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
        )}
      </div>

      <div className="mt-16 rounded-3xl border border-dashed border-zinc-300 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="font-bold text-zinc-900 text-lg">Don’t see a suitable role?</h4>
          <p className="text-zinc-600 text-sm mt-1">
            Send us your profile, share your GitHub or portfolio, and tell us what you would like to build.
          </p>
        </div>
        <Link href="/careers/apply?jobId=open" className="btn-secondary whitespace-nowrap">
          Send open proposal
        </Link>
      </div>
    </div>
  );
}