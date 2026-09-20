import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

export const metadata = { title: "Contact" };

export default function Contact() {
  return <div className="container-x py-24 lg:py-32">
    <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
      <div>
        <div className="eyebrow">Contact</div>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight">Let’s talk.</h1>
        <p className="mt-5 text-lg leading-8 text-zinc-600">Whether you have a project, partnership idea, vendor requirement or career enquiry, send us a message.</p>
        <div className="mt-9 grid gap-5 text-sm">
          <a href="mailto:info@sevamanjari.com" className="flex items-center gap-3"><Mail className="text-amber-700"/> info@sevamanjari.com</a>
          <a href="tel:+919103963025" className="flex items-center gap-3"><Phone className="text-amber-700"/> +91 91039 63025</a>
          <div className="flex items-start gap-3"><MapPin className="mt-0.5 text-amber-700"/> Manawar, Dhar, Madhya Pradesh, India</div>
        </div>
      </div>
      <form className="card" action="mailto:info@sevamanjari.com" method="post" encType="text/plain">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">Name<input name="name" required className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none focus:border-amber-600" placeholder="Your name"/></label>
          <label className="grid gap-2 text-sm font-semibold">Email<input name="email" type="email" required className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none focus:border-amber-600" placeholder="you@example.com"/></label>
        </div>
        <label className="mt-5 grid gap-2 text-sm font-semibold">Subject<input name="subject" className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none focus:border-amber-600" placeholder="How can we help?"/></label>
        <label className="mt-5 grid gap-2 text-sm font-semibold">Message<textarea name="message" required rows={7} className="resize-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none focus:border-amber-600" placeholder="Tell us a little about your requirement..."/></label>
        <button className="btn-primary mt-6" type="submit">Send enquiry <ArrowUpRight size={16}/></button>
        <p className="mt-3 text-xs text-zinc-500">The form uses your email client. For production, connect this form to your preferred email/API service.</p>
      </form>
    </div>
  </div>
}