"use client";

import { useState, useEffect } from 'react';
// import download from 'downloadjs'; // Pustaka ini tidak lagi digunakan
import { TableCellsIcon, ArrowDownTrayIcon, EyeIcon, ArrowPathIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const EventBookGenerator = () => {
  // State untuk menyimpan daftar semua acara yang diambil dari API
  const [events, setEvents] = useState([]);
  
  // State untuk melacak ID acara yang dipilih oleh pengguna
  const [selectedEventId, setSelectedEventId] = useState('');
  
  // State untuk menyimpan detail acara yang dipilih
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  
  // State untuk mengontrol visibilitas tabel pratinjau
  const [showPreview, setShowPreview] = useState(false);
  
  // State untuk melacak status loading, baik saat mengambil acara maupun saat mengunduh PDF
  const [isLoading, setIsLoading] = useState(false);
  const [pdfIsLoading, setPdfIsLoading] = useState(false);

  // State untuk menyimpan pesan kesalahan, jika ada
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil daftar semua acara dari API
  const fetchAllEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.oceanticsports.com/oceantic/v1/events/getAllEventsOpen');
      if (!response.ok) {
        throw new Error('Gagal mengambil daftar acara dari API.');
      }
      const data = await response.json();
      const eventList = data.data;

      if (Array.isArray(eventList)) {
        setEvents(eventList);
      } else {
        throw new Error('Format data API tidak valid.');
      }
    } catch (err) {
      console.error('Terjadi kesalahan saat mengambil acara:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect untuk memuat daftar acara saat komponen pertama kali dirender
  useEffect(() => {
    fetchAllEvents();
  }, []);

  // Handler untuk mengunduh PDF
  const handleDownloadPdf = async () => {
    if (!selectedEventId) {
      setError('Mohon pilih acara terlebih dahulu.');
      return;
    }

    setPdfIsLoading(true);
    setError(null);

    // Endpoint untuk membuat PDF
    // Perbaikan: Menggunakan port 3001 untuk generate-event-book-pdf,
    // yang konsisten dengan kesalahan sebelumnya dan kemungkinan lokasi server yang benar.
    const apiUrl = 'https://api.oceanticsports.com/generate-event-book-pdf';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Mengirimkan event_id yang dipilih ke backend
        body: JSON.stringify({ event_id: selectedEventId }),
      });

      if (!response.ok) {
        // Jika server merespons dengan status error
        const errorText = await response.text();
        throw new Error(`Gagal membuat PDF: ${errorText}`);
      }

      // Mendapatkan data blob (PDF) dari respons
      const pdfBlob = await response.blob();
      
      // Mendapatkan nama file dari header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'EventBook.pdf';
      if (contentDisposition && contentDisposition.indexOf('attachment') !== -1) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      // Mengunduh file secara manual tanpa pustaka eksternal
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Terjadi kesalahan saat mengunduh PDF:', err);
      setError('Terjadi kesalahan saat mengunduh PDF. Pastikan server backend berjalan dan CORS telah diatur dengan benar.');
    } finally {
      setPdfIsLoading(false);
    }
  };

  // Handler untuk mengubah acara yang dipilih dari dropdown
  const handleSelectEvent = (e) => {
    const id = e.target.value;
    setSelectedEventId(id);
    setShowPreview(false); // Sembunyikan pratinjau saat pilihan berubah
    
    // Cari detail acara yang dipilih dari daftar acara
    const event = events.find(event => event.id === parseInt(id));
    setSelectedEventDetails(event);
  };

  // Handler untuk menampilkan atau menyembunyikan pratinjau
  const handleTogglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Fungsi untuk memformat tanggal ke format yang lebih mudah dibaca
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6">
          Generator Buku Acara
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Pilih acara di bawah ini untuk melihat pratinjau atau mengunduh buku acara dalam format PDF.
        </p>

        {/* Bagian Dropdown Pemilihan Acara */}
        <div className="flex flex-col items-center mb-8">
          <label htmlFor="event-select" className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Acara:
          </label>
          <div className="relative w-full max-w-md">
            <select
              id="event-select"
              value={selectedEventId}
              onChange={handleSelectEvent}
              disabled={isLoading}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm cursor-pointer disabled:bg-gray-200"
            >
              <option value="" disabled>-- Pilih salah satu acara --</option>
              {isLoading ? (
                <option disabled>Memuat acara...</option>
              ) : error ? (
                <option disabled>Error: {error}</option>
              ) : (
                events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title}
                  </option>
                ))
              )}
            </select>
            {isLoading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ArrowPathIcon className="h-5 w-5 text-gray-400 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Tombol Aksi */}
        {selectedEventId && (
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            <button
              onClick={handleTogglePreview}
              className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              <EyeIcon className="h-5 w-5 mr-2" />
              <span>{showPreview ? 'Sembunyikan Pratinjau' : 'Tampilkan Pratinjau'}</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={pdfIsLoading}
              className={`flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white ${
                pdfIsLoading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              } transition duration-150 ease-in-out`}
            >
              {pdfIsLoading ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                  <span>Mengunduh...</span>
                </>
              ) : (
                <>
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  <span>Unduh Buku Acara</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Bagian Pratinjau Tabel */}
        {showPreview && selectedEventDetails && (
          <div className="overflow-x-auto mt-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Pratinjau Acara
            </h2>
            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Detail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Informasi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ID Acara
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {selectedEventDetails.id}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Judul Acara
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {selectedEventDetails.title}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Tanggal Acara
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(selectedEventDetails.event_date)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Lokasi
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {selectedEventDetails.location}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Status
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {selectedEventDetails.event_status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pesan Kesalahan */}
        {error && (
          <div className="flex items-center justify-center p-4 mt-8 rounded-lg bg-red-100 text-red-700">
            <ExclamationCircleIcon className="h-6 w-6 mr-2" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default EventBookGenerator;
