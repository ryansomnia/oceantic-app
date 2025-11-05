'use client';

import React from 'react';
import { CalendarDays, MapPin, Waves } from 'lucide-react';
import Link from 'next/link';

export default function RegistrationClosed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 p-6">
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 text-center border border-white/40">
        <div className="flex justify-center mb-6">
          <Waves className="h-16 w-16 text-blue-500 animate-pulse" />
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
          🌊 Pendaftaran Ditutup
        </h1>

        <p className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed">
          Terima kasih atas antusiasme luar biasa dari seluruh peserta! 💙
          <br />
          <span className="font-semibold text-blue-700">
            Pendaftaran untuk lomba renang OCEANTIC sudah resmi ditutup.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-gray-700 mb-8">
          <div className="flex items-center gap-2">
            <CalendarDays className="text-blue-600" />
            <span className="font-medium">22 November 2025</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="text-red-500" />
            <span className="font-medium">Deutsche Schule Jakarta</span>
          </div>
        </div>

        <p className="text-gray-600 text-base sm:text-lg mb-10">
          Sampai berjumpa di arena lomba nanti! 🏊‍♂️  
          Tetap semangat berlatih dan jadilah yang terbaik!
        </p>

        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-transform transform hover:scale-105 focus:ring-4 focus:ring-blue-300"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
