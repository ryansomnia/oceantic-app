'use client'; // Menandakan bahwa ini adalah Client Component

import Link from 'next/link';
import { useState, useEffect } from 'react'; // Import useState dan useEffect

export default function Navbar() {
  // Simulasikan status login. Dalam aplikasi nyata, ini akan datang dari context/global state.
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Default: belum login
  const [username, setUsername] = useState(''); // Placeholder untuk username
  // State baru untuk mengelola visibilitas menu mobile (hamburger menu)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Efek untuk mensimulasikan cek status login saat komponen dimuat
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');

    if (loggedInStatus === 'true' && storedUsername) {
      setIsUserLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsUserLoggedIn(false);
      setUsername('');
    }
  }, []);

  // Fungsi untuk mensimulasikan login/logout (hanya untuk testing di frontend)
  const handleLoginToggle = () => {
    if (isUserLoggedIn) {
      // Logout
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
      setIsUserLoggedIn(false);
      setUsername('');
      setIsMobileMenuOpen(false); // Tutup menu mobile saat logout
      // Opsional: Redirect ke halaman utama setelah logout
      window.location.href = '/';
    } else {
      // Login (contoh)
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', 'Heriyanto Sitorus'); // Menggunakan nama lengkap Anda
      setIsUserLoggedIn(true);
      setUsername('Heriyanto Sitorus');
      setIsMobileMenuOpen(false); // Tutup menu mobile saat login
    }
  };

  // Fungsi untuk menutup menu mobile saat link diklik
  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center relative">
        {/* <img src="/images/logo.png" alt="OCEANTIC Team" className="mt-10 rounded-lg shadow-lg mx-auto h-1" /> */}

        {/* <img src='/images/swim.png'/> */}
        <Link href="/" className="text-black text-3xl font-bold">
          OCEANTIC
        </Link>

        {/* Tombol Hamburger Menu (hanya terlihat di mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-black focus:outline-none"
          aria-label="Toggle navigation"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            )}
          </svg>
        </button>

        {/* Daftar Navigasi */}
        <ul
          className={`
            md:flex md:flex-row md:items-center md:space-x-4 md:space-y-0 
            absolute md:static top-full left-0 w-full md:w-auto 
            bg-white md:bg-transparent shadow-lg md:shadow-none 
            py-4 md:py-0 px-4 md:px-0 z-40 
            overflow-hidden transition-all duration-500 ease-in-out
            ${isMobileMenuOpen ? 'flex flex-col max-h-screen opacity-100 space-y-2' : 'hidden max-h-0 opacity-0'}
            md:!flex md:!max-h-none md:!opacity-100
          `}
        >
          {isUserLoggedIn ? (
            // Tampilan jika sudah login
            <>
              <li>
                <span className="text-black py-2 px-3 inline-block">Halo, {username}!</span>
              </li>
              <li>
                <Link href="#events" className="text-black hover:text-sky-300 transition duration-300 py-2 px-3 inline-block w-full text-center" onClick={handleNavLinkClick}>
                  Events
                </Link>
              </li>
              <li>
                <Link href="/myProfile" className="text-black hover:text-sky-300 transition duration-300 py-2 px-3 inline-block w-full text-center" onClick={handleNavLinkClick}>
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/my-achievement" className="text-black hover:text-sky-300 transition duration-300 py-2 px-3 inline-block w-full text-center" onClick={handleNavLinkClick}>
                  My Achievement
                </Link>
              </li>
              <li>
                <Link href="/my-data" className="text-black hover:text-sky-300 transition duration-300 py-2 px-3 inline-block w-full text-center" onClick={handleNavLinkClick}>
                  My Data
                </Link>
              </li>
              <li>
                <button
                  onClick={() => { handleLoginToggle(); handleNavLinkClick(); }}
                  className="bg-red-500 px-4 py-2 rounded-md text-white hover:bg-red-700 transition duration-300 whitespace-nowrap w-full text-center"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            // Tampilan jika belum login
            <>
              <li>
                <Link href="#about-us" className="text-black hover:text-sky-300 transition duration-300 py-2 px-3 inline-block w-full text-center" onClick={handleNavLinkClick}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#events" className="text-black hover:text-sky-300 transition duration-300 py-2 px-3 inline-block w-full text-center" onClick={handleNavLinkClick}>
                  Events
                </Link>
              </li>
              <li>
                <Link href="#achievements" className="text-black hover:text-sky-300 transition duration-300 py-2 px-3 inline-block w-full text-center" onClick={handleNavLinkClick}>
                  Achievements
                </Link>
              </li>
              <li>
                <Link href="#testimonials" className="text-black hover:text-sky-300 transition duration-300 py-2 px-3 inline-block w-full text-center" onClick={handleNavLinkClick}>
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="#contact-us" className="text-black hover:text-sky-300 transition duration-300 py-2 px-3 inline-block w-full text-center" onClick={handleNavLinkClick}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/login" className="bg-sky-300 hover:bg-sky-600 rounded-md text-white  transition duration-300 py-2 px-3 inline-block w-full text-center" onClick={handleNavLinkClick}>
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="border border-sky-900 rounded-md text-black hover:text-sky-300 transition duration-300 py-2 px-3 inline-block w-full text-center" onClick={handleNavLinkClick}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
