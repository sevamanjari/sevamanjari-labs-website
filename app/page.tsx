import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Store,
  Code2,
  Workflow,
  Globe2,
  CheckCircle2,
} from "lucide-react";

import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const highlights = [
  {
    number: "01",
    title: "Product thinking",
    description:
      "We start with the problem, understand the people involved, and design the right digital experience.",
  },
  {
    number: "02",
    title: "Modern technology",
    description:
      "Scalable websites, web applications, platforms and integrations built with modern technology.",
  },
  {
    number: "03",
    title: "Purpose-led products",
    description:
      "We focus on usability, practical impact and long-term value rather than technology for its own sake.",
  },
];

const services = [
  {
    icon: Code2,
    title: "Web & App Development",
    description:
      "Responsive websites, web applications and custom digital products designed for modern businesses.",
  },
  {
    icon: Workflow,
    title: "Business Solutions",
    description:
      "Digital systems that simplify operations, data management and everyday business workflows.",
  },
  {
    icon: Store,
    title: "Marketplace Platforms",
    description:
      "Seller onboarding, catalogues, orders, payments and logistics experiences for marketplace businesses.",
  },
  {
    icon: Globe2,
    title: "Digital Experiences",
    description:
      "Brand websites and digital experiences designed to communicate clearly and convert visitors into users.",
  },
];

const capabilities = [
  "Product strategy",
  "UI/UX design",
  "Web development",
  "Mobile-ready experiences",
  "Business automation",
  "Marketplace technology",
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="brand-grid relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-red-100/50 blur-3xl" />

        <div className="container-x relative grid min-h-[calc(100vh-80px)] items-center gap-14 py-20 lg:grid-cols-[1.05fr_.95fr]">
          <Reveal>
            <div className="eyebrow flex items-center gap-2">
              <Sparkles size={14} />
              Technology with purpose
            </div>

            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              We build digital products that{" "}
              <span className="text-[#8b0000]">move ideas forward.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600">
              SevaManjari Labs is a technology company creating modern
              software, digital platforms and products designed around
              real-world needs.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">
                Explore our product
                <ArrowRight size={17} />
              </Link>

              <Link href="/contact" className="btn-secondary">
                Work with us
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#8b0000]" />
                Built in India
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#8b0000]" />
                Digital products
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#8b0000]" />
                Scalable technology
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative mx-auto w-full max-w-lg">
              <div className="overflow-hidden rounded-[3rem] border border-zinc-200 bg-white p-3 shadow-soft">
                <Image
                  src="/hero-graphic.svg"
                  alt="SevaManjari Labs digital technology"
                  width={900}
                  height={700}
                  className="h-auto w-full rounded-[2.5rem]"
                  priority
                />
              </div>

              <div className="absolute -bottom-5 left-5 rounded-2xl border border-zinc-200 bg-white px-5 py-3 shadow-soft">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                  SevaManjari Labs
                </div>

                <div className="mt-1 text-sm font-semibold">
                  Products · Platforms · Technology
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="border-y border-zinc-200 bg-white">
        <div className="container-x grid gap-8 py-12 sm:grid-cols-3">
          {highlights.map((item) => (
            <Reveal key={item.number}>
              <div>
                <span className="text-sm font-bold text-[#8b0000]">
                  {item.number}
                </span>

                <h3 className="mt-3 text-xl font-semibold">
                  {item.title}
                </h3>

                <p className="mt-2 leading-7 text-zinc-600">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-x py-24">
        <SectionHeading
          eyebrow="What we do"
          title="Technology that fits the way your business works."
          text="From websites and custom software to marketplace infrastructure, we turn business requirements into usable digital experiences."
        />

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Reveal key={service.title}>
                <div className="card h-full">
                  <Icon className="text-[#8b0000]" size={26} />

                  <h3 className="mt-6 text-xl font-semibold">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-zinc-600">
                    {service.description}
                  </p>

                  <Link
                    href="/services"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:text-[#8b0000]"
                  >
                    Learn more
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* PRODUCT */}
      <section className="relative overflow-hidden bg-zinc-950 py-24 text-white">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-red-900/20 blur-3xl" />

        <div className="container-x relative grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal>
            <div className="eyebrow text-amber-400">
              Flagship product
            </div>

            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Meet SevaManjari — a marketplace built around seva.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              A focused digital platform designed to help customers discover
              seva-related products while giving artists, artisans and makers
              a digital route to customers across India.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2
                  size={18}
                  className="text-amber-400"
                />
                Digital marketplace
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2
                  size={18}
                  className="text-amber-400"
                />
                Seller ecosystem
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2
                  size={18}
                  className="text-amber-400"
                />
                Product discovery
              </div>

              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <CheckCircle2
                  size={18}
                  className="text-amber-400"
                />
                India-focused
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Link
              href="/products"
              className="btn-primary whitespace-nowrap"
            >
              Discover SevaManjari
              <ArrowRight size={17} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section className="container-x py-24">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="Our capabilities"
              title="From an idea to a working digital product."
              text="We combine product thinking, design and engineering to help businesses move from an early idea to a useful digital experience."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-3 sm:grid-cols-2">
              {capabilities.map((capability) => (
                <div
                  key={capability}
                  className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
                    <CheckCircle2
                      size={18}
                      className="text-[#8b0000]"
                    />
                  </div>

                  <span className="font-medium">
                    {capability}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMPANY */}
      <section className="border-y border-zinc-200 bg-[#fffaf2]">
        <div className="container-x grid gap-12 py-24 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <div className="eyebrow">SevaManjari Labs</div>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Building technology from India for the next generation.
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
                We are building a technology company around practical
                digital products, thoughtful experiences and platforms
                that can create meaningful value for users and businesses.
              </p>

              <Link
                href="/about"
                className="btn-secondary mt-8"
              >
                Learn about us
                <ArrowRight size={17} />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-soft sm:p-10">
              <div className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Our approach
              </div>

              <div className="mt-8 space-y-7">
                <div>
                  <h3 className="text-xl font-semibold">
                    Simple
                  </h3>

                  <p className="mt-2 leading-7 text-zinc-600">
                    We remove unnecessary complexity and focus on what
                    users actually need.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    Useful
                  </h3>

                  <p className="mt-2 leading-7 text-zinc-600">
                    Technology should solve real problems and make
                    everyday experiences better.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold">
                    Built to grow
                  </h3>

                  <p className="mt-2 leading-7 text-zinc-600">
                    We think about maintainability, scalability and
                    future possibilities from the beginning.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#8b0000] p-8 text-white sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-200">
                  Have a project?
                </div>

                <h2 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-4xl">
                  Let&apos;s turn your idea into something people can use.
                </h2>

                <p className="mt-4 max-w-2xl text-red-100">
                  Tell us what you are building, what problem you are
                  solving, and where you want to go next.
                </p>
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#8b0000] transition hover:bg-amber-100"
              >
                Talk to SevaManjari Labs
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}