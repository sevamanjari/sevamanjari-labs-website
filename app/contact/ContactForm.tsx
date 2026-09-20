"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("sending");
    setStatusMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to send your enquiry.");
      }

      setStatus("success");
      setStatusMessage(
        data.message || "Thank you. Your enquiry has been sent successfully."
      );

      form.reset();
    } catch (error) {
      setStatus("error");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "Unable to send your enquiry. Please try again."
      );
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold">
          Name
          <input
            name="name"
            required
            maxLength={100}
            className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none focus:border-amber-600"
            placeholder="Your name"
          />
        </label>

        <label className="grid gap-2 text-sm font-semibold">
          Email
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none focus:border-amber-600"
            placeholder="you@example.com"
          />
        </label>
      </div>

      <label className="mt-5 grid gap-2 text-sm font-semibold">
        Phone Number
            <input
                name="phone"
                type="tel"
                required
                maxLength={20}
                className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none focus:border-amber-600"
                placeholder="+91 98765 43210"
            />
        </label>

      <label className="mt-5 grid gap-2 text-sm font-semibold">
        Subject
        <input
          name="subject"
          maxLength={200}
          className="rounded-2xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none focus:border-amber-600"
          placeholder="How can we help?"
        />
      </label>

      <label className="mt-5 grid gap-2 text-sm font-semibold">
        Message
        <textarea
          name="message"
          required
          maxLength={5000}
          rows={7}
          className="resize-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 font-normal outline-none focus:border-amber-600"
          placeholder="Tell us a little about your requirement..."
        />
      </label>

      <button
        className="btn-primary mt-6 disabled:cursor-not-allowed disabled:opacity-60"
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending..." : "Send enquiry"}
        <ArrowUpRight size={16} />
      </button>

      {statusMessage && (
        <p
          className={`mt-4 text-sm ${
            status === "success" ? "text-green-700" : "text-red-700"
          }`}
          role="status"
        >
          {statusMessage}
        </p>
      )}

      <p className="mt-3 text-xs text-zinc-500">
        By submitting this form, you agree that SevaManjari Labs may contact
        you regarding your enquiry.
      </p>
    </form>
  );
}