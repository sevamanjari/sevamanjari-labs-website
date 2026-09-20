import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "SevaManjari Labs Private Limited",
    template: "%s | SevaManjari Labs"
  },
  description:
    "SevaManjari Labs Private Limited builds digital products, technology solutions and marketplaces that connect people, businesses and meaningful services.",
  keywords: ["SevaManjari Labs", "SevaManjari", "IT company", "software development", "digital marketplace"],
  metadataBase: new URL("https://sevamanjarilabs.in"),
  alternates: { canonical: "https://sevamanjarilabs.in" },
  openGraph: {
    title: "SevaManjari Labs Private Limited",
    description: "Building thoughtful digital products and technology solutions.",
    type: "website",
    url: "https://sevamanjarilabs.in"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}