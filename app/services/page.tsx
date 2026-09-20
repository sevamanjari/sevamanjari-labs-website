import Link from "next/link";
import { ArrowRight, Code2, Smartphone, Database, Cloud, ShoppingBag, Settings2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export const metadata = { title: "Services" };

const services = [
  [Code2, "Web Development", "Corporate websites, portals, dashboards and custom web applications using modern frameworks."],
  [Smartphone, "Application Development", "Mobile-first digital products and application experiences designed around real workflows."],
  [Database, "Business Software", "MIS, management systems, data-driven dashboards and workflow automation."],
  [ShoppingBag, "E-commerce & Marketplaces", "Multi-vendor commerce, product discovery, onboarding, order and payment workflows."],
  [Cloud, "Cloud & Deployment", "Application deployment, server setup, performance and scalable infrastructure."],
  [Settings2, "Technology Consulting", "Architecture, product planning and technical direction for new and existing products."]
];

export default function Services() {
  return <div className="container-x py-24 lg:py-32">
    <SectionHeading eyebrow="Services" title="Build, launch and improve your digital product." text="Flexible technology services for businesses, organizations and founders who want to move from an idea or manual process to a digital system." />
    <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {services.map(([Icon,title,desc],i) => <Reveal key={title as string} delay={i*.04}><div className="card h-full"><Icon className="text-amber-700"/><h3 className="mt-6 text-xl font-semibold">{title as string}</h3><p className="mt-3 leading-7 text-zinc-600">{desc as string}</p></div></Reveal>)}
    </div>
    <div className="mt-20 rounded-[2rem] bg-zinc-950 p-8 text-white sm:p-12">
      <h2 className="text-3xl font-semibold">Have a specific requirement?</h2>
      <p className="mt-3 max-w-2xl text-zinc-400">Share your requirements and we can discuss scope, technology, timeline and the right way to build it.</p>
      <Link href="/contact" className="btn-primary mt-7">Discuss your project <ArrowRight size={16}/></Link>
    </div>
  </div>
}