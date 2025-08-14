"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, Download, Loader2, FileText, CheckCircle2, CalendarDays, MapPin } from 'lucide-react';

// Dummy data yang diperbarui dengan detail event baru
const eventsData = [
  {
    id: 1,
    title: 'Kejuaraan Renang Nasional OCEANTIC',
    event_date: '24-26 November 2024',
    location: 'Stadion Akuatik Gelora Bung Karno, Jakarta',
    description: 'Acara renang tahunan yang mempertemukan atlet-atlet terbaik dari seluruh Indonesia.',
    registration_start_date: '10 Agustus 2024',
    registration_end_date: '20 Oktober 2024',
    pdfUrl: '/path/to/pdf/kejuaraan_renang.pdf'
  },
  {
    id: 2,
    title: 'Seminar Teknologi Masa Depan',
    event_date: '12 Desember 2024',
    location: 'Balai Sidang Jakarta Convention Center',
    description: 'Sebuah seminar interaktif yang membahas tren terbaru di dunia teknologi dan inovasi.',
    registration_start_date: '15 Oktober 2024',
    registration_end_date: '30 November 2024',
    pdfUrl: '/path/to/pdf/seminar_teknologi.pdf'
  },
  {
    id: 3,
    title: 'Workshop Fotografi Profesional',
    event_date: '10 Januari 2025',
    location: 'Pusat Kebudayaan, Bandung',
    description: 'Workshop praktis yang membimbing peserta untuk menguasai teknik-teknik fotografi profesional.',
    registration_start_date: '1 Desember 2024',
    registration_end_date: '5 Januari 2025',
    pdfUrl: '/path/to/pdf/workshop_fotografi.pdf'
  },
];

export default function BukuAcara() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState('');

  // Simulate fetching events data from an API
  useEffect(() => {
    // Simulate a 1-second delay
    setTimeout(() => {
      setEvents(eventsData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setIsDropdownOpen(false);
    setDownloadMessage('');
  };

  const handleDownloadPdf = () => {
    if (!selectedEvent) return;

    setIsDownloading(true);
    setDownloadMessage('');

    // Simulate a 2-second download process
    setTimeout(() => {
      // In a real app, you would initiate the download here, e.g.,
      // window.open(selectedEvent.pdfUrl, '_blank');
      setIsDownloading(false);
      setDownloadMessage('Berkas PDF berhasil diunduh!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-6 sm:p-10">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Buku Acara</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-lg font-semibold text-gray-600">Memuat daftar acara...</p>
          </div>
        ) : (
          <div className="space-y-8">

            {/* Pilih Event Section */}
            <div>
              <label htmlFor="event-select" className="block text-lg font-semibold text-gray-700 mb-2">
                Pilih Event
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex justify-between items-center w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <span className="text-gray-800 font-medium">
                    {selectedEvent ? selectedEvent.title : 'Pilih event dari daftar'}
                  </span>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
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

            {/* Event Details Section */}
            {selectedEvent && (
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 shadow-inner">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h2 className="text-xl font-bold text-blue-800">{selectedEvent.title}</h2>
                </div>
                
                <p className="text-gray-700 mb-4">{selectedEvent.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-blue-200">
                  <DetailItem icon={<CalendarDays className="h-5 w-5 text-blue-600" />} label="Tanggal Event" value={selectedEvent.event_date} />
                  <DetailItem icon={<MapPin className="h-5 w-5 text-blue-600" />} label="Lokasi" value={selectedEvent.location} />
                  <DetailItem label="Pendaftaran Dibuka" value={selectedEvent.registration_start_date} />
                  <DetailItem label="Pendaftaran Ditutup" value={selectedEvent.registration_end_date} />
                </div>
              </div>
            )}

            {/* Download Button Section */}
            <div>
              <button
                onClick={handleDownloadPdf}
                disabled={!selectedEvent || isDownloading}
                className={`w-full flex items-center justify-center py-3 rounded-full font-semibold transition duration-300 ${
                  selectedEvent
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isDownloading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Download className="h-5 w-5 mr-2" />
                )}
                {isDownloading ? 'Mempersiapkan...' : 'Download Berkas PDF'}
              </button>

              {downloadMessage && (
                <div className="mt-4 flex items-center justify-center text-sm text-center text-green-600 font-medium">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {downloadMessage}
                </div>
              )}
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component to display detail items
const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-3">
    {icon}
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-semibold text-gray-800">{value}</div>
    </div>
  </div>
);
