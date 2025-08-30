import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaWhatsapp,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-sky-700 via-sky-600 to-sky-700 text-white">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-wide hover:text-aqua-accent transition duration-300"
          >
            OCEANTIC
          </Link>
          <p className="mt-3 text-sm text-gray-200 leading-relaxed max-w-sm mx-auto md:mx-0">
            Event organizer olahraga renang untuk semua kalangan. Membawa
            semangat, sportivitas, dan prestasi ke tingkat berikutnya.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-aqua-accent">
            Navigasi
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                href="/about"
                className="hover:text-aqua-accent transition duration-300"
              >
                Tentang Kami
              </Link>
            </li>
            <li>
              <Link
                href="/events"
                className="hover:text-aqua-accent transition duration-300"
              >
                Event
              </Link>
            </li>
            <li>
              <Link
                href="#/achievements"
                className="hover:text-aqua-accent transition duration-300"
              >
                Prestasi
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-aqua-accent transition duration-300"
              >
                Kontak
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-aqua-accent">
            Ikuti Kami
          </h4>
          <div className="flex justify-center md:justify-start space-x-5">
            <a
              href="https://www.facebook.com/people/Oceantic-Official/61578010997154/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-aqua-accent hover:text-sky-900 transition duration-300"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://www.instagram.com/oceantic_official"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-aqua-accent hover:text-sky-900 transition duration-300"
            >
              <FaInstagram />
            </a>
            <a
              href="https://api.whatsapp.com/send/?phone=62895365089206&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-aqua-accent hover:text-sky-900 transition duration-300"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://www.tiktok.com/@oceanticsports"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-aqua-accent hover:text-sky-900 transition duration-300"
            >
              <FaTiktok />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/20 mt-8 py-4 text-center text-sm text-gray-200">
        &copy; {new Date().getFullYear()} OCEANTIC. Semua Hak Dilindungi.
      </div>
    </footer>
  );
}
