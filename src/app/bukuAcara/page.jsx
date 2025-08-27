"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  Download,
  Loader2,
  FileText,
  CheckCircle2,
  CalendarDays,
  MapPin,
  XCircle, // Menambahkan ikon untuk error
} from "lucide-react";
// Kita mengasumsikan SweetAlert2 dimuat melalui CDN.
// Contoh: <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
// sehingga fungsi Swal tersedia secara global.

const API_BASE_URL = "https://api.oceanticsports.com/oceantic/v1";

export default function BukuAcara() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  // Ambil data event aktif dari API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/events/getAllEventsOpen`);
        const data = await res.json();
        if (data.code === 200) {
          setEvents(data.data);
        }
      } catch (err) {
        console.error("Gagal memuat events:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsDropdownOpen(false);
  };

  const handleDownloadPdf = async () => {
    if (!selectedEvent) {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan',
        text: 'Silakan pilih event terlebih dahulu.',
      });
      return;
    }

    // Hitung sisa hari
    const today = new Date();
    const eventDate = new Date(selectedEvent.event_date);
    const timeDifference = eventDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    
    // Periksa apakah sudah H-1 atau lebih
    if (daysDifference > 1) {
      Swal.fire({
        icon: 'info',
        title: 'Belum Saatnya',
        text: `Buku acara dapat diunduh H-1 sebelum event. Masih ada ${daysDifference - 1} hari lagi.`,
      });
      return;
    }

    setIsDownloading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/generateEventBookPdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: selectedEvent.id }),
      });

      if (!res.ok) throw new Error("Gagal mengunduh PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      // Buat link untuk trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = `buku_acara_${selectedEvent.title
        .replace(/\s+/g, "_")
        .toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Berkas PDF berhasil diunduh!',
      });
    } catch (err) {
      console.error("Download error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: `Terjadi kesalahan: ${err.message}`,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const getDownloadButtonText = () => {
    if (!selectedEvent) return "Pilih Event untuk Download";
    const today = new Date();
    const eventDate = new Date(selectedEvent.event_date);
    const timeDifference = eventDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if (daysDifference > 1) {
      return `Tersedia H-1 (${daysDifference - 1} hari lagi)`;
    } else {
      return "Download Berkas PDF";
    }
  };

  const isDownloadAllowed = () => {
    if (!selectedEvent) return false;
    const today = new Date();
    const eventDate = new Date(selectedEvent.event_date);
    const timeDifference = eventDate.getTime() - today.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
    return daysDifference <= 1;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6 sm:p-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Buku Acara</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-lg font-semibold text-gray-600">
              Memuat daftar acara...
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pilih Event */}
            <div>
              <label
                htmlFor="event-select"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Pilih Event
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex justify-between items-center w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <span className="text-gray-800 font-medium">
                    {selectedEvent ? selectedEvent.title : "Pilih event dari daftar"}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        onClick={() => handleSelectEvent(event)}
                        className="px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors duration-200 text-gray-800"
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Detail Event */}
            {selectedEvent && (
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 shadow-inner">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-blue-800">
                    {selectedEvent.title}
                  </h2>
                </div>

                <p className="text-gray-700 mb-4">
                  {selectedEvent.description || "-"}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-blue-200">
                  <DetailItem
                    icon={<CalendarDays className="h-5 w-5 text-blue-600" />}
                    label="Tanggal Event"
                    value={
                      new Date(selectedEvent.event_date).toLocaleDateString("id-ID")
                    }
                  />
                  <DetailItem
                    icon={<MapPin className="h-5 w-5 text-blue-600" />}
                    label="Lokasi"
                    value={selectedEvent.location}
                  />
                  <DetailItem
                                      icon={<CalendarDays className="h-5 w-5 text-blue-600" />}

                    label="Pendaftaran Dibuka"
                    value={
                      new Date(selectedEvent.registration_start_date).toLocaleDateString(
                        "id-ID"
                      )
                    }
                  />
                  <DetailItem
                                      icon={<CalendarDays className="h-5 w-5 text-blue-600" />}

                    label="Pendaftaran Ditutup"
                    value={
                      new Date(selectedEvent.registration_end_date).toLocaleDateString(
                        "id-ID"
                      )
                    }
                  />
                </div>
              </div>
            )}

            {/* Tombol Download */}
            <div>
              <button
                onClick={handleDownloadPdf}
                disabled={!isDownloadAllowed() || isDownloading}
                className={`w-full flex items-center justify-center py-3 rounded-full font-semibold transition duration-300 ${
                  isDownloadAllowed()
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isDownloading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Download className="h-5 w-5 mr-2" />
                )}
                {getDownloadButtonText()}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Detail
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    {icon}
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold text-gray-800">{value}</div>
    </div>
  </div>
);
