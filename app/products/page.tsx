import Link from "next/link";
import { ArrowRight, Store, Search, CreditCard, Truck, Users, Package, ExternalLink, Sparkles } from "lucide-react";
import Reveal from "@/components/Reveal";
import { getAllProjects } from "@/lib/db";

export const metadata = { title: "Products & Projects" };
export const revalidate = 60;

export default async function Products() {
  const allProjects = await getAllProjects();

  return (
    <div>
      {/* Hero Section */}
      <section className="container-x py-24 lg:py-32">
        <div className="max-w-4xl">
          <div className="eyebrow">Our flagship product</div>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight sm:text-6xl">SevaManjari</h1>
          <p className="mt-6 max-w-3xl text-xl leading-9 text-zinc-600">
            A dedicated marketplace for seva-related products, connecting customers with artists, artisans, makers and specialized sellers.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">
              Partner with us <ArrowRight size={16} />
            </Link>
            <a href="https://sevamanjarilabs.in" target="_blank" rel="noreferrer" className="btn-secondary">
              Visit product website <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Flagship Features */}
      <section className="bg-zinc-950 py-20 text-white">
        <div className="container-x">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              [Store, "Seller onboarding", "Bring creators and specialized sellers onto one focused platform."],
              [Search, "Product discovery", "Help customers discover products through focused categories and catalogues."],
              [CreditCard, "Online ordering", "A streamlined order and payment experience for customers and sellers."],
              [Package, "Order management", "Organize product, order and seller workflows in one system."],
              [Truck, "Logistics integration", "Design the platform to support delivery and fulfilment workflows."],
              [Users, "Creator ecosystem", "Give artists and artisans a digital route to reach customers across India."],
            ].map(([Icon, title, desc]) => (
              <Reveal key={title as string}>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <Icon className="text-amber-400" />
                  <h3 className="mt-5 text-xl font-semibold">{title as string}</h3>
                  <p className="mt-3 leading-7 text-zinc-400">{desc as string}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Projects & Portfolio Section */}
      {allProjects.length > 0 && (
        <section className="container-x py-24 border-t border-zinc-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="eyebrow flex items-center gap-1.5">
                <Sparkles size={14} /> Technology Portfolio
              </div>
              <h2 className="section-title">Projects & Digital Solutions</h2>
              <p className="mt-4 text-zinc-600 max-w-xl">
                Explore our current portfolio of in-house products, client technology builds, and automated platforms.
              </p>
            </div>
            <Link href="/contact" className="btn-secondary self-start md:self-auto">
              Discuss a project
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((proj) => (
              <div
                key={proj.id}
                className="card flex flex-col justify-between hover:border-amber-400 transition"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 mb-3">
                    <span className="uppercase tracking-wider text-amber-800">{proj.category}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full ${
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

                  <h3 className="text-xl font-bold text-zinc-900">{proj.title}</h3>
                  <p className="text-xs font-medium text-zinc-500 mt-1">Client: {proj.client}</p>

                  <p className="mt-3 text-sm leading-relaxed text-zinc-600">{proj.summary}</p>

                  {proj.tags && proj.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {proj.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {proj.link && proj.link !== "#" && (
                  <div className="mt-6 pt-4 border-t border-zinc-100">
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950"
                    >
                      Visit Project <ExternalLink size={13} />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Community / Mission statement */}
      <section className="container-x py-20 border-t border-zinc-200">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow">The opportunity</div>
          <h2 className="section-title">A focused platform for a focused community.</h2>
          <p className="mt-5 text-lg leading-8 text-zinc-600">
            SevaManjari is being developed to make discovery easier for customers and digital reach more accessible for sellers who create or specialize in seva-related products.
          </p>
        </div>
      </section>
    </div>
  );
}