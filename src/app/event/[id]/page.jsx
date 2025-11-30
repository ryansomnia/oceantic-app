'use client';

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, MapPin, Users, ChevronLeft } from "lucide-react";
import moment from "moment";
import "moment/locale/id";

export default function EventDetail() {
  const router = useRouter();
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    moment.locale("id");

    const fetchEvent = async () => {
      try {
        const res = await fetch("http://localhost:3025/oceantic/v1/events/getAllEventsOpen", {
          method: "GET",
        });

        const json = await res.json();

        if (json.code === 200 && Array.isArray(json.data)) {
          const found = json.data.find(
            (ev) => ev.id.toString() === params.id
          );
          setEvent(found || null);
        }
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Memuat data event...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>Data event tidak ditemukan.</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 px-4 font-sans">
      {/* Tombol Kembali */}
      <button
        onClick={() => router.push("/")}
        className="flex items-center text-sky-600 hover:text-sky-800 mb-6 transition"
      >
        <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
      </button>

      {/* Info Utama */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        <div className="bg-gradient-to-r from-sky-400 to-sky-600 text-white px-4 py-1 rounded-full w-fit text-sm font-semibold shadow mb-4">
          {moment(event.date).format("YYYY")}
        </div>

        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          {event.title}
        </h1>

        <div className="flex items-center gap-3 text-gray-600 text-sm mb-1">
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600 text-sm mb-1">
          <Calendar size={16} />
          <span>{moment(event.date).format("D MMMM YYYY")}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-600 text-sm mb-4">
          <Users size={16} />
          <span>{event.category}</span>
        </div>

        <p className="text-gray-700 leading-relaxed">{event.description}</p>
      </div>

      {/* Seksi Tambahan */}
      <div className="mt-8 space-y-6">
        {/* Hasil Perlombaan */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Hasil Perlombaan
          </h2>
          <p className="text-gray-500 text-sm">Lihat hasil lengkap dari setiap nomor perlombaan</p>

          <button
            onClick={() => router.push(`/event/${params.id}/results`)}
            className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            Lihat Hasil →
          </button>
        </div>

        {/* Sertifikat & Surat Keterangan */}
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Sertifikat dan Surat Keterangan
          </h2>
          <p className="text-gray-500 text-sm">
            Unduh sertifikat dan dokumen resmi event
          </p>

          <button
            onClick={() => router.push(`/event/${params.id}/docs`)}
            className="mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            Lihat Dokumen →
          </button>
        </div>
      </div>
    </div>
  );
}
