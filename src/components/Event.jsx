'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { MapPin, Calendar, Loader2, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import moment from "moment";
import "moment/locale/id";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const API_BASE_URL = 'https://api.oceanticsports.com/oceantic/v1';

export default function EventsCarousel() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/events/getAllEvents`);
      const data = await res.json();
      if (data.code === 200 && Array.isArray(data.data)) {
        setEvents(data.data);
      } else {
        throw new Error('Format data event tidak valid');
      }
    } catch (err) {
      setError('Gagal memuat daftar event. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-700">
        <Loader2 className="h-10 w-10 animate-spin mr-3" />
        <p className="text-xl font-medium">Memuat event...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-600 p-4 text-center">
        <XCircle className="w-12 h-12 mb-4" />
        <p className="text-xl font-medium">{error}</p>
      </div>
    );
  }

  if (!events.length) {
    return (
      <p className="text-center py-10 text-xl font-medium text-gray-500">
        Belum ada event tersedia.
      </p>
    );
  }

  return (
    <div id="events" className="w-full relative overflow-hidden font-sans">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="w-full overflow-hidden"
      >
        {events.map((event, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-[500px] md:h-[600px] sm:h-[400px]">
              {/* Background with gradient overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/swim.jpg')" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
              </div>

              {/* Content */}
              <div className="relative z-10 w-full h-full flex items-center justify-center px-4 sm:px-8 text-center">
                <div className="max-w-3xl md:max-w-4xl text-white">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-snug sm:leading-tight drop-shadow-2xl">
                    {event.title}
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 font-light leading-relaxed drop-shadow-lg">
                    {event.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-8 text-xs sm:text-sm md:text-base font-medium text-gray-200">
                    <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md shadow-md">
                      <Calendar className="w-4 h-4" />
                      {moment(event.event_date).locale("id").format("dddd, D MMMM YYYY")}
                    </span>
                    <span className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-md shadow-md">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </span>
                  </div>

                  {/* Button */}
                  <button
                    disabled={event.event_status !== 'Open for Registration'}
                    onClick={() => {
                      if (event.event_status === 'Open for Registration') {
                        router.push('/registerEvent');
                      }
                    }}
                    className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-xl transition-all duration-300 transform ${
                      event.event_status === 'Open for Registration'
                        ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:scale-105 hover:shadow-2xl'
                        : 'bg-gray-500 text-gray-200 cursor-not-allowed'
                    }`}
                  >
                    {event.event_status === 'Open for Registration' ? 'Daftar Sekarang' : event.event_status}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation */}
        <button
          className="custom-prev absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 z-20 
                     bg-black/30 hover:bg-black/50 backdrop-blur-md 
                     p-2 sm:p-3 rounded-full shadow-lg transition duration-300"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <button
          className="custom-next absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 z-20 
                     bg-black/30 hover:bg-black/50 backdrop-blur-md 
                     p-2 sm:p-3 rounded-full shadow-lg transition duration-300"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
      </Swiper>
    </div>
  );
}
