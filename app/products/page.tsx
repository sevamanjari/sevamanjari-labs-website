import Link from "next/link";
import { ArrowRight, Store, Search, CreditCard, Truck, Users, Package } from "lucide-react";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Products" };

export default function Products() {
  return <div>
    <section className="container-x py-24 lg:py-32">
      <div className="max-w-4xl">
        <div className="eyebrow">Our flagship product</div>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">SevaManjari</h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-zinc-600">A dedicated marketplace for seva-related products, connecting customers with artists, artisans, makers and specialized sellers.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/contact" className="btn-primary">Partner with us <ArrowRight size={16}/></Link><a href="https://sevamanjarilabs.in" className="btn-secondary">Visit product website <ArrowRight size={16}/></a></div>
      </div>
    </section>
    <section className="bg-zinc-950 py-20 text-white">
      <div className="container-x">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            [Store,"Seller onboarding","Bring creators and specialized sellers onto one focused platform."],
            [Search,"Product discovery","Help customers discover products through focused categories and catalogues."],
            [CreditCard,"Online ordering","A streamlined order and payment experience for customers and sellers."],
            [Package,"Order management","Organize product, order and seller workflows in one system."],
            [Truck,"Logistics integration","Design the platform to support delivery and fulfilment workflows."],
            [Users,"Creator ecosystem","Give artists and artisans a digital route to reach customers across India."]
          ].map(([I,t,d]) => <Reveal key={t as string}><div className="rounded-3xl border border-white/10 bg-white/5 p-6"><I className="text-amber-400"/><h3 className="mt-5 text-xl font-semibold">{t as string}</h3><p className="mt-3 leading-7 text-zinc-400">{d as string}</p></div></Reveal>)}
        </div>
      </div>
    </section>
    <section className="container-x py-24">
      <div className="mx-auto max-w-3xl text-center"><div className="eyebrow">The opportunity</div><h2 className="section-title">A focused platform for a focused community.</h2><p className="mt-5 text-lg leading-8 text-zinc-600">SevaManjari is being developed to make discovery easier for customers and digital reach more accessible for sellers who create or specialize in seva-related products.</p></div>
    </section>
  </div>
}