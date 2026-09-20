import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { Target, Lightbulb, Users, ShieldCheck } from "lucide-react";

export const metadata = { title: "About" };

export default function About() {
  return <div>
    <section className="container-x py-24 lg:py-32">
      <SectionHeading eyebrow="About SevaManjari Labs" title="A technology company focused on useful, thoughtful digital products." text="We are building a product-led technology company from India, combining software engineering with practical understanding of businesses and communities." />
    </section>
    <section className="border-y border-zinc-200 bg-white py-20">
      <div className="container-x grid gap-8 md:grid-cols-2">
        {[
          [Target, "Our mission", "Create technology that solves meaningful problems and makes digital experiences simpler, more accessible and more useful."],
          [Lightbulb, "Our approach", "Start from the user's problem, validate the workflow, build simply, and improve continuously."],
          [Users, "Our people", "We bring together technology, product thinking, design and business development to create complete digital solutions."],
          [ShieldCheck, "Our values", "Reliability, transparency, continuous learning and responsible technology guide the way we build."]
        ].map(([Icon,t,d]) => <Reveal key={t as string}><div className="card"><Icon className="text-amber-700"/><h3 className="mt-5 text-2xl font-semibold">{t as string}</h3><p className="mt-3 leading-8 text-zinc-600">{d as string}</p></div></Reveal>)}
      </div>
    </section>
    <section className="container-x py-24">
      <div className="grid gap-12 lg:grid-cols-2">
        <div><div className="eyebrow">Our direction</div><h2 className="section-title">From services to products.</h2></div>
        <p className="text-lg leading-8 text-zinc-600">Our foundation is software and digital services. Our long-term direction is to create proprietary products that can serve larger communities while continuing to solve technology problems for businesses.</p>
      </div>
    </section>
  </div>
}