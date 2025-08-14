'use client'; // Menandakan bahwa ini adalah Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2'; // Import SweetAlert2 untuk notifikasi yang lebih baik

export default function RegisterSwimmerPage() {
  const router = useRouter();

  // State untuk data yang akan di-fetch dari API
  const [events, setEvents] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Menyimpan semua kategori yang tersedia untuk event yang dipilih

  // State untuk form data pendaftaran
  const [formData, setFormData] = useState({
    user_id: '',
    event_id: '',
    full_name: '',
    date_of_birth: '',
    gender: '',
    email: '',
    phone_number: '',
    club_name: '',
    stroke_category: '',
    age_category: '',
    distance_category: '',
    jenis_renang: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    payment_status: 'Pending', // Menambahkan kembali payment_status sesuai dengan curl request
    parent_consent: false,
    rules_consent: false,
  });

  // State untuk file foto pembayaran dan dokumen pendukung
  const [paymentPhoto, setPaymentPhoto] = useState(null);
  const [supportingDocument, setSupportingDocument] = useState(null);

  // State untuk UI feedback (loading/submitting)
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // URL dasar untuk backend API Anda
  const API_BASE_URL = 'http://localhost:3025/oceantic/v1';

  // Efek untuk mengambil daftar event saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');

    if (!token || !userId || userRole !== 'member') {

      // Jika pengguna tidak terautentikasi, alihkan ke halaman login
      router.push('/login');
      return;
    }
console.log('============hhh========================');
console.log(userRole);
console.log('====================================');
    // Set user_id dari local storage ke formData
    setFormData(prev => ({ ...prev, user_id: userId }));

    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/events/getAllEventsOpen`);
        if (!response.ok) {
          throw new Error('Gagal memuat daftar event.');
        }
        const data = await response.json();
        
        // --- BAGIAN PERBAIKAN: setEvents sekarang menggunakan data.data ---
        if (data.code === 200 && Array.isArray(data.data)) {
           setEvents(data.data);
        } else {
           throw new Error(data.message || 'Format data event tidak valid.');
        }
       
      } catch (err) {
        console.error('Error fetching events:', err);
        Swal.fire('Error', 'Gagal memuat daftar event. Silakan coba lagi.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  // Efek untuk mengambil semua kategori berdasarkan event yang dipilih
  useEffect(() => {
    if (formData.event_id) {
      const fetchCategories = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/categories/getCategoryEventByEventId/${formData.event_id}`);
          if (!response.ok) {
            throw new Error('Gagal memuat kategori.');
          }
          const data = await response.json();
          console.log('===========================ssss=========');
          console.log(data);
          console.log('====================================');
          
          // --- BAGIAN PERBAIKAN: setAllCategories sekarang menggunakan data.data ---
          if (data.code === 200 && Array.isArray(data.data)) {
            setAllCategories(data.data);
          } else {
            setAllCategories([]);
             throw new Error(data.message || 'Format data kategori tidak valid.');
          }
          
          // Reset kategori yang dipilih saat event berubah
          setFormData(prev => ({
            ...prev,
            stroke_category: '',
            age_category: '',
            distance_category: '',
            jenis_renang: '',
          }));
        } catch (err) {
          console.error('Error fetching categories:', err);
          Swal.fire('Error', 'Gagal memuat kategori untuk event ini.', 'error');
        } finally {
          setLoading(false);
        }
      };
      fetchCategories();
    } else {
      // Reset kategori jika tidak ada event yang dipilih
      setAllCategories([]);
      setFormData(prev => ({
        ...prev,
        stroke_category: '',
        age_category: '',
        distance_category: '',
        jenis_renang: '',
      }));
    }
  }, [formData.event_id]);


  // Handler perubahan input form umum
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handler perubahan file input
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'payment_photo') {
      setPaymentPhoto(files[0]);
    } else if (name === 'supporting_document') {
      setSupportingDocument(files[0]);
    }
  };

  // Handler submit form pendaftaran
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem('authToken');
    if (!token) {
      Swal.fire('Sesi Berakhir', 'Sesi Anda telah berakhir. Silakan login kembali.', 'warning').then(() => {
        router.push('/login');
      });
      setIsSubmitting(false);
      return;
    }

    // Validasi form
    if (!formData.event_id || !formData.stroke_category || !formData.age_category || !formData.distance_category || !formData.jenis_renang) {
      Swal.fire('Input Tidak Lengkap', 'Harap pilih Event, Gaya, Kategori Usia, Jarak Lomba, dan Jenis Lomba.', 'warning');
      setIsSubmitting(false);
      return;
    }
    if (!formData.parent_consent || !formData.rules_consent) {
        Swal.fire('Persetujuan Diperlukan', 'Anda harus menyetujui persetujuan orang tua/wali dan aturan lomba.', 'warning');
        setIsSubmitting(false);
        return;
    }
    if (!paymentPhoto) {
        Swal.fire('Bukti Pembayaran', 'Foto bukti pembayaran wajib diunggah.', 'warning');
        setIsSubmitting(false);
        return;
    }
    if (!supportingDocument) {
      Swal.fire('Dokumen Diperlukan', 'Scan Akte Kelahiran wajib diunggah.', 'warning');
      setIsSubmitting(false);
      return;
    }


    try {
      // Buat FormData untuk mengirim file dan data teks
      const dataToSend = new FormData();

      // Tambahkan semua field teks dari formData
      for (const key in formData) {
        // FormData akan mengkonversi boolean menjadi string ("true"/"false"), ini sesuai dengan contoh curl.
        dataToSend.append(key, formData[key]);
      }
      
      // Tambahkan file foto pembayaran dan dokumen pendukung
      if (paymentPhoto) {
        dataToSend.append('payment_photo', paymentPhoto);
      }
      if (supportingDocument) {
        dataToSend.append('supporting_document', supportingDocument);
      }

      const response = await fetch(`${API_BASE_URL}/registrations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: dataToSend,
      });

      if (response.ok) {
        await response.json();
        Swal.fire('Berhasil!', 'Pendaftaran berhasil! Anda akan menerima konfirmasi via email.', 'success');
        
        // Reset form setelah sukses
        setFormData({
            user_id: localStorage.getItem('userId'),
            event_id: '',
            full_name: '',
            date_of_birth: '',
            gender: '',
            email: '',
            phone_number: '',
            club_name: '',
            stroke_category: '',
            age_category: '',
            distance_category: '',
            jenis_renang: '',
            emergency_contact_name: '',
            emergency_contact_phone: '',
            payment_status: 'Pending',
            parent_consent: false,
            rules_consent: false,
        });
        setAllCategories([]);
        setPaymentPhoto(null);
        setSupportingDocument(null);
        // Reset input file secara manual
        if (document.getElementById('payment_photo')) {
            document.getElementById('payment_photo').value = '';
        }
        if (document.getElementById('supporting_document')) {
            document.getElementById('supporting_document').value = '';
        }

      } else {
        const errorData = await response.json();
        Swal.fire('Error', errorData.message || 'Pendaftaran gagal. Silakan coba lagi.', 'error');
      }
    } catch (err) {
      console.error('Error submitting registration:', err);
      Swal.fire('Error', 'Terjadi kesalahan jaringan atau server. Coba lagi nanti.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mendapatkan daftar unik untuk filter dropdown dari `allCategories`
  const uniqueAgeGroups = [...new Set(allCategories.filter(cat => cat.categoryName === 'usia').map(cat => cat.value))].filter(Boolean);
  const uniqueSwimStyles = [...new Set(allCategories.filter(cat => cat.categoryName === 'gaya').map(cat => cat.value))].filter(Boolean);
  const uniqueDistances = [...new Set(allCategories.filter(cat => cat.categoryName === 'jarak').map(cat => cat.value))].filter(Boolean).sort((a, b) => parseInt(a) - parseInt(b));
  const uniqueTypeOfSwimmingEvents = [...new Set(allCategories.filter(cat => cat.categoryName === 'opsi').map(cat => cat.value))].filter(Boolean);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-oceanic-blue to-aqua-accent text-white text-xl">
        Memuat formulir pendaftaran...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-oceanic-blue to-aqua-accent p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8 sm:p-10 lg:p-12">
        <h1 className="text-4xl font-extrabold text-dark-charcoal mb-8 text-center">
          Daftar Lomba Renang <span className="text-oceanic-blue">OCEANTIC</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bagian Pemilihan Event */}
          <div>
            <label htmlFor="event_id" className="block text-lg font-medium text-gray-800 mb-2">Pilih Event <span className="text-red-500">*</span></label>
            <select
              id="event_id"
              name="event_id"
              value={formData.event_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue"
            >
              <option value="">-- Pilih Event --</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} ({new Date(event.event_date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Bagian Informasi Pribadi Peserta */}
          <h2 className="text-2xl font-bold text-dark-charcoal mt-8 mb-4">Informasi Peserta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
              <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-oceanic-blue focus:border-oceanic-blue" placeholder="Nama Lengkap Anda" />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin <span className="text-red-500">*</span></label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-oceanic-blue focus:border-oceanic-blue">
                <option value="">Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div>
              <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Lahir <span className="text-red-500">*</span></label>
              <input type="date" id="date_of_birth" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-oceanic-blue focus:border-oceanic-blue" />
            </div>
            <div>
              <label htmlFor="club_name" className="block text-sm font-medium text-gray-700 mb-1">Perwakilan (Nama Klub/Tim)</label>
              <input type="text" id="club_name" name="club_name" value={formData.club_name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-oceanic-blue focus:border-oceanic-blue" placeholder="Jika Individu ketik: Individu" />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon Peserta <span className="text-red-500">*</span></label>
              <input type="tel" id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-oceanic-blue focus:border-oceanic-blue" placeholder="081234567890" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-oceanic-blue focus:border-oceanic-blue" placeholder="email@example.com" />
            </div>
           
          </div>

          {/* Bagian Pilihan Kategori Lomba */}
          {formData.event_id && (
            <>
              <h2 className="text-2xl font-bold text-dark-charcoal mt-8 mb-4">Pilihan Kategori Lomba</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {/* Dropdown Kategori Usia */}
                <div>
                  <label htmlFor="age_category" className="block text-sm font-medium text-gray-700 mb-1">Kategori Usia <span className="text-red-500">*</span></label>
                  <select
                    id="age_category"
                    name="age_category"
                    value={formData.age_category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue"
                  >
                    <option value="">Pilih Usia</option>
                    {uniqueAgeGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                {/* Dropdown Gaya Renang */}
                <div>
                  <label htmlFor="stroke_category" className="block text-sm font-medium text-gray-700 mb-1">Gaya Renang <span className="text-red-500">*</span></label>
                  <select
                    id="stroke_category"
                    name="stroke_category"
                    value={formData.stroke_category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue"
                  >
                    <option value="">Pilih Gaya</option>
                    {uniqueSwimStyles.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>

                {/* Dropdown Jarak */}
                <div>
                  <label htmlFor="distance_category" className="block text-sm font-medium text-gray-700 mb-1">Jarak Lomba <span className="text-red-500">*</span></label>
                  <select
                    id="distance_category"
                    name="distance_category"
                    value={formData.distance_category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue"
                  >
                    <option value="">Pilih Jarak</option>
                    {uniqueDistances.map(distance => (
                      <option key={distance} value={distance}>{distance}m</option>
                    ))}
                  </select>
                </div>

                {/* Dropdown Jenis Lomba (Renang/Polo Air) */}
                <div>
                  <label htmlFor="jenis_renang" className="block text-sm font-medium text-gray-700 mb-1">Jenis Lomba <span className="text-red-500">*</span></label>
                  <select
                    id="jenis_renang"
                    name="jenis_renang"
                    value={formData.jenis_renang}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-oceanic-blue focus:border-oceanic-blue"
                  >
                    <option value="">Pilih Jenis Lomba</option>
                    {uniqueTypeOfSwimmingEvents.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Bagian Kontak Darurat */}
          <h2 className="text-2xl font-bold text-dark-charcoal mt-8 mb-4">Kontak Darurat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700 mb-1">Nama Kontak Darurat <span className="text-red-500">*</span></label>
              <input type="text" id="emergency_contact_name" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-oceanic-blue focus:border-oceanic-blue" placeholder="Nama Orang yang Bisa Dihubungi" />
            </div>
            <div>
              <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon Pendamping <span className="text-red-500">*</span></label>
              <input type="tel" id="emergency_contact_phone" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-oceanic-blue focus:border-oceanic-blue" placeholder="081234567890" />
            </div>
          </div>

          {/* Bagian Dokumen Pendukung dan Pembayaran */}
          <h2 className="text-2xl font-bold text-dark-charcoal mt-8 mb-4">Dokumen & Pembayaran</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Scan Akte Kelahiran */}
            <div>
              <label htmlFor="supporting_document" className="block text-sm font-medium text-gray-700 mb-1">Upload Scan Akte Kelahiran<span className="text-red-500">*</span></label>
              <input
                required
                type="file"
                id="supporting_document"
                name="supporting_document"
                accept="image/*,.pdf" // Menerima gambar dan PDF
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-oceanic-blue file:text-white hover:file:bg-aqua-accent"
              />
              {supportingDocument && (
                <p className="text-sm text-gray-500 mt-1">File terpilih: {supportingDocument.name}</p>
              )}
            </div>

            {/* Upload Bukti Pembayaran */}
            <div>
              <label htmlFor="payment_photo" className="block text-sm font-medium text-gray-700 mb-1">Upload Bukti Pembayaran<span className="text-red-500">*</span></label>
              <input
                required
                type="file"
                id="payment_photo"
                name="payment_photo"
                accept="image/*" // Hanya menerima file gambar
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-oceanic-blue file:text-white hover:file:bg-aqua-accent"
              />
              {paymentPhoto && (
                <p className="text-sm text-gray-500 mt-1">File terpilih: {paymentPhoto.name}</p>
              )}
            </div>
          </div>


          {/* Bagian Persetujuan */}
          <h2 className="text-2xl font-bold text-dark-charcoal mt-8 mb-4">Persetujuan</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="parent_consent"
                name="parent_consent"
                checked={formData.parent_consent}
                onChange={handleChange}
                required
                className="h-5 w-5 text-oceanic-blue border-gray-300 rounded focus:ring-oceanic-blue mt-1"
              />
              <label htmlFor="parent_consent" className="ml-3 text-gray-700 text-base">
                Saya menyatakan bahwa saya adalah orang tua/wali dari peserta di bawah umur, dan memberikan persetujuan untuk pendaftaran ini. <span className="text-red-500">*</span>
              </label>
            </div>
            <div className="flex items-start">
              <input
                type="checkbox"
                id="rules_consent"
                name="rules_consent"
                checked={formData.rules_consent}
                onChange={handleChange}
                required
                className="h-5 w-5 text-oceanic-blue border-gray-300 rounded focus:ring-oceanic-blue mt-1"
              />
              <label htmlFor="rules_consent" className="ml-3 text-gray-700 text-base">
                Saya telah membaca dan menyetujui semua aturan dan regulasi lomba. <span className="text-red-500">*</span>
              </label>
            </div>
          </div>

          {/* Tombol Submit */}
          <div className="mt-8">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-semibold rounded-lg text-white bg-sky-300 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-600 transition duration-300 transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </div>
          <div className="text-center mt-4">
            <Link href="/dashboard" className="text-oceanic-blue hover:underline">Kembali ke Dashboard</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
