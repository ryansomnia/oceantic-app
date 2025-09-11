'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MapPin, Calendar, Users, Loader2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from "next/navigation"; // import ini di atas

import { Navigation } from 'swiper/modules';
import moment from "moment";
import "moment/locale/id";

import 'swiper/css';
import 'swiper/css/navigation';

const API_BASE_URL = 'https://api.oceanticsports.com/oceantic/v1';

export default function AchievementCarousel() {
  const router = useRouter();

  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAchievements = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/events/getAllEvents`);
      const data = await res.json();
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      if (data.code === 200 && Array.isArray(data.data)) {
        setAchievements(data.data);
      } else {
        throw new Error('Format data getAllEvents tidak valid');
      }
    } catch (err) {
      setError('Gagal memuat getAllEvents. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-gray-700">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <p className="text-lg font-medium">Memuat prestasi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-red-600 p-4 text-center">
        <XCircle className="w-10 h-10 mb-2" />
        <p className="text-lg font-medium">{error}</p>
      </div>
    );
  }

  if (!achievements.length) {
    return (
      <p className="text-center py-10 text-lg font-medium text-gray-500">
        Belum ada prestasi tercatat.
      </p>
    );
  }

  return (
    <div id="achievements" className="my-10 w-[70%] h-[30%] mx-auto relative overflow-hidden font-sans">
      <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide text-center">
        <span className="text-sky-500">Prestasi</span>
      </h2>
      <h1 className="text-4xl font-extrabold text-gray-900 mt-2 text-center">
        Riwayat Perlombaan
      </h1>

      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        spaceBetween={20}
        slidesPerView={2}
        className="w-full mt-8"
      >
        {achievements.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 flex flex-col h-full">
              {/* Tahun */}
              <div className="bg-gradient-to-r from-sky-400 to-sky-600 text-white px-4 py-1 rounded-full w-fit text-sm font-semibold shadow mb-3">
                {moment(item.date).format("YYYY")}
              </div>

              {/* Judul lomba */}
              <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>

              {/* Lokasi */}
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <MapPin size={16} /> <span>{item.location}</span>
              </div>

              {/* Tanggal */}
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <Calendar size={16} /> <span>{moment(item.date).locale("id").format("D MMMM YYYY")}</span>
              </div>

              {/* Kategori / Tipe lomba */}
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
                <Users size={16} /> <span>{item.category || "Umum"}</span>
              </div>

              <button
                          onClick={() => router.push(`/event/${item.id}`)}

              className="mt-auto px-4 py-2 bg-gray-100 text-sky-600 font-semibold rounded-md hover:bg-sky-500 hover:text-white transition">
                Hasil Acara
              </button>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation */}
        <button
          className="custom-prev absolute top-1/2 -left-6 -translate-y-1/2 z-20 
                     bg-sky-500 hover:bg-sky-600 
                     p-3 rounded-full shadow-lg transition duration-300"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
          className="custom-next absolute top-1/2 -right-6 -translate-y-1/2 z-20 
                     bg-sky-500 hover:bg-sky-600 
                     p-3 rounded-full shadow-lg transition duration-300"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </Swiper>
    </div>
  );
}
