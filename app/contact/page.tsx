import { Mail, Phone, MapPin } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata = { title: "Contact" };

export default function Contact() {
  return (
    <div className="container-x py-24 lg:py-32">
      <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <div className="eyebrow">Contact</div>

          <h1 className="mt-4 text-5xl font-semibold tracking-tight">
            Let&apos;s talk.
          </h1>

          <p className="mt-5 text-lg leading-8 text-zinc-600">
            Whether you have a project, partnership idea, vendor requirement or
            career enquiry, send us a message.
          </p>

          <div className="mt-9 grid gap-5 text-sm">
            <a
              href="mailto:info@sevamanjarilabs.in"
              className="flex items-center gap-3"
            >
              <Mail className="text-amber-700" />
              info@sevamanjarilabs.in
            </a>

            <a
              href="tel:+919103963025"
              className="flex items-center gap-3"
            >
              <Phone className="text-amber-700" />
              +91 91039 63025
            </a>

            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 text-amber-700" />
              Manawar, Dhar, Madhya Pradesh, India
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}