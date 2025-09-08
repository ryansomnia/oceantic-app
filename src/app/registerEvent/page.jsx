'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Swal from 'sweetalert2';
import React from 'react';
import { Loader2 } from 'lucide-react';
import {jwtDecode} from "jwt-decode";
import TermsAndConsent from '../../components/TermsAndConsent';


export default function RegisterSwimmerPage() {
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [availableRaces, setAvailableRaces] = useState({}); 
  const [selectedRaces, setSelectedRaces] = useState([]); 
  const [ageError, setAgeError] = useState('');

  const [formData, setFormData] = useState({
    user_id: '',
    event_id: '',
    full_name: '',
    date_of_birth: '',
    gender: '',
    age_group: '',
    email: '',
    phone_number: '',
    club_name: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    payment_status: 'Pending',
    parent_consent: false,
    rules_consent: false,
  });

  const [supportingDocument, setSupportingDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = 'https://api.oceanticsports.com/oceantic/v1';

  // Fetch events
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const userRole = localStorage.getItem('userRole');
    if (!token || !userId || userRole !== "member") {
      router.push("/login");
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        // token expired
        localStorage.clear();
        sessionStorage.clear();
        router.push("/login");
        return;
      }
    } catch (err) {
      console.error("Token invalid:", err);
      router.push("/login");
      return;
    }

    setFormData(prev => ({ ...prev, user_id: userId }));

    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/events/getAllEventsOpen`);
        const data = await res.json();
        if (data.code === 200 && Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          throw new Error('Format data event tidak valid');
        }
      } catch (err) {
        Swal.fire('Error', 'Gagal memuat daftar event.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  // Fetch races by event
  useEffect(() => {
    if (!formData.event_id) return;

    const fetchRaces = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/categories/getAvailableRaces`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: formData.event_id }),
        });
        const data = await res.json();
        if (data.swim_styles && data.races) {
          console.log('================data.swim_styles====================');
          console.log(data.races);
          console.log('====================================');
          setAvailableRaces(data.races);
          setSelectedRaces([]); // reset pilihan tiap ganti event
        } else {
          setAvailableRaces({});
        }
      } catch (err) {
        Swal.fire('Error', 'Gagal memuat kategori lomba.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, [formData.event_id]);

  // Hitung umur dan tentukan age_group
  useEffect(() => {
    if (!formData.date_of_birth || Object.keys(availableRaces).length === 0) return;
  
    const event = events.find(e => e.id == formData.event_id);
    if (!event) return;
  
    const birthDate = new Date(formData.date_of_birth);
    const eventDate = new Date(event.event_date);
    let age = eventDate.getFullYear() - birthDate.getFullYear();
    const m = eventDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && eventDate.getDate() < birthDate.getDate())) {
      age--;
    }
  
    let matchedGroup = '';
    Object.values(availableRaces).forEach(list => {
      list.forEach(race => {
        const match = race.age_group.match(/(\d+)[^\d]+(\d+)/);
        if (match) {
          const minAge = parseInt(match[1], 10);
          const maxAge = parseInt(match[2], 10);
          if (age >= minAge && age <= maxAge) {
            matchedGroup = race.age_group;
          }
        }
      });
    });
  
    if (matchedGroup) {
      setFormData(prev => ({ ...prev, age_group: matchedGroup }));
      setAgeError('');
    } else {
      setFormData(prev => ({ ...prev, age_group: '' }));
      setAgeError(`Maaf, umur kamu (${age} tahun) belum masuk kategori lomba yang tersedia`);
    }
  }, [formData.date_of_birth, formData.event_id, availableRaces, events]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    setSupportingDocument(e.target.files[0]);
  };

  const toggleRace = (raceId) => {
    setSelectedRaces(prev =>
      prev.includes(raceId) ? prev.filter(id => id !== raceId) : [...prev, raceId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      Swal.fire('Sesi Berakhir', 'Silakan login kembali.', 'warning');
      router.push('/login');
      setIsSubmitting(false);
      return;
    }
  
    if (!formData.event_id || !formData.gender || !formData.age_group || selectedRaces.length < 2) {
      Swal.fire('Input Tidak Lengkap', ' Coba periksa kembali apakah kamu tidak memilih event, isi tanggal lahir, gender, dan minimal 2 kategori lomba.', 'warning');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const dataToSend = new FormData();
      for (const key in formData) {
        dataToSend.append(key, formData[key]);
      }
      selectedRaces.forEach((raceId) => {
        dataToSend.append("selected_races", raceId);
      });
      dataToSend.append('supporting_document', supportingDocument);
  
      const res = await fetch(`${API_BASE_URL}/registrations`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: dataToSend,
      });
  
      if (res.ok) {
        const result = await res.json();
  
        const chosenRaces = [];
        Object.entries(availableRaces).forEach(([style, list]) => {
          list.forEach(race => {
            if (selectedRaces.includes(race.race_category_id)) {
              chosenRaces.push(`${style} - ${race.age_group} - ${race.gender}`);
            }
          });
        });
  
        Swal.fire({
          title: 'Registrasi Berhasil �',
          html: `
            <p><b>Total Biaya:</b> Rp ${result.total_fee.toLocaleString('id-ID')}</p>
            <p><b>Gaya yang dipilih:</b></p>
            <ul style="text-align:left">
              ${chosenRaces.map(r => `<li>${r}</li>`).join('')}
            </ul>
            <p>Biaya Admin : Rp. 2.500</p>
          `,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          router.push('/statusPayment');
        });
  
      } else {
        const errData = await res.json();
        Swal.fire('Error', `${errData.message} - ${errData.detail}` || 'Pendaftaran gagal.', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'Terjadi kesalahan server.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-oceanic-blue to-aqua-accent p-8">
        <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-xl">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <p className="text-xl font-semibold text-gray-600">Memuat formulir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-teal-500 p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-6 sm:p-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Formulir Registrasi Perenang</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Pilih Event */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Informasi Event</h2>
            <div>
              <label htmlFor="eventId" className="block mb-2 font-medium text-gray-600">Pilih Event</label>
              <select
                id="eventId"
                name="event_id"
                value={formData.event_id}
                onChange={handleChange}
                className="w-full border p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Pilih Event --</option>
                {events.map(ev => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({new Date(ev.event_date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Informasi Peserta */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Informasi Peserta</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block mb-2 font-medium text-gray-600">Nama Lengkap</label>
                <input id="fullName" type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Nama Lengkap" className="w-full border p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="dob" className="block mb-2 font-medium text-gray-600">Tanggal Lahir</label>
                <input id="dob" type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full border p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                {ageError && <p className="text-red-600 text-sm mt-2">{ageError}</p>}
              </div>
              <div>
                <label htmlFor="gender" className="block mb-2 font-medium text-gray-600">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-3 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Pilih Gender</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-medium text-gray-600">Email</label>
                <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full border p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block mb-2 font-medium text-gray-600">No. HP</label>
                <input id="phoneNumber" type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="No HP" className="w-full border p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="clubName" className="block mb-2 font-medium text-gray-600">Nama Klub/Individu</label>
                <input id="clubName" type="text" name="club_name" value={formData.club_name} onChange={handleChange} placeholder="Klub/Individu" className="w-full border p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            {formData.age_group && (
              <p className="text-green-600 font-medium mt-4">Kelompok Umur Otomatis: {formData.age_group}</p>
            )}
          </div>

          {/* Pilihan Lomba */}
          {formData.event_id && formData.gender && formData.age_group && (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Pilih Kategori Lomba</h2>
              <p className="text-sm text-gray-500 mb-4">Pilih minimal 2 kategori lomba.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(availableRaces).map(([style, list]) => {
                  const filteredList = list.filter(
                    race => race.gender === formData.gender && race.age_group === formData.age_group
                  );

                  if (filteredList.length === 0) return null;

                  return (
                    <div key={style} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <h3 className="font-semibold text-gray-800 mb-2">{style}</h3>
                      <div className="space-y-2">
                        {filteredList.map(race => (
                          <label key={race.race_category_id} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedRaces.includes(race.race_category_id)}
                              onChange={() => toggleRace(race.race_category_id)}
                              className="form-checkbox h-4 w-4 text-blue-600 rounded-sm focus:ring-blue-500"
                            />
                            <span>{race.distance} {race.age_group}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kontak Darurat & Dokumen */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Kontak Darurat & Dokumen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emergencyName" className="block mb-2 font-medium text-gray-600">Nama Kontak Darurat</label>
                <input id="emergencyName" type="text" name="emergency_contact_name" value={formData.emergency_contact_name} onChange={handleChange} placeholder="Nama Kontak Darurat" className="w-full border p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="emergencyPhone" className="block mb-2 font-medium text-gray-600">No. HP Kontak Darurat</label>
                <input id="emergencyPhone" type="tel" name="emergency_contact_phone" value={formData.emergency_contact_phone} onChange={handleChange} placeholder="No HP Kontak" className="w-full border p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="supportingDocument" className="block mb-2 font-medium text-gray-600">Upload Akta Lahir</label>
                <input id="supportingDocument" type="file" accept="image/*,.pdf" onChange={handleFileChange} className="w-full p-3 rounded-lg text-gray-800 border bg-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
              </div>
            </div>
          </div>

          {/* Persetujuan */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Persetujuan</h2>
            <div className="flex items-start">
              <input id="parentConsent" type="checkbox" name="parent_consent" checked={formData.parent_consent} onChange={handleChange} required className="mt-1 h-4 w-4 text-blue-600 rounded-sm focus:ring-blue-500" />
              <label htmlFor="parentConsent" className="ml-2 block text-sm font-medium text-gray-700">Saya menyatakan saya mendapat izin dari orangtua / wali saya.</label>
            </div>
            <TermsAndConsent  />
            <div className="flex items-start">
              <input id="rulesConsent" type="checkbox" name="rules_consent" checked={formData.rules_consent} onChange={handleChange} required className="mt-1 h-4 w-4 text-blue-600 rounded-sm focus:ring-blue-500" />
              <label htmlFor="rulesConsent" className="ml-2 block text-sm font-medium text-gray-700">Saya menyetujui aturan lomba.</label>
            </div>



          </div>

          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Mendaftar...
              </span>
            ) : 'Daftar Sekarang'}
          </button>
          
          <div className="text-center mt-4">
            <Link href="/" className="text-blue-600 hover:underline font-medium">
              Kembali ke Dashboard
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
