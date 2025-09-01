'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export default function Navbar() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Ambil token dari localStorage atau sessionStorage
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username') || sessionStorage.getItem('username');

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Cek expired
        if (decoded.exp * 1000 < Date.now()) {
          console.log('Token expired');
          localStorage.clear();
          sessionStorage.clear();
          setIsUserLoggedIn(false);
          setUsername('');
        } else {
          setIsUserLoggedIn(true);
          setUsername(storedUsername || decoded.username || 'User');
        }
      } catch (err) {
        console.error('Token invalid:', err);
        localStorage.clear();
        sessionStorage.clear();
        setIsUserLoggedIn(false);
        setUsername('');
      }
    } else {
      setIsUserLoggedIn(false);
      setUsername('');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setIsUserLoggedIn(false);
    setUsername('');
    setIsMobileMenuOpen(false);
    window.location.href = '/';
  };

  const handleNavLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center relative">
        <Link href="/" className="text-black text-3xl font-bold">
          OCEANTIC
        </Link>

        {/* Hamburger Menu */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            )}
          </svg>
        </button>

        {/* Menu */}
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
            <>
              <li>
                <span className="bg-amber-300 text-black rounded-xl py-2 px-3 inline-block">
                  Halo, {username}!
                </span>
              </li>
              <li>
                <Link href="/registerEvent" className="text-black hover:text-sky-300 py-2 px-3 inline-block" onClick={handleNavLinkClick}>
                  Registrasi
                </Link>
              </li>
              <li>
                <Link href="/statusPayment" className="text-black hover:text-sky-300 py-2 px-3 inline-block" onClick={handleNavLinkClick}>
                  Status Payment
                </Link>
              </li>
              <li>
                <Link href="/bukuAcara" className="text-black hover:text-sky-300 py-2 px-3 inline-block" onClick={handleNavLinkClick}>
                  Buku Acara
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-black hover:text-sky-300 py-2 px-3 inline-block" onClick={handleNavLinkClick}>
                  Profil
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded-md text-white hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link href="#about-us" className="text-black hover:text-sky-300 py-2 px-3 inline-block" onClick={handleNavLinkClick}>About Us</Link></li>
              <li><Link href="#events" className="text-black hover:text-sky-300 py-2 px-3 inline-block" onClick={handleNavLinkClick}>Events</Link></li>
              <li><Link href="#achievements" className="text-black hover:text-sky-300 py-2 px-3 inline-block" onClick={handleNavLinkClick}>Achievements</Link></li>
              <li><Link href="#testimonials" className="text-black hover:text-sky-300 py-2 px-3 inline-block" onClick={handleNavLinkClick}>Testimonials</Link></li>
              <li><Link href="#contact-us" className="text-black hover:text-sky-300 py-2 px-3 inline-block" onClick={handleNavLinkClick}>Contact Us</Link></li>
              <li><Link href="/login" className="bg-sky-300 hover:bg-sky-600 rounded-md text-white py-2 px-3 inline-block" onClick={handleNavLinkClick}>Login</Link></li>
              <li><Link href="/register" className="border border-sky-900 rounded-md text-black hover:text-sky-300 py-2 px-3 inline-block" onClick={handleNavLinkClick}>Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
