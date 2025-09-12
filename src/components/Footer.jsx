import Link from 'next/link';
import Image from 'next/image'; // ⬅️ tambahkan import ini

import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer id="footer" className="bg-white text-black py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Logo & Address */}
        <div>
        <Link href="/" className="flex items-center">
       
  <Image 
    src="/images/logo.png" 
    alt="Oceantic Logo" 
    width={100} 
    height={10} 
    priority
    className="block h-auto w-[100px] md:w-[160px] object-contain mr-5" 
  />
   <Image 
    src="/images/logofoundation.png" 
    alt="Oceantic Logo" 
    width={100} 
    height={10} 
    priority
    className="block h-auto w-[100px] md:w-[160px] object-contain" 
  /> 
</Link>
          <p className="mt-3 text-sm leading-relaxed text-black">
            &copy; {new Date().getFullYear()} OCEANTIC. All rights reserved.
          </p>
          <div className="mt-4 space-y-2 text-sm text-black">
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-black" />  
              Skynindo Group Building Lantai
3, JI Dr. Susilo Raya Nomor 23,
Grogol, Grogol Petamburan,
Jakarta Barat, DKI Jakarta 11450
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-black" />  
              +62 895-3650-89206
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-black" />  
              business@oceanticsports.com
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-3">
          <h3 className="text-xl font-semibold mb-3 text-black">Quick Links</h3>
          <Link href="#about-us" className="hover:text-black transition">About Us</Link>
          <Link href="#events" className="hover:text-black transition">Events</Link>
          <Link href="#achievements" className="hover:text-black transition">Achievements</Link>
          <Link href="#testimonials" className="hover:text-black transition">Testimonies</Link>
          <Link href="#contact-us" className="hover:text-black transition">Contact Us</Link>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-black">Follow Us</h3>
          <div className="flex space-x-6 text-2xl">
            <a href="https://www.facebook.com/people/Oceantic-Official/61578010997154/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">
              <FaFacebookF />
            </a>
            <a href="https://www.instagram.com/oceantic_official" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">
              <FaInstagram />
            </a>
            <a href="https://api.whatsapp.com/send/?phone=62895365089206&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">
              <FaWhatsapp />
            </a>
            <a href="https://www.tiktok.com/@oceanticsports" target="_blank" rel="noopener noreferrer" className="hover:text-black transition">
              <FaTiktok />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom line
      <div className="mt-10 border-t  border-gray-500 pt-5 text-center text-sm text-black">
        Designed and Code with ❤️ by Ryansomnia
      </div> */}
    </footer>
  );
}
