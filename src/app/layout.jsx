import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AuthWrapper from "../components/AuthWrapper"; // client wrapper

export const metadata = {
  title: "OCEANTIC - Elite Swimming Event Organizer",
  description:
    "Your premier partner for professional swimming events and competitions. Dive into excellence!",
  keywords:
    "swimming events, swimming organizer, swim competition, aquatic events, OCEANTIC",
  author: "OCEANTIC Team",
  openGraph: {
    title: "OCEANTIC - Elite Swimming Event Organizer",
    description:
      "Your premier partner for professional swimming events and competitions. Dive into excellence!",
    url: "https://oceanticsports.com", // Ganti dengan domain Anda
    siteName: "OCEANTIC",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "OCEANTIC Swimming Events",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <AuthWrapper>
          <main>{children}</main>
        </AuthWrapper>
        <Footer />
      </body>
    </html>
  );
}
