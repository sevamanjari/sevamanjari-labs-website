import Link from "next/link";
import { ArrowRight, Code2, Megaphone, Handshake, Palette } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

export const metadata = { title: "Careers" };

const roles = [
  [Megaphone, "Business Development Intern", "Lead generation, outreach, project acquisition and relationship building."],
  [Handshake, "Customer / Vendor Onboarding Intern", "Help onboard clients and marketplace sellers and support their journey."],
  [Code2, "Software Development Intern", "Contribute to web applications, APIs, dashboards and product features."],
  [Palette, "Content & Design Intern", "Create social content, product communication and visual assets."]
];

export default function Careers() {
  return <div className="container-x py-24 lg:py-32">
    <SectionHeading eyebrow="Careers" title="Build with us." text="We are creating a young technology company and are open to people who want hands-on experience, ownership and the chance to learn by building." />
    <div className="mt-14 grid gap-5 md:grid-cols-2">
      {roles.map(([Icon,t,d]) => <div key={t as string} className="card"><Icon className="text-amber-700"/><h3 className="mt-5 text-xl font-semibold">{t as string}</h3><p className="mt-3 leading-7 text-zinc-600">{d as string}</p><Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">Apply / enquire <ArrowRight size={15}/></Link></div>)}
    </div>
    <div className="mt-16 rounded-3xl border border-dashed border-zinc-300 p-8"><p className="text-zinc-600">Don’t see a suitable role? Send us your profile and tell us what you would like to build.</p><Link href="/contact" className="btn-secondary mt-5">Contact us</Link></div>
  </div>
}