"use client";
import { MapPin, Calendar } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function EventSection() {
  const events = [
    {
      title: "Swimming Championship 2025",
      description:
        "Bergabunglah dalam kompetisi renang bergengsi tahun ini. Tunjukkan kemampuan terbaikmu dan raih prestasi bersama para atlet terbaik lainnya.",
      date: "20 Oktober 2025",
      location: "Jakarta Aquatic Stadium",
      image: "/images/swim.jpg",
      status: "Open for Registration",
    },
  ];

  return (
    <section className="w-full px-8 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 relative pb-4">
          Event Kami
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-sky-600 rounded-full"></span>
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
        >
          {events.map((event, index) => (
            <SwiperSlide key={index}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Gambar */}
                <div className="w-full h-[380px] rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Konten */}
                <div className="flex flex-col justify-center space-y-6">
                  <h3 className="text-3xl font-bold text-gray-800">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Info event */}
                  <div className="flex items-center space-x-6 text-gray-500">
                    <span className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <span>{event.date}</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-red-500" />
                      <span>{event.location}</span>
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-4 py-1 w-fit rounded-full text-sm font-medium ${
                      event.status === "Open for Registration"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {event.status}
                  </span>

                  {/* Button full horizontal */}
                  {event.status === "Open for Registration" ? (
                    <a
                      href="/registerEvent"
                      className="w-full text-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white text-lg rounded-lg shadow-md transition"
                    >
                      Daftar Segera
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full px-6 py-3 bg-gray-300 text-gray-600 text-lg rounded-lg shadow-md cursor-not-allowed"
                    >
                      Daftar Segera
                    </button>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
