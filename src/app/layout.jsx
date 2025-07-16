import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'OCEANTIC - Elite Swimming Event Organizer',
  description: 'Your premier partner for professional swimming events and competitions. Dive into excellence!',
  keywords: 'swimming events, swimming organizer, swim competition, aquatic events, OCEANTIC',
  author: 'OCEANTIC Team',
  openGraph: {
    title: 'OCEANTIC - Elite Swimming Event Organizer',
    description: 'Your premier partner for professional swimming events and competitions. Dive into excellence!',
    url: 'https://www.your-oceantic-domain.com', // Ganti dengan domain Anda
    siteName: 'OCEANTIC',
    images: [
      {
        url: 'https://www.your-oceantic-domain.com/images/og-image.jpg', // Ganti dengan path gambar OG Anda
        width: 1200,
        height: 630,
        alt: 'OCEANTIC Swimming Events',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}